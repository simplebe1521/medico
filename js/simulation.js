/* ========================================
   ImmersiMed v2 — Enhanced Simulation Engine
   Three.js scene with view modes integration
   ======================================== */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnatomicalModel, ORGAN_DATA } from './anatomy.js?v=11.0';
import { ViewModeManager } from './view-modes.js?v=11.0';

export class SimulationEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) { console.error('Simulation container not found'); return; }

    this.annotationEl = document.getElementById('simAnnotation');
    this.annotationTitle = document.getElementById('annotationTitle');
    this.annotationLatin = document.getElementById('annotationLatin');
    this.annotationDesc = document.getElementById('annotationDesc');

    this.anatomy = null;
    this.viewModes = null;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-10, -10);
    this.hoveredMesh = null;
    this.selectedOrgan = null;
    this.clock = new THREE.Clock();
    this.running = false;
    this.effectMeshes = [];
    this.organSelectListeners = [];

    this._init();
  }

  _init() {
    const w = this.container.clientWidth || 800;
    const h = this.container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070b14);
    // Light subtle fog for depth without hiding cadaver
    this.scene.fog = new THREE.FogExp2(0x070b14, 0.04);

    this.camera = new THREE.PerspectiveCamera(42, (w / h) || 1.33, 0.01, 50);
    this.camera.position.set(0, 0.85, 2.75);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0.82, 0);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.minDistance = 0.35;
    this.controls.maxDistance = 4.5;
    this.controls.enablePan = true;
    this.controls.maxPolarAngle = Math.PI * 0.92;
    this.controls.update();

    this._setupLighting();
    this._setupEnvironment();

    this.anatomy = new AnatomicalModel();
    this.scene.add(this.anatomy.getGroup());

    this.viewModes = new ViewModeManager(this);

    this.container.addEventListener('pointermove', e => this._onPointerMove(e));
    this.container.addEventListener('click', e => this._onClick(e));
    window.addEventListener('resize', () => this._onResize());

    this.running = true;
    this._animate();
  }

  refreshAnatomy() {
    if (this.customModel) {
      this.scene.remove(this.customModel);
      this.customModel = null;
    }
    if (this.anatomy) {
      this.scene.remove(this.anatomy.getGroup());
    }
    this.anatomy = new AnatomicalModel();
    this.scene.add(this.anatomy.getGroup());
    this._deselectOrgan();
  }

  loadGLTFModel(url) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      if (this.anatomy) this.scene.remove(this.anatomy.getGroup());
      if (this.customModel) this.scene.remove(this.customModel);
      this.customModel = gltf.scene;
      this.scene.add(this.customModel);
      console.log('Successfully loaded photorealistic GLTF cadaver model:', url);
    }, undefined, (err) => {
      console.warn('Custom GLTF model not found at', url, ', retaining procedural 3D model.');
    });
  }

  _setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1a2b3c, 1.2);
    hemiLight.position.set(0, 5, 0);

    const mainSpot = new THREE.SpotLight(0xffffff, 3.5);
    mainSpot.position.set(1, 4, 3);
    mainSpot.angle = Math.PI / 3;
    mainSpot.penumbra = 0.4;

    const fillLight = new THREE.DirectionalLight(0xaaccff, 1.5);
    fillLight.position.set(-3, 2, -2);

    const rimLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
    rimLight.position.set(0, 3, -3);

    this.scene.add(ambientLight, hemiLight, mainSpot, fillLight, rimLight);
  }

  _setupEnvironment() {
    const grid = new THREE.GridHelper(3, 30, 0x00d4ff, 0x0d1a2e);
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    grid.position.y = -0.05;
    this.scene.add(grid);

    const ringGeom = new THREE.RingGeometry(0.42, 0.48, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
    this._platformRing = new THREE.Mesh(ringGeom, ringMat);
    this._platformRing.rotation.x = -Math.PI / 2;
    this._platformRing.position.y = -0.04;
    this.scene.add(this._platformRing);

    const discGeom = new THREE.CircleGeometry(0.42, 64);
    const discMat = new THREE.MeshStandardMaterial({ color: 0x080e18, emissive: 0x00334d, emissiveIntensity: 0.12, transparent: true, opacity: 0.6 });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -0.05;
    this.scene.add(disc);
  }

  _getPointer(e) {
    const rect = this.container.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  _onPointerMove(e) {
    this._getPointer(e);
    this._updateHover();
  }

  _onClick(e) {
    this._getPointer(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.anatomy.getAllInteractableMeshes();
    const hits = this.raycaster.intersectObjects(meshes, true);

    if (hits.length > 0) {
      let mesh = hits[0].object;
      while (mesh && !ORGAN_DATA[mesh.name]) mesh = mesh.parent;
      if (mesh && ORGAN_DATA[mesh.name]) {
        this._selectOrgan(mesh, hits[0].point);
        this._spawnClickEffect(hits[0].point);

        // Notify listeners (for AI tutor)
        this.organSelectListeners.forEach(fn => fn(mesh.name, ORGAN_DATA[mesh.name]));

        // If in isolation mode, isolate the clicked organ
        if (this.viewModes.getMode() === 'isolation') {
          this.viewModes.isolateOrgan(mesh.name);
        }
      }
    } else {
      this._deselectOrgan();
    }
  }

  _updateHover() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.anatomy.getAllInteractableMeshes();
    const hits = this.raycaster.intersectObjects(meshes, true);

    if (this.hoveredMesh && this.hoveredMesh._origEmissive !== undefined) {
      if (this.hoveredMesh.material?.emissive) {
        this.hoveredMesh.material.emissive.copy(this.hoveredMesh._origEmissive);
        this.hoveredMesh.material.emissiveIntensity = this.hoveredMesh._origEmissiveIntensity;
      }
      this.hoveredMesh = null;
      this.container.style.cursor = 'grab';
    }

    if (hits.length > 0) {
      let mesh = hits[0].object;
      while (mesh && !ORGAN_DATA[mesh.name]) mesh = mesh.parent;
      if (mesh?.material?.emissive) {
        if (mesh._origEmissive === undefined) {
          mesh._origEmissive = mesh.material.emissive.clone();
          mesh._origEmissiveIntensity = mesh.material.emissiveIntensity;
        }
        mesh.material.emissive.set(0x00d4ff);
        mesh.material.emissiveIntensity = 0.4;
        this.hoveredMesh = mesh;
        this.container.style.cursor = 'pointer';
      }
    }
  }

  _selectOrgan(mesh, point) {
    this.selectedOrgan = mesh;
    const data = ORGAN_DATA[mesh.name];
    if (!data || !this.annotationEl) return;
    this.annotationTitle.textContent = data.name;
    this.annotationLatin.textContent = data.latin;
    this.annotationDesc.textContent = data.desc;

    const funcEl = document.getElementById('annotationFunction');
    const clinEl = document.getElementById('annotationClinical');
    const vivaEl = document.getElementById('annotationViva');

    if (funcEl) funcEl.textContent = data.function || 'Essential biological component.';
    if (clinEl) clinEl.textContent = data.clinical || 'Pathological alterations disrupt systemic homeostasis.';
    if (vivaEl) vivaEl.textContent = data.viva || 'Q: What is the primary arterial blood supply? A: Derived from systemic branches.';

    this._positionAnnotation(mesh);
    this.annotationEl.classList.add('visible');
  }

  _deselectOrgan() {
    this.selectedOrgan = null;
    if (this.annotationEl) this.annotationEl.classList.remove('visible');
  }

  _positionAnnotation(mesh) {
    if (!this.annotationEl) return;
    const pos = new THREE.Vector3();
    mesh.getWorldPosition(pos);
    pos.project(this.camera);
    const rect = this.container.getBoundingClientRect();
    const x = ((pos.x + 1) / 2) * rect.width;
    const y = ((-pos.y + 1) / 2) * rect.height;
    this.annotationEl.style.left = (x + 20) + 'px';
    this.annotationEl.style.top = (y - 30) + 'px';
  }

  _spawnClickEffect(point) {
    const geom = new THREE.RingGeometry(0, 0.03, 24);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(geom, mat);
    ring.position.copy(point);
    ring.lookAt(this.camera.position);
    ring.userData.life = 0;
    this.scene.add(ring);
    this.effectMeshes.push(ring);
  }

  /* ── Public API ── */

  onOrganSelect(fn) { this.organSelectListeners.push(fn); }

  setLayerVisible(name, visible) { if (this.anatomy) this.anatomy.setLayerVisible(name, visible); }
  toggleLayer(name) { if (this.anatomy) return this.anatomy.toggleLayer(name); return false; }
  isLayerVisible(name) { if (this.anatomy) return this.anatomy.isLayerVisible(name); return false; }

  highlightOrgan(organName) {
    if (!organName) return;
    const mesh = this.anatomy.getMeshByName(organName);
    if (mesh) {
      this._selectOrgan(mesh, mesh.position);
      const target = new THREE.Vector3();
      mesh.getWorldPosition(target);
      this.controls.target.lerp(target, 0.3);
    }
  }

  resetView() {
    this.controls.target.set(0, 1.0, 0);
    this.camera.position.set(0.7, 1.2, 1.3);
    this.controls.update();
    this._deselectOrgan();
  }

  zoomIn() { this.camera.position.lerp(this.controls.target, 0.15); }
  zoomOut() {
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    this.camera.position.addScaledVector(dir, 0.15);
  }

  setViewMode(mode) { if (this.viewModes) this.viewModes.setMode(mode); }
  getViewMode() { return this.viewModes?.getMode() || 'normal'; }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _animate() {
    if (!this.running) return;
    requestAnimationFrame(() => this._animate());
    const t = this.clock.getElapsedTime();
    this.controls.update();
    try {
      if (this.anatomy && typeof this.anatomy.animate === 'function') {
        this.anatomy.animate(t);
      }
    } catch (e) {
      console.warn('Anatomy animation tick error:', e);
    }
    if (this._platformRing) this._platformRing.material.opacity = 0.08 + Math.sin(t * 1.5) * 0.04;

    for (let i = this.effectMeshes.length - 1; i >= 0; i--) {
      const m = this.effectMeshes[i];
      m.userData.life += 0.03;
      const s = 1 + m.userData.life * 3;
      m.scale.set(s, s, s);
      m.material.opacity = Math.max(0, 0.8 - m.userData.life);
      if (m.userData.life > 1) {
        this.scene.remove(m);
        m.geometry.dispose();
        m.material.dispose();
        this.effectMeshes.splice(i, 1);
      }
    }

    if (this.selectedOrgan && this.annotationEl?.classList.contains('visible')) {
      this._positionAnnotation(this.selectedOrgan);
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.running = false;
    this.renderer?.dispose();
    this.controls?.dispose();
  }
}

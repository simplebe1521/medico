/* ========================================
   ImmersiMed v2 — View Modes Manager
   X-ray, transparent, exploded, cross-section, isolation
   ======================================== */

import * as THREE from 'three';

export class ViewModeManager {
  constructor(simulation) {
    this.sim = simulation;
    this.current = 'normal';
    this.originalMaterials = new Map();
    this.explodedPositions = new Map();
    this.clippingPlane = null;
    this.clippingOffset = 0;
    this.isolatedOrgan = null;
    this._savedLayerState = {};
  }

  setMode(mode) {
    if (mode === this.current) return;
    this._resetCurrentMode();
    this.current = mode;

    switch (mode) {
      case 'normal': break; // already reset
      case 'xray': this._applyXRay(); break;
      case 'transparent': this._applyTransparent(); break;
      case 'exploded': this._applyExploded(); break;
      case 'crosssection': this._applyCrossSection(); break;
      case 'isolation': break; // isolation is triggered by clicking an organ
    }
  }

  getMode() { return this.current; }

  /* Isolate a specific organ */
  isolateOrgan(organName) {
    this.current = 'isolation';
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    // Save current layer state
    this._savedLayerState = {};
    for (const name of Object.keys(anatomy.layers)) {
      this._savedLayerState[name] = anatomy.isLayerVisible(name);
    }

    // Hide all layers
    for (const name of Object.keys(anatomy.layers)) {
      anatomy.setLayerVisible(name, false);
    }

    // Show only the target organ
    const mesh = anatomy.getMeshByName(organName);
    if (mesh) {
      mesh.visible = true;
      // Walk up parents to make sure they're visible
      let parent = mesh.parent;
      while (parent) {
        parent.visible = true;
        parent = parent.parent;
      }

      // Zoom camera to organ
      const target = new THREE.Vector3();
      mesh.getWorldPosition(target);
      this.sim.controls.target.copy(target);
      this.sim.camera.position.set(target.x + 0.3, target.y + 0.15, target.z + 0.4);
    }

    this.isolatedOrgan = organName;
  }

  /* Update clipping plane position (for cross-section slider) */
  updateClipping(offset) {
    if (this.current !== 'crosssection' || !this.clippingPlane) return;
    this.clippingOffset = offset;
    this.clippingPlane.constant = offset;
  }

  /* ── Private: Apply modes ── */

  _applyXRay() {
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    anatomy.group.traverse(child => {
      if (child.isMesh && child.material) {
        this.originalMaterials.set(child.uuid, child.material);
        const wiremat = new THREE.MeshBasicMaterial({
          color: 0x00d4ff,
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        child.material = wiremat;
      } else if (child.isLine && child.material) {
        this.originalMaterials.set(child.uuid, child.material);
        child.material = new THREE.LineBasicMaterial({
          color: 0x00ffaa,
          transparent: true,
          opacity: 0.6,
        });
      }
    });

    // Make all layers visible in x-ray
    for (const name of Object.keys(anatomy.layers)) {
      anatomy.layers[name].visible = true;
    }
  }

  _applyTransparent() {
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    anatomy.group.traverse(child => {
      if (child.isMesh && child.material) {
        this.originalMaterials.set(child.uuid, child.material.clone());
        child.material.transparent = true;
        child.material.opacity = Math.min(child.material.opacity, 0.3);
        child.material.depthWrite = false;
      }
    });

    for (const name of Object.keys(anatomy.layers)) {
      anatomy.layers[name].visible = true;
    }
  }

  _applyExploded() {
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    // Show organs
    anatomy.setLayerVisible('skin', false);
    anatomy.setLayerVisible('muscle', false);
    anatomy.setLayerVisible('skeleton', true);
    anatomy.setLayerVisible('organs', true);
    anatomy.setLayerVisible('nervous', false);

    // Explode organs outward
    const organs = anatomy.layers.organs;
    if (!organs) return;

    const center = new THREE.Vector3(0, 1.05, 0);
    organs.children.forEach(child => {
      if (child.isMesh) {
        this.explodedPositions.set(child.uuid, child.position.clone());
        const dir = child.position.clone().sub(center).normalize();
        const explodeDist = 0.15;
        child.position.add(dir.multiplyScalar(explodeDist));
      }
    });
  }

  _applyCrossSection() {
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    // Create clipping plane
    this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.3);

    // Enable clipping on renderer
    this.sim.renderer.clippingPlanes = [this.clippingPlane];
    this.sim.renderer.localClippingEnabled = true;

    // Make all layers visible
    for (const name of Object.keys(anatomy.layers)) {
      anatomy.setLayerVisible(name, true);
    }
  }

  _resetCurrentMode() {
    const anatomy = this.sim.anatomy;
    if (!anatomy) return;

    // Restore original materials
    if (this.originalMaterials.size > 0) {
      anatomy.group.traverse(child => {
        if ((child.isMesh || child.isLine) && this.originalMaterials.has(child.uuid)) {
          child.material = this.originalMaterials.get(child.uuid);
        }
      });
      this.originalMaterials.clear();
    }

    // Restore exploded positions
    if (this.explodedPositions.size > 0) {
      const organs = anatomy.layers.organs;
      if (organs) {
        organs.children.forEach(child => {
          if (this.explodedPositions.has(child.uuid)) {
            child.position.copy(this.explodedPositions.get(child.uuid));
          }
        });
      }
      this.explodedPositions.clear();
    }

    // Remove clipping
    if (this.clippingPlane) {
      this.sim.renderer.clippingPlanes = [];
      this.sim.renderer.localClippingEnabled = false;
      this.clippingPlane = null;
    }

    // Restore isolation
    if (this.isolatedOrgan && Object.keys(this._savedLayerState).length > 0) {
      for (const [name, vis] of Object.entries(this._savedLayerState)) {
        anatomy.setLayerVisible(name, vis);
      }
      this._savedLayerState = {};
      this.isolatedOrgan = null;
    }

    // Reset camera
    if (this.current === 'isolation') {
      this.sim.resetView();
    }
  }
}

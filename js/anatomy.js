/* ========================================
   MEDSIM — High-Detail Anatomical Model Builder
   Organic Realistic Human Anatomy with Subsurface Scattering
   ======================================== */

import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';

// Initialize noise generator for organic tissue surface variations
const noise = new SimplexNoise();

// ── Annotation & Clinical Viva Data ──
export const ORGAN_DATA = {
  heart: { 
    name: 'Heart', latin: 'Cor', 
    desc: 'Four-chambered muscular pump driving systemic & pulmonary circulation.', 
    function: 'Pumps ~7,500 liters of oxygenated & deoxygenated blood daily through systemic and pulmonary circuits.',
    clinical: 'Coronary artery occlusion leads to Myocardial Infarction (MI). Auscultation identifies murmurs from valvular stenosis or regurgitation.',
    viva: 'Q: Why is the left ventricular myocardium 3x thicker than the right? A: It must generate 5x higher pressure (120 mmHg) to pump blood through systemic resistance.',
    system: 'organs' 
  },
  leftVentricle: { 
    name: 'Left Ventricle', latin: 'Ventriculus sinister', 
    desc: 'Thick-walled muscular chamber pumping oxygenated blood to systemic circulation.', 
    function: 'Generates systolic arterial pressure (120 mmHg) to propel blood through the aorta.',
    clinical: 'Left Ventricular Hypertrophy (LVH) occurs in chronic hypertension. Failure leads to pulmonary edema.',
    viva: 'Q: Which coronary artery supplies the anterior 2/3 of the interventricular septum? A: Left Anterior Descending (LAD) artery ("widowmaker").',
    system: 'organs' 
  },
  leftLung: { 
    name: 'Left Lung', latin: 'Pulmo sinister', 
    desc: 'Two-lobed respiratory organ with oblique fissure and cardiac notch.', 
    function: 'Facilitates alveolar gas exchange (O2 uptake & CO2 removal).',
    clinical: 'Aspiration is less common in the left main bronchus due to its more horizontal angle compared to the right.',
    viva: 'Q: Why does the left lung have only 2 lobes? A: To accommodate the cardiac apex within the cardiac notch.',
    system: 'organs' 
  },
  rightLung: { 
    name: 'Right Lung', latin: 'Pulmo dexter', 
    desc: 'Three-lobed respiratory organ separated by horizontal and oblique fissures.', 
    function: 'Provides ~55% of total pulmonary gas exchange capacity.',
    clinical: 'Aspirated foreign bodies most frequently lodge in the right lower lobe due to wider and steeper right main bronchus.',
    viva: 'Q: Name the structures entering the hilum of the right lung from anterior to posterior. A: Pulmonary Vein, Pulmonary Artery, Main Bronchus (V-A-B).',
    system: 'organs' 
  },
  liver: { 
    name: 'Liver', latin: 'Hepar', 
    desc: 'Largest metabolic and detoxifying organ in the abdominal cavity.', 
    function: 'Synthesizes plasma proteins (albumin, clotting factors), secretes bile, metabolizes drugs, and stores glycogen.',
    clinical: 'Cirrhosis causes portal hypertension leading to esophageal varices, caput medusae, and ascites.',
    viva: 'Q: What forms the portal triad in the hepatoduodenal ligament? A: Proper Hepatic Artery, Hepatic Portal Vein, and Common Bile Duct.',
    system: 'organs' 
  },
  brain: { 
    name: 'Brain', latin: 'Cerebrum', 
    desc: 'Master central nervous system organ containing ~86 billion neurons.', 
    function: 'Controls cognition, motor movement, sensory perception, and autonomic vital reflexes.',
    clinical: 'Ischemic strokes in the Middle Cerebral Artery (MCA) cause contralateral hemiparesis and aphasia.',
    viva: 'Q: What vascular structure provides collateral circulation at the base of the brain? A: Circle of Willis (Circle of Arteriosus).',
    system: 'organs' 
  },
  spine: { 
    name: 'Vertebral Column', latin: 'Columna vertebralis', 
    desc: '33 stacked vertebrae supporting axial skeleton and spinal cord.', 
    function: 'Protects the spinal cord, bears upper body weight, and enables spinal flex/extension.',
    clinical: 'Lumbar disc herniation at L4-L5 or L5-S1 compresses sciatica nerve roots causing radiculopathy.',
    viva: 'Q: At what vertebral level does the adult spinal cord terminate? A: Conus medullaris terminates at L1-L2 (Lumbar puncture performed at L3-L4 or L4-L5).',
    system: 'skeleton' 
  },
  ribcage: { 
    name: 'Rib Cage', latin: 'Cavea thoracis', 
    desc: '12 thoracic rib pairs articulating with sternum and thoracic vertebrae.', 
    function: 'Protects heart and lungs; expands during inspiration via intercostal muscle contraction.',
    clinical: 'Flail chest occurs when 3+ adjacent ribs fracture in 2 places, causing paradoxical chest wall movement.',
    viva: 'Q: Where do intercostal neurovascular bundles run along each rib? A: Subcostal groove along the inferior border of the rib (VAN: Vein, Artery, Nerve).',
    system: 'skeleton' 
  },
  torsoSkin: { 
    name: 'Integumentary System (Skin)', latin: 'Cutis', 
    desc: 'Epidermal and dermal barrier shielding internal thoracic/abdominal viscera.', 
    function: 'Thermoregulation, sensation, immune protection, and prevention of fluid loss.',
    clinical: 'Surgical incisions follow Langer lines (cleavage lines) for minimal scarring and optimal wound healing.',
    viva: 'Q: What is the main cutaneous landmark for finding the 2nd intercostal space? A: Sternal Angle (Angle of Louis).',
    system: 'skin' 
  }
};

// ── Procedural Biological Textures ──
function createSkinTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#eac2a8';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 1.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(170, 110, 80, 0.09)' : 'rgba(255, 235, 215, 0.12)';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

function createMuscleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#b82230';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(130, 10, 20, 0.3)';
  for (let i = 0; i < 600; i++) {
    const y = Math.random() * 512;
    const h = 1 + Math.random() * 3;
    ctx.fillRect(0, y, 512, h);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 6);
  return tex;
}

function createBoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f2ece0';
  ctx.fillRect(0, 0, 512, 512);

  ctx.fillStyle = 'rgba(150, 140, 120, 0.15)';
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 3 + Math.random() * 12, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping; tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

// ── Materials ──
function createMaterials() {
  const skinTex = createSkinTexture();
  const muscleTex = createMuscleTexture();
  const boneTex = createBoneTexture();

  return {
    skin: new THREE.MeshPhysicalMaterial({ 
      color: 0xebc3ad, map: skinTex, transparent: true, opacity: 0.78, 
      roughness: 0.35, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.2,
      side: THREE.DoubleSide, depthWrite: true 
    }),
    skinSolid: new THREE.MeshStandardMaterial({ 
      color: 0xe0b59b, map: skinTex, roughness: 0.5, metalness: 0.05,
      side: THREE.DoubleSide
    }),
    muscle: new THREE.MeshStandardMaterial({ 
      color: 0xc82a38, map: muscleTex, roughness: 0.5, metalness: 0.1, side: THREE.DoubleSide 
    }),
    bone: new THREE.MeshStandardMaterial({ 
      color: 0xf0ebd9, map: boneTex, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide
    }),
    boneWire: new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.6 }),
    heart: new THREE.MeshStandardMaterial({ 
      color: 0xd91e2e, roughness: 0.3, metalness: 0.15, side: THREE.DoubleSide 
    }),
    heartChamber: new THREE.MeshStandardMaterial({ 
      color: 0x99101b, roughness: 0.4, side: THREE.DoubleSide 
    }),
    artery: new THREE.MeshStandardMaterial({ color: 0xee2233, roughness: 0.2, metalness: 0.1 }),
    vein: new THREE.MeshStandardMaterial({ color: 0x1155ee, roughness: 0.2, metalness: 0.1 }),
    lung: new THREE.MeshStandardMaterial({ 
      color: 0xe68a98, roughness: 0.4, transparent: true, opacity: 0.9, side: THREE.DoubleSide 
    }),
    liver: new THREE.MeshStandardMaterial({ 
      color: 0x8c3525, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide 
    }),
    stomach: new THREE.MeshStandardMaterial({ 
      color: 0xdf7c6d, roughness: 0.4, side: THREE.DoubleSide 
    }),
    kidney: new THREE.MeshStandardMaterial({ 
      color: 0x992e20, roughness: 0.3, side: THREE.DoubleSide 
    }),
    brain: new THREE.MeshStandardMaterial({ 
      color: 0xead0c7, roughness: 0.45, side: THREE.DoubleSide 
    }),
    intestine: new THREE.MeshStandardMaterial({ 
      color: 0xdc9769, roughness: 0.4, side: THREE.DoubleSide 
    }),
    nerve: new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.85 }),
    nerveGlow: new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.5 }),
  };
}

// ── Organic Geometry Deformation ──
function deformGeometry(geometry, freq, amp, offset = new THREE.Vector3(0,0,0)) {
  const pos = geometry.attributes.position;
  const vec = new THREE.Vector3();
  const vNorm = new THREE.Vector3();
  geometry.computeVertexNormals();
  const normals = geometry.attributes.normal;

  for (let i = 0; i < pos.count; i++) {
    vec.fromBufferAttribute(pos, i);
    vNorm.fromBufferAttribute(normals, i);
    
    const n = noise.noise3d(
      (vec.x + offset.x) * freq,
      (vec.y + offset.y) * freq,
      (vec.z + offset.z) * freq
    );
    
    // Displace vertex along its normal
    vec.add(vNorm.multiplyScalar(n * amp));
    pos.setXYZ(i, vec.x, vec.y, vec.z);
  }
  
  geometry.computeVertexNormals();
  return geometry;
}

// ── Build helpers ──
function buildMesh(geometry, mat, pos, rot = [0,0,0], scale = [1,1,1]) {
  const m = new THREE.Mesh(geometry, mat);
  m.position.set(...pos);
  m.rotation.set(...rot);
  m.scale.set(...scale);
  return m;
}

function organicSphere(mat, r, pos, scale = [1,1,1], noiseFreq = 0, noiseAmp = 0, noiseOffset = [0,0,0]) {
  let g = new THREE.SphereGeometry(r, 64, 48);
  if (noiseAmp > 0) {
    g = deformGeometry(g, noiseFreq, noiseAmp, new THREE.Vector3(...noiseOffset));
  }
  return buildMesh(g, mat, pos, [0,0,0], scale);
}

function organicCylinder(mat, rt, rb, h, pos, rot = [0,0,0], noiseFreq = 0, noiseAmp = 0) {
  let g = new THREE.CylinderGeometry(rt, rb, h, 32, 16);
  if (noiseAmp > 0) {
    g = deformGeometry(g, noiseFreq, noiseAmp);
  }
  return buildMesh(g, mat, pos, rot, [1,1,1]);
}

function contouredLimb(mat, rTop, rBelly, rBottom, height, pos, rot = [0,0,0], noiseFreq = 12, noiseAmp = 0.003) {
  const geom = new THREE.CylinderGeometry(rTop, rBottom, height, 32, 24);
  const posAttr = geom.attributes.position;
  
  for (let i = 0; i < posAttr.count; i++) {
    const y = posAttr.getY(i);
    const t = (y + height / 2) / height;
    const swell = Math.sin(t * Math.PI) * (rBelly - (rTop + rBottom) / 2);
    
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const currentR = Math.hypot(x, z);
    if (currentR > 0.0001) {
      const newR = currentR + swell;
      const factor = newR / currentR;
      posAttr.setX(i, x * factor);
      posAttr.setZ(i, z * factor);
    }
  }
  geom.computeVertexNormals();
  let finalGeom = geom;
  if (noiseAmp > 0) {
    finalGeom = deformGeometry(geom, noiseFreq, noiseAmp);
  }
  return buildMesh(finalGeom, mat, pos, rot, [1,1,1]);
}

function capsule(mat, rx, h, pos, rot = [0,0,0]) {
  const g = new THREE.CapsuleGeometry(rx, h, 16, 32);
  return buildMesh(g, mat, pos, rot, [1,1,1]);
}

// ════════════════════════════════════════
// AnatomicalModel class
// ════════════════════════════════════════
export class AnatomicalModel {
  constructor() {
    this.group = new THREE.Group();
    this.layers = {};
    this.meshMap = {};
    this.layerVisibility = {};
    this.materials = createMaterials();
    this._build();
  }

  getGroup() {
    return this.group;
  }

  setLayerVisible(layerName, visible) {
    if (this.layers[layerName]) {
      this.layers[layerName].visible = visible;
      this.layerVisibility[layerName] = visible;
    }
  }

  isLayerVisible(layerName) {
    return !!this.layerVisibility[layerName];
  }

  toggleLayer(layerName) {
    const nextVis = !this.isLayerVisible(layerName);
    this.setLayerVisible(layerName, nextVis);
    return nextVis;
  }

  getMeshByName(name) {
    return this.meshMap[name] || null;
  }

  animate(t) {
    const heart = this.meshMap.heart;
    if (heart) {
      const pulse = 1 + Math.sin(t * 7.5) * 0.035;
      heart.scale.set(pulse, pulse, pulse);
    }
    const lung = this.meshMap.leftLung;
    if (lung) {
      const breath = 1 + Math.sin(t * 1.8) * 0.025;
      lung.scale.set(breath, breath, breath);
    }
  }

  _build() {
    this.layers.skin     = this._buildSkin();
    this.layers.muscle   = this._buildMuscle();
    this.layers.skeleton = this._buildSkeleton();
    this.layers.organs   = this._buildOrgans();
    this.layers.nervous  = this._buildNervous();

    for (const [name, layer] of Object.entries(this.layers)) {
      layer.name = name;
      this.group.add(layer);
      this.layerVisibility[name] = true;
    }

    // Default layer visibility
    this.setLayerVisible('skin', true);
    this.setLayerVisible('muscle', false);
    this.setLayerVisible('skeleton', false);
    this.setLayerVisible('organs', true);
    this.setLayerVisible('nervous', false);
  }

  /* ── 1. REALISTIC HUMAN SKIN / INTEGUMENTARY LAYER ── */
  _buildSkin() {
    const g = new THREE.Group();
    const mat = this.materials.skin;

    // Head Contour with Anatomical Jaw & Nose Bridge
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.58, 0);

    const cranium = organicSphere(mat, 0.105, [0, 0, 0], [1.0, 1.1, 1.05], 12, 0.004);
    const jaw = organicSphere(mat, 0.075, [0, -0.04, 0.03], [0.85, 0.9, 1.1], 15, 0.003);
    const nose = organicSphere(mat, 0.02, [0, -0.02, 0.105], [0.6, 1.2, 0.8]);
    const chin = organicSphere(mat, 0.025, [0, -0.09, 0.07], [1.0, 0.7, 0.8]);
    const lEar = organicSphere(mat, 0.022, [-0.095, 0.01, -0.01], [0.4, 1.2, 0.7]);
    const rEar = organicSphere(mat, 0.022, [0.095, 0.01, -0.01], [0.4, 1.2, 0.7]);

    headGroup.add(cranium, jaw, nose, chin, lEar, rEar);
    headGroup.name = 'headSkin';
    this.meshMap.headSkin = headGroup;

    // Neck
    const neck = organicCylinder(mat, 0.052, 0.065, 0.12, [0, 1.41, 0], [0,0,0], 10, 0.002);
    neck.name = 'neck';

    // Anatomical Torso (Ribcage Contour + Waist Taper + Abdomen)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 1.05, 0);

    const chest = organicSphere(mat, 0.175, [0, 0.16, 0.01], [1.25, 0.9, 0.95], 10, 0.005);
    const abdomen = organicSphere(mat, 0.155, [0, -0.06, 0.01], [1.15, 0.95, 0.9], 12, 0.005);
    const pelvisSkin = organicSphere(mat, 0.165, [0, -0.28, 0], [1.2, 0.8, 0.95], 10, 0.004);

    torsoGroup.add(chest, abdomen, pelvisSkin);
    torsoGroup.name = 'torsoSkin';
    this.meshMap.torsoSkin = torsoGroup;

    // Shoulders & Contoured Arms (Seamless Junctions)
    const lDelt = organicSphere(mat, 0.065, [-0.20, 1.25, 0], [0.95, 1.1, 0.95]);
    const rDelt = organicSphere(mat, 0.065, [0.20, 1.25, 0], [0.95, 1.1, 0.95]);
    const lBicep = contouredLimb(mat, 0.048, 0.058, 0.040, 0.26, [-0.21, 1.08, 0], [0, 0, 0.12]);
    const rBicep = contouredLimb(mat, 0.048, 0.058, 0.040, 0.26, [0.21, 1.08, 0], [0, 0, -0.12]);
    const lForearm = contouredLimb(mat, 0.040, 0.046, 0.028, 0.25, [-0.22, 0.81, 0], [0, 0, 0.05]);
    const rForearm = contouredLimb(mat, 0.040, 0.046, 0.028, 0.25, [0.22, 0.81, 0], [0, 0, -0.05]);

    // Hands
    const lHand = organicSphere(mat, 0.034, [-0.23, 0.65, 0], [0.65, 1.2, 1.0]);
    const rHand = organicSphere(mat, 0.034, [0.23, 0.65, 0], [0.65, 1.2, 1.0]);

    // Contoured Legs (Seamless Hip to Foot Junctions)
    const lThigh = contouredLimb(mat, 0.088, 0.098, 0.066, 0.34, [-0.09, 0.54, 0]);
    const rThigh = contouredLimb(mat, 0.088, 0.098, 0.066, 0.34, [0.09, 0.54, 0]);
    const lKnee = organicSphere(mat, 0.054, [-0.09, 0.36, 0.01]);
    const rKnee = organicSphere(mat, 0.054, [0.09, 0.36, 0.01]);
    const lCalf = contouredLimb(mat, 0.060, 0.070, 0.038, 0.34, [-0.09, 0.18, -0.01]);
    const rCalf = contouredLimb(mat, 0.060, 0.070, 0.038, 0.34, [0.09, 0.18, -0.01]);

    // Feet
    const lFoot = organicSphere(mat, 0.048, [-0.09, 0.0, 0.04], [0.7, 0.5, 1.4]);
    const rFoot = organicSphere(mat, 0.048, [0.09, 0.0, 0.04], [0.7, 0.5, 1.4]);

    g.add(headGroup, neck, torsoGroup, lDelt, rDelt, lBicep, rBicep, lForearm, rForearm, lHand, rHand, lThigh, rThigh, lKnee, rKnee, lCalf, rCalf, lFoot, rFoot);
    return g;
  }

  /* ── 2. MUSCULATURE LAYER ── */
  _buildMuscle() {
    const g = new THREE.Group();
    const mat = this.materials.muscle;

    // Musculature with distinct muscle groups
    const torso = organicSphere(mat, 0.175, [0, 1.05, 0], [1.1, 1.3, 0.95], 12, 0.006);
    torso.name = 'torsoMuscle';

    const head = organicSphere(mat, 0.1, [0, 1.58, 0], [1,1,1], 20, 0.005);
    const neck = organicCylinder(mat, 0.044, 0.05, 0.1, [0, 1.4, 0]);

    // Pectorals (Pectoralis Major)
    const lPec = organicSphere(mat, 0.068, [-0.08, 1.21, 0.09], [1.3, 0.8, 0.6], 12, 0.01);
    const rPec = organicSphere(mat, 0.068, [0.08, 1.21, 0.09], [1.3, 0.8, 0.6], 12, 0.01, [10,0,0]);

    // Abs (Rectus Abdominis Six-Pack Contours)
    const absGroup = new THREE.Group();
    for (let row = 0; row < 3; row++) {
      const y = 1.06 - row * 0.06;
      const lAb = organicSphere(mat, 0.03, [-0.04, y, 0.12], [1.1, 0.7, 0.5]);
      const rAb = organicSphere(mat, 0.03, [0.04, y, 0.12], [1.1, 0.7, 0.5]);
      absGroup.add(lAb, rAb);
    }

    // Deltoids
    const lDelt = organicSphere(mat, 0.055, [-0.24, 1.28, 0], [0.9, 1.0, 0.8], 15, 0.005);
    const rDelt = organicSphere(mat, 0.055, [0.24, 1.28, 0], [0.9, 1.0, 0.8], 15, 0.005, [10,0,0]);

    // Arms
    const lUA = contouredLimb(mat, 0.038, 0.052, 0.034, 0.23, [-0.29, 1.15, 0], [0, 0, 0.18]);
    const rUA = contouredLimb(mat, 0.038, 0.052, 0.034, 0.23, [0.29, 1.15, 0], [0, 0, -0.18]);
    const lFA = contouredLimb(mat, 0.034, 0.042, 0.025, 0.22, [-0.33, 0.86, 0], [0, 0, 0.08]);
    const rFA = contouredLimb(mat, 0.034, 0.042, 0.025, 0.22, [0.33, 0.86, 0], [0, 0, -0.08]);

    // Thighs & Calves
    const lUL = contouredLimb(mat, 0.076, 0.088, 0.056, 0.30, [-0.1, 0.5, 0]);
    const rUL = contouredLimb(mat, 0.076, 0.088, 0.056, 0.30, [0.1, 0.5, 0]);
    const lLL = contouredLimb(mat, 0.052, 0.062, 0.032, 0.30, [-0.1, 0.12, 0]);
    const rLL = contouredLimb(mat, 0.052, 0.062, 0.032, 0.30, [0.1, 0.12, 0]);

    g.add(torso, head, neck, lPec, rPec, absGroup, lDelt, rDelt, lUA, rUA, lFA, rFA, lUL, rUL, lLL, rLL);
    return g;
  }

  /* ── 3. SKELETAL SYSTEM ── */
  _buildSkeleton() {
    const g = new THREE.Group();
    const mat = this.materials.bone;
    const wireMat = this.materials.boneWire;

    // Anatomical Skull with Cranium & Mandible
    const skullGroup = new THREE.Group();
    skullGroup.position.set(0, 1.58, 0);

    const cranium = organicSphere(mat, 0.092, [0, 0.02, 0], [0.95, 1.0, 1.05], 10, 0.004);
    const maxilla = organicSphere(mat, 0.05, [0, -0.03, 0.04], [0.8, 0.7, 0.9]);
    const mandible = organicSphere(mat, 0.045, [0, -0.07, 0.03], [0.9, 0.5, 0.8]);
    
    // Eye Orbits
    const lOrbit = organicSphere(wireMat, 0.018, [-0.03, 0.01, 0.07]);
    const rOrbit = organicSphere(wireMat, 0.018, [0.03, 0.01, 0.07]);

    skullGroup.add(cranium, maxilla, mandible, lOrbit, rOrbit);
    skullGroup.name = 'skull';
    this.meshMap.skull = skullGroup;

    // Vertebral Spine (24 Vertebral Discs)
    const spineGroup = new THREE.Group();
    spineGroup.name = 'spine';
    this.meshMap.spine = spineGroup;
    for (let i = 0; i < 24; i++) {
      const y = 1.45 - i * 0.032;
      const curveZ = Math.sin((i / 23) * Math.PI * 2) * 0.015 - 0.02;
      const vert = organicSphere(mat, 0.022, [0, y, curveZ], [1.2, 0.6, 1.0], 18, 0.003, [0,i,0]);
      spineGroup.add(vert);
    }

    // Ribcage (12 Paired Ribs + Sternum)
    const ribGroup = new THREE.Group();
    ribGroup.name = 'ribcage';
    this.meshMap.ribcage = ribGroup;

    const sternum = organicCylinder(mat, 0.018, 0.012, 0.28, [0, 1.15, 0.12]);
    ribGroup.add(sternum);

    for (let i = 0; i < 12; i++) {
      const ribRadius = 0.125 + Math.sin((i / 11) * Math.PI) * 0.055;
      const curve = new THREE.EllipseCurve(0, 0, ribRadius, ribRadius * 0.58, 0, Math.PI, false);
      const pts = curve.getPoints(24);
      const geom = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, 0, p.y + 0.02)));
      const rib = new THREE.Line(geom, wireMat);
      rib.position.y = 1.29 - i * 0.028;
      rib.rotation.x = Math.PI / 2;
      ribGroup.add(rib);
    }

    // Pelvic Girdle
    const pelvisMesh = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.028, 16, 32, Math.PI), mat);
    pelvisMesh.position.set(0, 0.72, 0);
    pelvisMesh.rotation.set(Math.PI / 2, 0, Math.PI);
    pelvisMesh.name = 'pelvis';
    this.meshMap.pelvis = pelvisMesh;

    // Limb Bones
    const boneCyl = (rt, h, pos, rot) => organicCylinder(mat, rt, rt * 0.82, h, pos, rot);
    const limbs = [
      boneCyl(0.018, 0.26, [-0.29, 1.15, 0], [0, 0, 0.18]), boneCyl(0.018, 0.26, [0.29, 1.15, 0], [0, 0, -0.18]),
      boneCyl(0.014, 0.24, [-0.33, 0.86, 0], [0, 0, 0.08]), boneCyl(0.014, 0.24, [0.33, 0.86, 0], [0, 0, -0.08]),
      boneCyl(0.026, 0.32, [-0.1, 0.5, 0]), boneCyl(0.026, 0.32, [0.1, 0.5, 0]),
      boneCyl(0.021, 0.30, [-0.1, 0.12, 0]), boneCyl(0.021, 0.30, [0.1, 0.12, 0])
    ];

    g.add(skullGroup, spineGroup, ribGroup, pelvisMesh, ...limbs);
    return g;
  }

  /* ── 4. INTERNAL VISCERA / ORGANS LAYER ── */
  _buildOrgans() {
    const g = new THREE.Group();
    const m = this.materials;

    // Heart with 4 Chambers & Aorta
    const heartGroup = new THREE.Group();
    heartGroup.position.set(-0.03, 1.18, 0.05);
    heartGroup.name = 'heart';
    
    const heartBase = organicSphere(m.heart, 0.042, [0, 0, 0], [1.0, 1.15, 0.95], 15, 0.005);
    
    const lVentricle = organicSphere(m.heartChamber, 0.022, [0.015, -0.015, 0.01], [1,1,1], 20, 0.002);
    lVentricle.name = 'leftVentricle';
    this.meshMap.leftVentricle = lVentricle;
    
    const rVentricle = organicSphere(m.heartChamber, 0.019, [-0.015, -0.01, 0.02], [1,1,1], 20, 0.002, [10,0,0]);
    rVentricle.name = 'rightVentricle';
    this.meshMap.rightVentricle = rVentricle;
    
    const lAtrium = organicSphere(m.heartChamber, 0.016, [0.01, 0.022, 0], [1,1,1], 25, 0.002, [0,10,0]);
    lAtrium.name = 'leftAtrium';
    this.meshMap.leftAtrium = lAtrium;
    
    const rAtrium = organicSphere(m.heartChamber, 0.016, [-0.015, 0.022, 0], [1,1,1], 25, 0.002, [0,0,10]);
    rAtrium.name = 'rightAtrium';
    this.meshMap.rightAtrium = rAtrium;
    
    const aorta = organicCylinder(m.artery, 0.009, 0.009, 0.035, [0, 0.038, 0]);
    aorta.name = 'aorta';
    this.meshMap.aorta = aorta;
    
    heartGroup.add(heartBase, lVentricle, rVentricle, lAtrium, rAtrium, aorta);
    this.meshMap.heart = heartBase;

    // Lungs (Realistic Lobes & Fissures)
    const lLung = organicSphere(m.lung, 0.065, [-0.1, 1.2, 0.01], [0.75, 1.15, 0.85], 8, 0.012);
    lLung.name = 'leftLung';
    this.meshMap.leftLung = lLung;

    const rLung = organicSphere(m.lung, 0.07, [0.1, 1.2, 0.01], [0.8, 1.2, 0.85], 8, 0.012, [10,10,10]);
    rLung.name = 'rightLung';
    this.meshMap.rightLung = rLung;

    // Liver (Wedge-shaped with right & left lobes)
    const liverMesh = organicSphere(m.liver, 0.065, [0.08, 1.0, 0.06], [1.4, 0.7, 0.9], 10, 0.015);
    liverMesh.name = 'liver';
    this.meshMap.liver = liverMesh;

    // Stomach (J-shaped gastric reservoir)
    const stomachMesh = organicSphere(m.stomach, 0.045, [-0.06, 1.0, 0.05], [1.1, 1.3, 0.9], 12, 0.01);
    stomachMesh.rotation.z = -0.4;
    stomachMesh.name = 'stomach';
    this.meshMap.stomach = stomachMesh;

    // Kidneys (Anatomical renal pair with hilum)
    const lKidney = organicSphere(m.kidney, 0.028, [-0.08, 0.95, -0.06], [0.9, 1.3, 0.8], 15, 0.003);
    lKidney.name = 'leftKidney';
    this.meshMap.leftKidney = lKidney;

    const rKidney = organicSphere(m.kidney, 0.028, [0.08, 0.93, -0.06], [0.9, 1.3, 0.8], 15, 0.003, [5,5,5]);
    rKidney.name = 'rightKidney';
    this.meshMap.rightKidney = rKidney;

    // Brain (Cerebral Gyri/Sulci + Cerebellum + Brainstem)
    const brainGroup = new THREE.Group();
    brainGroup.position.set(0, 1.6, 0);

    const cerebrum = organicSphere(m.brain, 0.085, [0, 0, 0], [1.0, 0.85, 0.95], 30, 0.008);
    const cerebellum = organicSphere(m.brain, 0.032, [0, -0.04, -0.04], [1.1, 0.8, 0.9], 25, 0.004);
    const brainstem = organicCylinder(m.brain, 0.015, 0.012, 0.05, [0, -0.06, -0.01]);

    brainGroup.add(cerebrum, cerebellum, brainstem);
    brainGroup.name = 'brain';
    this.meshMap.brain = brainGroup;

    // Intestines (Intestinal Coils)
    const intGeom = new THREE.TorusKnotGeometry(0.045, 0.016, 128, 16, 2, 3);
    deformGeometry(intGeom, 20, 0.002);
    const intMesh = new THREE.Mesh(intGeom, m.intestine);
    intMesh.position.set(0, 0.86, 0.04);
    intMesh.name = 'intestines';
    this.meshMap.intestines = intMesh;

    g.add(heartGroup, lLung, rLung, liverMesh, stomachMesh, lKidney, rKidney, brainGroup, intMesh);
    return g;
  }

  /* ── 5. NERVOUS SYSTEM LAYER ── */
  _buildNervous() {
    const g = new THREE.Group();
    const nerveMat = this.materials.nerve;
    const branchMat = this.materials.nerve.clone();
    branchMat.opacity = 0.45;
    branchMat.transparent = true;

    const spinePoints = [];
    for (let i = 0; i <= 24; i++) spinePoints.push(new THREE.Vector3(0, 1.55 - i * 0.035, -0.015));
    const spinalLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(spinePoints).getPoints(40)), nerveMat);
    spinalLine.name = 'spinalCord';
    this.meshMap.spinalCord = spinalLine;
    g.add(spinalLine);

    for (let i = 0; i < 14; i++) {
      const y = 1.3 - i * 0.04;
      const spread = 0.085 + Math.sin((i / 13) * Math.PI) * 0.1;
      const mkCurve = (pts) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts).getPoints(10)), branchMat);
      
      g.add(mkCurve([new THREE.Vector3(0, y, -0.015), new THREE.Vector3(-spread * 0.5, y - 0.01, 0), new THREE.Vector3(-spread, y - 0.02, 0.01)]));
      g.add(mkCurve([new THREE.Vector3(0, y, -0.015), new THREE.Vector3(spread * 0.5, y - 0.01, 0), new THREE.Vector3(spread, y - 0.02, 0.01)]));
    }

    return g;
  }
}

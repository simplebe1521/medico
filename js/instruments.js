/* ========================================
   ImmersiMed v2 — Enhanced Instruments
   7 tools with descriptions & warnings
   ======================================== */

export const INSTRUMENTS = [
  {
    id: 'scalpel', name: 'Scalpel', icon: '🔪',
    desc: 'Surgical knife for precise incisions',
    grip: 'Hold like a dinner knife for long cuts, or like a pencil for fine detail work.',
    warning: '⚠️ Always cut away from yourself. Use controlled, shallow strokes.',
    cursor: 'crosshair', action: 'cut',
  },
  {
    id: 'forceps', name: 'Forceps', icon: '🔧',
    desc: 'Grasping and holding tissue',
    grip: 'Hold with thumb and ring finger through the rings. Index finger guides along the shaft.',
    warning: '⚠️ Do not crush delicate tissue. Use toothed forceps for skin, smooth for organs.',
    cursor: 'grab', action: 'grab',
  },
  {
    id: 'retractor', name: 'Retractor', icon: '📌',
    desc: 'Holds tissue open for access',
    grip: 'Self-retaining retractors lock in place. Handheld retractors require an assistant.',
    warning: '⚠️ Excessive retraction can damage nerves and vessels. Reposition periodically.',
    cursor: 'pointer', action: 'retract',
  },
  {
    id: 'bonesaw', name: 'Bone Saw', icon: '🪚',
    desc: 'Oscillating saw for bone access',
    grip: 'Hold firmly with both hands. Guide along the marked cutting line.',
    warning: '⚠️ Never force the saw. Let the oscillation do the work. Protect underlying soft tissue.',
    cursor: 'cell', action: 'saw',
  },
  {
    id: 'needle_holder', name: 'Needle Holder', icon: '🪡',
    desc: 'Holds suture needles for stitching',
    grip: 'Hold with thumb and ring finger. Grasp needle at 1/3 from the swaged end.',
    warning: '⚠️ Never grasp the needle at the tip — it will bend or break.',
    cursor: 'crosshair', action: 'suture',
  },
  {
    id: 'syringe', name: 'Syringe', icon: '💉',
    desc: 'Injection and fluid aspiration',
    grip: 'Hold the barrel between index and middle fingers. Thumb on the plunger.',
    warning: '⚠️ Always aspirate before injecting to check you haven\'t hit a blood vessel.',
    cursor: 'pointer', action: 'inject',
  },
  {
    id: 'measuring_scale', name: 'Measuring Scale', icon: '📏',
    desc: 'Measure organ dimensions',
    grip: 'Place flat against the structure. Read the measurement at the distal end.',
    warning: '⚠️ Ensure the scale is properly calibrated and placed on a flat surface.',
    cursor: 'default', action: 'measure',
  },
];

export class InstrumentManager {
  constructor() {
    this.currentTool = null;
    this.listeners = [];
  }

  select(toolId) {
    const tool = INSTRUMENTS.find(t => t.id === toolId);
    if (!tool) return;
    this.currentTool = tool;
    this._notify();
    return tool;
  }

  deselect() {
    this.currentTool = null;
    this._notify();
  }

  getCurrent() { return this.currentTool; }
  getAll() { return INSTRUMENTS; }

  onChange(fn) { this.listeners.push(fn); }
  _notify() { this.listeners.forEach(fn => fn(this.currentTool)); }
}

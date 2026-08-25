/* ========================================
   ImmersiMed v2 — Enhanced Lesson System
   Detailed steps with view modes & AI cues
   ======================================== */

export const LESSONS = {
  heart: {
    id: 'heart', title: 'Heart Dissection', subject: 'anatomy', quizId: 'heart',
    steps: [
      { instruction: 'Observe the intact body. Rotate the model 360° to view the anterior thorax.', action: 'observe', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Select the Scalpel. Make a midline incision along the sternum — click the torso.', action: 'incise', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: 'torsoSkin', tool: 'scalpel', viewMode: 'normal' },
      { instruction: 'Retract the skin layer to expose the underlying musculature.', action: 'retract_skin', layers: { skin: false, muscle: true, organs: false, skeleton: false, nervous: false }, highlight: null, tool: 'retractor', viewMode: 'normal' },
      { instruction: 'Examine the intercostal muscles. Enable Skeleton to visualize the rib cage.', action: 'expose_ribs', layers: { skin: false, muscle: true, skeleton: true, organs: false, nervous: false }, highlight: 'ribcage', tool: null, viewMode: 'normal' },
      { instruction: 'Use the Bone Saw to remove the sternum and open the thoracic cavity.', action: 'open_cavity', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: 'bonesaw', viewMode: 'normal' },
      { instruction: 'The heart is now visible in situ. Click on it to examine.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'heart', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'Switch to Isolation mode to examine the heart in detail.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'heart', tool: null, viewMode: 'isolation' },
      { instruction: 'Rotate the isolated heart 360° to observe all surfaces and vessels.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'heart', tool: null, viewMode: 'isolation' },
      { instruction: 'Use the Measuring Scale to note the heart dimensions (~12cm × 8cm × 6cm).', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'heart', tool: 'measuring_scale', viewMode: 'normal' },
      { instruction: '🎉 Heart dissection complete! Proceed to the quiz to test your knowledge.', action: 'complete', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
  lungs: {
    id: 'lungs', title: 'Lung Examination', subject: 'anatomy', quizId: 'thoracic',
    steps: [
      { instruction: 'Observe the thorax. Note the symmetrical chest wall.', action: 'observe', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Remove the skin and muscle layers to expose the rib cage.', action: 'retract_skin', layers: { skin: false, muscle: false, skeleton: true, organs: false, nervous: false }, highlight: 'ribcage', tool: 'retractor', viewMode: 'normal' },
      { instruction: 'Open the thoracic cavity. Enable organs to reveal both lungs.', action: 'open_cavity', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: null, tool: 'bonesaw', viewMode: 'normal' },
      { instruction: 'Click on the Right Lung — note it has 3 lobes.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'rightLung', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'Now click on the Left Lung — it has only 2 lobes due to the cardiac notch.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'leftLung', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'Switch to Exploded view to see the spatial relationships.', action: 'examine', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'exploded' },
      { instruction: 'Use X-Ray mode to see the bronchial tree and vasculature.', action: 'examine', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'xray' },
      { instruction: '🎉 Lung examination complete! Proceed to the quiz.', action: 'complete', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
  liver: {
    id: 'liver', title: 'Liver & Hepatobiliary', subject: 'anatomy', quizId: 'abdominal',
    steps: [
      { instruction: 'Observe the abdominal region of the body.', action: 'observe', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Make an incision and retract to expose the abdominal cavity.', action: 'incise', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: null, tool: 'scalpel', viewMode: 'normal' },
      { instruction: 'Locate the liver in the right upper quadrant. Click to examine.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'liver', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'Isolate the liver to examine its lobes and surfaces.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'liver', tool: null, viewMode: 'isolation' },
      { instruction: 'Examine adjacent organs — stomach and intestines.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'stomach', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'View in Transparent mode to see organ relationships.', action: 'examine', layers: { skin: true, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'transparent' },
      { instruction: 'Examine the kidneys in the retroperitoneal space.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'leftKidney', tool: 'forceps', viewMode: 'normal' },
      { instruction: 'Examine the intestines in the lower abdomen.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'intestines', tool: 'forceps', viewMode: 'normal' },
      { instruction: '🎉 Abdominal examination complete! Proceed to the quiz.', action: 'complete', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
  brain: {
    id: 'brain', title: 'Brain & Cranial Nerves', subject: 'anatomy', quizId: 'cranial',
    steps: [
      { instruction: 'Observe the head. Rotate to view superior and lateral aspects.', action: 'observe', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: 'headSkin', tool: null, viewMode: 'normal' },
      { instruction: 'Make a coronal incision along the hairline with the Scalpel.', action: 'incise', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: 'headSkin', tool: 'scalpel', viewMode: 'normal' },
      { instruction: 'Retract the scalp to expose the skull.', action: 'retract', layers: { skin: false, muscle: false, skeleton: true, organs: false, nervous: false }, highlight: 'skull', tool: 'retractor', viewMode: 'normal' },
      { instruction: 'Perform craniotomy with the Bone Saw — reveal the brain.', action: 'craniotomy', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: 'bonesaw', viewMode: 'normal' },
      { instruction: 'Click on the Brain to examine its structure.', action: 'examine', layers: { skin: false, muscle: false, skeleton: false, organs: true, nervous: false }, highlight: 'brain', tool: 'forceps', viewMode: 'normal' },
      { instruction: '🎉 Cranial examination complete! Proceed to the quiz.', action: 'complete', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: true }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
  iv_cannulation: {
    id: 'iv_cannulation', title: 'Peripheral IV Cannulation', subject: 'clinical_skills', quizId: 'thoracic',
    steps: [
      { instruction: 'Step 1: Introduction - IV cannulation is indicated for fluid administration and IV medication.', action: 'intro', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 2: Equipment - Gather cannula, tourniquet, chlorhexidine wipe, flush, and dressing.', action: 'equip', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 3: Demonstration - Watch as the tourniquet is applied to engorge the veins.', action: 'demo', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 4: Guided Practice - Use the Scalpel (simulating needle) to insert at a 15-30 degree angle.', action: 'practice', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: 'scalpel', viewMode: 'normal' },
      { instruction: 'Step 5: Assessment - Perform the procedure independently without visual cues.', action: 'assess', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 6: Feedback - Good technique. Angle was slightly steep.', action: 'feedback', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 7: Revision - Review the procedure notes and attempt again if necessary.', action: 'complete', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
  cpr: {
    id: 'cpr', title: 'Basic Life Support (CPR)', subject: 'clinical_skills', quizId: 'thoracic',
    steps: [
      { instruction: 'Step 1: Introduction - CPR is vital for maintaining perfusion during cardiac arrest.', action: 'intro', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 2: Equipment - Ensure scene safety and call for AED.', action: 'equip', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 3: Demonstration - Observe correct hand placement on the lower half of the sternum.', action: 'demo', layers: { skin: false, muscle: false, skeleton: true, organs: false, nervous: false }, highlight: 'ribcage', tool: null, viewMode: 'normal' },
      { instruction: 'Step 4: Guided Practice - Perform compressions at 100-120 bpm, depth of 2 inches.', action: 'practice', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 5: Assessment - Perform a 2-minute cycle of CPR.', action: 'assess', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 6: Feedback - Excellent compression rate, ensure full chest recoil.', action: 'feedback', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
      { instruction: 'Step 7: Revision - Review the AHA guidelines for CPR.', action: 'complete', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    ],
  },
};

// Default lesson for topics without custom steps
export const DEFAULT_LESSON = {
  steps: [
    { instruction: 'Observe the body and identify the region of interest.', action: 'observe', layers: { skin: true, organs: false, skeleton: false, muscle: false, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    { instruction: 'Toggle body layers to explore internal structures.', action: 'examine', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
    { instruction: 'Use X-Ray mode for a comprehensive view.', action: 'examine', layers: { skin: true, muscle: true, skeleton: true, organs: true, nervous: true }, highlight: null, tool: null, viewMode: 'xray' },
    { instruction: '🎉 Exploration complete!', action: 'complete', layers: { skin: false, muscle: false, skeleton: true, organs: true, nervous: false }, highlight: null, tool: null, viewMode: 'normal' },
  ],
};

export class LessonManager {
  constructor() {
    this.currentLesson = null;
    this.currentStepIndex = 0;
    this.listeners = [];
    this.topicId = null;
  }

  loadLesson(topicId) {
    this.topicId = topicId;
    this.currentLesson = LESSONS[topicId] || { ...DEFAULT_LESSON, id: topicId, title: topicId, quizId: 'thoracic' };
    this.currentStepIndex = 0;
    this._notify('load');
    return this.currentLesson;
  }

  getCurrentStep() {
    if (!this.currentLesson) return null;
    return this.currentLesson.steps[this.currentStepIndex] || null;
  }

  getProgress() {
    if (!this.currentLesson) return 0;
    return ((this.currentStepIndex + 1) / this.currentLesson.steps.length) * 100;
  }

  getStepLabel() {
    if (!this.currentLesson) return '';
    return `Step ${this.currentStepIndex + 1} / ${this.currentLesson.steps.length}`;
  }

  nextStep() {
    if (!this.currentLesson) return null;
    if (this.currentStepIndex < this.currentLesson.steps.length - 1) {
      this.currentStepIndex++;
      this._notify('step');
      return this.getCurrentStep();
    }
    return null;
  }

  prevStep() {
    if (!this.currentLesson) return null;
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this._notify('step');
      return this.getCurrentStep();
    }
    return null;
  }

  isLastStep() { return !this.currentLesson || this.currentStepIndex >= this.currentLesson.steps.length - 1; }
  isFirstStep() { return this.currentStepIndex === 0; }
  isComplete() { return this.isLastStep() && this.getCurrentStep()?.action === 'complete'; }

  onChange(fn) { this.listeners.push(fn); }
  _notify(event) { this.listeners.forEach(fn => fn(event, this)); }
}

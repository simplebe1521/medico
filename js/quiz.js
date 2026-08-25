/* ========================================
   ImmersiMed v2 — Quiz Engine
   Organ identification, scoring, results
   ======================================== */

const QUIZ_BANKS = {
  heart: {
    title: 'Heart Anatomy Quiz',
    questions: [
      { q: 'Identify the chamber that pumps blood to the systemic circulation.', options: ['Left Ventricle', 'Right Ventricle', 'Left Atrium', 'Right Atrium'], correct: 0, explanation: 'The left ventricle pumps oxygenated blood through the aortic valve into the aorta and systemic circulation.' },
      { q: 'Which valve prevents blood from flowing back into the left ventricle?', options: ['Mitral Valve', 'Aortic Valve', 'Tricuspid Valve', 'Pulmonary Valve'], correct: 1, explanation: 'The aortic (semilunar) valve sits between the left ventricle and the aorta.' },
      { q: 'How many chambers does the human heart have?', options: ['2', '3', '4', '5'], correct: 2, explanation: 'The heart has 4 chambers: right atrium, right ventricle, left atrium, and left ventricle.' },
      { q: 'Which coronary artery is most commonly blocked in myocardial infarction?', options: ['Left Anterior Descending', 'Right Coronary', 'Circumflex', 'Posterior Descending'], correct: 0, explanation: 'The LAD (Left Anterior Descending) artery is called the "widow maker" as its blockage is most lethal.' },
      { q: 'What is the normal resting heart rate for adults?', options: ['40-60 bpm', '60-100 bpm', '100-120 bpm', '80-140 bpm'], correct: 1, explanation: 'Normal resting heart rate for adults is 60-100 beats per minute. Athletes may have lower rates.' },
    ],
  },
  lungs: {
    title: 'Lung Examination Quiz',
    questions: [
      { q: 'How many lobes does the right lung have?', options: ['1', '2', '3', '4'], correct: 2, explanation: 'The right lung has 3 lobes (superior, middle, inferior), while the left has only 2.' },
      { q: 'What separates the thoracic and abdominal cavities?', options: ['Peritoneum', 'Diaphragm', 'Pleura', 'Intercostal muscles'], correct: 1, explanation: 'The diaphragm is a dome-shaped muscle that separates the two cavities and is the primary muscle of respiration.' },
      { q: 'The cardiac notch is found on which lung?', options: ['Right', 'Left', 'Both', 'Neither'], correct: 1, explanation: 'The cardiac notch is a concavity on the left lung that accommodates the heart.' },
    ],
  },
  liver: {
    title: 'Liver & Hepatobiliary Quiz',
    questions: [
      { q: 'Which organ is the largest solid internal organ?', options: ['Spleen', 'Liver', 'Kidney', 'Pancreas'], correct: 1, explanation: 'The liver weighs approximately 1.5 kg and performs over 500 functions.' },
      { q: 'What is the primary function of the gallbladder?', options: ['Produce bile', 'Store and concentrate bile', 'Produce insulin', 'Filter blood'], correct: 1, explanation: 'The gallbladder stores and concentrates bile produced by the liver.' },
      { q: 'Which vessel supplies the majority of the liver\'s blood?', options: ['Hepatic artery', 'Hepatic portal vein', 'Inferior vena cava', 'Celiac trunk'], correct: 1, explanation: 'The hepatic portal vein supplies about 75% of the liver\'s blood, carrying nutrient-rich blood from the GI tract.' },
    ],
  },
  brain: {
    title: 'Brain & Cranial Nerves Quiz',
    questions: [
      { q: 'Which lobe of the brain is responsible for vision?', options: ['Frontal', 'Parietal', 'Temporal', 'Occipital'], correct: 3, explanation: 'The occipital lobe, located at the posterior part of the brain, contains the primary visual cortex.' },
      { q: 'How many cranial nerves are there?', options: ['10', '12', '14', '31'], correct: 1, explanation: 'There are 12 pairs of cranial nerves (CN I-XII).' },
      { q: 'Which cranial nerve is responsible for facial expression?', options: ['Trigeminal (V)', 'Facial (VII)', 'Vagus (X)', 'Optic (II)'], correct: 1, explanation: 'The Facial nerve (CN VII) controls the muscles of facial expression.' },
    ],
  },
  kidney: {
    title: 'Renal System Quiz',
    questions: [
      { q: 'Where are the kidneys located?', options: ['Intraperitoneal', 'Retroperitoneal', 'Subdiaphragmatic', 'Pelvic cavity'], correct: 1, explanation: 'The kidneys are retroperitoneal organs — they lie behind the peritoneum.' },
      { q: 'What is the functional unit of the kidney?', options: ['Glomerulus', 'Nephron', 'Calyx', 'Ureter'], correct: 1, explanation: 'The nephron is the functional unit of the kidney, responsible for filtering blood and producing urine.' },
    ],
  },
  eye: {
    title: 'Eye Anatomy Quiz',
    questions: [
      { q: 'Which part of the eye contains photoreceptors?', options: ['Cornea', 'Lens', 'Retina', 'Sclera'], correct: 2, explanation: 'The retina contains photoreceptor cells (rods and cones) that detect light.' },
      { q: 'What is the white outer layer of the eyeball called?', options: ['Choroid', 'Iris', 'Sclera', 'Macula'], correct: 2, explanation: 'The sclera is the tough, fibrous, white outer layer of the eyeball.' },
    ],
  },
  cardiac_cycle: {
    title: 'Cardiac Cycle Quiz',
    questions: [
      { q: 'What phase of the cardiac cycle involves ventricular contraction?', options: ['Diastole', 'Systole', 'Isovolumetric relaxation', 'Atrial kick'], correct: 1, explanation: 'Systole is the phase of the cardiac cycle when the ventricles contract and pump blood.' },
      { q: 'Which valves close to produce the first heart sound (S1)?', options: ['Aortic and Pulmonary', 'Mitral and Tricuspid', 'Mitral and Aortic', 'Tricuspid and Pulmonary'], correct: 1, explanation: 'The closure of the atrioventricular (mitral and tricuspid) valves produces the S1 sound.' },
    ],
  },
  respiratory: {
    title: 'Respiratory Mechanics Quiz',
    questions: [
      { q: 'What is the primary muscle of inspiration?', options: ['External intercostals', 'Internal intercostals', 'Diaphragm', 'Sternocleidomastoid'], correct: 2, explanation: 'The diaphragm is the primary muscle responsible for inspiration.' },
      { q: 'Where does gas exchange primarily occur?', options: ['Bronchi', 'Trachea', 'Alveoli', 'Bronchioles'], correct: 2, explanation: 'Gas exchange between air and blood occurs in the alveoli.' },
    ],
  },
  appendectomy: {
    title: 'Appendectomy Quiz',
    questions: [
      { q: 'The appendix is attached to which part of the large intestine?', options: ['Ascending colon', 'Cecum', 'Sigmoid colon', 'Transverse colon'], correct: 1, explanation: 'The vermiform appendix is attached to the posteromedial wall of the cecum.' },
      { q: 'What is the most common incision used for an open appendectomy?', options: ['Kocher', 'McBurney', 'Pfannenstiel', 'Midline'], correct: 1, explanation: 'The McBurney incision in the right lower quadrant is classically used for open appendectomies.' },
    ],
  },
  mi: {
    title: 'Myocardial Infarction Quiz',
    questions: [
      { q: 'What is the most common cause of myocardial infarction?', options: ['Coronary artery thrombosis', 'Valvular stenosis', 'Pericarditis', 'Aortic dissection'], correct: 0, explanation: 'A thrombosis (blood clot) in a coronary artery is the most common cause of an MI.' },
      { q: 'Which cardiac biomarker is most specific for myocardial injury?', options: ['Myoglobin', 'CK-MB', 'Troponin', 'LDH'], correct: 2, explanation: 'Cardiac troponins (I and T) are highly specific and sensitive for myocardial injury.' },
    ],
  },
  cardiac_tissue: {
    title: 'Cardiac Muscle Histology Quiz',
    questions: [
      { q: 'What structure unique to cardiac muscle cells allows them to contract as a syncytium?', options: ['Z-discs', 'Intercalated discs', 'T-tubules', 'Sarcoplasmic reticulum'], correct: 1, explanation: 'Intercalated discs contain gap junctions that allow electrical signals to pass rapidly between cardiac cells.' },
      { q: 'Cardiac muscle tissue is:', options: ['Striated and voluntary', 'Non-striated and involuntary', 'Striated and involuntary', 'Non-striated and voluntary'], correct: 2, explanation: 'Unlike skeletal muscle, cardiac muscle is striated but involuntary.' },
    ],
  },
  postmortem: {
    title: 'Postmortem Examination Quiz',
    questions: [
      { q: 'What is the common term for postmortem cooling of the body?', options: ['Rigor mortis', 'Livor mortis', 'Algor mortis', 'Pallor mortis'], correct: 2, explanation: 'Algor mortis is the reduction in body temperature following death.' },
      { q: 'Which incision is standard for a full internal autopsy?', options: ['Y-incision', 'U-incision', 'T-incision', 'I-incision'], correct: 0, explanation: 'A Y-shaped incision from the shoulders to the mid-chest and down to the pubic bone is standard.' },
    ],
  },
  thoracic: {
    title: 'Thoracic Cavity Quiz',
    questions: [
      { q: 'How many pairs of ribs does a human have?', options: ['10', '11', '12', '14'], correct: 2, explanation: 'There are 12 pairs of ribs: 7 true, 3 false, and 2 floating ribs.' },
    ],
  },
  abdominal: {
    title: 'Abdominal Organs Quiz',
    questions: [
      { q: 'What pH is gastric acid?', options: ['pH 1-2', 'pH 4-5', 'pH 7', 'pH 9-10'], correct: 0, explanation: 'Gastric acid has a pH of 1-2, strong enough to dissolve small metals. The mucus barrier protects the stomach lining.' },
    ],
  },
  cranial: {
    title: 'Cranial Anatomy Quiz',
    questions: [
      { q: 'How many bones make up the adult skull?', options: ['14', '18', '22', '28'], correct: 2, explanation: 'The skull consists of 22 bones: 8 cranial bones and 14 facial bones.' },
    ],
  },
  iv_cannulation: {
    title: 'Peripheral IV Cannulation Quiz',
    questions: [
      { q: 'What is the optimal angle of insertion for a peripheral IV cannula?', options: ['5-10°', '15-30°', '45-60°', '90°'], correct: 1, explanation: 'The cannula should be inserted at a 15-30° angle to the skin surface to penetrate the vein without piercing the posterior wall.' },
      { q: 'What visual indicator confirms that the needle has successfully entered the vein lumen?', options: ['Skin blanching', 'Blood flashback in hub', 'Patient twitching', 'Resistance release'], correct: 1, explanation: 'Blood flashback into the clear chamber hub confirms venous entry.' },
      { q: 'How long should skin disinfectant (chlorhexidine) dry before cannula insertion?', options: ['5 seconds', 'Allow to air dry completely (30-60s)', 'Wipe off immediately with gauze', 'No drying needed'], correct: 1, explanation: 'Antiseptic must air dry completely (at least 30 seconds) to achieve effective antimicrobial action.' },
      { q: 'When should the tourniquet be released during IV cannulation?', options: ['Before advancing cannula', 'Immediately after seeing flashback', 'After advancing cannula and before removing needle', 'After flushing'], correct: 2, explanation: 'Release tourniquet after advancing plastic catheter, before pulling needle out, to prevent blood leakage.' },
    ],
  },
};

export class QuizEngine {
  constructor() {
    this.quiz = null;
    this.currentIndex = 0;
    this.answers = [];
    this.startTime = null;
    this.listeners = [];
  }

  loadQuiz(topicId) {
    // Map topic to quiz bank
    const bankId = QUIZ_BANKS[topicId] ? topicId : 'thoracic';
    this.quiz = QUIZ_BANKS[bankId];
    this.currentIndex = 0;
    this.answers = [];
    this.startTime = Date.now();
    this._notify('load');
    return this.quiz;
  }

  getCurrentQuestion() {
    if (!this.quiz) return null;
    return this.quiz.questions[this.currentIndex] || null;
  }

  getQuestionNumber() {
    return this.currentIndex + 1;
  }

  getTotalQuestions() {
    return this.quiz ? this.quiz.questions.length : 0;
  }

  getProgress() {
    if (!this.quiz) return 0;
    return ((this.currentIndex) / this.quiz.questions.length) * 100;
  }

  submitAnswer(optionIndex) {
    const question = this.getCurrentQuestion();
    if (!question) return null;

    const isCorrect = optionIndex === question.correct;
    this.answers.push({
      questionIndex: this.currentIndex,
      selected: optionIndex,
      correct: question.correct,
      isCorrect,
    });

    this._notify('answer', { isCorrect, explanation: question.explanation });
    return { isCorrect, explanation: question.explanation, correctIndex: question.correct };
  }

  nextQuestion() {
    if (!this.quiz) return null;
    if (this.currentIndex < this.quiz.questions.length - 1) {
      this.currentIndex++;
      this._notify('next');
      return this.getCurrentQuestion();
    }
    return null;
  }

  isLastQuestion() {
    if (!this.quiz) return true;
    return this.currentIndex >= this.quiz.questions.length - 1;
  }

  isComplete() {
    return this.answers.length >= this.getTotalQuestions();
  }

  getResults() {
    if (!this.quiz) return null;
    const correct = this.answers.filter(a => a.isCorrect).length;
    const total = this.answers.length;
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = accuracy >= 60;

    return {
      title: this.quiz.title,
      correct,
      total,
      accuracy,
      time: elapsed,
      timeFormatted: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`,
      passed,
      answers: this.answers,
    };
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify(event, data) {
    this.listeners.forEach(fn => fn(event, data, this));
  }
}

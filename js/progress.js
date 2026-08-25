/* ========================================
   ImmersiMed v2 — Progress Tracker
   localStorage persistence, achievements
   ======================================== */

const STORAGE_KEY = 'immersimed_progress';

const ACHIEVEMENTS = [
  { id: 'first_lesson', name: 'First Steps', icon: '🎯', desc: 'Complete your first lesson', check: d => d.lessonsCompleted >= 1 },
  { id: 'anatomy_3', name: 'Anatomy Explorer', icon: '🦴', desc: 'Complete 3 anatomy lessons', check: d => (d.subjectLessons?.anatomy || 0) >= 3 },
  { id: 'perfect_quiz', name: 'Perfect Score', icon: '💯', desc: 'Score 100% on any quiz', check: d => d.perfectQuizzes >= 1 },
  { id: 'five_lessons', name: 'Dedicated Student', icon: '📚', desc: 'Complete 5 lessons', check: d => d.lessonsCompleted >= 5 },
  { id: 'all_tools', name: 'Tool Master', icon: '🔧', desc: 'Use all 7 instruments', check: d => (d.toolsUsed?.size || d.toolsUsedCount || 0) >= 7 },
  { id: 'speed_quiz', name: 'Speed Demon', icon: '⚡', desc: 'Complete a quiz in under 2 minutes', check: d => d.fastestQuiz < 120 },
  { id: 'ten_lessons', name: 'Knowledge Seeker', icon: '🏆', desc: 'Complete 10 lessons', check: d => d.lessonsCompleted >= 10 },
  { id: 'all_subjects', name: 'Renaissance Medic', icon: '🌟', desc: 'Complete lessons in all subjects', check: d => Object.keys(d.subjectLessons || {}).length >= 6 },
];

export class ProgressTracker {
  constructor() {
    this.data = this._load();
  }

  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return this._defaultData();
  }

  _defaultData() {
    return {
      lessonsCompleted: 0,
      quizzesTaken: 0,
      perfectQuizzes: 0,
      totalStudyTime: 0, // seconds
      fastestQuiz: Infinity,
      avgScore: 0,
      scores: [],
      subjectLessons: {},   // { anatomy: 2, surgery: 1 }
      completedTopics: {},  // { 'anatomy:heart': { score: 92, time: 180 } }
      toolsUsedCount: 0,
      history: [],          // [{ date, topic, score, time }]
    };
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) { /* ignore */ }
  }

  /** Mark a lesson as completed */
  completeLession(subjectId, topicId, quizScore, timeSeconds) {
    const key = `${subjectId}:${topicId}`;
    const d = this.data;

    d.lessonsCompleted++;
    d.subjectLessons[subjectId] = (d.subjectLessons[subjectId] || 0) + 1;

    if (quizScore !== undefined) {
      d.quizzesTaken++;
      d.scores.push(quizScore);
      d.avgScore = Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length);
      if (quizScore === 100) d.perfectQuizzes++;
      if (timeSeconds < d.fastestQuiz) d.fastestQuiz = timeSeconds;
    }

    d.completedTopics[key] = {
      score: quizScore || 0,
      time: timeSeconds || 0,
      date: new Date().toISOString(),
    };

    d.totalStudyTime += timeSeconds || 0;

    d.history.unshift({
      date: new Date().toISOString(),
      subject: subjectId,
      topic: topicId,
      score: quizScore || 0,
      time: timeSeconds || 0,
    });

    // Keep last 20 entries
    if (d.history.length > 20) d.history = d.history.slice(0, 20);

    this._save();
  }

  /** Record tool usage */
  recordToolUse(toolId) {
    // Simple counter
    this.data.toolsUsedCount = Math.min((this.data.toolsUsedCount || 0) + 1, 7);
    this._save();
  }

  /** Check if a topic is completed */
  isTopicCompleted(subjectId, topicId) {
    return !!this.data.completedTopics[`${subjectId}:${topicId}`];
  }

  /** Get topic score */
  getTopicScore(subjectId, topicId) {
    const entry = this.data.completedTopics[`${subjectId}:${topicId}`];
    return entry ? entry.score : null;
  }

  /** Get subject progress percentage */
  getSubjectProgress(subjectId, totalTopics) {
    const completed = this.data.subjectLessons[subjectId] || 0;
    return totalTopics > 0 ? Math.min(Math.round((completed / totalTopics) * 100), 100) : 0;
  }

  /** Get overall progress */
  getOverallProgress(totalTopicsInPlatform) {
    return totalTopicsInPlatform > 0
      ? Math.min(Math.round((this.data.lessonsCompleted / totalTopicsInPlatform) * 100), 100)
      : 0;
  }

  /** Get earned achievements */
  getAchievements() {
    return ACHIEVEMENTS.map(a => ({
      ...a,
      earned: a.check(this.data),
    }));
  }

  /** Get overview stats */
  getStats() {
    const d = this.data;
    return {
      lessonsCompleted: d.lessonsCompleted,
      quizzesTaken: d.quizzesTaken,
      avgScore: d.avgScore,
      studyTime: this._formatTime(d.totalStudyTime),
      history: d.history,
    };
  }

  _formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  }

  /** Reset all progress */
  reset() {
    this.data = this._defaultData();
    this._save();
  }
}

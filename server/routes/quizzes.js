const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Strip correct answers for student-facing responses
function sanitizeForStudent(quiz) {
  return {
    ...quiz,
    questions: quiz.questions.map(({ correctIndex, ...q }) => q),
  };
}

router.get('/course/:courseId', authMiddleware, (req, res) => {
  const quizzes = store.quizzes.filter(q => q.courseId === req.params.courseId && q.status === 'active');
  const { role, id } = req.user;
  const result = quizzes.map(quiz => {
    const attempt = store.quizAttempts.find(a => a.quizId === quiz.id && a.studentId === id);
    const attemptCount = store.quizAttempts.filter(a => a.quizId === quiz.id).length;
    const base = role === 'student' ? sanitizeForStudent(quiz) : quiz;
    return { ...base, attempted: !!attempt, myAttempt: attempt || null, attemptCount };
  });
  res.json(result);
});

router.get('/:id', authMiddleware, (req, res) => {
  const quiz = store.quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const course = store.courses.find(c => c.id === quiz.courseId);
  const attempt = store.quizAttempts.find(a => a.quizId === quiz.id && a.studentId === req.user.id);
  const base = req.user.role === 'student' ? sanitizeForStudent(quiz) : quiz;
  res.json({ ...base, courseName: course ? course.title : '', myAttempt: attempt || null });
});

router.post('/', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const { courseId, title, description, duration, questions } = req.body;
  if (!questions || questions.length < 2) return res.status(400).json({ error: 'At least 2 questions required' });
  const quiz = {
    id: uuidv4(), courseId, title, description,
    duration: Number(duration) || 15,
    questions: questions.map((q, i) => ({ id: `${uuidv4().slice(0, 8)}_${i}`, ...q })),
    status: 'active', createdBy: req.user.id, createdAt: new Date().toISOString()
  };
  store.quizzes.push(quiz);
  res.status(201).json(quiz);
});

router.put('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.quizzes.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quiz not found' });
  store.quizzes[idx] = { ...store.quizzes[idx], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
  res.json(store.quizzes[idx]);
});

router.delete('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.quizzes.findIndex(q => q.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Quiz not found' });
  store.quizzes.splice(idx, 1);
  res.json({ message: 'Quiz deleted' });
});

router.post('/:id/attempt', authMiddleware, (req, res) => {
  const quiz = store.quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const existing = store.quizAttempts.find(a => a.quizId === quiz.id && a.studentId === req.user.id);
  if (existing) return res.status(409).json({ error: 'Already attempted', attempt: existing });

  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
    return res.status(400).json({ error: 'Invalid answers array' });
  }

  let score = 0;
  const breakdown = quiz.questions.map((q, i) => {
    const correct = answers[i] === q.correctIndex;
    if (correct) score++;
    return { questionId: q.id, selected: answers[i], correct, correctIndex: q.correctIndex };
  });

  const attempt = {
    id: uuidv4(), quizId: quiz.id, studentId: req.user.id,
    answers, score, total: quiz.questions.length,
    percentage: Math.round((score / quiz.questions.length) * 100),
    breakdown, completedAt: new Date().toISOString()
  };
  store.quizAttempts.push(attempt);
  res.status(201).json(attempt);
});

router.get('/:id/attempts', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const attempts = store.quizAttempts
    .filter(a => a.quizId === req.params.id)
    .map(a => {
      const student = store.users.find(u => u.id === a.studentId);
      return { ...a, studentName: student ? student.name : 'Unknown', studentMatric: student ? student.matric : '' };
    });
  res.json(attempts);
});

module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

// Mark a lesson as complete for the logged-in student
router.post('/lessons/:lessonId/complete', authMiddleware, requireRole('student'), (req, res) => {
  const lesson = store.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const already = store.lessonProgress.find(
    p => p.studentId === req.user.id && p.lessonId === req.params.lessonId
  );
  if (already) return res.json(already);

  const entry = {
    id: uuidv4(), studentId: req.user.id,
    lessonId: lesson.id, courseId: lesson.courseId,
    completedAt: new Date().toISOString()
  };
  store.lessonProgress.push(entry);

  // Recalculate and save enrollment progress percentage
  const allLessons = store.lessons.filter(l => l.courseId === lesson.courseId);
  const completedCount = store.lessonProgress.filter(
    p => p.studentId === req.user.id && p.courseId === lesson.courseId
  ).length;
  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const enrollment = store.enrollments.find(
    e => e.studentId === req.user.id && e.courseId === lesson.courseId
  );
  if (enrollment) enrollment.progress = pct;

  res.status(201).json({ ...entry, courseProgress: pct });
});

// Get completed lesson IDs for a student in a course
router.get('/course/:courseId', authMiddleware, requireRole('student'), (req, res) => {
  const completedLessonIds = store.lessonProgress
    .filter(p => p.studentId === req.user.id && p.courseId === req.params.courseId)
    .map(p => p.lessonId);

  const allLessons = store.lessons.filter(l => l.courseId === req.params.courseId);
  const pct = allLessons.length > 0
    ? Math.round((completedLessonIds.length / allLessons.length) * 100) : 0;

  res.json({ completedLessonIds, total: allLessons.length, completed: completedLessonIds.length, percentage: pct });
});

// Get progress summary across all enrolled courses for the student
router.get('/my', authMiddleware, requireRole('student'), (req, res) => {
  const { id } = req.user;
  const isDemoStudent = id.startsWith('demo_');

  // For demo students, use any course they have progress in; for real students, use enrollments
  const courseIds = isDemoStudent
    ? [...new Set(store.lessonProgress.filter(p => p.studentId === id).map(p => p.courseId))]
    : store.enrollments.filter(e => e.studentId === id).map(e => e.courseId);

  const summary = courseIds.map(courseId => {
    const course = store.courses.find(c => c.id === courseId);
    const allLessons = store.lessons.filter(l => l.courseId === courseId);
    const completedCount = store.lessonProgress.filter(
      p => p.studentId === id && p.courseId === courseId
    ).length;
    const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
    return {
      courseId,
      courseCode: course ? course.code : '',
      courseTitle: course ? course.title : '',
      completed: completedCount,
      total: allLessons.length,
      percentage: pct
    };
  });
  res.json(summary);
});

module.exports = router;

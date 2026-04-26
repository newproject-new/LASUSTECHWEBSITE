const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const { role, id } = req.user;
  let courses = store.courses;

  if (role === 'lecturer') {
    courses = courses.filter(c => c.lecturerId === id);
  }

  const isDemoStudent = role === 'student' && id.startsWith('demo_');

  const enriched = courses.map(course => {
    const lecturer = store.users.find(u => u.id === course.lecturerId);
    const lessonCount = store.lessons.filter(l => l.courseId === course.id).length;
    const enrollCount = store.enrollments.filter(e => e.courseId === course.id).length;
    const enrollment = isDemoStudent
      ? { progress: 0 }
      : (role === 'student' ? store.enrollments.find(e => e.courseId === course.id && e.studentId === id) : null);
    const completedCount = role === 'student'
      ? store.lessonProgress.filter(p => p.studentId === id && p.courseId === course.id).length
      : 0;
    const progress = completedCount > 0 && lessonCount > 0
      ? Math.round((completedCount / lessonCount) * 100)
      : (enrollment ? enrollment.progress : 0);
    return {
      ...course,
      lecturerName: lecturer ? lecturer.name : 'Unknown',
      lessonCount,
      enrolledCount: enrollCount,
      isEnrolled: isDemoStudent ? true : !!enrollment,
      progress
    };
  });

  res.json(enriched);
});

router.get('/:id', authMiddleware, (req, res) => {
  const course = store.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const { role, id } = req.user;
  const isDemoStudent = role === 'student' && id.startsWith('demo_');
  const lecturer = store.users.find(u => u.id === course.lecturerId);
  const lessons = store.lessons.filter(l => l.courseId === course.id).sort((a, b) => a.order - b.order);
  const enrollment = isDemoStudent ? { progress: 0 } : store.enrollments.find(e => e.courseId === course.id && e.studentId === id);
  const enrolledCount = store.enrollments.filter(e => e.courseId === course.id).length;
  const completedCount = store.lessonProgress.filter(p => p.studentId === id && p.courseId === course.id).length;
  const progress = completedCount > 0 && lessons.length > 0
    ? Math.round((completedCount / lessons.length) * 100)
    : (enrollment ? enrollment.progress : 0);

  res.json({
    ...course,
    lecturerName: lecturer ? lecturer.name : 'Unknown',
    lecturerBio: lecturer ? lecturer.bio : '',
    lessons,
    isEnrolled: isDemoStudent ? true : !!enrollment,
    progress,
    enrolledCount
  });
});

router.post('/', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const { code, title, description, credits, level, semester, department, maxStudents, objectives } = req.body;
  const newCourse = {
    id: uuidv4(), code, title, description, lecturerId: req.user.id,
    credits: Number(credits) || 3, level, semester, department, maxStudents: Number(maxStudents) || 50,
    status: 'active', thumbnail: null,
    objectives: objectives || [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  store.courses.push(newCourse);
  res.status(201).json(newCourse);
});

router.put('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.courses.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  const course = store.courses[idx];
  if (course.lecturerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' });
  }
  store.courses[idx] = { ...course, ...req.body, id: course.id, updatedAt: new Date().toISOString() };
  res.json(store.courses[idx]);
});

router.post('/:id/enroll', authMiddleware, requireRole('student'), (req, res) => {
  const course = store.courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const existing = store.enrollments.find(e => e.courseId === req.params.id && e.studentId === req.user.id);
  if (existing) return res.status(409).json({ error: 'Already enrolled' });
  const enrollment = { id: uuidv4(), studentId: req.user.id, courseId: req.params.id, enrolledAt: new Date().toISOString(), progress: 0 };
  store.enrollments.push(enrollment);
  res.status(201).json({ message: 'Enrolled successfully', enrollment });
});

router.get('/:id/students', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const enrollments = store.enrollments.filter(e => e.courseId === req.params.id);
  const students = enrollments.map(e => {
    const user = store.users.find(u => u.id === e.studentId);
    const { password: _, ...safe } = user || {};
    return { ...safe, progress: e.progress, enrolledAt: e.enrolledAt };
  }).filter(Boolean);
  res.json(students);
});

module.exports = router;

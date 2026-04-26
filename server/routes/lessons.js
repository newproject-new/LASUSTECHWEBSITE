const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/course/:courseId', authMiddleware, (req, res) => {
  const lessons = store.lessons.filter(l => l.courseId === req.params.courseId).sort((a, b) => a.order - b.order);
  res.json(lessons);
});

router.get('/:id', authMiddleware, (req, res) => {
  const lesson = store.lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const course = store.courses.find(c => c.id === lesson.courseId);
  const allLessons = store.lessons.filter(l => l.courseId === lesson.courseId).sort((a, b) => a.order - b.order);
  const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
  res.json({
    ...lesson,
    courseName: course ? course.title : '',
    prev: allLessons[currentIdx - 1] || null,
    next: allLessons[currentIdx + 1] || null
  });
});

router.post('/', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const { courseId, title, content, type, duration, imageUrl, videoUrl, materials } = req.body;
  const courseExists = store.courses.find(c => c.id === courseId);
  if (!courseExists) return res.status(404).json({ error: 'Course not found' });
  const maxOrder = store.lessons.filter(l => l.courseId === courseId).reduce((m, l) => Math.max(m, l.order), 0);
  const newLesson = {
    id: uuidv4(), courseId, title, content, type: type || 'text',
    duration: Number(duration) || 30, imageUrl: imageUrl || null,
    videoUrl: videoUrl || null, materials: materials || [],
    order: maxOrder + 1, createdAt: new Date().toISOString()
  };
  store.lessons.push(newLesson);
  res.status(201).json(newLesson);
});

router.put('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lesson not found' });
  store.lessons[idx] = { ...store.lessons[idx], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
  res.json(store.lessons[idx]);
});

router.delete('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.lessons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lesson not found' });
  store.lessons.splice(idx, 1);
  res.json({ message: 'Lesson deleted' });
});

module.exports = router;

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const { role, id } = req.user;
  let assignments = store.assignments;

  if (role === 'student') {
    const enrolledCourseIds = store.enrollments.filter(e => e.studentId === id).map(e => e.courseId);
    assignments = assignments.filter(a => enrolledCourseIds.includes(a.courseId));
  } else if (role === 'lecturer') {
    const myCourseIds = store.courses.filter(c => c.lecturerId === id).map(c => c.id);
    assignments = assignments.filter(a => myCourseIds.includes(a.courseId));
  }

  const enriched = assignments.map(a => {
    const course = store.courses.find(c => c.id === a.courseId);
    const submission = role === 'student' ? store.submissions.find(s => s.assignmentId === a.id && s.studentId === id) : null;
    const submissionCount = store.submissions.filter(s => s.assignmentId === a.id).length;
    return {
      ...a, courseName: course ? course.title : '', courseCode: course ? course.code : '',
      submitted: !!submission, submission: submission || null, submissionCount,
      isOverdue: new Date(a.dueDate) < new Date()
    };
  });

  res.json(enriched);
});

router.get('/:id', authMiddleware, (req, res) => {
  const assignment = store.assignments.find(a => a.id === req.params.id);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  const course = store.courses.find(c => c.id === assignment.courseId);
  const submissions = store.submissions.filter(s => s.assignmentId === assignment.id).map(s => {
    const student = store.users.find(u => u.id === s.studentId);
    return { ...s, studentName: student ? student.name : 'Unknown', studentMatric: student ? student.matric : '' };
  });
  res.json({ ...assignment, courseName: course ? course.title : '', submissions });
});

router.post('/', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const { courseId, title, description, dueDate, totalMarks } = req.body;
  const newAssignment = {
    id: uuidv4(), courseId, title, description,
    dueDate, totalMarks: Number(totalMarks) || 100,
    status: 'active', createdAt: new Date().toISOString()
  };
  store.assignments.push(newAssignment);
  res.status(201).json(newAssignment);
});

router.put('/:id', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.assignments.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Assignment not found' });
  store.assignments[idx] = { ...store.assignments[idx], ...req.body, id: req.params.id };
  res.json(store.assignments[idx]);
});

module.exports = router;

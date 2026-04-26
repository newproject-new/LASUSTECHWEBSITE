const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, requireRole('student'), (req, res) => {
  const { assignmentId, content } = req.body;
  const assignment = store.assignments.find(a => a.id === assignmentId);
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  const existing = store.submissions.find(s => s.assignmentId === assignmentId && s.studentId === req.user.id);
  if (existing) return res.status(409).json({ error: 'Already submitted' });
  const submission = {
    id: uuidv4(), assignmentId, studentId: req.user.id, content,
    submittedAt: new Date().toISOString(), grade: null, feedback: null,
    gradedAt: null, gradedBy: null, status: 'pending'
  };
  store.submissions.push(submission);
  res.status(201).json(submission);
});

router.put('/:id/grade', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const idx = store.submissions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Submission not found' });
  const { grade, feedback } = req.body;
  store.submissions[idx] = {
    ...store.submissions[idx], grade: Number(grade), feedback,
    gradedAt: new Date().toISOString(), gradedBy: req.user.id, status: 'graded'
  };
  res.json(store.submissions[idx]);
});

router.get('/assignment/:assignmentId', authMiddleware, (req, res) => {
  const subs = store.submissions.filter(s => s.assignmentId === req.params.assignmentId).map(s => {
    const student = store.users.find(u => u.id === s.studentId);
    return { ...s, studentName: student ? student.name : '', studentMatric: student ? student.matric : '' };
  });
  res.json(subs);
});

router.get('/my', authMiddleware, requireRole('student'), (req, res) => {
  const subs = store.submissions.filter(s => s.studentId === req.user.id).map(s => {
    const assignment = store.assignments.find(a => a.id === s.assignmentId);
    const course = assignment ? store.courses.find(c => c.id === assignment.courseId) : null;
    return { ...s, assignmentTitle: assignment ? assignment.title : '', courseName: course ? course.title : '' };
  });
  res.json(subs);
});

module.exports = router;

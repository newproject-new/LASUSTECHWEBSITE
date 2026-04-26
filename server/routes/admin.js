const express = require('express');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/users', authMiddleware, requireRole('admin'), (req, res) => {
  const users = store.users.map(({ password: _, ...u }) => ({
    ...u,
    enrollmentCount: store.enrollments.filter(e => e.studentId === u.id).length,
    submissionCount: store.submissions.filter(s => s.studentId === u.id).length,
    courseCount: store.courses.filter(c => c.lecturerId === u.id).length
  }));
  res.json(users);
});

router.patch('/users/:id/status', authMiddleware, requireRole('admin'), (req, res) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.status = req.body.status;
  const { password: _, ...safe } = user;
  res.json(safe);
});

router.patch('/users/:id/role', authMiddleware, requireRole('admin'), (req, res) => {
  const user = store.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.role = req.body.role;
  const { password: _, ...safe } = user;
  res.json(safe);
});

router.get('/stats', authMiddleware, requireRole('admin'), (req, res) => {
  const now = new Date();
  const thisMonth = store.users.filter(u => new Date(u.joinedAt).getMonth() === now.getMonth()).length;
  res.json({
    totalUsers: store.users.length,
    students: store.users.filter(u => u.role === 'student').length,
    lecturers: store.users.filter(u => u.role === 'lecturer').length,
    admins: store.users.filter(u => u.role === 'admin').length,
    activeUsers: store.users.filter(u => u.status === 'active').length,
    totalCourses: store.courses.length,
    activeCourses: store.courses.filter(c => c.status === 'active').length,
    totalLessons: store.lessons.length,
    totalAssignments: store.assignments.length,
    totalSubmissions: store.submissions.length,
    pendingSubmissions: store.submissions.filter(s => s.status === 'pending').length,
    totalDiscussions: store.discussions.length,
    newUsersThisMonth: thisMonth,
    enrollments: store.enrollments.length,
    gradeRate: store.submissions.length > 0
      ? Math.round((store.submissions.filter(s => s.status === 'graded').length / store.submissions.length) * 100)
      : 0
  });
});

router.get('/activity', authMiddleware, requireRole('admin'), (req, res) => {
  const recent = [
    ...store.submissions.map(s => ({ type: 'submission', timestamp: s.submittedAt, userId: s.studentId })),
    ...store.users.filter(u => u.lastLogin).map(u => ({ type: 'login', timestamp: u.lastLogin, userId: u.id })),
    ...store.discussions.map(d => ({ type: 'discussion', timestamp: d.createdAt, userId: d.authorId }))
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20).map(item => {
    const user = store.users.find(u => u.id === item.userId);
    return { ...item, userName: user ? user.name : 'Unknown', userRole: user ? user.role : '' };
  });
  res.json(recent);
});

module.exports = router;

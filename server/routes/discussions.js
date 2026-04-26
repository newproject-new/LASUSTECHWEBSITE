const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/course/:courseId', authMiddleware, (req, res) => {
  const discussions = store.discussions
    .filter(d => d.courseId === req.params.courseId)
    .sort((a, b) => b.pinned - a.pinned || new Date(b.createdAt) - new Date(a.createdAt))
    .map(d => {
      const author = store.users.find(u => u.id === d.authorId);
      const replyCount = store.replies.filter(r => r.discussionId === d.id).length;
      return { ...d, authorName: author ? author.name : 'Unknown', authorRole: author ? author.role : '', replyCount };
    });
  res.json(discussions);
});

router.get('/:id', authMiddleware, (req, res) => {
  const discussion = store.discussions.find(d => d.id === req.params.id);
  if (!discussion) return res.status(404).json({ error: 'Not found' });
  discussion.views = (discussion.views || 0) + 1;
  const author = store.users.find(u => u.id === discussion.authorId);
  const replies = store.replies.filter(r => r.discussionId === discussion.id)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(r => {
      const replyAuthor = store.users.find(u => u.id === r.authorId);
      return { ...r, authorName: replyAuthor ? replyAuthor.name : 'Unknown', authorRole: replyAuthor ? replyAuthor.role : '' };
    });
  res.json({ ...discussion, authorName: author ? author.name : '', authorRole: author ? author.role : '', replies });
});

router.post('/', authMiddleware, (req, res) => {
  const { courseId, title, content } = req.body;
  const newDisc = {
    id: uuidv4(), courseId, title, content, authorId: req.user.id,
    pinned: false, views: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
  store.discussions.push(newDisc);
  res.status(201).json(newDisc);
});

router.post('/:id/replies', authMiddleware, (req, res) => {
  const discussion = store.discussions.find(d => d.id === req.params.id);
  if (!discussion) return res.status(404).json({ error: 'Discussion not found' });
  const reply = {
    id: uuidv4(), discussionId: req.params.id, authorId: req.user.id,
    content: req.body.content, isInstructor: req.user.role === 'lecturer' || req.user.role === 'admin',
    createdAt: new Date().toISOString()
  };
  store.replies.push(reply);
  discussion.updatedAt = new Date().toISOString();
  const author = store.users.find(u => u.id === reply.authorId);
  res.status(201).json({ ...reply, authorName: author ? author.name : '', authorRole: author ? author.role : '' });
});

router.patch('/:id/pin', authMiddleware, (req, res) => {
  const discussion = store.discussions.find(d => d.id === req.params.id);
  if (!discussion) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'lecturer' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  discussion.pinned = !discussion.pinned;
  res.json(discussion);
});

module.exports = router;

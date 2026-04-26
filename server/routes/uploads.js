const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const store = require('../data/store');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads', 'materials');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safe}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip', '.txt', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('File type not allowed'));
  }
});

// Upload a material file for a lesson
router.post('/lesson/:lessonId', authMiddleware, requireRole('lecturer', 'admin'), upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const lesson = store.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const sizeKB = req.file.size / 1024;
  const sizeLabel = sizeKB >= 1024
    ? `${(sizeKB / 1024).toFixed(1)} MB`
    : `${Math.round(sizeKB)} KB`;

  const material = {
    name: req.file.originalname,
    filename: req.file.filename,
    url: `/uploads/materials/${req.file.filename}`,
    size: sizeLabel,
    uploadedAt: new Date().toISOString()
  };

  if (!lesson.materials) lesson.materials = [];
  lesson.materials.push(material);

  res.status(201).json(material);
});

// Delete a material from a lesson
router.delete('/lesson/:lessonId/material', authMiddleware, requireRole('lecturer', 'admin'), (req, res) => {
  const lesson = store.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  const { filename } = req.body;
  const idx = (lesson.materials || []).findIndex(m => m.filename === filename);
  if (idx === -1) return res.status(404).json({ error: 'Material not found' });

  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  lesson.materials.splice(idx, 1);
  res.json({ message: 'Material deleted' });
});

module.exports = router;

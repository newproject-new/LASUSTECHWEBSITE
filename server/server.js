const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// On Firebase Functions runtime, pull JWT_SECRET from functions config if not already in env
if (process.env.FIREBASE_CONFIG) {
  try {
    const fc = require('firebase-functions').config();
    if (fc.app?.jwt_secret && !process.env.JWT_SECRET)
      process.env.JWT_SECRET = fc.app.jwt_secret;
  } catch { /* local dev — firebase-functions not required here */ }
}

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const lessonRoutes = require('./routes/lessons');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const discussionRoutes = require('./routes/discussions');
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quizzes');
const progressRoutes = require('./routes/progress');
const uploadRoutes = require('./routes/uploads');

const app = express();
const PORT = process.env.PORT || 5000;

const devOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const corsOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, ...devOrigins]
  : devOrigins;
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/uploads', uploadRoutes);

// --- UNIFIED DEPLOYMENT LOGIC (ROBUST) ---
const fs = require('fs');
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;

if (isProduction) {
  // Look for build folder relative to THIS file (it will be in the same folder now)
  const buildPath = path.resolve(__dirname, 'build');
  
  console.log('[Deployment] Current __dirname:', __dirname);
  console.log('[Deployment] Looking for build folder at:', buildPath);

  if (fs.existsSync(buildPath)) {
    console.log('[Deployment] Build folder found! Serving static files.');
    // Cache static assets for 1 year
    app.use(express.static(buildPath, {
      maxAge: '1y',
      immutable: true
    }));
    
    app.get('*', (req, res) => {
      // Don't serve index.html for API routes
      if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
      res.sendFile(path.resolve(buildPath, 'index.html'));
    });
  } else {
    // Fallback to searching higher up just in case
    const backupPath = path.resolve(__dirname, '../client/build');
    if (fs.existsSync(backupPath)) {
      console.log('[Deployment] Found build at backup path:', backupPath);
      app.use(express.static(backupPath));
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
        res.sendFile(path.join(backupPath, 'index.html'));
      });
    } else {
      console.error('[Deployment] ERROR: No build folder found anywhere.');
      app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API route not found' });
        res.status(500).send('<h1>Deployment Error</h1><p>Frontend build not found.</p>');
      });
    }
  }
} else {
  console.log('[Deployment] Running in development mode.');
  app.get('/', (req, res) => res.json({ message: 'API is running in dev mode.' }));
}
// ------------------------------------------

app.get('/api/health', (req, res) => {
  const store = require('./data/store');
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    stats: {
      users: store.users.length,
      courses: store.courses.length,
      lessons: store.lessons.length,
      assignments: store.assignments.length,
      submissions: store.submissions.length,
      discussions: store.discussions.length,
      quizzes: store.quizzes.length,
      quizAttempts: store.quizAttempts.length,
      lessonProgress: store.lessonProgress.length
    }
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n LASUSTECH Server running on port ${PORT}`);
    console.log(`API ready at http://localhost:${PORT}/api`);
    console.log(`\n Demo Accounts:`);
    console.log(`   Admin:    admin@lasustech.edu.ng / 123456`);
    console.log(`   Lecturer: prof.basit@lasustech.edu.ng / 123456`);
    console.log(`   Lecturer: dr.aisha@lasustech.edu.ng / 141414`);
    console.log(`   Student:  john.ola@student.lasustech.edu.ng / 141414\n`);
  });
}

module.exports = app;

/**
 * Authentication Routes
 *
 * POST /auth/login  — supports two login modes:
 *   1. Email login (admin & lecturers): validates password against bcrypt hash in the store.
 *   2. Surname/matric login (students): checks registered students first; if none match,
 *      creates a temporary demo account so assessors can log in without prior registration.
 *      Demo accounts expire after 8 hours and are not persisted to the store.
 *
 * GET /auth/me — returns the current user's profile from the token or the store.
 *
 * JWT tokens are signed with JWT_SECRET (read from environment in production).
 * Registered users receive a 24-hour token; demo students receive an 8-hour token.
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// In production, JWT_SECRET must be set as an environment variable.
// The hardcoded fallback is only present to allow the app to run without
// configuration during development and academic assessment.
const JWT_SECRET = process.env.JWT_SECRET || 'lasustech_jwt_secret_2024_secure_key';

router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  const identifier = (username || email || '').trim();

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  let user;

  if (identifier.includes('@')) {
    // Email-based login (admin and lecturer)
    user = store.users.find(u => u.email.toLowerCase() === identifier.toLowerCase());

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  } else {
    // Surname or matric number login (students)
    const lower = identifier.toLowerCase();
    user = store.users.find(u => {
      if (u.role !== 'student') return false;
      const surname = u.name.split(' ').pop().toLowerCase();
      const matric = (u.matric || '').toLowerCase();
      return surname === lower || matric === lower;
    });

    if (user) {
      // Registered student — check password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // Demo mode: any unrecognised name/matric combination is treated as a
      // guest student. This allows assessors and testers to access the student
      // portal without registering in advance. The demo account exists only
      // in the signed JWT — no record is written to the data store.
      const demoName = identifier
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      const demoUser = {
        id: `demo_${Date.now()}`,
        name: demoName,
        email: `${lower.replace(/\s+/g, '.')}@demo.lasustech.edu.ng`,
        role: 'student',
        department: 'Student',
        level: '100',
        matric: password,
        status: 'active',
        avatar: null,
      };

      const token = jwt.sign(
        {
          id: demoUser.id, email: demoUser.email, role: demoUser.role,
          name: demoUser.name, department: demoUser.department,
          level: demoUser.level, matric: demoUser.matric,
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({ token, user: demoUser });
    }
  }

  user.lastLogin = new Date().toISOString();
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = store.users.find(u => u.id === req.user.id);
  if (!user) {
    // Demo student — return decoded JWT payload as user object
    if (req.user.role === 'student') return res.json(req.user);
    return res.status(404).json({ error: 'User not found' });
  }
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

module.exports = router;

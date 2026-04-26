import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// ─── Feature Icons (specific to what each bullet describes) ───────────────────

function IconSignal() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.42 9a16 16 0 0121.16 0" />
      <path d="M5 12.55a11 11 0 0114.08 0" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

function IconBookOpen() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function IconClipboardCheck() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconMessageSquare() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function IconTrendingUp() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconEye({ open }) {
  return open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconKey() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

const FEATURES = [
  { icon: <IconSignal />, text: 'Adaptive content delivery — works on any network speed' },
  { icon: <IconBookOpen />, text: 'Access lecture notes, videos, and course materials' },
  { icon: <IconClipboardCheck />, text: 'Submit assignments and receive graded feedback' },
  { icon: <IconMessageSquare />, text: 'Join course discussion boards with peers and lecturers' },
  { icon: <IconTrendingUp />, text: 'Track your academic progress in real time' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'lecturer') navigate('/lecturer/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ minHeight: '100vh' }}
    >
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/laspotech_lib.jpg)' }}
      />
      <div className="absolute inset-0" style={{ background: 'rgba(10, 20, 50, 0.82)' }} />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Left — Branding panel */}
        <div className="hidden lg:flex flex-col gap-7 text-white">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden flex items-center justify-center p-1">
              <img src="/images/logo.jpg" alt="LASUSTECH" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black leading-tight">LASUSTECH</h1>
              <p className="text-blue-200 text-sm font-medium">Lagos State University of Science and Technology</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold leading-snug mb-2">
              Your Learning Portal,<br />
              <span className="text-blue-300">Wherever You Are.</span>
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Empowering Education, Connecting Minds — the official portal for students, lecturers, and administrators of LASUSTECH.
            </p>
          </div>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-100/90">
                <span className="text-blue-300">{f.icon}</span>
                <span className="text-sm">{f.text}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Right — Login form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-12 h-12 rounded-full bg-brand-900 overflow-hidden flex items-center justify-center p-1">
              <img src="/images/logo.jpg" alt="LASUSTECH" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-black text-gray-900 text-sm leading-tight">LASUSTECH Learn</div>
              <div className="text-gray-500 text-xs">Learning Portal</div>
            </div>
          </div>

          <div className="mb-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-brand-700 hover:text-brand-900 font-medium transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back to Homepage
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-6">Access your LASUSTECH learning dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Username or Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconUser /></span>
                <input
                  type="text"
                  value={form.username}
                  required
                  autoComplete="username"
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="form-input pl-9"
                  placeholder="Username or Email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2"><IconLock /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  required
                  autoComplete="current-password"
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="form-input pl-9 pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  <IconEye open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-3 text-center">
            <button
              onClick={() => setShowForgot(v => !v)}
              className="text-sm text-brand-700 hover:text-brand-900 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Forgot password panel */}
          {showForgot && (
            <div className="mt-4 p-4 bg-brand-50 rounded-xl border border-brand-100">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-brand-700"><IconKey /></span>
                <div>
                  <p className="text-sm font-bold text-brand-900 mb-1">Recover Your Login Details</p>
                  <p className="text-xs text-brand-700 leading-relaxed mb-2">
                    To recover your login credentials, contact the LASUSTECH ICT Helpdesk with the following information:
                  </p>
                  <ul className="text-xs text-brand-700 space-y-1 list-disc list-inside leading-relaxed">
                    <li><strong>Students:</strong> Provide your full name and matric number to the Department Office or ICT Support.</li>
                    <li><strong>Staff / Lecturers:</strong> Contact the ICT Unit with your staff ID and official LASUSTECH email address.</li>
                    <li>Walk-in support is available at the ICT Unit, Admin Block, Monday – Friday, 8am – 4pm.</li>
                    <li>Email: <span className="font-semibold">ict@lasustech.edu.ng</span></li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setShowForgot(false)}
                className="text-xs text-brand-600 hover:text-brand-900 font-medium"
              >
                Close
              </button>
            </div>
          )}

          {/* First-time info box */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-start gap-2 text-gray-600">
              <IconInfo />
              <div>
                <p className="text-xs font-bold text-gray-800 mb-1">Is this your first time here?</p>
                <p className="text-xs leading-relaxed">
                  <strong>Students:</strong> Enter your surname (username) and matric number (password) to explore the portal. <strong>Staff:</strong> Use your official email address and password. Use <button onClick={() => setShowForgot(true)} className="text-brand-700 font-semibold hover:underline">forgot password</button> if you need help.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

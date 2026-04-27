import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '', level: '100', matric: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Account created! Welcome, ${user.name.split(' ')[0]}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-brand-900 font-black text-lg">LS</span>
          </div>
          <h1 className="text-2xl font-black text-white">Create Your Account</h1>
          <p className="text-brand-300 text-sm mt-1">LASUSTECH E-LEARNING PORTAL Registration</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="form-label">Full Name</label>
                <input type="text" value={form.name} onChange={set('name')} required className="form-input" placeholder="e.g. John Oladele" />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Email Address</label>
                <input type="email" value={form.email} onChange={set('email')} required className="form-input" placeholder="yourname@student.lasustech.edu.ng" />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Password</label>
                <input type="password" value={form.password} onChange={set('password')} required minLength={6} className="form-input" placeholder="Minimum 6 characters" />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select value={form.role} onChange={set('role')} className="form-input">
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                </select>
              </div>
              <div>
                <label className="form-label">Department</label>
                <select value={form.department} onChange={set('department')} className="form-input">
                  <option value="">Select Department</option>
                  {['Computer Science', 'Mathematics', 'Physics', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemistry', 'Biology'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              {form.role === 'student' && (
                <>
                  <div>
                    <label className="form-label">Level</label>
                    <select value={form.level} onChange={set('level')} className="form-input">
                      {['100', '200', '300', '400'].map(l => <option key={l} value={l}>{l} Level</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Matric Number</label>
                    <input type="text" value={form.matric} onChange={set('matric')} className="form-input" placeholder="LASU/CSC/300/001" />
                  </div>
                </>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-700 font-semibold hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

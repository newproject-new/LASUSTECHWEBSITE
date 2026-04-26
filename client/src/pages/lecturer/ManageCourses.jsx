import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

function CourseForm({ course, onSave, onClose }) {
  const [form, setForm] = useState(course || { code: '', title: '', description: '', credits: 3, level: '300', semester: '2nd Semester 2023/2024', department: 'Computer Science', maxStudents: 50, objectives: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, objectives: form.objectives ? form.objectives.split('\n').filter(Boolean) : [] };
      let res;
      if (course) res = await api.put(`/courses/${course.id}`, payload);
      else res = await api.post('/courses', payload);
      onSave(res.data, !!course);
      toast.success(course ? 'Course updated!' : 'Course created!');
      onClose();
    } catch {
      toast.error('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{course ? 'Edit Course' : 'Create New Course'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label">Course Code *</label>
            <input value={form.code} onChange={set('code')} required className="form-input" placeholder="e.g. CSC 301" />
          </div>
          <div>
            <label className="form-label">Credits</label>
            <select value={form.credits} onChange={set('credits')} className="form-input">
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} credits</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Course Title *</label>
            <input value={form.title} onChange={set('title')} required className="form-input" placeholder="Full course title" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Description *</label>
            <textarea value={form.description} onChange={set('description')} required rows={3} className="form-input resize-none" />
          </div>
          <div>
            <label className="form-label">Level</label>
            <select value={form.level} onChange={set('level')} className="form-input">
              {['100','200','300','400'].map(l => <option key={l} value={l}>{l} Level</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Department</label>
            <select value={form.department} onChange={set('department')} className="form-input">
              {['Computer Science','Mathematics','Physics','Electrical Engineering','Mechanical Engineering','Civil Engineering'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Semester</label>
            <input value={form.semester} onChange={set('semester')} className="form-input" />
          </div>
          <div>
            <label className="form-label">Max Students</label>
            <input type="number" value={form.maxStudents} onChange={set('maxStudents')} className="form-input" min="1" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Learning Objectives (one per line)</label>
            <textarea value={typeof form.objectives === 'string' ? form.objectives : form.objectives?.join('\n') || ''} onChange={set('objectives')} rows={3} className="form-input resize-none" placeholder="Understand core concepts&#10;Apply techniques&#10;Analyze problems" />
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : course ? 'Update Course' : 'Create Course'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = (saved, isEdit) => {
    if (isEdit) setCourses(prev => prev.map(c => c.id === saved.id ? { ...c, ...saved } : c));
    else setCourses(prev => [{ ...saved, lessonCount: 0, enrolledCount: 0, lecturerName: '' }, ...prev]);
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 text-sm mt-0.5">{courses.length} courses</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">+ Create Course</button>
      </div>

      {courses.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-4">No courses yet. Create your first course!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Create Course</button>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map(course => (
            <div key={course.id} className="card p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap gap-2 items-center mb-1">
                    <span className="badge badge-blue">{course.code}</span>
                    <span className={`badge text-xs ${course.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{course.status}</span>
                    <span className="badge badge-gray text-xs">{course.level} Level</span>
                  </div>
                  <h3 className="font-bold text-gray-900 break-words">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 break-words">{course.department} · {course.credits} credits · {course.semester}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>{course.enrolledCount} enrolled</span>
                    <span>{course.lessonCount} lessons</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                  <Link to={`/lecturer/courses/${course.id}/content`} className="btn-primary text-xs py-2 px-3">Manage Content</Link>
                  <button onClick={() => { setEditing(course); setShowForm(true); }} className="btn-secondary text-xs py-2 px-3">Edit</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <CourseForm course={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

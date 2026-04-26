import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

function AssignmentForm({ courses, assignment, onSave, onClose }) {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 7);
  const [form, setForm] = useState(assignment || {
    courseId: courses[0]?.id || '',
    title: '',
    description: '',
    dueDate: tomorrow.toISOString().slice(0, 16),
    totalMarks: 100
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      if (assignment) res = await api.put(`/assignments/${assignment.id}`, form);
      else res = await api.post('/assignments', form);
      onSave(res.data, !!assignment);
      toast.success(assignment ? 'Assignment updated!' : 'Assignment created!');
      onClose();
    } catch {
      toast.error('Failed to save assignment');
    } finally {
      setSaving(false);
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{assignment ? 'Edit Assignment' : 'Create Assignment'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="form-label">Course *</label>
            <select value={form.courseId} onChange={set('courseId')} required className="form-input">
              {courses.map(c => <option key={c.id} value={c.id}>{c.code}: {c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Title *</label>
            <input value={form.title} onChange={set('title')} required className="form-input" placeholder="e.g. Implement Binary Search Tree" />
          </div>
          <div>
            <label className="form-label">Assignment Description *</label>
            <textarea value={form.description} onChange={set('description')} required rows={8} className="form-input resize-none" placeholder="Detailed assignment brief...&#10;&#10;**Requirements:**&#10;1. ..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Due Date & Time *</label>
              <input type="datetime-local" value={form.dueDate} onChange={set('dueDate')} required className="form-input" />
            </div>
            <div>
              <label className="form-label">Total Marks</label>
              <input type="number" value={form.totalMarks} onChange={set('totalMarks')} className="form-input" min="1" max="200" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : assignment ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AssignmentManager() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/assignments')])
      .then(([c, a]) => { setCourses(c.data); setAssignments(a.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (saved, isEdit) => {
    const course = courses.find(c => c.id === saved.courseId);
    const enriched = { ...saved, courseName: course?.title, courseCode: course?.code, submissionCount: 0 };
    if (isEdit) setAssignments(prev => prev.map(a => a.id === saved.id ? { ...a, ...enriched } : a));
    else setAssignments(prev => [enriched, ...prev]);
  };

  const filtered = filter === 'all' ? assignments : assignments.filter(a => {
    const due = parseISO(a.dueDate);
    if (filter === 'active') return due > new Date();
    if (filter === 'past') return due <= new Date();
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-500 text-sm mt-0.5">{assignments.length} total across {courses.length} courses</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary" disabled={courses.length === 0}>+ Create Assignment</button>
      </div>

      <div className="flex gap-2">
        {[['all', 'All'], ['active', 'Active'], ['past', 'Past Due']].map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-4">No assignments yet.</p>
          {courses.length > 0 && <button onClick={() => setShowForm(true)} className="btn-primary">Create First Assignment</button>}
          {courses.length === 0 && <p className="text-sm text-gray-400">Create a course first, then add assignments.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(a => {
            const due = parseISO(a.dueDate);
            const isPast = due < new Date();
            return (
              <div key={a.id} className="card p-5 border-l-4 border-l-brand-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="badge badge-blue text-xs">{a.courseCode}</span>
                      {isPast && <span className="badge badge-gray text-xs">Past Due</span>}
                    </div>
                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{a.courseName}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{a.description?.substring(0, 150)}...</p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>Due {format(due, 'MMM d, yyyy h:mm a')}</span>
                      <span>·</span>
                      <span>{a.totalMarks} marks</span>
                      <span>·</span>
                      <span className={a.submissionCount > 0 ? 'text-green-600 font-medium' : ''}>{a.submissionCount} submissions</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(a); setShowForm(true); }} className="btn-secondary text-xs py-2 px-3">Edit</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && courses.length > 0 && <AssignmentForm courses={courses} assignment={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

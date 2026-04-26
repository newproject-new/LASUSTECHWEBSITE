import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import QuizManager from './QuizManager';

function LessonForm({ courseId, lesson, onSave, onClose }) {
  const [form, setForm] = useState(lesson || { title: '', content: '', type: 'text', duration: 30, imageUrl: '', videoUrl: '', materials: [] });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [materials, setMaterials] = useState(lesson?.materials || []);
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form, courseId,
        duration: Number(form.duration),
        imageUrl: form.imageUrl || null,
        videoUrl: form.videoUrl || null,
        materials,
      };
      let res;
      if (lesson) res = await api.put(`/lessons/${lesson.id}`, payload);
      else res = await api.post('/lessons', payload);
      onSave(res.data, !!lesson);
      toast.success(lesson ? 'Lesson updated!' : 'Lesson created!');
      onClose();
    } catch {
      toast.error('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!lesson) {
      toast('Save the lesson first, then upload files.');
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await api.post(`/uploads/lesson/${lesson.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMaterials(prev => [...prev, r.data]);
      toast.success(`Uploaded: ${file.name}`);
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const removeMaterial = async (mat) => {
    if (!lesson || !mat.filename) {
      setMaterials(prev => prev.filter(m => m !== mat));
      return;
    }
    try {
      await api.delete(`/uploads/lesson/${lesson.id}/material`, { data: { filename: mat.filename } });
      setMaterials(prev => prev.filter(m => m.filename !== mat.filename));
      toast.success('File removed');
    } catch {
      toast.error('Failed to remove file');
    }
  };

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{lesson ? 'Edit Lesson' : 'Create New Lesson'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">Lesson Title *</label>
              <input value={form.title} onChange={set('title')} required className="form-input" placeholder="e.g. Introduction to Binary Trees" />
            </div>
            <div>
              <label className="form-label">Type</label>
              <select value={form.type} onChange={set('type')} className="form-input">
                <option value="text">Text + Images</option>
                <option value="video">Video Lecture</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <label className="form-label">Duration (minutes)</label>
              <input type="number" value={form.duration} onChange={set('duration')} className="form-input" min="5" max="180" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Image URL (optional)</label>
              <input value={form.imageUrl} onChange={set('imageUrl')} className="form-input" placeholder="https://picsum.photos/seed/topic/800/400" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Video URL (optional, YouTube embed)</label>
              <input value={form.videoUrl} onChange={set('videoUrl')} className="form-input" placeholder="https://www.youtube.com/embed/..." />
            </div>
            <div className="col-span-2">
              <label className="form-label">Lesson Content * (Markdown supported)</label>
              <textarea value={form.content} onChange={set('content')} required rows={12} className="form-input font-mono text-sm resize-none" placeholder="# Lesson Title&#10;&#10;## Introduction&#10;&#10;Write your lesson content here...&#10;&#10;Use **bold**, *italic*, `code`, and code blocks." />
            </div>
            <div className="col-span-2">
              <label className="form-label">Downloadable Materials</label>
              {materials.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {materials.map((mat, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-400">📎</span>
                        <span className="text-gray-800 truncate">{mat.name}</span>
                        <span className="text-gray-400 text-xs flex-shrink-0">{mat.size}</span>
                      </div>
                      <button type="button" onClick={() => removeMaterial(mat)} className="text-red-400 hover:text-red-600 text-xs ml-2 flex-shrink-0">Remove</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.txt,.png,.jpg,.jpeg" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading || !lesson} className="btn-secondary text-sm py-1.5 px-4">
                  {uploading ? 'Uploading...' : '↑ Upload File'}
                </button>
                {!lesson && <p className="text-xs text-gray-400">Save lesson first to upload files</p>}
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Saving...' : lesson ? 'Update Lesson' : 'Create Lesson'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CourseContent() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    Promise.all([api.get(`/courses/${courseId}`), api.get(`/lessons/course/${courseId}`)])
      .then(([c, l]) => { setCourse(c.data); setLessons(l.data); })
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSaveLesson = (saved, isEdit) => {
    if (isEdit) setLessons(prev => prev.map(l => l.id === saved.id ? saved : l));
    else setLessons(prev => [...prev, saved]);
  };

  const deleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await api.delete(`/lessons/${id}`);
      setLessons(prev => prev.filter(l => l.id !== id));
      toast.success('Lesson deleted');
    } catch {
      toast.error('Failed to delete lesson');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link to="/lecturer/courses" className="text-sm text-brand-700 hover:underline">← My Courses</Link>
        <span className="text-gray-300">|</span>
        {course && <span className="text-sm text-gray-500 font-medium">{course.code}: {course.title}</span>}
      </div>

      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
          <p className="text-gray-500 text-sm mt-0.5">{lessons.length} lessons · {course?.enrolledCount} students enrolled</p>
        </div>
        <button onClick={() => { setEditingLesson(null); setShowForm(true); }} className="btn-primary">+ Add Lesson</button>
      </div>

      {/* Students summary */}
      {course && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Enrolled', value: course.enrolledCount },
            { label: 'Lessons', value: lessons.length },
            { label: 'Credits', value: course.credits },
          ].map(s => (
            <div key={s.label} className="card p-4 text-center">
              <div className="text-2xl font-bold text-brand-800">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {lessons.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-4">No lessons yet. Create the first lesson for this course!</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Add First Lesson</button>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.sort((a, b) => a.order - b.order).map((lesson, i) => (
            <div key={lesson.id} className="card p-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-brand-100 text-brand-800 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="badge badge-gray text-xs capitalize">{lesson.type}</span>
                    <span className="badge badge-gray text-xs">{lesson.duration} min</span>
                    {lesson.videoUrl && <span className="badge badge-blue text-xs">Video</span>}
                    {lesson.imageUrl && <span className="badge badge-gray text-xs">Image</span>}
                    {lesson.materials?.length > 0 && <span className="badge badge-gray text-xs">{lesson.materials.length} files</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{lesson.content?.substring(0, 100)}...</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditingLesson(lesson); setShowForm(true); }} className="btn-secondary text-xs py-1.5 px-3">Edit</button>
                  <button onClick={() => deleteLesson(lesson.id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quizzes */}
      <div className="card p-6">
        <QuizManager courseId={courseId} />
      </div>

      {showForm && <LessonForm courseId={courseId} lesson={editingLesson} onSave={handleSaveLesson} onClose={() => { setShowForm(false); setEditingLesson(null); }} />}
    </div>
  );
}

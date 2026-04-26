import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const LETTERS = ['A', 'B', 'C', 'D'];

function emptyQuestion() {
  return { text: '', options: ['', '', '', ''], correctIndex: 0 };
}

function QuizFormModal({ courseId, quiz, onSave, onClose }) {
  const [title, setTitle] = useState(quiz?.title || '');
  const [description, setDescription] = useState(quiz?.description || '');
  const [duration, setDuration] = useState(quiz?.duration || 15);
  const [questions, setQuestions] = useState(
    quiz?.questions?.map(q => ({ ...q, options: [...q.options] })) || [emptyQuestion(), emptyQuestion()]
  );
  const [saving, setSaving] = useState(false);

  const setQ = (qi, field, val) => setQuestions(prev => {
    const next = [...prev];
    next[qi] = { ...next[qi], [field]: val };
    return next;
  });

  const setOption = (qi, oi, val) => setQuestions(prev => {
    const next = [...prev];
    const opts = [...next[qi].options];
    opts[oi] = val;
    next[qi] = { ...next[qi], options: opts };
    return next;
  });

  const addQuestion = () => setQuestions(prev => [...prev, emptyQuestion()]);
  const removeQuestion = (qi) => setQuestions(prev => prev.filter((_, i) => i !== qi));

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return toast.error(`Question ${i + 1} has no text`);
      if (q.options.some(o => !o.trim())) return toast.error(`Question ${i + 1} has an empty option`);
    }
    setSaving(true);
    try {
      const payload = { courseId, title, description, duration: Number(duration), questions };
      let res;
      if (quiz) res = await api.put(`/quizzes/${quiz.id}`, payload);
      else res = await api.post('/quizzes', payload);
      onSave(res.data, !!quiz);
      toast.success(quiz ? 'Quiz updated!' : 'Quiz created!');
      onClose();
    } catch {
      toast.error('Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">{quiz ? 'Edit Quiz' : 'Create Quiz'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="form-label">Quiz Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} required className="form-input" placeholder="e.g. Week 3 Quiz — Stacks and Queues" />
            </div>
            <div className="col-span-2">
              <label className="form-label">Description</label>
              <input value={description} onChange={e => setDescription(e.target.value)} className="form-input" placeholder="Brief description shown to students before starting" />
            </div>
            <div>
              <label className="form-label">Time Limit (minutes)</label>
              <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="form-input" min="5" max="120" />
            </div>
            <div className="flex items-end">
              <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 w-full">
                {questions.length} question(s) · Pass mark: 50%
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Questions</h3>
              <button type="button" onClick={addQuestion} className="btn-secondary text-xs py-1.5 px-3">+ Add Question</button>
            </div>
            {questions.map((q, qi) => (
              <div key={qi} className="border border-gray-200 rounded-xl p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-brand-800 flex-shrink-0 mt-2">Q{qi + 1}</span>
                  <input
                    value={q.text} onChange={e => setQ(qi, 'text', e.target.value)} required
                    className="form-input flex-1" placeholder="Enter question text..."
                  />
                  {questions.length > 2 && (
                    <button type="button" onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 flex-shrink-0 text-xl leading-none mt-2">&times;</button>
                  )}
                </div>
                <div className="space-y-2 ml-6">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio" name={`correct_${qi}`} checked={q.correctIndex === oi}
                        onChange={() => setQ(qi, 'correctIndex', oi)}
                        className="accent-brand-800 flex-shrink-0"
                        title="Mark as correct answer"
                      />
                      <span className="text-xs font-bold text-gray-500 w-4">{LETTERS[oi]}.</span>
                      <input
                        value={opt} onChange={e => setOption(qi, oi, e.target.value)} required
                        className="form-input text-sm py-1.5 flex-1" placeholder={`Option ${LETTERS[oi]}`}
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-400 ml-5">Select the radio button next to the correct answer</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : quiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AttemptsModal({ quiz, onClose }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/quizzes/${quiz.id}/attempts`)
      .then(r => setAttempts(r.data))
      .catch(() => toast.error('Failed to load attempts'))
      .finally(() => setLoading(false));
  }, [quiz.id]);

  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{quiz.title}</h2>
            <p className="text-xs text-gray-500">{attempts.length} attempt(s) · avg {avg}%</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800" /></div>
          ) : attempts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No attempts yet.</p>
          ) : (
            <div className="space-y-3">
              {attempts.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{a.studentName}</div>
                    <div className="text-xs text-gray-500">{a.studentMatric} · {new Date(a.completedAt).toLocaleString()}</div>
                  </div>
                  <div className={`text-lg font-bold ${a.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {a.percentage}%
                    <span className="text-xs font-normal text-gray-400 ml-1">({a.score}/{a.total})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuizManager({ courseId }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingAttempts, setViewingAttempts] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    api.get(`/quizzes/course/${courseId}`)
      .then(r => setQuizzes(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSave = (saved, isEdit) => {
    if (isEdit) setQuizzes(prev => prev.map(q => q.id === saved.id ? saved : q));
    else setQuizzes(prev => [...prev, saved]);
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    try {
      await api.delete(`/quizzes/${id}`);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      toast.success('Quiz deleted');
    } catch {
      toast.error('Failed to delete quiz');
    }
  };

  if (loading) return <div className="py-6 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Quizzes <span className="text-gray-400 font-normal text-sm">({quizzes.length})</span></h3>
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-1.5 px-4">+ New Quiz</button>
      </div>

      {quizzes.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
          No quizzes yet. Create one to assess student understanding.
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map(q => (
            <div key={q.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{q.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="badge badge-gray text-xs">{q.questions?.length} questions</span>
                    <span className="badge badge-gray text-xs">{q.duration} min</span>
                    <span className="badge badge-blue text-xs">{q.attemptCount || 0} attempt(s)</span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => setViewingAttempts(q)} className="btn-secondary text-xs py-1 px-2.5">Results</button>
                  <button onClick={() => { setEditing(q); setShowForm(true); }} className="btn-secondary text-xs py-1 px-2.5">Edit</button>
                  <button onClick={() => deleteQuiz(q.id)} className="btn-danger text-xs py-1 px-2.5">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <QuizFormModal courseId={courseId} quiz={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />}
      {viewingAttempts && <AttemptsModal quiz={viewingAttempts} onClose={() => setViewingAttempts(null)} />}
    </div>
  );
}

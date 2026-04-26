import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useNetwork } from '../../contexts/NetworkContext';

function GradeModal({ submission, totalMarks, onClose, onGraded }) {
  const [grade, setGrade] = useState(submission.grade ?? '');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [saving, setSaving] = useState(false);

  const handleGrade = async (e) => {
    e.preventDefault();
    if (grade === '' || isNaN(grade)) return toast.error('Enter a valid grade');
    if (Number(grade) > totalMarks) return toast.error(`Grade cannot exceed ${totalMarks}`);
    setSaving(true);
    try {
      const res = await api.put(`/submissions/${submission.id}/grade`, { grade: Number(grade), feedback });
      onGraded(res.data);
      toast.success('Grade submitted!');
      onClose();
    } catch {
      toast.error('Failed to submit grade');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Grade Submission</h2>
            <p className="text-sm text-gray-500">{submission.studentName} · {submission.studentMatric}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Student's Submission</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto border border-gray-200">
              {submission.content}
            </div>
            <p className="text-xs text-gray-400 mt-1">Submitted: {format(parseISO(submission.submittedAt), 'MMM d, yyyy h:mm a')}</p>
          </div>
          <form onSubmit={handleGrade} className="space-y-4">
            <div>
              <label className="form-label">Grade (out of {totalMarks})</label>
              <div className="flex items-center gap-3">
                <input type="number" value={grade} onChange={e => setGrade(e.target.value)} min={0} max={totalMarks} className="form-input w-32" placeholder="0" />
                {grade !== '' && !isNaN(grade) && (
                  <span className={`text-sm font-semibold ${(Number(grade)/totalMarks)*100 >= 70 ? 'text-green-600' : (Number(grade)/totalMarks)*100 >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {Math.round((Number(grade)/totalMarks)*100)}%
                  </span>
                )}
              </div>
            </div>
            <div>
              <label className="form-label">Feedback to Student</label>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={4} className="form-input resize-none" placeholder="Write constructive feedback..." />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={saving} className="btn-success flex-1">{saving ? 'Submitting...' : 'Submit Grade'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Submissions() {
  const { activeMode } = useNetwork();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState('all');
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    Promise.all([api.get('/assignments'), api.get('/submissions/my')]).then(([a, s]) => {
      setAssignments(a.data);
      const allSubs = [];
      a.data.forEach(assignment => {
        if (assignment.submissions) {
          assignment.submissions.forEach(sub => {
            allSubs.push({ ...sub, assignmentTitle: assignment.title, courseName: assignment.courseName, courseCode: assignment.courseCode, totalMarks: assignment.totalMarks });
          });
        }
      });
      if (allSubs.length > 0) setSubmissions(allSubs);
    }).catch(() => {}).finally(() => setLoading(false));

    api.get('/assignments').then(async (aRes) => {
      const all = [];
      for (const assignment of aRes.data) {
        try {
          const subRes = await api.get(`/submissions/assignment/${assignment.id}`);
          subRes.data.forEach(s => all.push({ ...s, assignmentTitle: assignment.title, courseName: assignment.courseName, courseCode: assignment.courseCode, totalMarks: assignment.totalMarks }));
        } catch {}
      }
      setSubmissions(all);
      setLoading(false);
    });
  }, []);

  const handleGraded = (graded) => {
    setSubmissions(prev => prev.map(s => s.id === graded.id ? { ...s, ...graded } : s));
  };

  const filtered = submissions.filter(s => {
    const matchAssignment = selectedAssignment === 'all' || s.assignmentId === selectedAssignment;
    const matchFilter = filter === 'all' || s.status === filter;
    return matchAssignment && matchFilter;
  });

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
        <p className="text-gray-500 text-sm mt-0.5">{submissions.length} total · {pendingCount} pending grading · {gradedCount} graded</p>
      </div>

      {activeMode !== 'lite' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-brand-800">{submissions.length}</div>
            <div className="text-xs text-gray-500">Total Submissions</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-brand-800">{pendingCount}</div>
            <div className="text-xs text-gray-500">Pending Grade</div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-2xl font-bold text-brand-800">{gradedCount}</div>
            <div className="text-xs text-gray-500">Graded</div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <select value={selectedAssignment} onChange={e => setSelectedAssignment(e.target.value)} className="form-input w-auto">
          <option value="all">All Assignments</option>
          {assignments.map(a => <option key={a.id} value={a.id}>{a.courseCode}: {a.title}</option>)}
        </select>
        <div className="flex gap-2">
          {[['all', 'All'], ['pending', 'Pending'], ['graded', 'Graded']].map(([f, label]) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No submissions found.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(s => (
            <div key={s.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="badge badge-blue text-xs">{s.courseCode}</span>
                    <span className={`badge text-xs ${s.status === 'graded' ? 'badge-green' : 'badge-yellow'}`}>{s.status}</span>
                    {s.grade !== null && <span className="badge badge-green text-xs font-semibold">{s.grade}/{s.totalMarks} ({Math.round((s.grade/s.totalMarks)*100)}%)</span>}
                  </div>
                  <div className="font-bold text-gray-900 break-words">{s.studentName}</div>
                  <div className="text-sm text-gray-500 break-words">{s.studentMatric} · {s.assignmentTitle}</div>
                  {activeMode !== 'lite' && (
                    <div className="mt-2 bg-gray-50 rounded-lg p-3 text-sm text-gray-700 line-clamp-2 break-words">{s.content}</div>
                  )}
                  {s.feedback && (
                    <div className="mt-2 bg-green-50 rounded-lg p-2 text-xs text-green-700 italic break-words">
                      <strong>Feedback:</strong> {s.feedback}
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">Submitted: {s.submittedAt ? format(parseISO(s.submittedAt), 'MMM d, yyyy h:mm a') : 'N/A'}</div>
                </div>
                <div className="flex-shrink-0 self-start">
                  {s.status === 'pending' ? (
                    <button onClick={() => setGradingSubmission(s)} className="btn-primary text-sm py-2 px-4 w-full sm:w-auto">Grade</button>
                  ) : (
                    <button onClick={() => setGradingSubmission(s)} className="btn-secondary text-sm py-2 px-4 w-full sm:w-auto">Edit Grade</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {gradingSubmission && (
        <GradeModal
          submission={gradingSubmission}
          totalMarks={gradingSubmission.totalMarks}
          onClose={() => setGradingSubmission(null)}
          onGraded={handleGraded}
        />
      )}
    </div>
  );
}

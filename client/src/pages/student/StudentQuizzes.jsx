import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';
import toast from 'react-hot-toast';

export default function StudentQuizzes() {
  const { activeMode } = useNetwork();
  const [quizzesByCourse, setQuizzesByCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/courses')
      .then(async cRes => {
        const enrolled = cRes.data.filter(c => c.isEnrolled);
        const results = await Promise.all(
          enrolled.map(course =>
            api.get(`/quizzes/course/${course.id}`)
              .then(r => ({ course, quizzes: r.data }))
              .catch(() => ({ course, quizzes: [] }))
          )
        );
        setQuizzesByCourse(results.filter(r => r.quizzes.length > 0));
      })
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setLoading(false));
  }, []);

  const allQuizzes = quizzesByCourse.flatMap(({ course, quizzes }) =>
    quizzes.map(q => ({ ...q, courseName: course.title, courseCode: course.code, courseId: course.id }))
  );

  const filtered = allQuizzes.filter(q => {
    if (filter === 'pending') return !q.attempted;
    if (filter === 'completed') return q.attempted;
    if (filter === 'passed') return q.myAttempt?.percentage >= 50;
    if (filter === 'failed') return q.attempted && q.myAttempt?.percentage < 50;
    return true;
  });

  const counts = {
    total: allQuizzes.length,
    pending: allQuizzes.filter(q => !q.attempted).length,
    completed: allQuizzes.filter(q => q.attempted).length,
    passed: allQuizzes.filter(q => q.myAttempt?.percentage >= 50).length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500 text-sm mt-0.5">{counts.total} total · {counts.pending} pending · {counts.passed} passed</p>
      </div>

      {activeMode !== 'lite' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total',     value: counts.total     },
            { label: 'Pending',   value: counts.pending   },
            { label: 'Completed', value: counts.completed },
            { label: 'Passed',    value: counts.passed    },
          ].map(s => (
            <div key={s.label} className="card p-4 border-l-4 border-l-brand-800">
              <div className="text-2xl font-bold text-brand-800">{s.value}</div>
              <div className="text-xs font-medium text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {[['all', 'All'], ['pending', 'Pending'], ['completed', 'Completed'], ['passed', 'Passed'], ['failed', 'Failed']].map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          {allQuizzes.length === 0
            ? 'No quizzes available for your enrolled courses yet.'
            : 'No quizzes match this filter.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <div key={q.id} className="card p-5 border-l-4 border-l-brand-800">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="badge badge-blue text-xs">{q.courseCode}</span>
                    {q.attempted && (
                      <span className={`badge text-xs ${q.myAttempt?.percentage >= 50 ? 'badge-green' : 'badge-red'}`}>
                        {q.myAttempt?.percentage >= 50 ? 'Passed' : 'Failed'} — {q.myAttempt?.percentage}%
                      </span>
                    )}
                    {!q.attempted && <span className="badge badge-gray text-xs">Not attempted</span>}
                  </div>
                  <h3 className="font-bold text-gray-900">{q.title}</h3>
                  <p className="text-sm text-gray-500">{q.courseName}</p>
                  {activeMode !== 'lite' && q.description && (
                    <p className="text-sm text-gray-600 mt-1">{q.description}</p>
                  )}
                  <div className="flex gap-3 mt-2 text-xs text-gray-500">
                    <span>{q.questions?.length} questions</span>
                    <span>{q.duration} min</span>
                    {q.attempted && <span>{q.myAttempt?.score}/{q.myAttempt?.total} correct</span>}
                  </div>
                </div>
                <Link
                  to={`/student/courses/${q.courseId}/quizzes/${q.id}`}
                  className={q.attempted ? 'btn-secondary text-xs py-1.5 px-3' : 'btn-primary text-xs py-1.5 px-3'}
                >
                  {q.attempted ? 'View Result' : 'Take Quiz'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

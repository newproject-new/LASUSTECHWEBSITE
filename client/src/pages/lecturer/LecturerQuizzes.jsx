import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function LecturerQuizzes() {
  const [quizzesByCourse, setQuizzesByCourse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courses')
      .then(async cRes => {
        const results = await Promise.all(
          cRes.data.map(course =>
            api.get(`/quizzes/course/${course.id}`)
              .then(r => ({ course, quizzes: r.data }))
              .catch(() => ({ course, quizzes: [] }))
          )
        );
        setQuizzesByCourse(results);
      })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const totalQuizzes = quizzesByCourse.reduce((s, r) => s + r.quizzes.length, 0);
  const totalAttempts = quizzesByCourse.reduce((s, r) => s + r.quizzes.reduce((a, q) => a + (q.attemptCount || 0), 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Overview</h1>
        <p className="text-gray-500 text-sm mt-0.5">{totalQuizzes} quizzes · {totalAttempts} student attempts</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-5 border-l-4 border-l-brand-800">
          <div className="text-2xl font-bold text-gray-900">{totalQuizzes}</div>
          <div className="text-sm text-gray-500">Total Quizzes</div>
        </div>
        <div className="card p-5 border-l-4 border-l-brand-800">
          <div className="text-2xl font-bold text-gray-900">{totalAttempts}</div>
          <div className="text-sm text-gray-500">Student Attempts</div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        To create or edit quizzes, go to <strong>My Courses</strong> → select a course → <strong>Content</strong>.
      </p>

      {quizzesByCourse.filter(r => r.quizzes.length > 0).length === 0 ? (
        <div className="card p-10 text-center space-y-3">
          <p className="text-gray-500">You have not created any quizzes yet.</p>
          <Link to="/lecturer/courses" className="btn-primary inline-block">Go to My Courses</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {quizzesByCourse.filter(r => r.quizzes.length > 0).map(({ course, quizzes }) => (
            <div key={course.id} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="badge badge-blue text-xs mr-2">{course.code}</span>
                  <span className="font-semibold text-gray-800">{course.title}</span>
                </div>
                <Link to={`/lecturer/courses/${course.id}/content`} className="text-xs text-brand-700 hover:underline">
                  Manage →
                </Link>
              </div>
              <div className="space-y-2">
                {quizzes.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{q.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {q.questions?.length} questions · {q.duration} min · {q.attemptCount || 0} attempt(s)
                      </div>
                    </div>
                    <Link to={`/lecturer/courses/${course.id}/content`} className="btn-secondary text-xs py-1 px-3">
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

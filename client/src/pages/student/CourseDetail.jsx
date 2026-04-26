import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdaptiveImage from '../../components/adaptive/AdaptiveImage';

export default function CourseDetail() {
  const { courseId } = useParams();
  const { activeMode } = useNetwork();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${courseId}`),
      api.get(`/quizzes/course/${courseId}`).catch(() => ({ data: [] })),
      api.get(`/progress/course/${courseId}`).catch(() => ({ data: null })),
    ]).then(([c, q, p]) => {
      setCourse(c.data);
      setQuizzes(q.data);
      setProgress(p.data);
    }).catch(() => toast.error('Failed to load course')).finally(() => setLoading(false));
  }, [courseId]);

  const enroll = async () => {
    setEnrolling(true);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setCourse(c => ({ ...c, isEnrolled: true }));
      toast.success('Enrolled successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;
  if (!course) return <div className="card p-8 text-center text-gray-500">Course not found.</div>;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link to="/student/courses" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        ← Back to Catalog
      </Link>

      {/* Hero */}
      {activeMode !== 'lite' && (
        <div className="card overflow-hidden">
          <AdaptiveImage src={course.thumbnail} alt={course.title} seed={course.code} className="w-full h-48 md:h-56" />
        </div>
      )}

      {/* Info */}
      <div className="card p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="badge badge-blue">{course.code}</span>
              <span className="badge badge-gray">{course.level} Level</span>
              <span className="badge badge-gray">{course.credits} Credits</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 break-words">{course.title}</h1>
            <p className="text-gray-500 text-sm break-words">{course.department} · {course.semester}</p>
          </div>
          {course.isEnrolled ? (
            <span className="badge badge-green text-sm px-3 py-1.5">✓ Enrolled</span>
          ) : (
            <button onClick={enroll} disabled={enrolling} className="btn-primary">
              {enrolling ? 'Enrolling...' : 'Enroll in Course'}
            </button>
          )}
        </div>

        {activeMode !== 'lite' && (
          <p className="mt-4 text-gray-700 leading-relaxed">{course.description}</p>
        )}

        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-500">
          <span><strong className="text-gray-700">{course.lecturerName}</strong></span>
          <span><strong className="text-gray-700">{course.lessons?.length || 0} Lessons</strong></span>
          <span><strong className="text-gray-700">{course.enrolledCount} Students</strong></span>
        </div>
      </div>

      {/* Learning objectives */}
      {activeMode !== 'lite' && course.objectives?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h2>
          <ul className="space-y-2">
            {course.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quizzes */}
      {quizzes.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Quizzes</h2>
          <div className="space-y-2">
            {quizzes.map(q => (
              <div key={q.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{q.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{q.questions?.length} questions · {q.duration} min</div>
                  {q.myAttempt && (
                    <div className={`text-xs font-semibold mt-1 ${q.myAttempt.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                      Score: {q.myAttempt.percentage}% ({q.myAttempt.score}/{q.myAttempt.total})
                    </div>
                  )}
                </div>
                {course.isEnrolled ? (
                  <Link
                    to={`/student/courses/${courseId}/quizzes/${q.id}`}
                    className={q.attempted ? 'btn-secondary text-xs py-1.5 px-3' : 'btn-primary text-xs py-1.5 px-3'}
                  >
                    {q.attempted ? 'View Result' : 'Take Quiz'}
                  </Link>
                ) : (
                  <span className="text-xs text-gray-400">Enroll to take</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons list */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Course Lessons</h2>
          {progress && (
            <div className="text-sm text-brand-700 font-medium">{progress.percentage}% complete</div>
          )}
        </div>
        {progress && progress.percentage > 0 && (
          <div className="h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-brand-800 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
          </div>
        )}
        {course.lessons?.length === 0 ? (
          <div className="text-center text-gray-500 py-6">No lessons yet.</div>
        ) : (
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => (
              <Link key={lesson.id}
                to={course.isEnrolled ? `/student/courses/${courseId}/lessons/${lesson.id}` : '#'}
                onClick={!course.isEnrolled ? () => toast('Enroll first to access lessons') : undefined}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${course.isEnrolled ? 'border-gray-200 hover:bg-brand-50 hover:border-brand-200 cursor-pointer' : 'border-gray-100 opacity-60 cursor-not-allowed'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${progress?.completedLessonIds?.includes(lesson.id) ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-800'}`}>
                  {progress?.completedLessonIds?.includes(lesson.id) ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">{lesson.title}</div>
                  <div className="text-xs text-gray-500">{lesson.duration} min · {lesson.type}</div>
                </div>
                {activeMode !== 'lite' && lesson.videoUrl && <span className="badge badge-blue text-xs">Video</span>}
                {activeMode !== 'lite' && lesson.materials?.length > 0 && <span className="badge badge-gray text-xs">{lesson.materials.length} files</span>}
                {course.isEnrolled && <span className="text-gray-400 text-sm">→</span>}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Lecturer */}
      {activeMode !== 'lite' && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Your Lecturer</h2>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-800 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {course.lecturerName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 break-words">{course.lecturerName}</div>
              <div className="text-sm text-gray-500 break-words">{course.lecturerBio}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

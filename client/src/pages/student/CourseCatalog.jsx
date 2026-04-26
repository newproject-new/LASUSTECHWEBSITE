import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AdaptiveImage from '../../components/adaptive/AdaptiveImage';

export default function CourseCatalog() {
  const { activeMode } = useNetwork();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const enroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, isEnrolled: true, progress: 0, enrolledCount: c.enrolledCount + 1 } : c));
      toast.success('Successfully enrolled!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Enrollment failed');
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.lecturerName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'enrolled' && c.isEnrolled) || (filter === 'available' && !c.isEnrolled);
    return matchSearch && matchFilter;
  });

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
            <p className="text-gray-500 text-sm mt-0.5">{courses.length} courses available · {courses.filter(c => c.isEnrolled).length} enrolled</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search" placeholder="Search courses, codes, or lecturers..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="form-input flex-1"
        />
        <div className="flex gap-2">
          {['all', 'enrolled', 'available'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium">No courses match your search.</p>
          <button onClick={() => { setSearch(''); setFilter('all'); }} className="btn-secondary mt-3 text-sm">Clear filters</button>
        </div>
      ) : (
        <div className={`grid gap-5 ${activeMode === 'lite' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
          {filtered.map(course => (
            <div key={course.id} className="card hover:shadow-md transition-shadow flex flex-col">
              {activeMode !== 'lite' && (
                <div className="h-40 relative overflow-hidden">
                  <AdaptiveImage src={course.thumbnail} alt={course.title} seed={course.code} className="w-full h-40" />
                  {course.isEnrolled && (
                    <div className="absolute top-2 left-2 badge badge-green font-semibold">✓ Enrolled</div>
                  )}
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="badge badge-blue">{course.code}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{course.credits} credits</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 leading-tight break-words">{course.title}</h3>
                {activeMode === 'full' && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed break-words">{course.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 mb-4 mt-auto">
                  <span className="break-words">{course.lecturerName}</span>
                  <span>·</span>
                  <span>{course.lessonCount} lessons</span>
                  <span>·</span>
                  <span>{course.enrolledCount} students</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/student/courses/${course.id}`} className="btn-secondary flex-1 text-sm py-2">View Course</Link>
                  {!course.isEnrolled ? (
                    <button onClick={() => enroll(course.id)} disabled={enrolling === course.id} className="btn-primary flex-1 text-sm py-2">
                      {enrolling === course.id ? '...' : 'Enroll'}
                    </button>
                  ) : (
                    <Link to={`/student/courses/${course.id}`} className="btn-success flex-1 text-sm py-2 text-center">Continue</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import api from '../../services/api';

// ─── Static rich content ──────────────────────────────────────────────────────

const SAMPLE_COURSES = [
  { id: 'c1',  code: 'CSC 301', title: 'Data Structures and Algorithms',     enrolled: 47, lessons: 12, status: 'active',   submissions: 18 },
  { id: 'c3',  code: 'CSC 201', title: 'Object-Oriented Programming',        enrolled: 63, lessons: 10, status: 'active',   submissions: 25 },
  { id: 'c5',  code: 'CSC 401', title: 'Computer Networks',                  enrolled: 38, lessons: 14, status: 'active',   submissions: 10 },
  { id: 'c6',  code: 'CSC 302', title: 'Database Management Systems',        enrolled: 52, lessons: 13, status: 'active',   submissions: 20 },
  { id: 'c7',  code: 'CSC 403', title: 'Software Engineering',               enrolled: 44, lessons: 16, status: 'active',   submissions: 14 },
  { id: 'c8',  code: 'MTH 301', title: 'Probability and Statistics',         enrolled: 71, lessons: 10, status: 'active',   submissions: 32 },
  { id: 'c2',  code: 'MTH 201', title: 'Calculus and Linear Algebra',        enrolled: 78, lessons: 11, status: 'active',   submissions: 40 },
  { id: 'c4',  code: 'PHY 211', title: 'Physics for Engineers',              enrolled: 85, lessons: 9,  status: 'active',   submissions: 35 },
  { id: 'c9',  code: 'EEE 302', title: 'Electronics and Circuit Theory',     enrolled: 56, lessons: 11, status: 'active',   submissions: 22 },
  { id: 'c10', code: 'BCH 301', title: 'Biochemistry and Molecular Biology', enrolled: 68, lessons: 12, status: 'active',   submissions: 28 },
];

const SAMPLE_ASSIGNMENTS = [
  { id: 'a1',  title: 'Implement a Binary Search Tree',            course: 'CSC 301', dueDate: '2026-05-15', submitted: 18, total: 47 },
  { id: 'a2',  title: 'Algorithm Analysis and Sorting',            course: 'CSC 301', dueDate: '2026-05-30', submitted: 5,  total: 47 },
  { id: 'a4',  title: 'OOP Design — Library Management System',    course: 'CSC 201', dueDate: '2026-05-20', submitted: 25, total: 63 },
  { id: 'a5',  title: 'Network Protocol Analysis with Wireshark',  course: 'CSC 401', dueDate: '2026-05-28', submitted: 10, total: 38 },
  { id: 'a6',  title: 'Database Design Project',                   course: 'CSC 302', dueDate: '2026-05-18', submitted: 20, total: 52 },
  { id: 'a7',  title: 'Software Requirements Specification',       course: 'CSC 403', dueDate: '2026-05-22', submitted: 14, total: 44 },
  { id: 'a8',  title: 'Statistical Analysis Report',               course: 'MTH 301', dueDate: '2026-05-12', submitted: 32, total: 71 },
  { id: 'a3',  title: 'Calculus Problem Set 1',                    course: 'MTH 201', dueDate: '2026-05-10', submitted: 40, total: 78 },
  { id: 'a9',  title: 'Circuit Design and Simulation',             course: 'EEE 302', dueDate: '2026-05-25', submitted: 12, total: 56 },
  { id: 'a10', title: 'Enzyme Kinetics Lab Report',                course: 'BCH 301', dueDate: '2026-05-16', submitted: 28, total: 68 },
];

const SAMPLE_DISCUSSIONS = [
  { id: 'd3',  title: 'Welcome to CSC 301 Discussion Forum',       course: 'CSC 301', replies: 2,  views: 156, pinned: true },
  { id: 'd1',  title: 'Help needed: BST delete operation',            course: 'CSC 301', replies: 3,  views: 42  },
  { id: 'd2',  title: 'Time Complexity — Assignment 2 clarification', course: 'CSC 301', replies: 1,  views: 28  },
  { id: 'd5',  title: 'OOP Project Guidelines',                    course: 'CSC 201', replies: 0,  views: 89,  pinned: true },
  { id: 'd6',  title: 'Wireshark Installation Issues on Windows 11',  course: 'CSC 401', replies: 1,  views: 19  },
  { id: 'd7',  title: 'Database Project ER Diagram Requirements',  course: 'CSC 302', replies: 0,  views: 67,  pinned: true },
  { id: 'd8',  title: 'Agile vs Waterfall for Banking Apps',          course: 'CSC 403', replies: 1,  views: 23  },
  { id: 'd9',  title: 'Understanding p-values in Hypothesis Testing', course: 'MTH 301', replies: 1,  views: 31  },
  { id: 'd4',  title: 'Chain Rule Application Examples',              course: 'MTH 201', replies: 2,  views: 35  },
  { id: 'd10', title: 'Lineweaver-Burk Plot Interpretation',          course: 'BCH 301', replies: 0,  views: 14  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function LecturerDashboard() {
  const { user } = useAuth();
  const { activeMode } = useNetwork();
  const [apiCourses, setApiCourses] = useState([]);
  const [apiAssignments, setApiAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    Promise.all([api.get('/courses'), api.get('/assignments')])
      .then(([c, a]) => { setApiCourses(c.data); setApiAssignments(a.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayCourses = apiCourses.length > 0
    ? apiCourses.map(c => ({
        id: c.id, code: c.code, title: c.title,
        enrolled: c.enrolledCount, lessons: c.lessonCount,
        status: c.status, submissions: c.submissionCount || 0
      }))
    : SAMPLE_COURSES;

  const displayAssignments = apiAssignments.length > 0
    ? apiAssignments.map(a => ({
        id: a.id, title: a.title, course: a.courseName || a.courseCode,
        dueDate: a.dueDate?.split('T')[0], submitted: a.submissionCount || 0,
        total: a.maxStudents || '—'
      }))
    : SAMPLE_ASSIGNMENTS;

  const totalStudents = displayCourses.reduce((s, c) => s + (c.enrolled || 0), 0);
  const totalSubmissions = displayAssignments.reduce((s, a) => s + (a.submitted || 0), 0);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="page-header">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.name?.split(' ').slice(0, 2).join(' ')}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {user?.department} · {user?.bio?.substring(0, 70) || 'Lecturer'}
            </p>
          </div>
          <Link to="/lecturer/courses" className="btn-primary">+ New Course</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Courses',      value: displayCourses.length,    accent: 'border-brand-800' },
          { label: 'Total Students',  value: totalStudents,             accent: 'border-brand-800' },
          { label: 'Assignments Set', value: displayAssignments.length, accent: 'border-brand-800' },
          { label: 'Submissions In',  value: totalSubmissions,          accent: 'border-brand-800' },
        ].map(s => (
          <div key={s.label} className={`card p-5 border-l-4 ${s.accent}`}>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'courses',     label: 'My Courses'    },
          { key: 'assignments', label: 'Assignments'   },
          { key: 'discussions', label: 'Discussions'   },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-800 text-brand-800'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Courses tab */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{displayCourses.length} courses active this semester</p>
            <Link to="/lecturer/courses" className="text-sm text-brand-700 font-medium hover:underline">Manage all →</Link>
          </div>
          <div className={`grid gap-4 ${activeMode === 'lite' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
            {displayCourses.map(course => (
              <div key={course.id} className="card p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <span className="badge badge-blue mb-1.5 inline-block">{course.code}</span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight break-words">{course.title}</h3>
                  </div>
                  <span className="badge badge-green text-xs flex-shrink-0">{course.status}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  <span>{course.enrolled} students</span>
                  <span>{course.lessons} lessons</span>
                  <span>{course.submissions} submitted</span>
                </div>
                <div className="flex gap-2">
                  <Link to={`/lecturer/courses/${course.id}/content`} className="btn-secondary flex-1 text-xs py-2 text-center">Manage</Link>
                  <Link to="/lecturer/submissions" className="btn-secondary flex-1 text-xs py-2 text-center">Grade</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments tab */}
      {activeTab === 'assignments' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{displayAssignments.length} assignments across all courses</p>
            <Link to="/lecturer/assignments" className="text-sm text-brand-700 font-medium hover:underline">Manage →</Link>
          </div>
          <div className="card divide-y divide-gray-100">
            {displayAssignments.map(a => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3 hover:bg-gray-50 gap-1 sm:gap-0">
                <div className="flex-1 min-w-0 sm:pr-4">
                  <div className="text-sm font-medium text-gray-900 break-words">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.course} · Due {a.dueDate}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="badge badge-blue text-xs">{a.submitted}/{a.total} submitted</span>
                  <Link to="/lecturer/submissions" className="text-xs text-brand-700 hover:underline font-medium">Grade →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discussions tab */}
      {activeTab === 'discussions' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{SAMPLE_DISCUSSIONS.length} active discussion threads</p>
            <Link to="/lecturer/discussions" className="text-sm text-brand-700 font-medium hover:underline">View all →</Link>
          </div>
          <div className="card divide-y divide-gray-100">
            {SAMPLE_DISCUSSIONS.map(d => (
              <Link key={d.id} to="/lecturer/discussions" className="flex items-start justify-between px-4 py-3 hover:bg-gray-50 group">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    {d.pinned && <span className="badge badge-red text-xs">Pinned</span>}
                    <span className="text-xs text-gray-400">{d.course}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-brand-800 transition-colors line-clamp-1">
                    {d.title}
                  </div>
                </div>
                <div className="text-right shrink-0 text-xs text-gray-400">
                  <div>{d.replies} {d.replies === 1 ? 'reply' : 'replies'}</div>
                  <div>{d.views} views</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import api from '../../services/api';
import AdaptiveImage from '../../components/adaptive/AdaptiveImage';

// ─── Static rich content (supplements API data) ───────────────────────────────

const SAMPLE_COURSES = [
  { id: 'c1',  code: 'CSC 301', title: 'Data Structures and Algorithms',    lecturer: 'Prof. Abdul-basit',  progress: 75, lessons: 12 },
  { id: 'c3',  code: 'CSC 201', title: 'Object-Oriented Programming',       lecturer: 'Prof. Abdul-basit',  progress: 60, lessons: 10 },
  { id: 'c5',  code: 'CSC 401', title: 'Computer Networks',                 lecturer: 'Prof. Abdul-basit',  progress: 40, lessons: 14 },
  { id: 'c2',  code: 'MTH 201', title: 'Calculus and Linear Algebra',       lecturer: 'Prof. Abdul-basit',  progress: 82, lessons: 11 },
  { id: 'c6',  code: 'CSC 302', title: 'Database Management Systems',       lecturer: 'Prof. Abdul-basit',  progress: 55, lessons: 13 },
  { id: 'c7',  code: 'CSC 403', title: 'Software Engineering',              lecturer: 'Prof. Abdul-basit',  progress: 30, lessons: 16 },
  { id: 'c4',  code: 'PHY 211', title: 'Physics for Engineers',             lecturer: 'Prof. Abdul-basit',  progress: 90, lessons: 9  },
  { id: 'c8',  code: 'MTH 301', title: 'Probability and Statistics',        lecturer: 'Prof. Abdul-basit',  progress: 48, lessons: 10 },
  { id: 'c9',  code: 'EEE 302', title: 'Electronics and Circuit Theory',    lecturer: 'Prof. Abdul-basit',  progress: 20, lessons: 11 },
  { id: 'c10', code: 'BCH 301', title: 'Biochemistry and Molecular Biology',lecturer: 'Prof. Abdul-basit',  progress: 65, lessons: 12 },
];

const SAMPLE_ASSIGNMENTS = [
  { id: 'a1',  title: 'Implement a Binary Search Tree',            course: 'CSC 301', dueDate: '2026-05-15', daysLeft: 21, urgent: false },
  { id: 'a2',  title: 'Algorithm Analysis and Sorting',            course: 'CSC 301', dueDate: '2026-05-30', daysLeft: 36, urgent: false },
  { id: 'a3',  title: 'Calculus Problem Set 1',                    course: 'MTH 201', dueDate: '2026-05-10', daysLeft: 16, urgent: false },
  { id: 'a4',  title: 'OOP Design — Library Management System',    course: 'CSC 201', dueDate: '2026-05-20', daysLeft: 26, urgent: false },
  { id: 'a5',  title: 'Network Protocol Analysis with Wireshark',  course: 'CSC 401', dueDate: '2026-05-28', daysLeft: 34, urgent: false },
  { id: 'a6',  title: 'Database Design Project',                   course: 'CSC 302', dueDate: '2026-05-18', daysLeft: 24, urgent: false },
  { id: 'a7',  title: 'Software Requirements Specification',       course: 'CSC 403', dueDate: '2026-05-22', daysLeft: 28, urgent: false },
  { id: 'a8',  title: 'Statistical Analysis Report',               course: 'MTH 301', dueDate: '2026-05-12', daysLeft: 18, urgent: false },
  { id: 'a9',  title: 'Circuit Design and Simulation',             course: 'EEE 302', dueDate: '2026-05-25', daysLeft: 31, urgent: false },
  { id: 'a10', title: 'Enzyme Kinetics Lab Report',                course: 'BCH 301', dueDate: '2026-05-16', daysLeft: 22, urgent: false },
  { id: 'a11', title: 'Physics Lab Report: Mechanics and Motion',  course: 'PHY 211', dueDate: '2026-05-14', daysLeft: 20, urgent: false },
  { id: 'a12', title: 'Electronics Circuit Simulation Analysis',   course: 'EEE 302', dueDate: '2026-05-19', daysLeft: 25, urgent: false },
  { id: 'a13', title: 'Molecular Biology Practical Write-up',      course: 'BCH 301', dueDate: '2026-05-21', daysLeft: 27, urgent: false },
  { id: 'a14', title: 'Computer Networks Lab Assignment',          course: 'CSC 401', dueDate: '2026-05-26', daysLeft: 32, urgent: false },
  { id: 'a15', title: 'Object-Oriented Design Patterns Report',    course: 'CSC 201', dueDate: '2026-06-02', daysLeft: 39, urgent: false },
];

const SAMPLE_DISCUSSIONS = [
  { id: 'd1',  title: 'Help needed: BST delete operation',              course: 'CSC 301', replies: 3,  views: 42,  date: '2026-04-20' },
  { id: 'd3',  title: 'Welcome to CSC 301 Discussion Forum',           course: 'CSC 301', replies: 0,  views: 156, date: '2026-04-10', pinned: true },
  { id: 'd2',  title: 'Time Complexity — Assignment 2 clarification',   course: 'CSC 301', replies: 1,  views: 28,  date: '2026-04-25' },
  { id: 'd4',  title: 'Chain Rule Application Examples',                course: 'MTH 201', replies: 2,  views: 35,  date: '2026-04-22' },
  { id: 'd5',  title: 'OOP Project Guidelines',                        course: 'CSC 201', replies: 0,  views: 89,  date: '2026-04-20', pinned: true },
  { id: 'd6',  title: 'Wireshark Installation Issues on Windows 11',    course: 'CSC 401', replies: 1,  views: 19,  date: '2026-04-23' },
  { id: 'd7',  title: 'Database Project ER Diagram Requirements',      course: 'CSC 302', replies: 0,  views: 67,  date: '2026-04-16', pinned: true },
  { id: 'd8',  title: 'Agile vs Waterfall for Banking Apps',            course: 'CSC 403', replies: 1,  views: 23,  date: '2026-04-24' },
  { id: 'd9',  title: 'Understanding p-values in Hypothesis Testing',   course: 'MTH 301', replies: 1,  views: 31,  date: '2026-04-21' },
  { id: 'd10', title: 'Lineweaver-Burk Plot Interpretation',            course: 'BCH 301', replies: 0,  views: 14,  date: '2026-04-23' },
  { id: 'd11', title: 'Physics Lab Safety and Equipment Guidelines',    course: 'PHY 211', replies: 2,  views: 45,  date: '2026-04-18' },
  { id: 'd12', title: 'Ohm\'s Law and Circuit Analysis Practice',       course: 'EEE 302', replies: 1,  views: 22,  date: '2026-04-21' },
  { id: 'd13', title: 'Introduction to Enzyme Kinetics Discussion',     course: 'BCH 301', replies: 3,  views: 56,  date: '2026-04-17' },
  { id: 'd14', title: 'Software Architecture Patterns Q&A',             course: 'CSC 403', replies: 0,  views: 18,  date: '2026-04-24' },
  { id: 'd15', title: 'Probability vs Statistics: Key Differences',     course: 'MTH 301', replies: 2,  views: 41,  date: '2026-04-20' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-brand-800 rounded-full" style={{ width: `${value}%` }} />
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`card p-5 border-l-4 ${accent}`}>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const { activeMode } = useNetwork();
  const [apiCourses, setApiCourses] = useState([]);
  const [apiAssignments, setApiAssignments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    Promise.all([
      api.get('/courses'),
      api.get('/assignments'),
      api.get('/progress/my').catch(() => ({ data: [] })),
    ])
      .then(([cRes, aRes, pRes]) => {
        const enrolled = cRes.data.filter(c => c.isEnrolled);
        setApiCourses(enrolled);
        setApiAssignments(aRes.data.filter(a => !a.submitted && !a.isOverdue));
        const map = {};
        (pRes.data || []).forEach(p => { map[p.courseId] = p.percentage; });
        setProgressMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Merge real API courses with sample display data, preferring API progress
  const displayCourses = apiCourses.length > 0
    ? apiCourses.map(c => ({
        ...c,
        lecturer: c.lecturerName,
        lessons: c.lessonCount || c.lessons?.length || 0,
        progress: progressMap[c.id] ?? c.progress ?? 0,
      }))
    : SAMPLE_COURSES.map(c => ({ ...c, progress: progressMap[c.id] ?? c.progress }));

  const displayAssignments = apiAssignments.length > 0 ? apiAssignments : SAMPLE_ASSIGNMENTS;

  const totalProgress = displayCourses.length > 0
    ? Math.round(displayCourses.reduce((s, c) => s + (c.progress || 0), 0) / displayCourses.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="page-header">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Good {getGreeting()}, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              {user?.department} · {user?.level} Level · {user?.matric}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-50 rounded-xl border border-brand-100">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-brand-800 text-sm font-medium">2nd Semester 2025/26</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled Courses"   value={displayCourses.length}     accent="border-brand-800" />
        <StatCard label="Avg. Progress"      value={`${totalProgress}%`}        accent="border-brand-800" />
        <StatCard label="Pending Tasks"      value={displayAssignments.length}  accent="border-brand-800" />
        <StatCard label="Active Discussions" value={SAMPLE_DISCUSSIONS.length}  accent="border-brand-800" />
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
            <p className="text-sm text-gray-500">{displayCourses.length} courses enrolled this semester</p>
            <Link to="/student/courses" className="text-sm text-brand-700 font-medium hover:underline">Browse Catalogue →</Link>
          </div>

          {activeMode !== 'lite' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayCourses.map(course => (
                <Link key={course.id} to={`/student/courses/${course.id}`} className="card hover:shadow-md transition-shadow group overflow-hidden">
                  <div className="h-40 relative overflow-hidden">
                    <AdaptiveImage src={course.thumbnail} alt={course.title} seed={course.code} className="w-full h-40" />
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-blue text-xs">{course.code}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 group-hover:text-brand-800 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">{course.lecturer} · {course.lessons} lessons</p>
                    <ProgressBar value={course.progress} />
                    <div className="flex justify-between mt-1.5">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs font-bold text-brand-800">{course.progress}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="card divide-y divide-gray-100">
              {displayCourses.map(course => (
                <Link key={course.id} to={`/student/courses/${course.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{course.code}: {course.title}</div>
                    <div className="text-xs text-gray-500">{course.lecturer}</div>
                  </div>
                  <span className="text-xs font-bold text-brand-700">{course.progress}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Assignments tab */}
      {activeTab === 'assignments' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{displayAssignments.length} pending assignments</p>
            <Link to="/student/assignments" className="text-sm text-brand-700 font-medium hover:underline">View all →</Link>
          </div>
          <div className="card divide-y divide-gray-100">
            {displayAssignments.map(a => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="text-sm font-medium text-gray-900 truncate">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.course}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-xs font-semibold ${a.urgent ? 'text-red-600' : a.daysLeft <= 7 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {a.daysLeft <= 0 ? 'Overdue' : a.daysLeft === 1 ? 'Due tomorrow' : `${a.daysLeft} days left`}
                  </div>
                  <div className="text-xs text-gray-400">{a.dueDate}</div>
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
            <p className="text-sm text-gray-500">{SAMPLE_DISCUSSIONS.length} active threads</p>
            <Link to="/student/discussions" className="text-sm text-brand-700 font-medium hover:underline">View all →</Link>
          </div>
          <div className="card divide-y divide-gray-100">
            {SAMPLE_DISCUSSIONS.map(d => (
              <Link key={d.id} to="/student/discussions" className="flex items-start justify-between px-4 py-3 hover:bg-gray-50 group">
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

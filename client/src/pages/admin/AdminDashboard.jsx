import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b0000', '#b91c1c', '#16a34a', '#dc2626', '#f59e0b'];

const RECENT_ACTIVITY = [
  { type: 'login',      userName: 'Oladele, John',       detail: 'Logged in — Student Portal',          time: '2 mins ago' },
  { type: 'submission', userName: 'Adamu, Sarah',         detail: 'Submitted: OOP Design assignment',    time: '8 mins ago' },
  { type: 'discussion', userName: 'Prof. Abdul-basit',  detail: 'Posted reply in CSC 301 forum',       time: '15 mins ago' },
  { type: 'login',      userName: 'Eze, Michael',         detail: 'Logged in — Student Portal',          time: '21 mins ago' },
  { type: 'submission', userName: 'Yusuf, Fatima',        detail: 'Submitted: Calculus Problem Set 1',   time: '34 mins ago' },
  { type: 'login',      userName: 'Prof. Abdul-basit',    detail: 'Logged in — Lecturer Portal',         time: '47 mins ago' },
  { type: 'submission', userName: 'Obi, Chukwuemeka',     detail: 'Submitted: Network Protocol Analysis',time: '1 hr ago'    },
  { type: 'discussion', userName: 'Ibrahim, Amina',       detail: 'Posted in BCH 301: Lineweaver-Burk',  time: '1 hr ago'    },
  { type: 'login',      userName: 'Fashola, Tunde',       detail: 'Logged in — Student Portal',          time: '2 hrs ago'   },
  { type: 'submission', userName: 'Prof. Abdul-basit',  detail: 'Published: Software Engineering Week 6 notes', time: '2 hrs ago' },
];

const COURSE_STATS = [
  { code: 'CSC 301', title: 'Data Structures and Algorithms',     enrolled: 47, completion: 62, submissions: 18 },
  { code: 'CSC 201', title: 'Object-Oriented Programming',        enrolled: 63, completion: 55, submissions: 25 },
  { code: 'MTH 201', title: 'Calculus and Linear Algebra',        enrolled: 78, completion: 70, submissions: 40 },
  { code: 'PHY 211', title: 'Physics for Engineers',              enrolled: 85, completion: 80, submissions: 35 },
  { code: 'CSC 401', title: 'Computer Networks',                  enrolled: 38, completion: 35, submissions: 10 },
  { code: 'CSC 302', title: 'Database Management Systems',        enrolled: 52, completion: 48, submissions: 20 },
  { code: 'CSC 403', title: 'Software Engineering',               enrolled: 44, completion: 30, submissions: 14 },
  { code: 'MTH 301', title: 'Probability and Statistics',         enrolled: 71, completion: 58, submissions: 32 },
  { code: 'EEE 302', title: 'Electronics and Circuit Theory',     enrolled: 56, completion: 42, submissions: 22 },
  { code: 'BCH 301', title: 'Biochemistry and Molecular Biology', enrolled: 68, completion: 55, submissions: 28 },
];

const actTypeDot  = { login: 'bg-blue-500', submission: 'bg-green-500', discussion: 'bg-purple-500' };
const actTypeColor = { login: 'text-blue-600', submission: 'text-green-600', discussion: 'text-purple-600' };

export default function AdminDashboard() {
  const { activeMode } = useNetwork();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([api.get('/admin/stats'), api.get('/admin/activity')])
      .then(([s]) => { setStats(s.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div>
    </div>
  );

  const pieData = [
    { name: 'Students',  value: stats?.students  || 8  },
    { name: 'Lecturers', value: stats?.lecturers || 2  },
    { name: 'Admins',    value: stats?.admins    || 1  },
  ];

  const barData = [
    { name: 'Courses',     value: stats?.totalCourses     || 10 },
    { name: 'Lessons',     value: stats?.totalLessons     || 9  },
    { name: 'Assignments', value: stats?.totalAssignments || 10 },
    { name: 'Submissions', value: stats?.totalSubmissions || 4  },
    { name: 'Discussions', value: stats?.totalDiscussions || 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">LASUSTECH E-LEARNING PORTAL Administration — 2025/2026</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/users"  className="btn-secondary text-sm">Manage Users</Link>
          <Link to="/admin/system" className="btn-primary  text-sm">System Health</Link>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',      value: stats?.totalUsers         || 11, accent: 'border-brand-800', sub: `${stats?.newUsersThisMonth || 2} new this month` },
          { label: 'Active Students',  value: stats?.students           || 8,  accent: 'border-brand-800', sub: `${stats?.activeUsers || 10} active users`       },
          { label: 'Lecturers',        value: stats?.lecturers          || 2,  accent: 'border-brand-800', sub: `${stats?.activeCourses || 10} active courses`   },
          { label: 'Pending Grades',   value: stats?.pendingSubmissions || 3,  accent: 'border-brand-800', sub: `${stats?.gradeRate || 78}% graded`             },
        ].map(s => (
          <div key={s.label} className={`card p-5 border-l-4 ${s.accent}`}>
            <div className="text-2xl font-bold text-gray-900">{s.value ?? 0}</div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {[
          { key: 'overview',   label: 'Overview'         },
          { key: 'courses',    label: 'Course Stats'     },
          { key: 'activity',   label: 'Recent Activity'  },
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

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div>
          <div className={`grid gap-6 ${activeMode === 'lite' ? 'grid-cols-1' : 'grid-cols-1 xl:grid-cols-2'}`}>
            {/* Content bar chart */}
            <div className="card p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Portal Content Overview</h2>
              {activeMode === 'full' ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8b0000" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="space-y-2">
                  {barData.map(d => (
                    <div key={d.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="text-sm text-gray-700">{d.name}</span>
                      <span className="text-sm font-bold text-brand-800">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User distribution pie */}
            <div className="card p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">User Distribution</h2>
              {activeMode === 'full' ? (
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="60%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {pieData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                        <span className="text-sm text-gray-700">{d.name}: <strong>{d.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-sm text-gray-700 flex-1">{d.name}</span>
                      <span className="font-bold text-brand-800">{d.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {[
              { label: 'Courses',       value: stats?.totalCourses     || 10 },
              { label: 'Lessons',       value: stats?.totalLessons     || 9  },
              { label: 'Assignments',   value: stats?.totalAssignments || 10 },
              { label: 'Submissions',   value: stats?.totalSubmissions || 4  },
              { label: 'Discussions',   value: stats?.totalDiscussions || 10 },
            ].map(s => (
              <div key={s.label} className="card p-4 text-center">
                <div className="text-xl font-bold text-brand-800">{s.value ?? 0}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course stats tab */}
      {activeTab === 'courses' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{COURSE_STATS.length} courses active this semester</p>
          </div>
          <div className="card divide-y divide-gray-100">
            {COURSE_STATS.map(c => (
              <div key={c.code} className="px-5 py-3 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <span className="badge badge-blue text-xs mr-2">{c.code}</span>
                    <span className="text-sm font-medium text-gray-900">{c.title}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{c.enrolled} enrolled</span>
                    <span>{c.submissions} submitted</span>
                    <span className={`font-semibold ${c.completion >= 60 ? 'text-green-700' : c.completion >= 40 ? 'text-yellow-700' : 'text-red-700'}`}>
                      {c.completion}% completion
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.completion >= 60 ? 'bg-green-500' : c.completion >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${c.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity tab */}
      {activeTab === 'activity' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">Most recent platform actions</p>
          </div>
          <div className="card divide-y divide-gray-100">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${actTypeDot[item.type] || 'bg-gray-400'}`}></span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900">{item.userName}</span>
                  <span className={`text-xs ml-2 ${actTypeColor[item.type]}`}>({item.type})</span>
                  <div className="text-xs text-gray-500 truncate">{item.detail}</div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

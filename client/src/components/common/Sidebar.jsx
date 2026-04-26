import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';

const Icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  courses: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  assignments: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  discussions: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
    </svg>
  ),
  submissions: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  system: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
    </svg>
  ),
  network: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  quizzes: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const studentNav = [
  { to: '/student/dashboard',   label: 'Dashboard',     icon: 'dashboard'   },
  { to: '/student/courses',     label: 'Course Catalog', icon: 'courses'     },
  { to: '/student/assignments', label: 'Assignments',    icon: 'assignments' },
  { to: '/student/quizzes',     label: 'Quizzes',        icon: 'quizzes'     },
  { to: '/student/discussions', label: 'Discussions',    icon: 'discussions' },
];

const lecturerNav = [
  { to: '/lecturer/dashboard',   label: 'Dashboard',    icon: 'dashboard'   },
  { to: '/lecturer/courses',     label: 'My Courses',   icon: 'courses'     },
  { to: '/lecturer/quizzes',     label: 'Quizzes',      icon: 'quizzes'     },
  { to: '/lecturer/assignments', label: 'Assignments',  icon: 'assignments' },
  { to: '/lecturer/submissions', label: 'Submissions',  icon: 'submissions' },
  { to: '/lecturer/discussions', label: 'Discussions',  icon: 'discussions' },
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/users', label: 'User Management', icon: 'users' },
  { to: '/admin/system', label: 'System Health', icon: 'system' },
];

// Human-readable network labels
const networkLabels = {
  '4g':     { label: '4G / LTE', quality: 'Excellent', desc: 'You have a strong, fast connection. All content loads at full quality.' },
  '3g':     { label: '3G', quality: 'Good', desc: 'Your connection is moderate. Videos and images load at reduced quality to save data.' },
  '2g':     { label: '2G', quality: 'Limited', desc: 'Your connection is slow. The portal switches to a lightweight view to keep things working.' },
  'slow-2g':{ label: 'Very Slow', quality: 'Poor', desc: 'Your connection is very weak. Text-only content is shown to ensure the portal stays accessible.' },
};

const modeLabels = {
  full:   { label: 'Full Mode', color: 'text-green-700', dot: 'bg-green-500', desc: 'All media and interactive features are fully enabled.' },
  medium: { label: 'Medium Mode', color: 'text-yellow-700', dot: 'bg-yellow-500', desc: 'Images are compressed and videos are limited to save your data.' },
  lite:   { label: 'Lite Mode', color: 'text-red-700', dot: 'bg-red-500', desc: 'Text-only view — no images or videos — for very slow connections.' },
};

function MyNetworkPanel() {
  const { activeMode, activeEffectiveType, simulatedType, metrics, formatDataUsage } = useNetwork();

  const net = networkLabels[activeEffectiveType] || networkLabels['4g'];
  const mode = modeLabels[activeMode] || modeLabels['full'];

  return (
    <div className="mt-2 space-y-3">
      {/* Connection quality */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">Connection</span>
          <span className="text-xs font-bold text-gray-900">{net.label}</span>
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className={`w-2 h-2 rounded-full ${mode.dot} animate-pulse`}></div>
          <span className={`text-xs font-semibold ${mode.color}`}>{mode.label}</span>
          {simulatedType && <span className="text-xs text-gray-400">(simulated)</span>}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{net.desc}</p>
      </div>

      {/* What the portal is doing */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <p className="text-xs font-semibold text-gray-700 mb-1">Update</p>
        <p className="text-xs text-gray-500 leading-relaxed">{mode.desc}</p>
      </div>

      {/* Data usage */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
        <p className="text-xs font-semibold text-gray-700 mb-2">Session info</p>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Data used this session</span>
            <span className="font-semibold text-gray-800">{formatDataUsage ? formatDataUsage(metrics?.dataUsage) : '—'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Page load time</span>
            <span className="font-semibold text-gray-800">{metrics?.pageLoadMs ? `${metrics.pageLoadMs}ms` : '—'}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const [networkOpen, setNetworkOpen] = React.useState(false);
  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'lecturer' ? lecturerNav : studentNav;

  const roleBadge = { admin: 'Administrator', lecturer: 'Lecturer Portal', student: 'Student Portal' };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4">
          <div className="mb-6 px-3 py-3 bg-brand-50 rounded-xl border border-brand-100">
            <div className="text-xs font-semibold text-brand-700 uppercase tracking-wider">{roleBadge[user?.role]}</div>
            <div className="text-sm font-medium text-gray-900 mt-1 truncate">{user?.name}</div>
            <div className="text-xs text-gray-500 truncate">{user?.department}</div>
          </div>

          <nav className="space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              >
                {Icons[item.icon]}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* My Network */}
          <div className="mt-6">
            <button
              onClick={() => setNetworkOpen(v => !v)}
              className="w-full sidebar-link justify-between"
            >
              <span className="flex items-center gap-3">
                {Icons.network}
                <span>My Network</span>
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${networkOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {networkOpen && <MyNetworkPanel />}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Academic Info</div>
            <div className="px-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between"><span>Semester</span><span className="font-medium">2nd Sem 2025/26</span></div>
              {user?.level && <div className="flex justify-between"><span>Level</span><span className="font-medium">{user.level} Level</span></div>}
              {user?.matric && <div className="flex justify-between"><span>Matric No.</span><span className="font-medium text-xs">{user.matric}</span></div>}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

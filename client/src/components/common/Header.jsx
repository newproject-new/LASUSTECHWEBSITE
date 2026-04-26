import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import toast from 'react-hot-toast';

const icons = {
  menu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  wifi: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
  ),
};

const modeColors = { full: 'bg-green-500', medium: 'bg-yellow-500', lite: 'bg-red-500' };
const netLabels = { '4g': '4G', '3g': '3G', '2g': '2G', 'slow-2g': 'Slow 2G' };

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { activeMode, activeEffectiveType, simulatedType, setShowDashboard, showDashboard } = useNetwork();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const roleColors = { admin: 'bg-red-100 text-red-800', lecturer: 'bg-blue-100 text-blue-800', student: 'bg-green-100 text-green-800' };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-900 shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-white p-1.5 rounded-lg hover:bg-brand-800 transition-colors">
            {icons.menu}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-full overflow-hidden flex items-center justify-center p-0.5">
              <img src="/images/logo.jpg" alt="LASUSTECH" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-tight">LASUSTECH</div>
              <div className="text-brand-300 text-xs leading-tight">Learn Portal</div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-700 transition-colors"
            title="Network Dashboard"
          >
            <div className={`w-2 h-2 rounded-full ${modeColors[activeMode]} animate-pulse`}></div>
            <span className="text-white text-xs font-medium hidden sm:block">
              {netLabels[activeEffectiveType] || '4G'}
            </span>
            {simulatedType && <span className="text-yellow-300 text-xs hidden sm:block">(sim)</span>}
            {icons.wifi}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-brand-800 transition-colors"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-brand-900 font-bold text-sm">
                {user?.name?.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-white text-xs font-medium leading-tight">{user?.name?.split(' ').slice(0, 2).join(' ')}</div>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleColors[user?.role]}`}>
                  {user?.role}
                </span>
              </div>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                  <div className="text-gray-500 text-xs truncate">{user?.email}</div>
                </div>
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-xs text-gray-500">{user?.department} · Level {user?.level || 'N/A'}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  {icons.logout}
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active mode indicator strip */}
      <div className={`h-0.5 ${modeColors[activeMode]}`}></div>
    </header>
  );
}

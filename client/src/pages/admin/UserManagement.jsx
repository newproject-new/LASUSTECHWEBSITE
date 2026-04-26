import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useNetwork } from '../../contexts/NetworkContext';

export default function UserManagement() {
  const { activeMode } = useNetwork();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (userId, status) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
      toast.success(`User ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const roleColors = { admin: 'badge-red', lecturer: 'badge-blue', student: 'badge-green' };
  const statusColors = { active: 'badge-green', inactive: 'badge-gray' };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6 w-full min-w-0">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">{users.length} total users · {users.filter(u => u.status === 'active').length} active</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Students',  value: users.filter(u => u.role === 'student').length,    accent: 'border-brand-800' },
          { label: 'Lecturers', value: users.filter(u => u.role === 'lecturer').length,  accent: 'border-brand-800' },
          { label: 'Admins',    value: users.filter(u => u.role === 'admin').length,     accent: 'border-brand-800' },
          { label: 'Inactive',  value: users.filter(u => u.status === 'inactive').length,accent: 'border-brand-800' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border-l-4 ${s.accent}`}>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="search" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} className="form-input flex-1" />
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-input flex-1 sm:w-auto sm:flex-none">
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input flex-1 sm:w-auto sm:flex-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* User table — only the table scrolls horizontally on small screens */}
      {activeMode !== 'lite' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <div className="max-h-[520px] overflow-y-auto">
              <table className="w-full text-sm" style={{ minWidth: '600px' }}>
                <thead className="bg-brand-900 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-3 text-left font-medium whitespace-nowrap">User</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Department</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Role</th>
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                    {activeMode === 'full' && <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Joined</th>}
                    <th className="px-4 py-3 text-left font-medium whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {user.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 whitespace-nowrap">{user.name}</div>
                            <div className="text-xs text-gray-500 max-w-[180px] truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{user.department}</td>
                      <td className="px-4 py-3">
                        <select value={user.role} onChange={e => updateRole(user.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white">
                          <option value="student">Student</option>
                          <option value="lecturer">Lecturer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge text-xs ${statusColors[user.status]}`}>{user.status}</span>
                      </td>
                      {activeMode === 'full' && (
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{user.joinedAt ? format(parseISO(user.joinedAt), 'MMM d, yyyy') : 'N/A'}</td>
                      )}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => updateStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap ${user.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-green-600 border-green-200 hover:bg-green-50'}`}>
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 py-8 text-sm">No users match your filters.</div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(user => (
            <div key={user.id} className="card p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-800 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {user.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 break-words">{user.name}</div>
                <div className="text-xs text-gray-500">{user.role} · {user.status}</div>
              </div>
              <button onClick={() => updateStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                className="text-xs text-brand-700 hover:underline flex-shrink-0">
                {user.status === 'active' ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

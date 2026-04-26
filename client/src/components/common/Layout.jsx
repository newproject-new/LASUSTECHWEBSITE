import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import NetworkDashboard from '../adaptive/NetworkDashboard';
import { useNetwork } from '../../contexts/NetworkContext';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeMode } = useNetwork();

  return (
    <div className={`min-h-screen bg-gray-50 mode-${activeMode}`}>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 lg:ml-64 p-4 lg:p-6 min-h-[calc(100vh-4rem)] min-w-0 max-w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <NetworkDashboard />
    </div>
  );
}

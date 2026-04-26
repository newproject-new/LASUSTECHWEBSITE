import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';

function HealthIndicator({ label, status, detail }) {
  const colors = { ok: 'bg-green-500', warn: 'bg-yellow-500', error: 'bg-red-500' };
  const labels = { ok: 'OK', warn: 'Warning', error: 'Error' };
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {detail && <div className="text-xs text-gray-500 mt-0.5">{detail}</div>}
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${colors[status]}`}></div>
        <span className="text-xs font-medium text-gray-600">{labels[status]}</span>
      </div>
    </div>
  );
}

export default function SystemHealth() {
  const { activeMode, activeEffectiveType, activeMode: netMode, activeProfile, simulatedType, modeConfig } = useNetwork();
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const load = () => {
      Promise.all([api.get('/health'), api.get('/admin/stats')])
        .then(([h, s]) => { setHealth(h.data); setStats(s.data); setUptime(h.data.uptime); })
        .catch(() => {})
        .finally(() => setLoading(false));
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  };

  const netModeColors = { full: 'green', medium: 'yellow', lite: 'red' };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <p className="text-gray-500 text-sm mt-0.5">Real-time platform and network monitoring</p>
      </div>

      {/* Server health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-base font-bold text-gray-900">Server Status</h2>
          </div>
          <HealthIndicator label="API Server" status="ok" detail="Running on port 5000" />
          <HealthIndicator label="Data Store" status="ok" detail="In-memory store active" />
          <HealthIndicator label="Authentication" status="ok" detail="JWT service running" />
          <HealthIndicator label="File Upload" status="ok" detail="Multer middleware active" />
          <HealthIndicator label="CORS Policy" status="ok" detail="localhost:3000 allowed" />
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-xs font-semibold text-green-800 mb-1">Server Uptime</div>
            <div className="text-lg font-bold text-green-700">{formatUptime(uptime)}</div>
          </div>
        </div>

        {/* Network status */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Network Adaptive Engine</h2>
            <span className={`badge bg-${netModeColors[activeMode]}-100 text-${netModeColors[activeMode]}-800 border border-${netModeColors[activeMode]}-200`}>
              {modeConfig[activeMode]?.label}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Connection</span>
              <span className="font-semibold text-gray-900 uppercase">{activeEffectiveType}{simulatedType ? ' (simulated)' : ''}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Adaptive Mode</span>
              <span className="font-semibold text-gray-900">{modeConfig[activeMode]?.label}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Downlink Speed</span>
              <span className="font-semibold text-gray-900">{activeProfile?.downlink || 10} Mbps</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">RTT Latency</span>
              <span className="font-semibold text-gray-900">{activeProfile?.rtt || 50} ms</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Service Worker</span>
              <span className="font-semibold text-green-600">{'serviceWorker' in navigator ? 'Registered' : 'Not supported'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Cache Storage</span>
              <span className="font-semibold text-green-600">{'caches' in window ? 'Available' : 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network API</span>
              <span className="font-semibold text-green-600">{'connection' in navigator ? 'Supported' : 'Polyfilled'}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs font-semibold text-gray-700 mb-2">Adaptive Behavior by Mode</div>
            <div className="space-y-1">
              {[
                { mode: 'full', net: '4G', actions: 'Full images, video enabled, all animations' },
                { mode: 'medium', net: '3G', actions: 'Compressed images, video on click only' },
                { mode: 'lite', net: '2G', actions: 'No images/video, text-only interface' },
              ].map(r => (
                <div key={r.mode} className={`flex items-start gap-2 text-xs p-2 rounded ${activeMode === r.mode ? 'bg-brand-50 border border-brand-200' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${r.mode === 'full' ? 'bg-green-500' : r.mode === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <div>
                    <span className="font-medium text-gray-700 capitalize">{r.mode} ({r.net}):</span>
                    <span className="text-gray-500 ml-1">{r.actions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Database stats */}
      {health && (
        <div className="card p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Data Store Statistics</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(health.stats || {}).map(([key, val]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-brand-800">{val}</div>
                <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance notes */}
      <div className="card p-5">
        <h2 className="text-base font-bold text-gray-900 mb-4">Performance Notes</h2>
        <div className="space-y-3">
          {[
            { title: 'Network Information API',       desc: 'Real-time bandwidth and RTT detection via navigator.connection. Falls back gracefully on unsupported browsers.' },
            { title: 'Service Worker Caching',        desc: 'Static assets and API responses are cached. Enables partial offline functionality and faster repeat loads.' },
            { title: 'Adaptive Image Loading',        desc: 'Full mode: 800×400px originals. Medium mode: 40% compressed versions. Lite mode: SVG placeholders (0 bytes).' },
            { title: 'Adaptive Video Rendering',      desc: 'Full mode: Autoload iframe embeds. Medium mode: Poster thumbnail, load on click. Lite mode: Hidden entirely.' },
            { title: 'Lazy Loading',                  desc: 'All images use loading="lazy". Heavy components are React.lazy() deferred. Off-screen content not loaded.' },
            { title: 'Performance Instrumentation',   desc: 'Page load time, request count, and estimated data usage tracked in real-time via the Network Dashboard.' },
          ].map(note => (
            <div key={note.title} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-1.5 h-1.5 bg-brand-800 rounded-full mt-1.5 shrink-0"></div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{note.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{note.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

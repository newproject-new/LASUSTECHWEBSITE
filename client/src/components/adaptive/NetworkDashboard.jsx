import React, { useEffect, useRef } from 'react';
import { useNetwork } from '../../contexts/NetworkContext';

const modeColorMap = {
  full:   { dot: 'bg-green-500', badge: 'bg-green-100 text-green-800 border-green-200' },
  medium: { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  lite:   { dot: 'bg-red-500', badge: 'bg-red-100 text-red-800 border-red-200' },
};

export default function NetworkDashboard() {
  const {
    showDashboard, setShowDashboard,
    activeMode,
    simulatedType, simulateNetwork,
    realConnection,
  } = useNetwork();

  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!showDashboard) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowDashboard(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDashboard, setShowDashboard]);

  if (!showDashboard) return null;

  const mc = modeColorMap[activeMode] || modeColorMap.full;

  return (
    <div
      ref={panelRef}
      className="fixed top-[68px] right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ animation: 'fadeSlideDown 0.15s ease' }}
    >
      {/* Header */}
      <div className="bg-brand-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${mc.dot} animate-pulse`}></div>
          <span className="font-semibold text-sm">Simulate Network</span>
        </div>
        <button
          onClick={() => setShowDashboard(false)}
          className="text-brand-300 hover:text-white transition-colors text-lg leading-none"
        >
          &times;
        </button>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-500 leading-relaxed">
          Switch between network conditions to see how the portal adapts content delivery in real time.
        </p>

        <div className="space-y-2">
          {[
            { key: null,      label: 'Real Network',  sub: `Currently detected: ${(realConnection?.effectiveType || '4g').toUpperCase()}`, color: 'green' },
            { key: '4g',      label: '4G / LTE',      sub: 'Fast — full content, HD images, videos enabled' },
            { key: '3g',      label: '3G',            sub: 'Moderate — compressed images, reduced video' },
            { key: '2g',      label: '2G',            sub: 'Slow — lightweight layout, limited media' },
            { key: 'slow-2g', label: 'Slow 2G',       sub: 'Very slow — text-only mode, no images or video' },
          ].map(opt => {
            const isActive = simulatedType === opt.key;
            return (
              <button
                key={opt.key ?? 'real'}
                onClick={() => { simulateNetwork(opt.key); setShowDashboard(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <div className={`text-sm font-semibold ${isActive ? 'text-brand-800' : 'text-gray-800'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>
                </div>
                {isActive && <div className="w-2 h-2 bg-brand-500 rounded-full shrink-0 ml-2"></div>}
              </button>
            );
          })}
        </div>

      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

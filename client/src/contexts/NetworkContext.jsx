/**
 * NetworkContext — Adaptive Network Engine
 *
 * This context is the core innovation of the LASUSTECH e-learning portal.
 * It detects the user's current network quality using the browser's
 * Network Information API (navigator.connection) and maps it to one of
 * three adaptive modes that control how content is rendered across the app:
 *
 *   full   → 4G/LTE   : HD images, embedded videos, full animations
 *   medium → 3G       : Compressed images, click-to-play video, reduced UI
 *   lite   → 2G/slow  : No images or video, plain text layout only
 *
 * Real data consumption is measured via the PerformanceResourceTiming API
 * (transferSize on each network resource), which replaces any hardcoded
 * byte estimates with actual measured values.
 *
 * Lecturers and admins can also simulate a network type (via the Network
 * Dashboard panel) to preview how students on slower connections experience
 * the portal.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const NetworkContext = createContext(null);

/**
 * Maps a browser-reported effectiveType to an adaptive mode.
 * effectiveType is one of: 'slow-2g' | '2g' | '3g' | '4g'
 * Only 4G gets full content; 3G gets medium; anything slower gets lite.
 */
function computeMode(effectiveType) {
  if (effectiveType === '4g') return 'full';
  if (effectiveType === '3g') return 'medium';
  return 'lite';
}

/**
 * Pre-defined network profiles used when simulating a connection type.
 * Each profile mirrors realistic values for downlink speed (Mbps) and
 * round-trip time (RTT in ms) at that connection tier.
 */
const SIMULATED_PROFILES = {
  'slow-2g': { effectiveType: 'slow-2g', downlink: 0.1, rtt: 2000 },
  '2g':      { effectiveType: '2g',      downlink: 0.3, rtt: 800 },
  '3g':      { effectiveType: '3g',      downlink: 1.5, rtt: 300 },
  '4g':      { effectiveType: '4g',      downlink: 20,  rtt: 50  },
};

export function NetworkProvider({ children }) {
  // realConnection holds what the browser reports via navigator.connection
  const [realConnection, setRealConnection] = useState({ effectiveType: '4g', downlink: 10, rtt: 50, saveData: false });

  // simulatedType is set when a user manually selects a network tier to test
  const [simulatedType, setSimulatedType] = useState(null);

  // userOverride allows bypassing the detected mode entirely (manual toggle)
  const [userOverride, setUserOverride] = useState(null);

  // metrics tracks page load time, total data transferred, and request count
  const [metrics, setMetrics] = useState({ loadTime: 0, dataUsage: 0, requestCount: 0, pageLoadMs: 0 });

  const [showDashboard, setShowDashboard] = useState(false);
  const pageLoadStart = useRef(Date.now());
  const dataUsageRef = useRef(0);
  const seenEntries = useRef(new Set()); // prevents double-counting the same resource

  // Subscribe to Network Information API changes.
  // navigator.connection is supported in Chrome/Android; on unsupported browsers
  // the default value (4G) is used so the portal degrades gracefully.
  useEffect(() => {
    const nav = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (nav) {
      const update = () => setRealConnection({
        effectiveType: nav.effectiveType || '4g',
        downlink: nav.downlink || 10,
        rtt: nav.rtt || 50,
        saveData: nav.saveData || false
      });
      update();
      nav.addEventListener('change', update);
      return () => nav.removeEventListener('change', update);
    }
  }, []);

  // Capture total page load time once (measured 1 second after mount to
  // allow resources to finish loading before sampling).
  useEffect(() => {
    const t = setTimeout(() => {
      setMetrics(m => ({ ...m, pageLoadMs: Date.now() - pageLoadStart.current }));
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  /**
   * Track real data usage via PerformanceResourceTiming.
   *
   * The browser exposes a PerformanceResourceTiming entry for every network
   * request (scripts, stylesheets, images, API calls). Each entry has a
   * transferSize field showing actual compressed bytes sent over the wire.
   *
   * A PerformanceObserver watches for new entries in real time, while the
   * initial scan picks up resources loaded before this effect ran.
   * A seenEntries Set prevents any entry from being counted twice.
   */
  useEffect(() => {
    const accumulateEntries = (entries) => {
      let addedBytes = 0;
      let addedCount = 0;
      for (const entry of entries) {
        const key = `${entry.name}|${entry.startTime}`;
        if (seenEntries.current.has(key)) continue;
        seenEntries.current.add(key);
        if (entry.transferSize > 0) {
          addedBytes += entry.transferSize;
          addedCount++;
        }
      }
      if (addedBytes > 0) {
        dataUsageRef.current += addedBytes;
        setMetrics(m => ({
          ...m,
          dataUsage: dataUsageRef.current,
          requestCount: m.requestCount + addedCount,
        }));
      }
    };

    // Pick up resources already loaded before this effect ran
    if (window.performance?.getEntriesByType) {
      accumulateEntries(performance.getEntriesByType('resource'));
    }

    if (!window.PerformanceObserver) return;
    const observer = new PerformanceObserver((list) => accumulateEntries(list.getEntries()));
    try { observer.observe({ entryTypes: ['resource'] }); } catch {}
    return () => observer.disconnect();
  }, []);

  // Derive the currently active values from simulation or real connection
  const activeEffectiveType = simulatedType ? SIMULATED_PROFILES[simulatedType]?.effectiveType : realConnection.effectiveType;
  const activeMode = userOverride || computeMode(activeEffectiveType || '4g');
  const activeProfile = simulatedType ? SIMULATED_PROFILES[simulatedType] : realConnection;

  // trackRequest is a manual fallback for components that load content outside
  // the PerformanceResourceTiming scope (e.g. lazy-rendered images).
  const trackRequest = useCallback((bytes = 50000) => {
    dataUsageRef.current += bytes;
    setMetrics(m => ({
      ...m,
      requestCount: m.requestCount + 1,
      dataUsage: dataUsageRef.current
    }));
  }, []);

  // simulateNetwork sets a fixed network type, overriding real detection
  const simulateNetwork = (type) => {
    setSimulatedType(type);
    setUserOverride(null);
  };

  // overrideMode toggles a manual mode; calling it again with the same value reverts
  const overrideMode = (mode) => setUserOverride(mode === userOverride ? null : mode);

  const formatDataUsage = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Human-readable labels and descriptions for each adaptive mode
  const modeConfig = {
    full:   { label: 'Full Mode',   color: 'green', desc: 'All content, high quality' },
    medium: { label: 'Medium Mode', color: 'yellow', desc: 'Compressed assets, moderate' },
    lite:   { label: 'Lite Mode',   color: 'red',   desc: 'Text only, minimal data' },
  };

  return (
    <NetworkContext.Provider value={{
      realConnection, simulatedType, activeMode, activeEffectiveType,
      activeProfile, userOverride, metrics, showDashboard,
      setShowDashboard, simulateNetwork, overrideMode, trackRequest,
      formatDataUsage, modeConfig
    }}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
};

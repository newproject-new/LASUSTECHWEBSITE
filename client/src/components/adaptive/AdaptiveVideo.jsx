import React, { useState } from 'react';
import { useNetwork } from '../../contexts/NetworkContext';

export default function AdaptiveVideo({ videoUrl, title, thumbnail }) {
  const { activeMode } = useNetwork();
  const [showVideo, setShowVideo] = useState(false);

  if (activeMode === 'lite') {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Video unavailable</div>
          <div className="text-xs text-gray-500">Switch to Medium or Full mode to view this video</div>
        </div>
        <span className="ml-auto badge badge-red text-xs">Lite Mode</span>
      </div>
    );
  }

  if (activeMode === 'medium' && !showVideo) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-900 cursor-pointer group" onClick={() => setShowVideo(true)}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-48 object-cover opacity-70" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-40" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-brand-800 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
            </svg>
          </div>
          <div className="text-white text-sm font-medium">Click to load video</div>
        </div>
        <div className="absolute top-2 right-2 badge bg-yellow-500 text-white text-xs">3G Mode — Click to load</div>
      </div>
    );
  }

  if (!videoUrl) return null;

  return (
    <div className="rounded-xl overflow-hidden bg-black aspect-video">
      <iframe
        src={videoUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

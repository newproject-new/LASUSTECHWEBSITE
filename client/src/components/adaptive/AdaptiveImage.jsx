import React, { useState } from 'react';
import { useNetwork } from '../../contexts/NetworkContext';

const COURSE_GRADIENTS = [
  ['#1e3a5f', '#2563eb'],
  ['#3b0764', '#7c3aed'],
  ['#064e3b', '#059669'],
  ['#7f1d1d', '#b91c1c'],
  ['#1e3a5f', '#0891b2'],
  ['#431407', '#c2410c'],
  ['#1a2e05', '#4d7c0f'],
  ['#1e1b4b', '#4338ca'],
  ['#0c4a6e', '#0284c7'],
  ['#134e4a', '#0f766e'],
];

function pickGradient(seed = '') {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return COURSE_GRADIENTS[Math.abs(hash) % COURSE_GRADIENTS.length];
}

function CoursePlaceholder({ alt, seed, className }) {
  const [from, to] = pickGradient(seed || alt || '');
  const code = seed || '';
  const title = alt || '';

  return (
    <div
      className={`${className} flex flex-col items-center justify-center relative overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.1) 0,rgba(255,255,255,.1) 1px,transparent 0,transparent 50%)', backgroundSize: '12px 12px' }} />
      <div className="relative z-10 text-center px-4 max-w-full">
        {code && (
          <div className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">{code}</div>
        )}
        <div
          className="font-bold text-white leading-tight"
          style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1rem)', wordBreak: 'break-word', textShadow: '0 1px 3px rgba(0,0,0,0.4)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

export default function AdaptiveImage({ src, alt, className = '', seed, width = 800, height = 400 }) {
  const { activeMode, trackRequest } = useNetwork();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (activeMode === 'lite') {
    return <CoursePlaceholder alt={alt} seed={seed} className={className} />;
  }

  const isPlaceholder = !src || src === null || src === '' || src.includes('picsum.photos');

  if (isPlaceholder || error) {
    return <CoursePlaceholder alt={alt} seed={seed} className={className} />;
  }

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0">
          <CoursePlaceholder alt={alt} seed={seed} className="w-full h-full" />
        </div>
      )}
      <picture>
        {src && !isPlaceholder && (
          <source 
            srcSet={src.replace(/\.(jpe?g|png)$/i, '.webp')} 
            type="image/webp" 
          />
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => { setLoaded(true); trackRequest(activeMode === 'medium' ? 30000 : 80000); }}
          onError={() => setError(true)}
        />
      </picture>
    </div>
  );
}

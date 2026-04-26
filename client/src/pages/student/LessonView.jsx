import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';
import AdaptiveImage from '../../components/adaptive/AdaptiveImage';
import AdaptiveVideo from '../../components/adaptive/AdaptiveVideo';
import toast from 'react-hot-toast';

function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^```[\w]*\n([\s\S]*?)```$/gm, '<pre>$1</pre>')
    .replace(/^\| (.+)$/gm, (match) => {
      const cells = match.slice(2).split(' | ');
      const isHeader = match.includes('---');
      if (isHeader) return '';
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    })
    .replace(/(<tr>[\s\S]*?<\/tr>)/g, '<table>$1</table>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|u|p|l|t|c|p])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>');
}

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const { activeMode } = useNetwork();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('base');
  const [completed, setCompleted] = useState(false);
  const markedRef = React.useRef(false);

  useEffect(() => {
    api.get(`/lessons/${lessonId}`)
      .then(r => setLesson(r.data))
      .catch(() => toast.error('Failed to load lesson'))
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Mark lesson complete after 10 seconds of viewing
  useEffect(() => {
    if (!lesson || markedRef.current) return;
    const timer = setTimeout(() => {
      if (markedRef.current) return;
      markedRef.current = true;
      api.post(`/progress/lessons/${lessonId}/complete`)
        .then(() => setCompleted(true))
        .catch(() => {});
    }, 10000);
    return () => clearTimeout(timer);
  }, [lesson, lessonId]);

  const handleDownload = (material) => {
    if (material.url && material.url !== '#') {
      const a = document.createElement('a');
      a.href = material.url;
      a.download = material.name;
      a.click();
    } else {
      toast('No file uploaded yet — lecturer listed this material by name only.');
    }
  };

  const fontSizes = { sm: 'text-sm', base: 'text-base', lg: 'text-lg' };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;
  if (!lesson) return <div className="card p-8 text-center text-gray-500">Lesson not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link to={`/student/courses/${courseId}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
          ← {lesson.courseName}
        </Link>
        <div className="flex gap-2 text-xs text-gray-500">
          <span className="badge badge-gray">{lesson.duration} min</span>
          {activeMode !== 'lite' && <span className="badge badge-blue capitalize">{lesson.type}</span>}
        </div>
      </div>

      {/* Header */}
      <div className="card p-6">
        <div className="flex items-start gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900 flex-1">{lesson.title}</h1>
          {completed && <span className="badge badge-green text-xs flex-shrink-0">✓ Completed</span>}
        </div>
        {activeMode !== 'lite' && lesson.imageUrl && (
          <AdaptiveImage src={lesson.imageUrl} alt={lesson.title} seed={lesson.id} className="w-full h-48 rounded-xl mt-4" />
        )}
      </div>

      {/* Video */}
      {lesson.videoUrl && (
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📹 Lecture Video</h3>
          <AdaptiveVideo videoUrl={lesson.videoUrl} title={lesson.title} />
        </div>
      )}

      {/* Content controls */}
      {activeMode !== 'lite' && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-gray-500">Font size:</span>
          <div className="flex gap-1">
            {Object.entries({ sm: 'A-', base: 'A', lg: 'A+' }).map(([sz, label]) => (
              <button key={sz} onClick={() => setFontSize(sz)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${fontSize === sz ? 'bg-brand-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={`card p-6 lg:p-8 ${fontSizes[fontSize]}`}>
        {activeMode === 'lite' ? (
          <div className="prose-content">
            <p className="text-xs badge badge-red mb-4">Lite Mode: Basic text rendering</p>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">{lesson.content?.replace(/[#*`_]/g, '').replace(/```[\w]*\n([\s\S]*?)```/g, '$1')}</div>
          </div>
        ) : (
          <div className="prose-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(lesson.content) }} />
        )}
      </div>

      {/* Materials */}
      {lesson.materials?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">📎 Downloadable Materials</h3>
          <div className="space-y-2">
            {lesson.materials.map((mat, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-brand-700">📄</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{mat.name}</div>
                    <div className="text-xs text-gray-500">{mat.size}</div>
                  </div>
                </div>
                <button onClick={() => handleDownload(mat)} className="btn-secondary text-xs py-1.5 px-3">
                  {activeMode === 'lite' ? 'DL' : '↓ Download'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prev/Next */}
      <div className="flex gap-4">
        {lesson.prev ? (
          <Link to={`/student/courses/${courseId}/lessons/${lesson.prev.id}`} className="card flex-1 p-4 hover:bg-gray-50 transition-colors">
            <div className="text-xs text-gray-500 mb-1">← Previous</div>
            <div className="text-sm font-medium text-gray-900 truncate">{lesson.prev.title}</div>
          </Link>
        ) : <div className="flex-1" />}
        {lesson.next ? (
          <Link to={`/student/courses/${courseId}/lessons/${lesson.next.id}`} className="card flex-1 p-4 text-right hover:bg-gray-50 transition-colors">
            <div className="text-xs text-gray-500 mb-1">Next →</div>
            <div className="text-sm font-medium text-gray-900 truncate">{lesson.next.title}</div>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  );
}

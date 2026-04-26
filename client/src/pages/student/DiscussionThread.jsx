import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';

function Avatar({ name, role, size = 'sm' }) {
  const bg = role === 'lecturer' ? 'bg-brand-800' : role === 'admin' ? 'bg-red-700' : 'bg-green-700';
  const sz = size === 'lg' ? 'w-10 h-10 text-base' : 'w-8 h-8 text-sm';
  return (
    <div className={`${sz} ${bg} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.charAt(0)}
    </div>
  );
}

export default function DiscussionThread() {
  const { courseId, threadId } = useParams();
  const { user } = useAuth();
  const { activeMode } = useNetwork();
  const [discussion, setDiscussion] = useState(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const replyRef = useRef(null);
  const basePath = user?.role === 'lecturer' ? '/lecturer' : '/student';

  useEffect(() => {
    api.get(`/discussions/${threadId}`).then(r => setDiscussion(r.data)).catch(() => toast.error('Failed to load thread')).finally(() => setLoading(false));
  }, [threadId]);

  const postReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/discussions/${threadId}/replies`, { content: reply });
      setDiscussion(d => ({ ...d, replies: [...(d.replies || []), res.data] }));
      setReply('');
      toast.success('Reply posted!');
    } catch {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;
  if (!discussion) return <div className="card p-8 text-center text-gray-500">Thread not found.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to={`${basePath}/discussions/${courseId}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        ← Back to Discussions
      </Link>

      {/* Original post */}
      <div className="card p-6">
        <div className="flex items-start gap-3">
          <Avatar name={discussion.authorName} role={discussion.authorRole} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-gray-900">{discussion.authorName}</span>
              {discussion.authorRole === 'lecturer' && <span className="badge badge-blue text-xs">Instructor</span>}
              {discussion.pinned && <span className="badge badge-red text-xs">Pinned</span>}
              <span className="text-xs text-gray-400">{format(parseISO(discussion.createdAt), 'MMM d, yyyy h:mm a')}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-3">{discussion.title}</h1>
            <div className="prose-content text-sm">
              <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{discussion.content}</p>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
              <span>{discussion.views} views</span>
              <span>·</span>
              <span>{discussion.replies?.length || 0} replies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      {discussion.replies?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">{discussion.replies.length} {discussion.replies.length === 1 ? 'Reply' : 'Replies'}</h3>
          {discussion.replies.map(r => (
            <div key={r.id} className={`card p-5 ${r.isInstructor ? 'border-l-4 border-l-brand-800 bg-brand-50' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar name={r.authorName} role={r.authorRole} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-sm text-gray-900">{r.authorName}</span>
                    {r.isInstructor && <span className="badge badge-blue text-xs">Instructor Response</span>}
                    <span className="text-xs text-gray-400">{format(parseISO(r.createdAt), 'MMM d, h:mm a')}</span>
                  </div>
                  {activeMode === 'lite' ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.content.replace(/```[\w]*\n([\s\S]*?)```/g, '$1')}</p>
                  ) : (
                    <div className="text-sm text-gray-700 prose-content whitespace-pre-wrap">{r.content}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply form */}
      <div className="card p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Post a Reply</h3>
        <form onSubmit={postReply} className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar name={user?.name} role={user?.role} />
            <textarea
              ref={replyRef}
              value={reply}
              onChange={e => setReply(e.target.value)}
              rows={4}
              className="form-input flex-1 resize-none"
              placeholder="Share your thoughts, answer, or question..."
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting || !reply.trim()} className="btn-primary">
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

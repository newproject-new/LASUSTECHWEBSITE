import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';

const SAMPLE_COURSES = [
  { id: 'sc1', code: 'CSC 301', title: 'Data Structures and Algorithms', isEnrolled: true },
  { id: 'sc2', code: 'MTH 201', title: 'Calculus and Linear Algebra',    isEnrolled: true },
  { id: 'sc3', code: 'CSC 201', title: 'Object-Oriented Programming',    isEnrolled: true },
  { id: 'sc4', code: 'PHY 211', title: 'Physics for Engineers',          isEnrolled: true },
  { id: 'sc5', code: 'CSC 401', title: 'Computer Networks',              isEnrolled: true },
];

const SAMPLE_DISCUSSIONS_MAP = {
  sc1: [
    { id: 'sd1',  title: 'Welcome to CSC 301 Discussion Forum',        content: 'Welcome to Data Structures and Algorithms! Use this forum to ask questions, share resources, and collaborate with classmates. Please be respectful and constructive in all interactions.', authorName: 'Prof. Abdul-basit', authorRole: 'lecturer', replyCount: 5, views: 156, createdAt: '2026-04-10T09:00:00.000Z', pinned: true },
    { id: 'sd2',  title: 'Help needed: BST delete operation',           content: "I'm struggling with the three cases for deleting a node in a BST — especially when the node has two children. Can someone walk me through the successor/predecessor approach?", authorName: 'Oladele, John', authorRole: 'student', replyCount: 3, views: 42, createdAt: '2026-04-20T14:30:00.000Z' },
    { id: 'sd3',  title: 'Time Complexity — Assignment 2 clarification', content: 'For Assignment 2, does the Big-O analysis need to cover all three cases (best, average, worst) for each algorithm, or just worst-case? The brief is not entirely clear.', authorName: 'Adamu, Sarah', authorRole: 'student', replyCount: 1, views: 28, createdAt: '2026-04-25T11:15:00.000Z' },
    { id: 'sd4',  title: 'Recommended resources for graph algorithms',  content: "I found two great resources for understanding Dijkstra's and BFS/DFS: MIT OpenCourseWare 6.006 lectures and Visualgo.net. Both are free and highly visual. Sharing here for everyone.", authorName: 'Eze, Michael', authorRole: 'student', replyCount: 2, views: 54, createdAt: '2026-04-22T16:00:00.000Z' },
  ],
  sc2: [
    { id: 'sd5',  title: 'Chain Rule Application Examples',             content: 'Can someone provide more worked examples of the chain rule applied to composite functions? The textbook examples are straightforward but the assignment problems are considerably more complex.', authorName: 'Yusuf, Fatima', authorRole: 'student', replyCount: 2, views: 35, createdAt: '2026-04-22T10:00:00.000Z' },
    { id: 'sd6',  title: 'Matrix multiplication — row vs column order', content: 'Quick question: does the order matter in matrix multiplication? I know AB ≠ BA in general, but when does commutativity hold? Looking for clear examples.', authorName: 'Ibrahim, Amina', authorRole: 'student', replyCount: 1, views: 27, createdAt: '2026-04-21T09:30:00.000Z' },
    { id: 'sd7',  title: 'Problem Set 1 — Question 17 approach',        content: "For Q17 on the first problem set, I'm getting a different answer using implicit differentiation vs the explicit form. Is there a trick I'm missing with ln(y)?", authorName: 'Fashola, Tunde', authorRole: 'student', replyCount: 0, views: 19, createdAt: '2026-04-24T18:00:00.000Z' },
  ],
  sc3: [
    { id: 'sd8',  title: 'OOP Project Guidelines — Updated Announcement', content: 'The Library Management System project rubric has been updated. Key changes: (1) UML diagram is now mandatory, (2) minimum 5 classes required, (3) unit tests worth 20 marks. Please download the updated rubric from the course page.', authorName: 'Prof. Abdul-basit', authorRole: 'lecturer', replyCount: 4, views: 89, createdAt: '2026-04-20T08:00:00.000Z', pinned: true },
    { id: 'sd9',  title: 'Abstract class vs interface — practical guidance', content: 'I understand that both abstract classes and interfaces define contracts, but when should I choose one over the other in Java? Looking for practical guidance beyond the textbook definition.', authorName: 'Obi, Chukwuemeka', authorRole: 'student', replyCount: 2, views: 47, createdAt: '2026-04-23T13:00:00.000Z' },
    { id: 'sd10', title: 'Design Patterns — Singleton thread safety',   content: 'For the design patterns assignment, do we need to implement a thread-safe Singleton? The brief says "production-quality" but does not specify concurrency requirements explicitly.', authorName: 'Adamu, Sarah', authorRole: 'student', replyCount: 1, views: 22, createdAt: '2026-04-24T10:30:00.000Z' },
  ],
  sc4: [
    { id: 'sd11', title: 'Physics Lab Safety and Equipment Guidelines', content: 'All students must complete the lab safety induction before the first practical session on May 5th. Equipment sign-out forms are available at the lab office. Closed-toe shoes are mandatory in the lab.', authorName: 'Prof. Abdul-basit', authorRole: 'lecturer', replyCount: 2, views: 45, createdAt: '2026-04-18T09:00:00.000Z', pinned: true },
    { id: 'sd12', title: 'Projectile motion — air resistance in lab report', content: 'For the lab report, should we include air resistance in our theoretical model or assume vacuum conditions? Our calculated range is about 8% off the measured value and I want to address this correctly.', authorName: 'Yusuf, Fatima', authorRole: 'student', replyCount: 1, views: 33, createdAt: '2026-04-23T15:00:00.000Z' },
  ],
  sc5: [
    { id: 'sd13', title: 'Wireshark: No interfaces found on Windows 11', content: "I'm getting a 'No interfaces found' error in Wireshark on Windows 11. I've installed Npcap but it still doesn't detect my network adapter. Has anyone resolved this?", authorName: 'Fashola, Tunde', authorRole: 'student', replyCount: 3, views: 19, createdAt: '2026-04-23T20:00:00.000Z' },
    { id: 'sd14', title: 'Assignment clarification: which protocols to analyse', content: "The assignment says 'identify 5 different protocols'. Can we include application-layer protocols like HTTP/2 and QUIC, or should we stick to the traditional OSI-layer protocols covered in lectures?", authorName: 'Eze, Michael', authorRole: 'student', replyCount: 1, views: 26, createdAt: '2026-04-24T11:00:00.000Z' },
    { id: 'sd15', title: 'TCP three-way handshake — visual explanation resource', content: "I found a great interactive tool for visualising the TCP handshake and connection teardown at tcpipguide.com. It really helped me understand the SYN-SYN/ACK-ACK sequence clearly. Sharing in case it helps others.", authorName: 'Ibrahim, Amina', authorRole: 'student', replyCount: 0, views: 41, createdAt: '2026-04-20T14:00:00.000Z' },
  ],
};

export default function Discussions() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { activeMode } = useNetwork();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [activeCourse, setActiveCourse] = useState(courseId || null);
  const [loading, setLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get('/courses').then(r => {
      const enrolled = r.data.filter(c => c.isEnrolled || user?.role === 'lecturer');
      const finalCourses = enrolled.length > 0 ? enrolled : SAMPLE_COURSES;
      setCourses(finalCourses);
      if (!activeCourse && finalCourses.length > 0) setActiveCourse(finalCourses[0].id);
    }).catch(() => {
      setCourses(SAMPLE_COURSES);
      if (!activeCourse) setActiveCourse(SAMPLE_COURSES[0].id);
    });
  }, []);

  useEffect(() => {
    if (!activeCourse) return;
    // Use sample discussions for sample course IDs without an API call
    if (SAMPLE_DISCUSSIONS_MAP[activeCourse]) {
      setDiscussions(SAMPLE_DISCUSSIONS_MAP[activeCourse]);
      return;
    }
    setLoading(true);
    api.get(`/discussions/course/${activeCourse}`)
      .then(r => setDiscussions(r.data.length > 0 ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeCourse]);

  const createPost = async (e) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) return toast.error('Title and content required');
    try {
      const res = await api.post('/discussions', { courseId: activeCourse, ...newPost });
      const author = { authorName: user.name, authorRole: user.role, replyCount: 0 };
      setDiscussions(prev => [{ ...res.data, ...author }, ...prev]);
      setNewPost({ title: '', content: '' });
      setShowForm(false);
      toast.success('Discussion posted!');
    } catch {
      toast.error('Failed to post discussion');
    }
  };

  const activeCourseObj = courses.find(c => c.id === activeCourse);
  const basePath = user?.role === 'lecturer' ? '/lecturer' : '/student';

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discussions</h1>
          <p className="text-gray-500 text-sm mt-0.5">Course discussion forums</p>
        </div>
        {activeCourse && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : '+ New Post'}
          </button>
        )}
      </div>

      {/* Course selector */}
      <div className="flex flex-wrap gap-2">
        {courses.map(c => (
          <button key={c.id} onClick={() => { setActiveCourse(c.id); navigate(`${basePath}/discussions/${c.id}`); }}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${activeCourse === c.id ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
            {c.code}
          </button>
        ))}
      </div>

      {/* New post form */}
      {showForm && (
        <div className="card p-5">
          <h3 className="font-bold text-gray-900 mb-4">Start a New Discussion</h3>
          <form onSubmit={createPost} className="space-y-3">
            <div>
              <label className="form-label">Topic / Title</label>
              <input type="text" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} required className="form-input" placeholder="e.g., Help needed with BST implementation" />
            </div>
            <div>
              <label className="form-label">Message</label>
              <textarea value={newPost.content} onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))} required rows={5} className="form-input resize-none" placeholder="Describe your question or topic in detail..." />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Post Discussion</button>
            </div>
          </form>
        </div>
      )}

      {/* Discussions list */}
      {!activeCourse ? (
        <div className="card p-8 text-center text-gray-500">Select a course to view discussions.</div>
      ) : loading ? (
        <div className="flex items-center justify-center h-32"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-800"></div></div>
      ) : discussions.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">
          <p className="font-medium">No discussions yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map(d => (
            <Link key={d.id} to={`${basePath}/discussions/${activeCourse}/thread/${d.id}`}
              className="card p-5 hover:shadow-md transition-shadow block">
              <div className="flex items-start gap-3">
                {d.pinned && <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></span>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {d.pinned && <span className="badge badge-red text-xs">Pinned</span>}
                    {d.authorRole === 'lecturer' && <span className="badge badge-blue text-xs">Instructor</span>}
                    <h3 className="font-semibold text-gray-900">{d.title}</h3>
                  </div>
                  {activeMode !== 'lite' && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{d.content}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{d.authorName}</span>
                    <span>·</span>
                    <span>{format(parseISO(d.createdAt), 'MMM d, h:mm a')}</span>
                    <span>·</span>
                    <span>{d.replyCount} replies</span>
                    <span>·</span>
                    <span>{d.views} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

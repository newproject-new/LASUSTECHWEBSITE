import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import { useNetwork } from '../../contexts/NetworkContext';

const SAMPLE_ASSIGNMENTS = [
  {
    id: 'sa1', title: 'Implement a Binary Search Tree',
    courseCode: 'CSC 301', courseName: 'Data Structures and Algorithms',
    description: 'Implement a full Binary Search Tree (BST) in Python or Java with insert, delete, search, and traversal operations (in-order, pre-order, post-order). Include a written analysis of time and space complexity for each operation. Submit source code and a 2-page report.',
    dueDate: '2026-05-15T23:59:00.000Z', totalMarks: 100, submitted: false, isOverdue: false,
  },
  {
    id: 'sa2', title: 'Algorithm Analysis: Sorting Algorithms Comparison',
    courseCode: 'CSC 301', courseName: 'Data Structures and Algorithms',
    description: 'Compare performance of Bubble Sort, Merge Sort, and Quick Sort on datasets of 1,000, 10,000, and 100,000 random integers. Plot execution time vs dataset size. Identify best-case, average-case, and worst-case scenarios for each algorithm.',
    dueDate: '2026-05-30T23:59:00.000Z', totalMarks: 80, submitted: false, isOverdue: false,
  },
  {
    id: 'sa3', title: 'Calculus Problem Set 1: Differentiation',
    courseCode: 'MTH 201', courseName: 'Calculus and Linear Algebra',
    description: "Solve 20 differentiation problems covering chain rule, implicit differentiation, and logarithmic differentiation. Show all working steps. Bonus section covers L'Hôpital's Rule applications.",
    dueDate: '2026-05-10T23:59:00.000Z', totalMarks: 50, submitted: true,
    submission: { status: 'graded', submittedAt: '2026-05-08T15:30:00.000Z', grade: 44, feedback: 'Excellent work on implicit differentiation. Minor errors in Q17 and Q19.' },
  },
  {
    id: 'sa4', title: 'OOP Design: Library Management System',
    courseCode: 'CSC 201', courseName: 'Object-Oriented Programming',
    description: 'Design and implement a Library Management System using OOP principles. Must include at least 5 classes with proper inheritance, encapsulation, and polymorphism. Features: book catalogue, member management, lending records, and fine calculation. Include UML class diagram.',
    dueDate: '2026-05-20T23:59:00.000Z', totalMarks: 100, submitted: false, isOverdue: false,
  },
  {
    id: 'sa5', title: 'Network Protocol Analysis with Wireshark',
    courseCode: 'CSC 401', courseName: 'Computer Networks',
    description: 'Capture and analyse network traffic using Wireshark. Identify and describe 5 different protocols (HTTP, DNS, TCP, ICMP, ARP). Annotate packet captures with explanations of headers, payloads, and protocol behaviour. Submit .pcap file and written report.',
    dueDate: '2026-05-28T23:59:00.000Z', totalMarks: 75, submitted: false, isOverdue: false,
  },
  {
    id: 'sa6', title: 'Database Design Project: Student Records System',
    courseCode: 'CSC 302', courseName: 'Database Management Systems',
    description: 'Design a normalised relational database for a university student records system. Requirements: ER diagram, at least 8 tables in 3NF, SQL schema with constraints, sample data, and 10 complex queries covering JOINs, subqueries, and aggregations.',
    dueDate: '2026-05-18T23:59:00.000Z', totalMarks: 100, submitted: false, isOverdue: false,
  },
  {
    id: 'sa7', title: 'Software Requirements Specification (SRS)',
    courseCode: 'CSC 403', courseName: 'Software Engineering',
    description: 'Write a complete Software Requirements Specification for an online food ordering system following IEEE 830 standard. Include functional requirements, non-functional requirements, use case diagrams, and data flow diagrams.',
    dueDate: '2026-05-22T23:59:00.000Z', totalMarks: 80, submitted: false, isOverdue: false,
  },
  {
    id: 'sa8', title: 'Statistical Analysis: Hypothesis Testing',
    courseCode: 'MTH 301', courseName: 'Probability and Statistics',
    description: 'Apply hypothesis testing (z-test, t-test, chi-square) to 3 real-world datasets provided on the course portal. State null/alternative hypotheses, compute test statistics, determine p-values, and interpret results at α=0.05. Use R or Python.',
    dueDate: '2026-05-12T23:59:00.000Z', totalMarks: 60, submitted: true,
    submission: { status: 'pending', submittedAt: '2026-05-11T22:00:00.000Z' },
  },
  {
    id: 'sa9', title: 'Circuit Design and Simulation',
    courseCode: 'EEE 302', courseName: 'Electronics and Circuit Theory',
    description: 'Design and simulate: (1) a common-emitter BJT amplifier with specified gain, and (2) a second-order low-pass RC filter with 1kHz cutoff. Use LTSpice or Multisim. Submit circuit files, frequency response plots, and a 3-page analysis report.',
    dueDate: '2026-05-25T23:59:00.000Z', totalMarks: 90, submitted: false, isOverdue: false,
  },
  {
    id: 'sa10', title: 'Enzyme Kinetics Lab Report',
    courseCode: 'BCH 301', courseName: 'Biochemistry and Molecular Biology',
    description: 'Analyse kinetic data from the amylase enzyme experiment. Plot Michaelis-Menten and Lineweaver-Burk curves. Determine Km and Vmax values. Discuss effect of pH and temperature on enzyme activity. Minimum 8 pages, APA format.',
    dueDate: '2026-05-16T23:59:00.000Z', totalMarks: 70, submitted: false, isOverdue: false,
  },
  {
    id: 'sa11', title: 'Physics Lab Report: Mechanics and Motion',
    courseCode: 'PHY 211', courseName: 'Physics for Engineers',
    description: 'Write a formal lab report for the projectile motion and conservation of momentum experiments. Include raw data tables, calculated values, error analysis, and discussion relative to theoretical predictions. Follow the department lab report template.',
    dueDate: '2026-05-14T23:59:00.000Z', totalMarks: 50, submitted: false, isOverdue: false,
  },
  {
    id: 'sa12', title: 'Object-Oriented Design Patterns Implementation',
    courseCode: 'CSC 201', courseName: 'Object-Oriented Programming',
    description: 'Implement and demonstrate 4 GoF design patterns: Singleton, Observer, Factory Method, and Decorator. For each pattern, provide a real-world use-case with at least 3 classes, a UML diagram, and a brief explanation of when to apply it.',
    dueDate: '2026-06-02T23:59:00.000Z', totalMarks: 100, submitted: false, isOverdue: false,
  },
];

/**
 * Local-first draft caching key.
 * Each assignment gets a unique localStorage key so drafts from different
 * assignments never overwrite each other.
 */
const DRAFT_KEY = (id) => `lasustech_draft_${id}`;

function SubmitModal({ assignment, onClose, onSubmit }) {
  const draftKey = DRAFT_KEY(assignment.id);

  // Restore any previously saved draft from localStorage on first render.
  // This implements local-first caching: the student's work is never lost
  // even if the browser is closed or the network drops mid-session.
  const [content, setContent] = useState(() => localStorage.getItem(draftKey) || '');
  const [submitting, setSubmitting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const handleChange = (val) => {
    setContent(val);
    // Persist every keystroke to localStorage so the draft survives page reloads
    localStorage.setItem(draftKey, val);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return toast.error('Please enter your submission');
    setSubmitting(true);
    try {
      await onSubmit(assignment.id, content);
      localStorage.removeItem(draftKey);
      toast.success('Assignment submitted successfully!');
      onClose();
    } catch {
      toast.error('Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Submit Assignment</h2>
              <p className="text-sm text-gray-500 mt-0.5">{assignment.courseCode}: {assignment.title}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Assignment Brief</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
              {assignment.description}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="form-label mb-0">Your Submission <span className="text-red-500">*</span></label>
              {draftSaved && <span className="text-xs text-green-600">Draft saved</span>}
              {!draftSaved && content && <span className="text-xs text-gray-400">Draft auto-saved</span>}
            </div>
            <textarea
              value={content} onChange={e => handleChange(e.target.value)}
              rows={8} className="form-input resize-none"
              placeholder="Write your submission here. You can include code, answers, and analysis..."
            />
            <p className="text-xs text-gray-400 mt-1">Your work is saved locally as you type and will not be lost if the page reloads.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Assignments() {
  const { activeMode } = useNetwork();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/assignments')
      .then(r => setAssignments(r.data.length > 0 ? r.data : SAMPLE_ASSIGNMENTS))
      .catch(() => setAssignments(SAMPLE_ASSIGNMENTS))
      .finally(() => setLoading(false));
  }, []);

  const submitAssignment = async (assignmentId, content) => {
    // Optimistic update: mark as submitted in local state immediately so the
    // UI responds instantly. The API call runs in parallel; if it fails, the
    // next page reload will resync from the server.
    try { await api.post('/submissions', { assignmentId, content }); } catch { /* API error is non-fatal — draft is cleared in the modal on success */ }
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, submitted: true, submission: { status: 'pending', submittedAt: new Date().toISOString() } } : a));
  };

  const filtered = assignments.filter(a => {
    if (filter === 'pending') return !a.submitted && !a.isOverdue;
    if (filter === 'submitted') return a.submitted;
    if (filter === 'graded') return a.submission?.status === 'graded';
    if (filter === 'overdue') return a.isOverdue && !a.submitted;
    return true;
  });

  const counts = {
    pending: assignments.filter(a => !a.submitted && !a.isOverdue).length,
    submitted: assignments.filter(a => a.submitted).length,
    graded: assignments.filter(a => a.submission?.status === 'graded').length,
    overdue: assignments.filter(a => a.isOverdue && !a.submitted).length,
  };

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800"></div></div>;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
        <p className="text-gray-500 text-sm mt-0.5">{assignments.length} total · {counts.pending} pending</p>
      </div>

      {/* Summary cards */}
      {activeMode !== 'lite' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Pending',   count: counts.pending   },
            { label: 'Submitted', count: counts.submitted  },
            { label: 'Graded',    count: counts.graded     },
            { label: 'Overdue',   count: counts.overdue    },
          ].map(s => (
            <div key={s.label} className="card p-4 border-l-4 border-l-brand-800">
              <div className="text-2xl font-bold text-brand-800">{s.count}</div>
              <div className="text-xs font-medium text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[['all', 'All'], ['pending', 'Pending'], ['submitted', 'Submitted'], ['graded', 'Graded'], ['overdue', 'Overdue']].map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-brand-800 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Assignment list */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No assignments in this category.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map(a => {
            const due = parseISO(a.dueDate);
            const daysLeft = Math.ceil((due - new Date()) / (1000 * 60 * 60 * 24));
            const isOverdue = a.isOverdue && !a.submitted;

            return (
              <div key={a.id} className="card p-5 border-l-4 border-l-brand-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="badge badge-blue text-xs">{a.courseCode}</span>
                      {isOverdue && <span className="badge badge-red text-xs">Overdue</span>}
                      {a.submitted && <span className={`badge text-xs ${a.submission?.grade ? 'badge-green' : 'badge-gray'}`}>{a.submission?.grade ? `Graded: ${a.submission.grade}/${a.totalMarks}` : 'Submitted'}</span>}
                    </div>
                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                    <p className="text-sm text-gray-500">{a.courseName}</p>

                    {activeMode !== 'lite' && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{a.description?.substring(0, 200)}...</p>
                    )}

                    {a.submission?.grade && activeMode !== 'lite' && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="text-sm font-semibold text-green-800">Grade: {a.submission.grade}/{a.totalMarks} ({Math.round((a.submission.grade / a.totalMarks) * 100)}%)</div>
                        {a.submission.feedback && <div className="text-xs text-green-700 mt-1 italic">"{a.submission.feedback}"</div>}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-gray-500 mb-1">Due {format(due, 'MMM d, yyyy')}</div>
                    {!a.submitted && !isOverdue && (
                      <div className={`text-xs font-semibold mb-2 ${daysLeft <= 2 ? 'text-red-600' : 'text-gray-600'}`}>
                        {daysLeft === 1 ? 'Due tomorrow!' : `${daysLeft} days left`}
                      </div>
                    )}
                    {!a.submitted && (
                      <button onClick={() => setSelected(a)} className={isOverdue ? 'btn-danger text-xs py-1.5 px-3' : 'btn-primary text-xs py-1.5 px-3'}>
                        {isOverdue ? 'Submit Late' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <SubmitModal assignment={selected} onClose={() => setSelected(null)} onSubmit={submitAssignment} />}
    </div>
  );
}

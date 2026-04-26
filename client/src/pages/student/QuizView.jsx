import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useNetwork } from '../../contexts/NetworkContext';
import toast from 'react-hot-toast';

function TimerBar({ totalSeconds, onExpire }) {
  const [left, setLeft] = useState(totalSeconds);
  useEffect(() => {
    if (left <= 0) { onExpire(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onExpire]);
  const pct = (left / totalSeconds) * 100;
  const mins = String(Math.floor(left / 60)).padStart(2, '0');
  const secs = String(left % 60).padStart(2, '0');
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Time remaining</span>
        <span className={`font-mono font-bold ${pct <= 20 ? 'text-red-600' : 'text-gray-700'}`}>{mins}:{secs}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ResultView({ quiz, attempt, onReturnToCourse }) {
  const passed = attempt.percentage >= 50;
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`card p-8 text-center border-2 ${passed ? 'border-green-400' : 'border-red-400'}`}>
        <div className={`text-5xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {attempt.percentage}%
        </div>
        <div className="text-lg font-semibold text-gray-800">{passed ? 'Well done!' : 'Keep practising'}</div>
        <div className="text-sm text-gray-500 mt-1">
          {attempt.score} out of {attempt.total} correct
        </div>
      </div>

      <div className="card p-5 space-y-4">
        <h3 className="font-bold text-gray-900 text-sm">Question Breakdown</h3>
        {quiz.questions.map((q, i) => {
          const bd = attempt.breakdown?.[i];
          const correct = bd?.correct;
          return (
            <div key={q.id} className={`rounded-xl border p-4 ${correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-start gap-2 mb-2">
                <span className={`text-lg flex-shrink-0 ${correct ? 'text-green-600' : 'text-red-600'}`}>
                  {correct ? '✓' : '✗'}
                </span>
                <p className="text-sm font-medium text-gray-800">{q.text}</p>
              </div>
              <div className="ml-6 space-y-1">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === bd?.correctIndex;
                  const isSelected = oi === bd?.selected;
                  return (
                    <div key={oi} className={`text-xs px-3 py-1.5 rounded-lg ${
                      isCorrect ? 'bg-green-200 text-green-900 font-semibold' :
                      isSelected && !isCorrect ? 'bg-red-200 text-red-900' :
                      'text-gray-600'
                    }`}>
                      {isCorrect ? '✓ ' : isSelected && !isCorrect ? '✗ ' : '  '}{opt}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onReturnToCourse} className="btn-primary w-full">← Back to Course</button>
    </div>
  );
}

export default function QuizView() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const { activeMode } = useNetwork();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const expiredRef = useRef(false);

  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then(r => {
        setQuiz(r.data);
        if (r.data.myAttempt) {
          setAttempt(r.data.myAttempt);
          setSubmitted(true);
        }
        setAnswers(new Array((r.data.questions || []).length).fill(null));
      })
      .catch(() => toast.error('Failed to load quiz'))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting || submitted) return;
    const unanswered = answers.filter(a => a === null).length;
    if (!auto && unanswered > 0) {
      const ok = window.confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`);
      if (!ok) return;
    }
    setSubmitting(true);
    try {
      const finalAnswers = answers.map(a => a === null ? 0 : a);
      const r = await api.post(`/quizzes/${quizId}/attempt`, { answers: finalAnswers });
      setAttempt(r.data);
      setSubmitted(true);
      toast.success(`Quiz submitted — ${r.data.percentage}%`);
    } catch (err) {
      if (err.response?.status === 409) {
        setAttempt(err.response.data.attempt);
        setSubmitted(true);
      } else {
        toast.error('Submission failed');
      }
    } finally {
      setSubmitting(false);
    }
  }, [answers, quizId, submitting, submitted]);

  const handleExpire = useCallback(() => {
    if (!expiredRef.current && !submitted) {
      expiredRef.current = true;
      toast('Time is up! Submitting automatically.', { icon: '⏱' });
      handleSubmit(true);
    }
  }, [handleSubmit, submitted]);

  if (loading) return <div className="flex items-center justify-center h-48"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800" /></div>;
  if (!quiz) return <div className="card p-8 text-center text-gray-500">Quiz not found.</div>;

  if (submitted && attempt) {
    return <ResultView quiz={quiz} attempt={attempt} onReturnToCourse={() => navigate(`/student/courses/${courseId}`)} />;
  }

  if (!started) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Link to={`/student/courses/${courseId}`} className="text-sm text-brand-700 hover:underline">← Back to Course</Link>
        <div className="card p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-brand-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          {quiz.description && <p className="text-gray-500 text-sm">{quiz.description}</p>}
          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div><span className="font-bold text-gray-800">{quiz.questions.length}</span> questions</div>
            <div><span className="font-bold text-gray-800">{quiz.duration}</span> minutes</div>
            <div>Pass mark: <span className="font-bold text-gray-800">50%</span></div>
          </div>
          <p className="text-xs text-gray-400">The timer starts when you click Begin. You can only attempt this quiz once.</p>
          <button onClick={() => setStarted(true)} className="btn-primary px-10">Begin Quiz</button>
        </div>
      </div>
    );
  }

  const allAnswered = answers.every(a => a !== null);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
        <span className="badge badge-gray text-xs">{answers.filter(a => a !== null).length}/{quiz.questions.length} answered</span>
      </div>

      {activeMode !== 'lite' && (
        <div className="card p-4">
          <TimerBar totalSeconds={quiz.duration * 60} onExpire={handleExpire} />
        </div>
      )}

      <div className="space-y-5">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} className={`card p-5 border-l-4 transition-colors ${answers[qi] !== null ? 'border-l-brand-800' : 'border-l-brand-200'}`}>
            <p className="text-sm font-semibold text-gray-800 mb-3">
              <span className="text-brand-800 mr-1">Q{qi + 1}.</span>{q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => setAnswers(prev => { const a = [...prev]; a[qi] = oi; return a; })}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                    answers[qi] === oi
                      ? 'border-brand-800 bg-brand-50 text-brand-900 font-medium'
                      : 'border-gray-200 hover:border-gray-400 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + oi)}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 flex items-center justify-between gap-4 flex-wrap">
        {!allAnswered && (
          <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
            {answers.filter(a => a === null).length} question(s) still unanswered
          </p>
        )}
        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="btn-primary ml-auto"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
}

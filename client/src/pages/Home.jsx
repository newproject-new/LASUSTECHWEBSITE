import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ─── Data ─────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    image: '/images/Engineering_block.jpg',
    headline: 'Your Learning Portal, Wherever You Are',
    subtitle: 'LASUSTECH Learn delivers course materials, assignments, and discussions straight to your device — adapting to your network so your studies never stop.',
  },
  {
    image: '/images/lasustech_gate.jpg',
    headline: 'One Platform. Every Role. Fully Connected.',
    subtitle: 'Students track progress and submit work. Lecturers publish content and grade submissions. Admins keep everything running — all from a single portal.',
  },
  {
    image: '/images/environmentals_.jpg',
    headline: 'Learning That Adapts to Your Connection',
    subtitle: 'Whether you are on 4G or 2G, the portal automatically adjusts content quality in real time — no manual settings, no interruptions.',
  },
  {
    image: '/images/huawei_visit_1.jpeg',
    headline: 'Submit. Discuss. Grow.',
    subtitle: 'Upload assignments, join course discussion threads, follow lecturer feedback, and monitor your academic progress — all from your student dashboard.',
  },
];

const NEWS_ITEMS = [
  {
    image: '/images/nuc_accred.jpeg',
    tag: 'Notice',
    date: 'April 10, 2026',
    title: 'Second Semester Course Enrolment Now Open on LASUSTECH Learn',
    excerpt:
      'All registered students can log in to enrol in courses for the 2025/2026 second semester. Lecturers have begun uploading course outlines, reading lists, and introductory lesson materials across all active programmes.',
  },
  {
    image: '/images/laspotech_lib.jpg',
    tag: 'Update',
    date: 'April 5, 2026',
    title: 'Over 200 Lesson Materials Uploaded by Lecturers This Week',
    excerpt:
      'Lecturers across multiple departments have published lecture notes, video recordings, and supplementary resources to their courses. Students are encouraged to log in and begin working through posted content ahead of scheduled assessments.',
  },
  {
    image: '/images/huawei_visit_1.jpeg',
    tag: 'Feature',
    date: 'March 20, 2026',
    title: 'Adaptive Content Delivery Now Live: Full, Medium, and Lite Modes Active',
    excerpt:
      'The portal\'s network-aware engine now automatically detects your connection speed and switches delivery modes in real time. Students on slow connections receive a lightweight version of course content without any manual intervention.',
  },
  {
    image: null,
    bgColor: '#6b0f0f',
    tag: 'Deadline',
    date: 'March 28, 2026',
    title: 'Assignment Submission Deadline: End-of-Semester Projects Due 30 April',
    excerpt:
      'Lecturers have set final assignment deadlines ahead of the examination period. Students should log in, review submission instructions on their dashboards, and upload completed work on time to avoid grade penalties.',
  },
  {
    image: null,
    bgColor: '#1a3a6b',
    tag: 'Improvement',
    date: 'March 15, 2026',
    title: 'Discussion Boards Upgraded with Threaded Replies and Course Filters',
    excerpt:
      'The discussion module now supports threaded replies, course-filtered post views, and improved notification settings. Students and lecturers can follow active conversations more easily and stay engaged with academic dialogue.',
  },
  {
    image: null,
    bgColor: '#1a5c3a',
    tag: 'Milestone',
    date: 'March 8, 2026',
    title: 'Platform Records 5,000 Lesson Completions This Semester',
    excerpt:
      'LASUSTECH Learn reached its 5,000th lesson completion this semester, reflecting consistent engagement across student and lecturer accounts. The adaptive delivery feature has been a key driver of continued access on variable network conditions.',
  },
];

const PROGRAMS = [
  {
    image: '/images/bsc-biochemistry.jpg',
    name: 'BCH 301 – Biochemistry & Molecular Biology',
    desc: 'Lecture notes, lab guides, and weekly graded quizzes uploaded by your lecturer. Access course content from your student dashboard at any network speed.',
  },
  {
    image: '/images/environmentals_.jpg',
    name: 'ENV 201 – Environmental Science',
    desc: 'Course materials covering ecosystems, pollution control, and policy are live on the portal. Assignments and discussion threads are open for enrolled students.',
  },
  {
    image: null, bgColor: '#0f2a4a',
    name: 'CSC 401 – Data Structures & Algorithms',
    desc: 'Lecturer-uploaded lessons on sorting, trees, and graphs with auto-graded problem sets and an active course discussion board for peer learning.',
  },
  {
    image: null, bgColor: '#1e0f4a',
    name: 'EEE 302 – Electronics & Circuit Theory',
    desc: 'Video lectures, downloadable circuit notes, and timed assignments accessible from your dashboard — delivered in adaptive quality based on your connection.',
  },
  {
    image: null, bgColor: '#0f3a1a',
    name: 'MEC 201 – Engineering Mechanics',
    desc: 'Statics and dynamics content available as PDF notes and video lessons. Submit coursework through the portal and receive graded feedback from your lecturer.',
  },
  {
    image: null, bgColor: '#3a1a00',
    name: 'CVE 301 – Structural Analysis',
    desc: 'Lecturer-published notes on beams, frames, and trusses. Assignments are submitted directly through the portal with structured marking criteria.',
  },
  {
    image: '/images/laspotech_lib.jpg',
    name: 'LIS 101 – Introduction to Information Science',
    desc: 'Interactive course modules covering information retrieval and classification. Discussion boards and upload submissions are fully active for enrolled students.',
  },
  {
    image: null, bgColor: '#3a0a0a',
    name: 'ELE 401 – Power Systems Engineering',
    desc: 'Content on generation, transmission, and distribution delivered across Full, Medium, and Lite modes — so it remains accessible even under limited bandwidth.',
  },
];

const PLATFORM_FEATURES = [
  {
    gradient: 'linear-gradient(135deg, #0d1b4a 0%, #1565C0 100%)',
    key: 'adaptive',
    title: 'Network-Adaptive Content Delivery',
    subtitle: 'The portal detects your connection speed and automatically switches between Full, Medium, and Lite modes — serving HD content on 4G and a fast text-first layout on 2G, without any manual input.',
  },
  {
    gradient: 'linear-gradient(135deg, #0d3a1a 0%, #2E7D32 100%)',
    key: 'roles',
    title: 'Purpose-Built Dashboards for Every Role',
    subtitle: 'Students enrol in courses, submit assignments, and join discussions. Lecturers publish lessons and grade work. Admins manage accounts and track system health — each with a dedicated, focused interface.',
  },
  {
    gradient: 'linear-gradient(135deg, #4a2000 0%, #E65100 100%)',
    key: 'tracking',
    title: 'Real-Time Academic Progress Tracking',
    subtitle: 'Students view assignment scores and completion rates. Lecturers monitor submission activity and course engagement. Admins review usage statistics and platform uptime — all available live from the dashboard.',
  },
];

// ─── Professional SVG Icons ────────────────────────────────────────────────────

function IconGraduationCap({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function IconBookOpen({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
    </svg>
  );
}

function IconMicroscope({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 10-5.78-10.93" />
      <path d="M9 3l2 2-4.5 4.5-2-2L9 3z" />
      <path d="M11 5l2 2" />
      <path d="M13 7c1.5 1.5 1.5 4 0 5.5" />
    </svg>
  );
}

function IconUsers({ className = 'w-8 h-8' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconSearch({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function IconChevronDown({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function IconChevronLeft({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconChevronRight({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function IconArrowUp({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function IconClock({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconBarChart({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4"  />
      <line x1="6"  y1="20" x2="6"  y2="14" />
      <line x1="2"  y1="20" x2="22" y2="20" />
    </svg>
  );
}

function IconMapPin({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconPhone({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18L5 0a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L5.91 7.9a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function IconMail({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconMenu({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

// Social icons
function IconFacebook({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function IconTwitter({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconInstagram({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function IconLinkedIn({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

// ─── Count-up hook ─────────────────────────────────────────────────────────────

function useCountUp(end, duration = 2200, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, active]);
  return val;
}

// ─── 1. Sticky Navbar ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Courses' },
  { label: 'Assignments' },
  { label: 'Discussions' },
  { label: 'Academic Info' },
  { label: 'Support' },
];

function HomeNavbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let rafId;
    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 10));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => { window.removeEventListener('scroll', handler); cancelAnimationFrame(rafId); };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 flex items-center justify-between h-16 lg:h-[68px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
            <img src="/images/logo.jpg" alt="LASUSTECH" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm leading-tight tracking-tight">
              LAGOS STATE UNIVERSITY
            </div>
            <div className="text-gray-500 text-[10px] font-medium tracking-widest leading-tight uppercase">
              Of Science and Technology
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-700 hover:text-brand-800 font-medium rounded-lg hover:bg-brand-50 transition-colors"
            >
              {l.label}
              <IconChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          ))}
        </nav>

        {/* Search + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs, news, faculty..."
              className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white transition-all placeholder-gray-400"
            />
          </div>

          {user ? (
            <Link
              to={
                user.role === 'admin'
                  ? '/admin/dashboard'
                  : user.role === 'lecturer'
                  ? '/lecturer/dashboard'
                  : '/student/dashboard'
              }
              className="px-4 py-2 bg-brand-800 text-white text-sm font-semibold rounded-lg hover:bg-brand-900 transition-colors"
            >
              My Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 bg-brand-800 text-white text-sm font-bold rounded-lg hover:bg-brand-900 transition-colors shadow-sm"
            >
              Access Portal
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          <IconMenu />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              className="flex w-full items-center justify-between py-2.5 text-sm font-medium text-gray-700 border-b border-gray-50 hover:text-brand-800"
            >
              {l.label}
              <IconChevronDown className="w-4 h-4 opacity-50" />
            </button>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'lecturer' ? '/lecturer/dashboard' : '/student/dashboard'}
                className="btn-primary w-full justify-center py-2.5"
              >
                My Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-primary w-full justify-center py-2.5">Access Portal</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// ─── 3. Hero Section ──────────────────────────────────────────────────────────

function HeroSection({ topOffset }) {
  const [current, setCurrent]   = useState(0);
  const intervalRef = useRef(null);

  const startAuto = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % HERO_SLIDES.length);
    }, 5500);
  }, []);

  useEffect(() => {
    startAuto();
    const onVisibility = () => document.hidden ? clearInterval(intervalRef.current) : startAuto();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { clearInterval(intervalRef.current); document.removeEventListener('visibilitychange', onVisibility); };
  }, [startAuto]);

  const goTo = (idx) => { setCurrent(idx); startAuto(); };
  const prev = () => { setCurrent((c) => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); startAuto(); };
  const next = () => { setCurrent((c) => (c + 1) % HERO_SLIDES.length); startAuto(); };

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: `calc(100vh - ${topOffset}px)`, minHeight: 500 }}
    >
      {/* Slides */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className="hero-slide"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
            fetchPriority={i === 0 ? 'high' : 'low'}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          {HERO_SLIDES[current].headline}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-2xl mb-8 font-light leading-relaxed">
          {HERO_SLIDES[current].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/login"
            className="px-7 py-3 bg-brand-800 text-white font-bold rounded-lg hover:bg-brand-900 transition-colors text-sm shadow-lg"
          >
            Access Your Dashboard
          </Link>
          <Link
            to="/login"
            className="px-7 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-brand-900 transition-all text-sm"
          >
            View Course Catalogue
          </Link>
        </div>
      </div>

      {/* Left / Right arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Previous slide"
      >
        <IconChevronLeft />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label="Next slide"
      >
        <IconChevronRight />
      </button>

      {/* Scroll-down mouse */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <div className="scroll-mouse">
          <div className="scroll-mouse-dot" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-6 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── 4. Quick Links Bar ───────────────────────────────────────────────────────

const QUICK_LINKS = [
  {
    Icon: IconGraduationCap,
    title: 'Student Portal',
    sub: 'Access your courses, assignments, and grades',
    to: '/login',
  },
  {
    Icon: IconBookOpen,
    title: 'Course Catalogue',
    sub: 'Browse and enrol in available modules',
    to: '/login',
  },
  {
    Icon: IconMicroscope,
    title: 'Submit Assignments',
    sub: 'Upload work and track lecturer feedback',
    to: '/login',
  },
  {
    Icon: IconUsers,
    title: 'Join Discussions',
    sub: 'Engage in threaded academic conversations',
    to: '/login',
  },
];

function QuickLinksBar() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {QUICK_LINKS.map(({ Icon, title, sub, to }) => (
            <Link key={title} to={to} className="quick-link-card group">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-brand-100"
                style={{ background: 'rgba(139,0,0,0.07)' }}
              >
                <Icon className="w-7 h-7 text-brand-800" />
              </div>
              <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-800 transition-colors">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. News & Events ─────────────────────────────────────────────────────────

function NewsCarousel() {
  const [offset, setOffset] = useState(0);
  const perPage = 3;
  const maxOffset = NEWS_ITEMS.length - perPage;

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));

  const visible = NEWS_ITEMS.slice(offset, offset + perPage);

  const tagColors = {
    Update:      'bg-blue-100 text-blue-800',
    Feature:     'bg-purple-100 text-purple-800',
    Improvement: 'bg-green-100 text-green-800',
    Notice:      'bg-yellow-100 text-yellow-800',
    Deadline:    'bg-brand-100 text-brand-800',
    Milestone:   'bg-teal-100 text-teal-800',
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Portal Notices &amp; Updates</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Stay informed on course enrolment, assignment deadlines, new materials, and platform improvements
          </p>
        </div>

        <div className="flex items-stretch gap-4 lg:gap-6">
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={offset === 0}
            className="shrink-0 self-center w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-800 hover:text-brand-800 disabled:opacity-30 transition-colors"
          >
            <IconChevronLeft />
          </button>

          {/* Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-hidden">
            {visible.map((item, i) => (
              <article key={offset + i} className="news-card cursor-pointer">
                {/* Image area */}
                <div className="h-44 overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: item.bgColor || '#6b0f0f' }}
                    >
                      <span className="text-white text-4xl font-black opacity-20 select-none">
                        LASUSTECH
                      </span>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge text-xs font-medium ${tagColors[item.tag] || 'bg-gray-100 text-gray-700'}`}>
                      {item.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <IconClock />
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 hover:text-brand-800 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 mb-3">
                    {item.excerpt}
                  </p>
                  <a href="#" className="text-brand-800 text-xs font-semibold hover:text-brand-900 transition-colors inline-flex items-center gap-1">
                    Read More <IconChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            disabled={offset >= maxOffset}
            className="shrink-0 self-center w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-800 hover:text-brand-800 disabled:opacity-30 transition-colors"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── 6. Vice Chancellor's Welcome ─────────────────────────────────────────────

function VCWelcome() {
  return (
    <section className="py-20" style={{ background: '#fff5f5' }}>
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-0">
            {/* Photo column */}
            <div className="md:w-64 shrink-0 flex flex-col items-center justify-center p-10 bg-gradient-to-br from-brand-50 to-brand-100 relative">
              {/* Decorative quote */}
              <span
                className="absolute top-4 left-4 font-serif font-black select-none leading-none"
                style={{ fontSize: 100, color: 'rgba(139,0,0,0.08)', lineHeight: 1 }}
              >
                &ldquo;
              </span>
              {/* Portrait photo */}
              <div className="relative z-10 w-40 h-40 rounded-full shadow-xl border-4 border-white overflow-hidden">
                <img
                  src="/images/VC.jpg"
                  alt="Vice Chancellor Prof. Olumuyiwa Odusanya"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.parentElement.innerHTML = '<div class="w-full h-full bg-brand-800 flex items-center justify-center"><span class="text-white font-black text-4xl">VC</span></div>';
                  }}
                />
              </div>
            </div>

            {/* Text column */}
            <div className="flex-1 p-8 lg:p-10">
              <p className="text-xs font-bold text-brand-800 uppercase tracking-widest mb-2">A Message From the Vice-Chancellor</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">On Digital Learning at LASUSTECH</h2>
              <h3 className="text-base font-semibold text-brand-800 mb-5">Prof. Olumuyiwa Odusanya</h3>
              <p className="text-gray-600 leading-relaxed text-sm mb-4">
                The LASUSTECH Learn portal is a direct expression of our institution's commitment to
                making quality education reachable for every student, regardless of where they are or
                what network they are on. We built this platform because we recognise that connectivity
                in Nigeria is uneven — and a student on a 2G connection deserves the same access to
                their course materials as one on broadband.
              </p>
              <p className="text-gray-600 leading-relaxed text-sm mb-6">
                This platform is not simply a file repository. It is a full academic environment — for
                submitting assignments, discussing ideas with peers, receiving feedback from lecturers,
                and tracking your progress in real time. I encourage every student, lecturer, and
                administrator to engage with it fully as the primary channel of academic activity.
              </p>
              <Link to="/login" className="inline-block px-6 py-2.5 bg-brand-800 text-white text-sm font-bold rounded-lg hover:bg-brand-900 transition-colors">
                Access the Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 7. Academic Programs ─────────────────────────────────────────────────────

function AcademicPrograms() {
  const [offset, setOffset] = useState(0);
  const perPage = 3;
  const maxOffset = PROGRAMS.length - perPage;

  const prev = () => setOffset((o) => Math.max(0, o - 1));
  const next = () => setOffset((o) => Math.min(maxOffset, o + 1));
  const visible = PROGRAMS.slice(offset, offset + perPage);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title">Active Courses on the Portal</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            These courses are currently live on LASUSTECH Learn — with uploaded materials,
            open assignments, and active discussion threads available to enrolled students.
          </p>
        </div>

        <div className="flex items-stretch gap-4 lg:gap-6 mb-10">
          <button
            onClick={prev}
            disabled={offset === 0}
            className="shrink-0 self-center w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-800 hover:text-brand-800 disabled:opacity-30 transition-colors"
          >
            <IconChevronLeft />
          </button>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((prog, i) => (
              <div key={offset + i} className="news-card group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  {prog.image ? (
                    <img
                      src={prog.image}
                      alt={prog.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-end p-4"
                      style={{ background: prog.bgColor || '#1a1a2e' }}
                    >
                      <span className="text-white/20 font-black text-3xl select-none leading-none tracking-widest">
                        COURSE
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 group-hover:text-brand-800 transition-colors text-sm mb-2">
                    {prog.name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={next}
            disabled={offset >= maxOffset}
            className="shrink-0 self-center w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand-800 hover:text-brand-800 disabled:opacity-30 transition-colors"
          >
            <IconChevronRight />
          </button>
        </div>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 px-7 py-3 bg-brand-800 text-white text-sm font-bold rounded-lg hover:bg-brand-900 transition-colors shadow-sm">
            View Full Course Catalogue
            <IconChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── 8. Research Excellence ───────────────────────────────────────────────────

function PlatformFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="section-title-dark">What Powers This Platform</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Three core capabilities that make LASUSTECH Learn different from a generic file-sharing tool
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map((item) => (
            <div key={item.key} className="news-card group cursor-pointer overflow-hidden">
              <div
                className="h-52 flex items-center justify-center relative"
                style={{ background: item.gradient }}
              >
                <div className="absolute inset-0"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                <div className="relative text-center px-6">
                  <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                    {item.key === 'adaptive' && (
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.55a11 11 0 0114.08 0" />
                        <path d="M1.42 9a16 16 0 0121.16 0" />
                        <path d="M8.53 16.11a6 6 0 016.95 0" />
                        <circle cx="12" cy="20" r="1" fill="currentColor" />
                      </svg>
                    )}
                    {item.key === 'roles' && (
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                      </svg>
                    )}
                    {item.key === 'tracking' && (
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6"  y1="20" x2="6"  y2="14" />
                        <line x1="2"  y1="20" x2="22" y2="20" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-brand-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{item.subtitle}</p>
                <Link to="/login" className="text-brand-800 text-sm font-semibold hover:text-brand-900 transition-colors inline-flex items-center gap-1">
                  Try it now <IconChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. Visitors Counter ──────────────────────────────────────────────────────

function VisitorsCounter() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const todayCount = useCountUp(16436,  2000, active);
  const totalCount = useCountUp(3484484, 2500, active);

  return (
    <section ref={sectionRef} className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <IconBarChart className="w-4 h-4 text-brand-800" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-800">
            Platform Activity — Live
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
        </div>

        {/* Stat blocks */}
        <div className="flex flex-col sm:flex-row justify-center gap-10 sm:gap-16">
          {/* Today */}
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Active Sessions Today</p>
            <p className="text-xs text-gray-400 mb-3">24 Apr 2026</p>
            <div
              className="inline-block px-6 py-3 rounded-xl font-extrabold text-white tracking-widest"
              style={{ background: '#111', fontSize: '2.5rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}
            >
              {todayCount.toLocaleString()}
            </div>
          </div>

          {/* Total */}
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Total Portal Logins</p>
            <p className="text-xs text-gray-400 mb-3">Since 1 Jan 2022</p>
            <div
              className="inline-block px-6 py-3 rounded-xl font-extrabold text-white tracking-widest"
              style={{ background: '#111', fontSize: '2.5rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.06em' }}
            >
              {totalCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 10. Footer ───────────────────────────────────────────────────────────────

function HomeFooter() {
  const [email, setEmail] = useState('');

  return (
    <footer style={{ background: '#1a1a2e' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1 — Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 shrink-0">
                <img src="/images/logo.jpg" alt="LASUSTECH" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="text-white font-extrabold text-sm leading-tight">LASUSTECH Learn</div>
                <div className="text-gray-400 text-[10px] tracking-wider">Adaptive E-Learning Portal</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              The official adaptive e-learning portal of Lagos State University of Science and Technology — delivering course content, assignments, and academic collaboration tools across every network condition.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: IconFacebook,  label: 'Facebook'  },
                { Icon: IconTwitter,   label: 'Twitter/X' },
                { Icon: IconInstagram, label: 'Instagram' },
                { Icon: IconLinkedIn,  label: 'LinkedIn'  },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="space-y-2.5">
              {['Student Dashboard', 'Course Catalogue', 'Submit Assignment', 'Discussion Boards', 'Lecturer Dashboard', 'Admin Panel'].map((l) => (
                <li key={l}>
                  <a href="#" className="footer-link hover:text-white flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-brand-600 group-hover:bg-white transition-colors" />
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Newsletter */}
          <div>
            <h4 className="footer-heading">Stay Updated</h4>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new course uploads, assignment deadlines, and platform updates — delivered straight to your inbox.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900"
              style={{ background: '#2a2a3e' , color: '#e5e7eb' }}
            />
            <button className="w-full py-2.5 bg-brand-800 text-white text-sm font-bold rounded-lg hover:bg-brand-900 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-800/30 flex items-center justify-center shrink-0 mt-0.5">
                  <IconMapPin className="w-3.5 h-3.5 text-brand-400" />
                </span>
                <span className="text-gray-400 text-sm leading-relaxed">
                  Km 4, Itokin Road, Ikorodu, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-800/30 flex items-center justify-center shrink-0">
                  <IconPhone className="w-3.5 h-3.5 text-brand-400" />
                </span>
                <div className="text-gray-400 text-sm">
                  <div>+234 808 102 6249</div>
                  <div>+234 802 338 3822</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-brand-800/30 flex items-center justify-center shrink-0 mt-0.5">
                  <IconMail className="w-3.5 h-3.5 text-brand-400" />
                </span>
                <div className="text-gray-400 text-sm">
                  <div>info@lasustech.edu.ng</div>
                  <div>dipr@lasustech.edu.ng</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-gray-500 text-xs">
            &copy; 2026 LASUSTECH | ICT. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── 11. Scroll-to-Top ────────────────────────────────────────────────────────

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let rafId;
    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setShow(window.scrollY > 350));
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => { window.removeEventListener('scroll', handler); cancelAnimationFrame(rafId); };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-4 z-50 w-11 h-11 rounded-full bg-brand-800 text-white flex items-center justify-center shadow-lg hover:bg-brand-900 transition-all animate-fade-in"
      aria-label="Scroll to top"
    >
      <IconArrowUp />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavbar />

      <div style={{ marginTop: 68 }}>
        <HeroSection topOffset={68} />
      </div>

      <QuickLinksBar />
      <NewsCarousel />
      <VCWelcome />
      <AcademicPrograms />
      <PlatformFeatures />
      <VisitorsCounter />
      <HomeFooter />

      <ScrollToTop />
    </div>
  );
}

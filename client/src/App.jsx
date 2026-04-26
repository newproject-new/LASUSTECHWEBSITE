import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NetworkProvider } from './contexts/NetworkContext';
import Layout from './components/common/Layout';
import Home from './pages/Home';

const Login    = React.lazy(() => import('./pages/auth/Login'));
const Register = React.lazy(() => import('./pages/auth/Register'));

const StudentDashboard   = React.lazy(() => import('./pages/student/StudentDashboard'));
const CourseCatalog      = React.lazy(() => import('./pages/student/CourseCatalog'));
const CourseDetail       = React.lazy(() => import('./pages/student/CourseDetail'));
const LessonView         = React.lazy(() => import('./pages/student/LessonView'));
const StudentAssignments = React.lazy(() => import('./pages/student/Assignments'));
const Discussions        = React.lazy(() => import('./pages/student/Discussions'));
const DiscussionThread   = React.lazy(() => import('./pages/student/DiscussionThread'));
const QuizView           = React.lazy(() => import('./pages/student/QuizView'));
const StudentQuizzes     = React.lazy(() => import('./pages/student/StudentQuizzes'));

const LecturerDashboard = React.lazy(() => import('./pages/lecturer/LecturerDashboard'));
const ManageCourses     = React.lazy(() => import('./pages/lecturer/ManageCourses'));
const CourseContent     = React.lazy(() => import('./pages/lecturer/CourseContent'));
const AssignmentManager = React.lazy(() => import('./pages/lecturer/AssignmentManager'));
const Submissions       = React.lazy(() => import('./pages/lecturer/Submissions'));
const LecturerQuizzes   = React.lazy(() => import('./pages/lecturer/LecturerQuizzes'));

const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const UserManagement = React.lazy(() => import('./pages/admin/UserManagement'));
const SystemHealth   = React.lazy(() => import('./pages/admin/SystemHealth'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-800" />
    </div>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role === 'admin')    return <Navigate to="/admin/dashboard"    replace />;
  if (user.role === 'lecturer') return <Navigate to="/lecturer/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading)                              return <PageLoader />;
  if (!user)                                return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))  return <RoleRedirect />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public homepage — always visible */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login"    element={user ? <RoleRedirect /> : <Login />} />
        <Route path="/register" element={user ? <RoleRedirect /> : <Register />} />

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute roles={['student']}><Layout /></ProtectedRoute>}>
          <Route path="dashboard"                                      element={<StudentDashboard />} />
          <Route path="courses"                                        element={<CourseCatalog />} />
          <Route path="courses/:courseId"                              element={<CourseDetail />} />
          <Route path="courses/:courseId/lessons/:lessonId"            element={<LessonView />} />
          <Route path="courses/:courseId/quizzes/:quizId"             element={<QuizView />} />
          <Route path="assignments"                                    element={<StudentAssignments />} />
          <Route path="quizzes"                                        element={<StudentQuizzes />} />
          <Route path="discussions"                                    element={<Discussions />} />
          <Route path="discussions/:courseId"                          element={<Discussions />} />
          <Route path="discussions/:courseId/thread/:threadId"         element={<DiscussionThread />} />
        </Route>

        {/* Lecturer */}
        <Route path="/lecturer" element={<ProtectedRoute roles={['lecturer']}><Layout /></ProtectedRoute>}>
          <Route path="dashboard"                               element={<LecturerDashboard />} />
          <Route path="courses"                                 element={<ManageCourses />} />
          <Route path="courses/:courseId/content"               element={<CourseContent />} />
          <Route path="assignments"                             element={<AssignmentManager />} />
          <Route path="quizzes"                                 element={<LecturerQuizzes />} />
          <Route path="submissions"                             element={<Submissions />} />
          <Route path="discussions"                             element={<Discussions />} />
          <Route path="discussions/:courseId"                   element={<Discussions />} />
          <Route path="discussions/:courseId/thread/:threadId"  element={<DiscussionThread />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users"     element={<UserManagement />} />
          <Route path="system"    element={<SystemHealth />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NetworkProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '8px',
                background: '#ffffff',
                color: '#111111',
                fontSize: '14px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                border: '1px solid #e5e7eb',
              },
              success: { icon: null, style: { background: '#ffffff', color: '#111111' } },
              error:   { icon: null, style: { background: '#ffffff', color: '#111111' } },
            }}
          />
        </NetworkProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

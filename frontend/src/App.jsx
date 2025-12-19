import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Jobs from './pages/Jobs';
import StudentDashboard from './pages/Student/Dashboard';
import CompanyDashboard from './pages/Company/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import JobDetails from './pages/Jobs/JobDetails';
import PostJob from './pages/Company/PostJob';
import PendingJobs from './pages/Admin/PendingJobs';
import MyApplications from './pages/Student/MyApplications';
import MyJobs from './pages/Company/MyJobs';
import JobApplications from './pages/Company/JobApplications';
import StudentProfile from './pages/Student/Profile';
import CompanyProfile from './pages/Company/Profile';
import SavedJobs from './pages/Student/SavedJobs';  // ⬅️ IMPORTANT
import AdminProfile from './pages/Admin/Profile';
import EditJob from './pages/Company/EditJob';
import Settings from './pages/Settings';
import AdminUsers from './pages/Admin/Users';
import AdminAnalytics from './pages/Admin/Analytics';
import AdminVerifications from './pages/Admin/Verifications';
import NotFound from './pages/NotFound';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (user) {
    if (user.role === 'student' || user.role === 'employee') return <Navigate to="/student/dashboard" replace />;
    if (user.role === 'company') return <Navigate to="/company/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Jobs Routes - IMPORTANT: /jobs/create MUST come before /jobs/:id */}
        <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
        <Route path="/jobs/create" element={<ProtectedRoute allowedRoles={['company']}><PostJob /></ProtectedRoute>} />
        <Route path="/jobs/:id/edit" element={<ProtectedRoute allowedRoles={['company']}><EditJob /></ProtectedRoute>} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student', 'employee']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute allowedRoles={['student', 'employee']}><MyApplications /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student', 'employee']}><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/saved-jobs" element={<ProtectedRoute allowedRoles={['student', 'employee']}><SavedJobs /></ProtectedRoute>} />

        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/jobs" element={<ProtectedRoute allowedRoles={['company']}><MyJobs /></ProtectedRoute>} />
        <Route path="/company/jobs/:id/applications" element={<ProtectedRoute allowedRoles={['company']}><JobApplications /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute allowedRoles={['company']}><CompanyProfile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/pending-jobs" element={<ProtectedRoute allowedRoles={['admin']}><PendingJobs /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminProfile /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminVerifications /></ProtectedRoute>} />

        {/* Settings Route - Available to all authenticated users */}
        <Route path="/settings" element={<ProtectedRoute allowedRoles={['student', 'employee', 'company', 'admin']}><Settings /></ProtectedRoute>} />

        {/* 404 Route - MUST BE LAST */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
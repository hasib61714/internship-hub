import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Briefcase, 
  TrendingUp,
  Clock,
  AlertTriangle,
  Activity,
  Building,
  GraduationCap,
  Shield,
  Bell,
  MessageCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingVerifications: 0,
    pendingJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      const data = response.data.data;
      setStats({
        totalUsers: data.total_users || 0,
        totalStudents: data.total_students || 0,
        totalCompanies: data.total_companies || 0,
        totalJobs: data.total_jobs || 0,
        activeJobs: data.active_jobs || 0,
        totalApplications: data.total_applications || 0,
        pendingVerifications: (data.pending_student_verifications || 0) + (data.pending_company_verifications || 0),
        pendingJobs: data.pending_jobs || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const mainStats = [
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      change: '+12%',
      onClick: () => navigate('/admin/users')
    },
    { 
      label: 'Total Jobs', 
      value: stats.totalJobs, 
      icon: Briefcase, 
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      change: '+8%',
      onClick: () => navigate('/admin/pending-jobs')
    },
    { 
      label: 'Applications', 
      value: stats.totalApplications, 
      icon: TrendingUp, 
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      change: '+24%',
      onClick: () => navigate('/admin/analytics')
    },
    { 
      label: 'Pending Reviews', 
      value: stats.pendingJobs, 
      icon: Clock, 
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      change: '-3%',
      onClick: () => navigate('/admin/pending-jobs')
    },
  ];

  const userStats = [
    {
      label: 'Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      onClick: () => navigate('/admin/users?filter=student')
    },
    {
      label: 'Companies',
      value: stats.totalCompanies,
      icon: Building,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      onClick: () => navigate('/admin/users?filter=company')
    },
    {
      label: 'Active Jobs',
      value: stats.activeJobs,
      icon: Activity,
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      onClick: () => navigate('/jobs')
    },
    {
      label: 'Today',
      value: 8,
      icon: TrendingUp,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      onClick: () => navigate('/admin/users?filter=today')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard 🛡️</h1>
              <p className="mt-1 text-gray-600">Platform overview and management</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Button */}
              <button 
                onClick={() => navigate('/admin/verifications')}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Notifications"
              >
                <Bell className="w-6 h-6" />
                {stats.pendingVerifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingVerifications}
                  </span>
                )}
              </button>

              {/* Messages Button */}
              <button 
                onClick={() => navigate('/settings')}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Settings"
              >
                <MessageCircle className="w-6 h-6" />
              </button>

              {/* Admin Access Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Shield className="w-4 h-4 mr-1" />
                Admin Access
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Statistics - Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <button 
              key={index} 
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 text-left w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </button>
          ))}
        </div>

        {/* User Statistics - Clickable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <button 
              key={index} 
              onClick={stat.onClick}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Actions - Clickable Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/admin/users')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600">View and manage all platform users</p>
          </button>

          <button 
            onClick={() => navigate('/admin/pending-jobs')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Moderate Jobs</h3>
            <p className="text-sm text-gray-600">Review and moderate job postings</p>
          </button>

          <button 
            onClick={() => navigate('/admin/analytics')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">View Analytics</h3>
            <p className="text-sm text-gray-600">Platform insights and statistics</p>
          </button>
        </div>

        {/* Pending Verifications Alert */}
        {stats.pendingVerifications > 0 && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-1">Pending Verifications</h3>
                <p className="text-yellow-800 mb-3">
                  You have {stats.pendingVerifications} user(s) waiting for verification approval
                </p>
                <button 
                  onClick={() => navigate('/admin/verifications')}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Review Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
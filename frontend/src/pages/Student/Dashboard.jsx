import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Briefcase, 
  Send, 
  Clock, 
  CheckCircle,
  DollarSign,
  TrendingUp,
  Star,
  FileText,
  User,
  Bookmark
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        api.get('/my-applications'),
        api.get('/jobs?per_page=6')
      ]);
      setApplications(Array.isArray(appsRes.data.data) ? appsRes.data.data : []);
      setJobs(Array.isArray(jobsRes.data.data) ? jobsRes.data.data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const studentData = user?.student || {};
  
  const stats = [
    { 
      label: 'Total Applications', 
      value: applications.length, 
      icon: Send, 
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Pending', 
      value: applications.filter(a => a.status === 'pending').length, 
      icon: Clock, 
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    { 
      label: 'Accepted', 
      value: applications.filter(a => a.status === 'accepted').length, 
      icon: CheckCircle, 
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      label: 'Success Rate', 
      value: applications.length > 0 
        ? Math.round((applications.filter(a => a.status === 'accepted').length / applications.length) * 100) + '%'
        : '0%', 
      icon: TrendingUp, 
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      shortlisted: 'bg-blue-100 text-blue-800 border-blue-200',
      accepted: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="mt-1 text-gray-600">Here's your application overview</p>
            </div>
            <div className="flex items-center space-x-3">
              {studentData.verification_badge && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </span>
              )}
              {studentData.rating > 0 && (
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{studentData.rating ? Number(studentData.rating).toFixed(1) : '0.0'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/student/applications" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {applications.length === 0 ? (
                <div className="p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
                  <Link
                    to="/jobs"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app.application_id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                          <Link to={`/jobs/${app.job?.job_id}`}>
                            {app.job?.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {app.job?.company?.user?.name || app.job?.company?.company_name}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                      {app.proposed_rate && (
                        <span className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {app.proposed_rate} BDT
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Profile Strength</h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold text-blue-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <button 
                onClick={() => navigate('/student/profile')} 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Complete Your Profile →
              </button>
            </div>

            {/* Saved Jobs Quick Link */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Bookmark className="w-5 h-5 mr-2 text-blue-600" />
                  Saved Jobs
                </h3>
                <Link to="/student/saved-jobs" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
              <p className="text-sm text-gray-600">
                Quick access to your bookmarked opportunities
              </p>
              <Link
                to="/student/saved-jobs"
                className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Saved Jobs →
              </Link>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Recommended</h3>
                <Link to="/jobs" className="text-blue-600 hover:text-blue-700 text-sm">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {Array.isArray(jobs) && jobs.length > 0 ? jobs.slice(0, 3).map((job) => (
                  <Link
                    key={job.job_id}
                    to={`/jobs/${job.job_id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.location}</p>
                  </Link>
                )) : (
                  <p className="text-sm text-gray-500 text-center py-4">No jobs available</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/jobs')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Browse Jobs</h3>
            <p className="text-sm text-gray-600">Find new opportunities</p>
          </button>

          <button 
            onClick={() => navigate('/student/applications')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">My Applications</h3>
            <p className="text-sm text-gray-600">Track your applications</p>
          </button>

          <button 
            onClick={() => navigate('/student/profile')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">My Profile</h3>
            <p className="text-sm text-gray-600">Update your information</p>
          </button>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Ready to find your next opportunity?</h2>
              <p className="opacity-90">Browse thousands of jobs and start applying today</p>
            </div>
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

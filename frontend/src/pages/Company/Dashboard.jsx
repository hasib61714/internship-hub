import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle,
  Plus,
  TrendingUp,
  Star,
  Eye,
  Building
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/my-jobs'),
        api.get('/jobs?per_page=6')
      ]);
      setJobs(Array.isArray(jobsRes.data.data) ? jobsRes.data.data : []);
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const companyData = user?.company || {};
  
  const totalApplications = jobs.reduce((sum, job) => sum + (job.applications_count || 0), 0);
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  
  const stats = [
    { 
      label: 'Active Jobs', 
      value: activeJobs, 
      icon: Briefcase, 
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Total Applications', 
      value: totalApplications, 
      icon: Users, 
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      label: 'Pending Review', 
      value: applications.filter(a => a.status === 'pending').length, 
      icon: Clock, 
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
    { 
      label: 'Hired', 
      value: applications.filter(a => a.status === 'accepted').length, 
      icon: CheckCircle, 
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
                Welcome back, {companyData.company_name || user?.name}! 👋
              </h1>
              <p className="mt-1 text-gray-600">Manage your job postings and applications</p>
            </div>
            <div className="flex items-center space-x-3">
              {user?.is_verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified Company
                </span>
              )}
              <Link
                to="/jobs/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post Job
              </Link>
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
          {/* Posted Jobs */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Job Postings</h2>
              <Link to="/company/jobs" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <div className="p-12 text-center">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
                  <p className="text-gray-600 mb-6">Create your first job posting to find talented candidates</p>
                  <Link
                    to="/jobs/create"
                    className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Post Your First Job
                  </Link>
                </div>
              ) : (
                jobs.slice(0, 5).map((job) => (
                  <div key={job.job_id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                          <Link to={`/jobs/${job.job_id}`}>
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {job.location} • {job.job_type}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {job.applications_count || 0} Applications
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Company Profile</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Company Size</p>
                  <p className="font-medium text-gray-900">{companyData.company_size || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Industry</p>
                  <p className="font-medium text-gray-900">{companyData.industry || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-gray-600">Location</p>
                  <p className="font-medium text-gray-900">{companyData.location || 'Not specified'}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/company/profile')} 
                className="mt-4 block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Edit Profile →
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{totalApplications} Total Applications</p>
                    <p className="text-gray-500">Across all job postings</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Briefcase className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activeJobs} Active Jobs</p>
                    <p className="text-gray-500">Currently accepting applications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            onClick={() => navigate('/jobs/create')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Plus className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Post a Job</h3>
            <p className="text-sm text-gray-600">Create new job posting</p>
          </button>

          <button 
            onClick={() => navigate('/company/jobs')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">My Jobs</h3>
            <p className="text-sm text-gray-600">Manage job postings</p>
          </button>

          <button 
            onClick={() => navigate('/company/profile')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-medium">→</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Company Profile</h3>
            <p className="text-sm text-gray-600">Update company info</p>
          </button>
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Need help finding the right talent?</h2>
              <p className="opacity-90">Post a job and connect with qualified candidates today</p>
            </div>
            <Link
              to="/jobs/create"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
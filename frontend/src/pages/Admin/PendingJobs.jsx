import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { 
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Eye,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Calendar,
  Loader
} from 'lucide-react';

export default function PendingJobs() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchJobs();
  }, [isAdmin, navigate, filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'pending' ? '/admin/jobs/pending' : '/admin/jobs';
      const response = await api.get(`${endpoint}?per_page=50`);
      setJobs(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (jobId, action) => {
    const actionText = action === 'approve' ? 'approve' : 'reject';
    if (!confirm(`Are you sure you want to ${actionText} this job?`)) {
      return;
    }

    setProcessing(jobId);
    const moderatePromise = api.put(`/admin/jobs/${jobId}/moderate`, { action });
    
    toast.promise(
      moderatePromise,
      {
        loading: `${action === 'approve' ? 'Approving' : 'Rejecting'} job...`,
        success: `Job ${action === 'approve' ? 'approved' : 'rejected'} successfully!`,
        error: (err) => err.response?.data?.message || 'Failed to moderate job'
      }
    ).then(() => {
      fetchJobs();
      setProcessing(null);
    }).catch(() => {
      setProcessing(null);
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      active: CheckCircle,
      rejected: XCircle,
      closed: XCircle
    };
    return icons[status] || Clock;
  };

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.status === 'pending').length,
    approved: jobs.filter(j => j.status === 'active').length,
    rejected: jobs.filter(j => j.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Job Moderation</h1>
                <p className="text-gray-600 mt-1">Review and moderate job postings</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {stats.pending} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">All Jobs</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-4 rounded-xl ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`p-4 rounded-xl ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Approved</p>
            <p className="text-2xl font-bold mt-1">{stats.approved}</p>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`p-4 rounded-xl ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Rejected</p>
            <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
          </button>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'pending' ? 'All Caught Up!' : 'No Jobs Found'}
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'No pending jobs to review at the moment'
                : 'No jobs match your current filter'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const StatusIcon = getStatusIcon(job.status);
              return (
                <div key={job.job_id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            to={`/jobs/${job.job_id}`}
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 mb-2 block"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span>{job.company?.company_name || job.company?.user?.name}</span>
                            {job.company?.user?.is_verified && (
                              <CheckCircle className="w-4 h-4 ml-2 text-blue-600" />
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)} flex items-center`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {job.budget_min} - {job.budget_max} BDT/hr
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.job_type}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {job.required_skills && (
                        <div className="flex flex-wrap gap-2">
                          {job.required_skills.split(',').slice(0, 5).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {job.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Link
                        to={`/jobs/${job.job_id}`}
                        className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>

                      <button
                        onClick={() => handleModerate(job.job_id, 'approve')}
                        disabled={processing === job.job_id}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        {processing === job.job_id ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleModerate(job.job_id, 'reject')}
                        disabled={processing === job.job_id}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400"
                      >
                        {processing === job.job_id ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {job.status !== 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Link
                        to={`/jobs/${job.job_id}`}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Briefcase, 
  Clock, 
  DollarSign,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle
} from 'lucide-react';

export default function PendingJobs() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchPendingJobs();
  }, [isAdmin, navigate]);

  const fetchPendingJobs = async () => {
    try {
      const response = await api.get('/admin/jobs/pending');
      setJobs(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (jobId, action) => {
    if (!confirm(`Are you sure you want to ${action} this job?`)) return;

    setProcessingId(jobId);
    try {
      await api.put(`/admin/jobs/${jobId}/moderate`, {
        status: action === 'approve' ? 'active' : 'rejected',
        moderation_notes: action === 'approve' ? 'Job approved by admin' : 'Job rejected by admin'
      });

      alert(`Job ${action}d successfully!`);
      
      // Remove from list
      setJobs(jobs.filter(job => job.job_id !== jobId));
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error moderating job:', error);
      alert(error.response?.data?.message || 'Failed to moderate job');
    } finally {
      setProcessingId(null);
    }
  };

  const viewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'hourly': 'bg-purple-100 text-purple-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'project': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pending jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pending Job Approvals</h1>
                <p className="text-gray-600 mt-1">Review and moderate job postings</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {jobs.length} Pending
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up! 🎉</h3>
            <p className="text-gray-600">No pending jobs to review at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.job_id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{job.company?.company_name || job.company?.user?.name || 'Company'}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.job_type)}`}>
                        {job.job_type}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {job.experience_level}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {job.work_mode}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.budget_min} - {job.budget_max} BDT/hr
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => viewDetails(job)}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                  <button
                    onClick={() => handleModerate(job.job_id, 'reject')}
                    disabled={processingId === job.job_id}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    {processingId === job.job_id ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleModerate(job.job_id, 'approve')}
                    disabled={processingId === job.job_id}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {processingId === job.job_id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showDetailsModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600 mt-1">{selectedJob.company?.company_name}</p>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Job Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Job Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Job Type:</span>
                    <p className="font-medium">{selectedJob.job_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment Type:</span>
                    <p className="font-medium">{selectedJob.payment_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Work Mode:</span>
                    <p className="font-medium">{selectedJob.work_mode}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Experience Level:</span>
                    <p className="font-medium">{selectedJob.experience_level}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-medium">{selectedJob.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Budget Range:</span>
                    <p className="font-medium">{selectedJob.budget_min} - {selectedJob.budget_max} BDT/hr</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.description}</p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedJob.requirements}</p>
                </div>
              )}

              {/* Skills */}
              {selectedJob.required_skills && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.required_skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Company Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900">{selectedJob.company?.company_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedJob.company?.industry}</p>
                  {selectedJob.company?.description && (
                    <p className="text-sm text-gray-700 mt-2">{selectedJob.company.description}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handleModerate(selectedJob.job_id, 'reject')}
                  disabled={processingId === selectedJob.job_id}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  {processingId === selectedJob.job_id ? 'Processing...' : 'Reject Job'}
                </button>
                <button
                  onClick={() => handleModerate(selectedJob.job_id, 'approve')}
                  disabled={processingId === selectedJob.job_id}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {processingId === selectedJob.job_id ? 'Processing...' : 'Approve Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

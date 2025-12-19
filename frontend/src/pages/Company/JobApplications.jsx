import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Calendar,
  FileText,
  User
} from 'lucide-react';

export default function JobApplications() {
  const { id } = useParams();
  const { user, isCompany } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    if (!isCompany) {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [isCompany, navigate, id]);

  const fetchApplications = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        api.get(`/jobs/${id}`),
        api.get(`/jobs/${id}/applications`)
      ]);
      
      setJob(jobRes.data.data || jobRes.data);
      setApplications(appsRes.data.data || appsRes.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('Failed to load applications');
      navigate('/company/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    const statusText = newStatus === 'shortlisted' ? 'shortlist' : newStatus;
    if (!confirm(`Are you sure you want to ${statusText} this applicant?`)) {
      return;
    }

    setProcessing(applicationId);
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });

      alert(`Applicant ${statusText}ed successfully!`);
      
      // Update local state
      setApplications(applications.map(app => 
        app.application_id === applicationId 
          ? { ...app, status: newStatus }
          : app
      ));

      if (selectedApp?.application_id === applicationId) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'shortlisted': 'bg-blue-100 text-blue-800',
      'accepted': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': Clock,
      'shortlisted': AlertCircle,
      'accepted': CheckCircle,
      'rejected': XCircle
    };
    return icons[status] || Clock;
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/company/jobs')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to My Jobs
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
                <p className="text-gray-600 mt-1">Manage applicants</p>
              </div>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {stats.total} Applicants
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`p-4 rounded-xl ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">All</p>
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
            onClick={() => setFilter('shortlisted')}
            className={`p-4 rounded-xl ${filter === 'shortlisted' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Shortlisted</p>
            <p className="text-2xl font-bold mt-1">{stats.shortlisted}</p>
          </button>

          <button
            onClick={() => setFilter('accepted')}
            className={`p-4 rounded-xl ${filter === 'accepted' ? 'bg-green-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Accepted</p>
            <p className="text-2xl font-bold mt-1">{stats.accepted}</p>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`p-4 rounded-xl ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-white text-gray-900'} shadow-sm hover:shadow-md transition-all`}
          >
            <p className="text-sm font-medium">Rejected</p>
            <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
          </button>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'all' ? 'No Applications Yet' : `No ${filter.charAt(0).toUpperCase() + filter.slice(1)} Applications`}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'Applications will appear here once candidates apply to this job.'
                : `You don't have any ${filter} applications for this job.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const StatusIcon = getStatusIcon(app.status);
              return (
                <div key={app.application_id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {app.student?.user?.name || 'Applicant'}
                            </h3>
                            <p className="text-sm text-gray-600">{app.student?.user?.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)} flex items-center`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {app.proposed_rate} BDT/hr
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {app.proposed_duration || 'Not specified'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>

                        {app.cover_letter && (
                          <p className="text-gray-700 text-sm line-clamp-2">
                            {app.cover_letter}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => viewDetails(app)}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>

                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app.application_id, 'shortlisted')}
                          disabled={processing === app.application_id}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.application_id, 'rejected')}
                          disabled={processing === app.application_id}
                          className="flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {app.status === 'shortlisted' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(app.application_id, 'accepted')}
                          disabled={processing === app.application_id}
                          className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.application_id, 'rejected')}
                          disabled={processing === app.application_id}
                          className="flex items-center justify-center px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {(app.status === 'accepted' || app.status === 'rejected') && (
                      <span className="flex-1 text-center text-sm text-gray-500 py-2">
                        {app.status === 'accepted' ? 'Application Accepted' : 'Application Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {showDetailsModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApp.student?.user?.name || 'Applicant'}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedApp.student?.user?.email}</p>
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
              {/* Status */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Application Status</h3>
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedApp.status)}`}>
                  {selectedApp.status.charAt(0).toUpperCase() + selectedApp.status.slice(1)}
                </span>
              </div>

              {/* Application Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Application Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Applied Date:</span>
                    <p className="font-medium">{new Date(selectedApp.applied_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Proposed Rate:</span>
                    <p className="font-medium">{selectedApp.proposed_rate} BDT/hr</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{selectedApp.proposed_duration || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Availability:</span>
                    <p className="font-medium">{selectedApp.portfolio_links || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {selectedApp.cover_letter && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Cover Letter</h3>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApp.application_id, 'shortlisted');
                      setShowDetailsModal(false);
                    }}
                    disabled={processing === selectedApp.application_id}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                  >
                    Shortlist Applicant
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApp.application_id, 'rejected');
                      setShowDetailsModal(false);
                    }}
                    disabled={processing === selectedApp.application_id}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}

              {selectedApp.status === 'shortlisted' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApp.application_id, 'accepted');
                      setShowDetailsModal(false);
                    }}
                    disabled={processing === selectedApp.application_id}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                  >
                    Accept Applicant
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedApp.application_id, 'rejected');
                      setShowDetailsModal(false);
                    }}
                    disabled={processing === selectedApp.application_id}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

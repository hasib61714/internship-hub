import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building2,
  Calendar,
  Users,
  CheckCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  AlertCircle
} from 'lucide-react';

export default function JobDetails() {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    proposedRate: '',
    expectedDuration: '',
    availability: ''
  });
  const [applicationStatus, setApplicationStatus] = useState(null);

  useEffect(() => {
    fetchJobDetails();
    if (isStudent) {
      checkApplicationStatus();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await api.get('/my-applications');
      const apps = response.data.data || response.data || [];
      const existingApp = apps.find(app => app.job_id === parseInt(id));
      if (existingApp) {
        setApplicationStatus(existingApp.status);
      }
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await api.post(`/jobs/${id}/apply`, {
        job_id: parseInt(id),
        cover_letter: application.coverLetter,
        proposed_rate: application.proposedRate,
        expected_duration: application.expectedDuration,
        availability: application.availability
      });

      alert('Application submitted successfully!');
      setShowApplyModal(false);
      setApplicationStatus('pending');
      fetchJobDetails();
    } catch (error) {
      console.error('Error applying:', error);
      alert(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'full-time': 'bg-blue-100 text-blue-800',
      'part-time': 'bg-green-100 text-green-800',
      'contract': 'bg-purple-100 text-purple-800',
      'internship': 'bg-yellow-100 text-yellow-800',
      'freelance': 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Application Pending' },
      shortlisted: { color: 'bg-blue-100 text-blue-800', text: 'Shortlisted' },
      accepted: { color: 'bg-green-100 text-green-800', text: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Not Selected' }
    };
    return badges[status] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">This job posting doesn't exist or has been removed</p>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-medium">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link to="/jobs" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Building2 className="w-5 h-5 mr-2" />
                    <span className="text-lg">{job.company?.company_name || job.company?.user?.name}</span>
                    {job.company?.user?.is_verified && (
                      <CheckCircle className="w-5 h-5 ml-2 text-blue-600" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getJobTypeColor(job.job_type)}`}>
                      {job.job_type}
                    </span>
                    {job.experience_level && (
                      <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {job.experience_level}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="text-sm">Rate</span>
                  </div>
                  <p className="font-semibold text-gray-900">{job.budget_min} - {job.budget_max} BDT/hr</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-semibold text-gray-900">{job.location}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-semibold text-gray-900">{job.duration || 'Flexible'}</p>
                </div>
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">Applicants</span>
                  </div>
                  <p className="font-semibold text-gray-900">{job.applications_count || 0}</p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* Skills Required */}
            {job.skills_required && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              {applicationStatus ? (
                <div className={`p-4 rounded-lg mb-4 ${getStatusBadge(applicationStatus).color}`}>
                  <p className="font-semibold">{getStatusBadge(applicationStatus).text}</p>
                </div>
              ) : null}

              {isStudent && !applicationStatus && (
                <button
                  onClick={() => setShowApplyModal(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
                >
                  Apply Now
                </button>
              )}

              {!user && (
                <Link
                  to="/login"
                  className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center mb-4"
                >
                  Login to Apply
                </Link>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
                {job.deadline && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">About Company</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{job.company?.company_name}</p>
                  <p className="text-sm text-gray-600">{job.company?.industry}</p>
                </div>
              </div>
              {job.company?.description && (
                <p className="text-sm text-gray-600 mb-4">{job.company.description}</p>
              )}
              <div className="space-y-2 text-sm">
                {job.company?.company_size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{job.company.company_size}</span>
                  </div>
                )}
                {job.company?.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{job.company.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
            </div>
            <form onSubmit={handleApply} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    required
                    rows="6"
                    value={application.coverLetter}
                    onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell the company why you're a great fit for this position..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Hourly Rate (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    value={application.proposedRate}
                    onChange={(e) => setApplication({ ...application, proposedRate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Hours per Week
                  </label>
                  <input
                    type="text"
                    value={application.availability}
                    onChange={(e) => setApplication({ ...application, availability: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 20 hours/week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Duration
                  </label>
                  <input
                    type="text"
                    value={application.expectedDuration}
                    onChange={(e) => setApplication({ ...application, expectedDuration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 3 months"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

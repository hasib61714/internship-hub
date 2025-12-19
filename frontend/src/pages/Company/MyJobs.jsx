import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { JobCardSkeleton } from '../../components/LoadingSkeleton';
import { NoApplications } from '../../components/EmptyState';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, shortlisted, accepted, rejected

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-applications');
      if (response.data.success) {
        setApplications(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredApplications = applications.filter(app => 
    filter === 'all' ? true : app.status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return <NoApplications role="student" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: 'All', count: applications.length },
              { value: 'pending', label: 'Pending', count: applications.filter(a => a.status === 'pending').length },
              { value: 'shortlisted', label: 'Shortlisted', count: applications.filter(a => a.status === 'shortlisted').length },
              { value: 'accepted', label: 'Accepted', count: applications.filter(a => a.status === 'accepted').length },
              { value: 'rejected', label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length },
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {filter !== 'all' ? filter : ''} applications
            </h3>
            <p className="text-gray-600">
              {filter !== 'all' 
                ? `You don't have any ${filter} applications yet.`
                : 'Start applying to jobs to see them here.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map(application => (
              <div
                key={application.application_id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                {/* Job Title */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {application.job.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application.job.company?.user?.name || 'Company'}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(application.status)}`}>
                    {application.status.toUpperCase()}
                  </span>
                </div>

                {/* Application Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Applied: {new Date(application.applied_at).toLocaleDateString()}
                  </div>
                  
                  {application.proposed_rate && (
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Proposed: ৳{application.proposed_rate}
                    </div>
                  )}
                </div>

                {/* Company Notes */}
                {application.company_notes && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                    <p className="text-sm text-gray-700">
                      <strong className="text-blue-700">Company Note:</strong><br />
                      {application.company_notes}
                    </p>
                  </div>
                )}

                {/* Cover Letter Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {application.cover_letter}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/jobs/${application.job.job_id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm text-center rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Job
                  </Link>
                  <button
                    onClick={() => {
                      toast.success('Opening application details...');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {applications.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(a => a.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 'shortlisted').length}
                </div>
                <div className="text-sm text-gray-600">Shortlisted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter(a => a.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
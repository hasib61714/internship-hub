import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { JobCardSkeleton } from '../../components/LoadingSkeleton';
import { NoSavedJobs } from '../../components/EmptyState';

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/saved-jobs');
      if (response.data.success) {
        setSavedJobs(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}/unsave`);
      if (response.data.success) {
        toast.success('Job removed from saved list');
        setSavedJobs(savedJobs.filter(saved => saved.job.job_id !== jobId));
      }
    } catch (error) {
      console.error('Failed to unsave job:', error);
      toast.error('Failed to remove job');
    }
  };

  const formatSalary = (job) => {
    if (job.payment_type === 'hourly' && job.hourly_rate) {
      return `৳${job.hourly_rate}/hr`;
    } else if (job.budget_min && job.budget_max) {
      return `৳${job.budget_min} - ৳${job.budget_max}`;
    }
    return 'Negotiable';
  };

  const getJobTypeBadge = (type) => {
    const badges = {
      'internship': 'bg-blue-100 text-blue-800',
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-yellow-100 text-yellow-800',
      'project': 'bg-purple-100 text-purple-800',
      'hourly': 'bg-pink-100 text-pink-800',
      'daily': 'bg-orange-100 text-orange-800'
    };
    return badges[type] || 'bg-gray-100 text-gray-800';
  };

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

  if (savedJobs.length === 0) {
    return <NoSavedJobs />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💾 Saved Jobs
          </h1>
          <p className="text-gray-600">
            You have {savedJobs.length} saved {savedJobs.length === 1 ? 'job' : 'jobs'}
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobs.map(savedJob => {
            const job = savedJob.job;
            return (
              <div
                key={savedJob.saved_job_id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 relative"
              >
                {/* Unsave Button */}
                <button
                  onClick={() => handleUnsave(job.job_id)}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Remove from saved"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Job Header */}
                <div className="mb-4 pr-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {job.company?.user?.name || 'Company'}
                  </p>
                </div>

                {/* Job Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatSalary(job)}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Saved {new Date(savedJob.saved_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getJobTypeBadge(job.job_type)}`}>
                    {job.job_type}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                    {job.work_mode}
                  </span>
                  {job.is_urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                      URGENT
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {job.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/jobs/${job.job_id}`}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm text-center rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => {
                      // Navigate to application
                      window.location.href = `/jobs/${job.job_id}`;
                    }}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Pro Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Apply to saved jobs before they expire or get filled</li>
            <li>• Review job requirements carefully before applying</li>
            <li>• Customize your cover letter for each application</li>
            <li>• Keep your profile updated for better chances</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
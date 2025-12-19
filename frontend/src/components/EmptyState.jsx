// EmptyState.jsx - Reusable empty state component
// Location: frontend/src/components/EmptyState.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export function EmptyState({ 
  icon = '📭', 
  title = 'No data found', 
  description = 'Nothing to show here yet',
  actionLabel,
  actionLink,
  onAction
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {actionLabel && (
        <>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// Specific Empty States
export function NoJobsFound({ onClearFilters }) {
  return (
    <EmptyState
      icon="🔍"
      title="No jobs found"
      description="Try adjusting your filters or search terms to find what you're looking for"
      actionLabel="Clear All Filters"
      onAction={onClearFilters}
    />
  );
}

export function NoApplications({ role }) {
  if (role === 'student') {
    return (
      <EmptyState
        icon="📝"
        title="No applications yet"
        description="Start applying to jobs to see your applications here"
        actionLabel="Browse Jobs"
        actionLink="/jobs"
      />
    );
  }
  
  return (
    <EmptyState
      icon="📝"
      title="No applications received"
      description="You haven't received any applications yet"
    />
  );
}

export function NoSavedJobs() {
  return (
    <EmptyState
      icon="💾"
      title="No saved jobs"
      description="Save jobs you're interested in to view them later"
      actionLabel="Browse Jobs"
      actionLink="/jobs"
    />
  );
}

export function NoPostedJobs() {
  return (
    <EmptyState
      icon="💼"
      title="No jobs posted"
      description="Post your first job to start receiving applications"
      actionLabel="Post a Job"
      actionLink="/company/post-job"
    />
  );
}

export function NoUsers() {
  return (
    <EmptyState
      icon="👥"
      title="No users found"
      description="No users match your search criteria"
    />
  );
}

export function NoVerifications() {
  return (
    <EmptyState
      icon="✓"
      title="No pending verifications"
      description="All verification requests have been processed"
    />
  );
}

export function NoReports() {
  return (
    <EmptyState
      icon="🚨"
      title="No reports"
      description="There are no reports to review at this time"
    />
  );
}

export function ErrorState({ onRetry }) {
  return (
    <EmptyState
      icon="⚠️"
      title="Something went wrong"
      description="We encountered an error while loading this page"
      actionLabel="Try Again"
      onAction={onRetry}
    />
  );
}

export function ComingSoon() {
  return (
    <EmptyState
      icon="🚀"
      title="Coming Soon"
      description="This feature is under development and will be available soon"
    />
  );
}

// 404 Not Found
export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default EmptyState;
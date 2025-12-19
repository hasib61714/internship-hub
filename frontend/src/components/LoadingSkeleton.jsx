// LoadingSkeleton.jsx - Reusable loading skeleton component
// Location: frontend/src/components/LoadingSkeleton.jsx

import React from 'react';

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
      </div>
      
      <div className="h-16 bg-gray-200 rounded mb-4"></div>
      
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="bg-gray-50 p-4 border-b">
          <div className="flex gap-4">
            {[...Array(cols)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded flex-1"></div>
            ))}
          </div>
        </div>
        
        {/* Rows */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 border-b">
            <div className="flex gap-4">
              {[...Array(cols)].map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-200 rounded flex-1"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default {
  JobCardSkeleton,
  TableSkeleton,
  DashboardCardSkeleton,
  ProfileSkeleton
};

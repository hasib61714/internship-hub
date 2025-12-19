import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    job_type: '',
    work_mode: '',
    payment_type: '',
    experience_level: '',
    location: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.current_page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...filters,
        page: pagination.current_page,
        per_page: pagination.per_page
      });

      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (!filters[key]) params.delete(key);
      });

      const response = await api.get(`/jobs?${params}`);
      
      if (response.data.success) {
        setJobs(response.data.data.data || []);
        setPagination({
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      job_type: '',
      work_mode: '',
      payment_type: '',
      experience_level: '',
      location: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
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

  const getWorkModeBadge = (mode) => {
    const badges = {
      'remote': 'bg-green-100 text-green-800',
      'on-site': 'bg-blue-100 text-blue-800',
      'hybrid': 'bg-purple-100 text-purple-800'
    };
    return badges[mode] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Jobs</h1>
          <p className="text-gray-600">
            Find your perfect internship or job opportunity
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs by title or description..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Category */}
              <select
                name="category_id"
                value={filters.category_id}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Job Type */}
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Job Types</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
                <option value="project">Project</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>

              {/* Work Mode */}
              <select
                name="work_mode"
                value={filters.work_mode}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Work Modes</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {/* Experience Level */}
              <select
                name="experience_level"
                value={filters.experience_level}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="entry">Entry Level</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>

              {/* Sort By */}
              <select
                name="sort_by"
                value={filters.sort_by}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="created_at">Latest</option>
                <option value="title">Title</option>
                <option value="budget_max">Highest Budget</option>
              </select>

              {/* Clear Filters */}
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </form>

          {/* Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {jobs.length} of {pagination.total} jobs
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <div key={job.job_id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                  {/* Job Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {job.company?.user?.name || 'Company'}
                      </p>
                    </div>
                    {job.is_urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                        URGENT
                      </span>
                    )}
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
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getJobTypeBadge(job.job_type)}`}>
                      {job.job_type}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getWorkModeBadge(job.work_mode)}`}>
                      {job.work_mode}
                    </span>
                    {job.category && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                        {job.category.name}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-xs text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/jobs/${job.job_id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.last_page > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-600">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
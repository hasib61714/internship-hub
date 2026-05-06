'use client';

import { useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Briefcase, X } from 'lucide-react';
import { useJobs, useCategories } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import JobCard from '@/components/JobCard';
import { JobCardSkeleton } from '@/components/SkeletonCard';

const JOB_TYPES = ['internship', 'full-time', 'part-time', 'project', 'hourly'];
const WORK_MODES = ['remote', 'on-site', 'hybrid'];
const LIMIT = 12;

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ categoryId: '', jobType: '', workMode: '' });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({ search: '', ...filters, page: 1, limit: LIMIT });

  const { data, isLoading } = useJobs(query);
  const { data: categories } = useCategories();

  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const applySearch = useCallback(() => {
    const q = { search, ...filters, page: 1, limit: LIMIT };
    setQuery(q);
    setPage(1);
  }, [search, filters]);

  function changePage(newPage) {
    setPage(newPage);
    setQuery(q => ({ ...q, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearFilters() {
    setFilters({ categoryId: '', jobType: '', workMode: '' });
    setSearch('');
    setPage(1);
    setQuery({ search: '', categoryId: '', jobType: '', workMode: '', page: 1, limit: LIMIT });
  }

  const hasActiveFilters = search || Object.values(filters).some(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Search + filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applySearch()}
              placeholder="Search jobs, skills, companies..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <Select value={filters.categoryId} onChange={e => setFilters(p => ({ ...p, categoryId: e.target.value }))} className="sm:w-44">
            <option value="">All categories</option>
            {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={filters.jobType} onChange={e => setFilters(p => ({ ...p, jobType: e.target.value }))} className="sm:w-40">
            <option value="">All types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={filters.workMode} onChange={e => setFilters(p => ({ ...p, workMode: e.target.value }))} className="sm:w-36">
            <option value="">All modes</option>
            {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Button onClick={applySearch}>Search</Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {total} job{total !== 1 ? 's' : ''} found
          {totalPages > 1 && <span className="text-sm font-normal text-gray-400 ml-2">· Page {page} of {totalPages}</span>}
        </h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
            <X className="h-4 w-4" /> Clear filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No jobs found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => <JobCard key={job.id} job={job} />)}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let p;
                  if (totalPages <= 7) p = i + 1;
                  else if (page <= 4) p = i + 1;
                  else if (page >= totalPages - 3) p = totalPages - 6 + i;
                  else p = page - 3 + i;
                  return (
                    <button
                      key={p}
                      onClick={() => changePage(p)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

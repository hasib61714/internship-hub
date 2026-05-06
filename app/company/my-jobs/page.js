'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, Pencil, Trash2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyJobs, useDeleteJob } from '@/hooks/useJobs';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { STATUS_COLORS, JOB_TYPE_COLORS, timeAgo } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function MyJobsPage() {
  const { user } = useAuth();
  const { data: jobs = [], isLoading } = useCompanyJobs(user?.id);
  const deleteMutation = useDeleteJob();

  if (isLoading) return <FullPageSpinner />;

  async function handleDelete(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Job deleted');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-500 mt-1">{jobs.length} job posting{jobs.length !== 1 && 's'}</p>
        </div>
        <Link href="/company/post-job">
          <Button><Plus className="h-4 w-4" /> Post Job</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <p className="text-gray-500 font-medium">No jobs posted yet</p>
            <Link href="/company/post-job" className="text-blue-500 text-sm hover:underline">Post your first job</Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={JOB_TYPE_COLORS[job.job_type]}>{job.job_type}</Badge>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><Users className="h-3 w-3" />{job.applications_count} applicants</span>
                      <span className="text-xs text-gray-400">{timeAgo(job.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/company/jobs/${job.id}/applications`}>
                      <Button variant="ghost" size="icon" title="View applications"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Link href={`/company/edit-job/${job.id}`}>
                      <Button variant="ghost" size="icon" title="Edit"><Pencil className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(job.id, job.title)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

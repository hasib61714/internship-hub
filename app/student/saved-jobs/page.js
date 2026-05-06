'use client';

import { Bookmark, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedJobs, useUnsaveJob } from '@/hooks/useApplications';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import { JOB_TYPE_COLORS, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function SavedJobsPage() {
  const { user } = useAuth();
  const { data: savedJobs = [], isLoading } = useSavedJobs(user?.id);
  const unsaveMutation = useUnsaveJob();

  if (isLoading) return <FullPageSpinner />;

  async function handleUnsave(jobId) {
    await unsaveMutation.mutateAsync({ jobId, studentId: user.id });
    toast.success('Removed from saved jobs');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="text-gray-500 mt-1">{savedJobs.length} saved job{savedJobs.length !== 1 && 's'}</p>
      </div>

      {savedJobs.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <Bookmark className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No saved jobs</p>
            <Link href="/jobs" className="text-sm text-blue-500 hover:underline mt-1 inline-block">Browse jobs to save</Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedJobs.map(({ id, job_id, jobs }) => (
            <Card key={id} className="hover:shadow-md transition-shadow">
              <div className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {jobs?.company_profiles?.company_name?.[0] ?? '?'}
                  </div>
                  <div>
                    <Link href={`/jobs/${jobs?.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                      {jobs?.title}
                    </Link>
                    <p className="text-sm text-gray-500">{jobs?.company_profiles?.company_name}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {jobs?.job_type && <Badge className={JOB_TYPE_COLORS[jobs.job_type]}>{jobs.job_type}</Badge>}
                      <span className="flex items-center gap-0.5 text-xs text-gray-400"><MapPin className="h-3 w-3" />{jobs?.location}</span>
                      {jobs?.budget_min && <span className="text-xs text-green-600">{formatCurrency(jobs.budget_min)}/mo</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => handleUnsave(jobs?.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

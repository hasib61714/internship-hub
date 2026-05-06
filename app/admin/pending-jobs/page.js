'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MapPin, Building2, AlertCircle } from 'lucide-react';
import { usePendingJobs, useApproveJob, useRejectJobWithReason } from '@/hooks/useJobs';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import PageHeader from '@/components/PageHeader';
import Badge from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { JOB_TYPE_COLORS, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PendingJobsPage() {
  const { data: jobs = [], isLoading } = usePendingJobs();
  const approveMutation = useApproveJob();
  const rejectMutation = useRejectJobWithReason();
  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState('');

  async function handleApprove(id, title) {
    try {
      await approveMutation.mutateAsync(id);
      toast.success(`"${title}" approved!`);
    } catch (err) { toast.error(err.message); }
  }

  async function handleRejectSubmit() {
    if (!reason.trim()) return;
    try {
      await rejectMutation.mutateAsync({ id: rejectTarget.id, reason });
      toast.success('Job rejected');
      setRejectTarget(null);
      setReason('');
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Pending Job Reviews"
        description={isLoading ? 'Loading...' : `${jobs.length} job${jobs.length !== 1 ? 's' : ''} awaiting review`}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
      ) : jobs.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">All caught up!</p>
            <p className="text-sm text-gray-400">No pending jobs to review</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card key={job.id}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/jobs/${job.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600">
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {job.company_profiles?.company_name}
                      {job.company_profiles?.is_verified && <CheckCircle className="h-3.5 w-3.5 text-blue-500" />}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={JOB_TYPE_COLORS[job.job_type]}>{job.job_type}</Badge>
                      <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="text-xs text-gray-400">{timeAgo(job.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="success" onClick={() => handleApprove(job.id, job.title)} loading={approveMutation.isPending}>
                      <CheckCircle className="h-4 w-4" /> Approve
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => { setRejectTarget(job); setReason(''); }}>
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
                {job.description && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Reject modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Job">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">{rejectTarget?.title}</p>
              <p className="text-xs text-gray-500">{rejectTarget?.company_profiles?.company_name}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why this job is being rejected..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRejectSubmit} disabled={!reason.trim()} loading={rejectMutation.isPending}>
              Reject Job
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

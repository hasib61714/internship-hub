'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, MapPin, Calendar, XCircle, AlertCircle, Star, Video, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMyApplications, useWithdrawApplication } from '@/hooks/useApplications';
import { useStudentInterviews } from '@/hooks/useInterviews';
import { Card } from '@/components/ui/Card';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import PageHeader from '@/components/PageHeader';
import { STATUS_COLORS, timeAgo, formatDate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ReviewModal from '@/components/ReviewModal';
import toast from 'react-hot-toast';

export default function StudentApplicationsPage() {
  const { user } = useAuth();
  const { data: applications = [], isLoading } = useMyApplications(user?.id);
  const { data: interviews = [] } = useStudentInterviews(user?.id);
  const withdraw = useWithdrawApplication();
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);

  const interviewMap = Object.fromEntries(interviews.map(i => [i.application_id, i]));

  async function handleWithdraw(app) {
    if (!confirm(`Withdraw application for "${app.jobs?.title}"?`)) return;
    setWithdrawingId(app.id);
    try {
      await withdraw.mutateAsync(app.id);
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err.message || 'Failed to withdraw');
    } finally {
      setWithdrawingId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="My Applications"
        description={isLoading ? 'Loading...' : `${applications.length} application${applications.length !== 1 ? 's' : ''}`}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              <Link href="/jobs" className="text-blue-500 hover:underline">Browse jobs</Link> and apply today
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app, i) => {
            const job = app.jobs;
            return (
              <motion.div key={app.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm shrink-0">
                          {job?.company_profiles?.company_name?.[0] ?? '?'}
                        </div>
                        <div>
                          <Link href={`/jobs/${job?.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600">
                            {job?.title}
                          </Link>
                          <p className="text-sm text-gray-500">{job?.company_profiles?.company_name}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="h-3 w-3" />{job?.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />Applied {timeAgo(app.applied_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                        {app.status === 'accepted' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setReviewTarget(app)}
                            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                          >
                            <Star className="h-3.5 w-3.5" /> Rate
                          </Button>
                        )}
                        {app.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleWithdraw(app)}
                            loading={withdrawingId === app.id}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {app.cover_letter && (
                      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg line-clamp-2">
                        {app.cover_letter}
                      </p>
                    )}

                    {app.status === 'rejected' && app.rejection_reason && (
                      <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span><strong>Reason:</strong> {app.rejection_reason}</span>
                      </div>
                    )}

                    {interviewMap[app.id] && interviewMap[app.id].status === 'scheduled' && (
                      <div className="mt-3 flex items-center justify-between gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <Video className="h-4 w-4 shrink-0" />
                          <div>
                            <span className="font-medium">Interview Scheduled</span>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {new Date(interviewMap[app.id].scheduled_at).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                            {interviewMap[app.id].notes && <p className="text-xs text-gray-500 mt-0.5">{interviewMap[app.id].notes}</p>}
                          </div>
                        </div>
                        <a href={interviewMap[app.id].meeting_link} target="_blank" rel="noreferrer">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <ExternalLink className="h-3.5 w-3.5" /> Join
                          </Button>
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <ReviewModal
        isOpen={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        application={reviewTarget}
        revieweeId={reviewTarget?.jobs?.company_profiles?.id ?? reviewTarget?.jobs?.company_id}
        revieweeName={reviewTarget?.jobs?.company_profiles?.company_name ?? 'Company'}
      />
    </div>
  );
}

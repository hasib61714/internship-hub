'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { ExternalLink, FileText, Video } from 'lucide-react';
import { useJobApplications, useUpdateApplicationStatus, useRejectApplicationWithReason } from '@/hooks/useApplications';
import { useJob } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ScheduleInterviewModal from '@/components/ScheduleInterviewModal';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import PageHeader from '@/components/PageHeader';
import { STATUS_COLORS, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'reviewing', 'shortlisted', 'accepted', 'rejected'];

export default function JobApplicationsPage() {
  const { id } = useParams();
  const { profile } = useAuth();
  const { data: job } = useJob(id);
  const { data: applications = [], isLoading } = useJobApplications(id);
  const updateStatus = useUpdateApplicationStatus();
  const rejectWithReason = useRejectApplicationWithReason();
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [interviewTarget, setInterviewTarget] = useState(null);

  async function handleStatusChange(applicationId, status) {
    if (status === 'rejected') {
      const app = applications.find(a => a.id === applicationId);
      setRejectTarget(app);
      setRejectReason('');
      return;
    }
    try {
      await updateStatus.mutateAsync({ id: applicationId, status });
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleRejectSubmit() {
    if (!rejectTarget) return;
    try {
      if (rejectReason.trim()) {
        await rejectWithReason.mutateAsync({ id: rejectTarget.id, reason: rejectReason });
      } else {
        await updateStatus.mutateAsync({ id: rejectTarget.id, status: 'rejected' });
      }
      toast.success('Application rejected');
      setRejectTarget(null);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title={job?.title ?? 'Applications'}
        description={isLoading ? 'Loading...' : `${applications.length} application${applications.length !== 1 ? 's' : ''}`}
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
      ) : applications.length === 0 ? (
        <Card>
          <div className="p-12 text-center text-gray-400 dark:text-gray-500">No applications yet for this job.</div>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const student = app.student_profiles;
            const profile = student?.profiles;
            return (
              <Card key={app.id} className="hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 font-bold flex items-center justify-center text-sm shrink-0">
                        {profile?.name?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <button onClick={() => setSelectedApp(app)} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 text-left">
                          {profile?.name}
                        </button>
                        <p className="text-xs text-gray-400">{profile?.email}</p>
                        {student?.university && <p className="text-xs text-gray-500 mt-0.5">{student.university} — {student.department}</p>}
                        {student?.skills && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {student.skills.split(',').slice(0, 4).map(s => (
                              <span key={s} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">{s.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(app.status === 'shortlisted' || app.status === 'accepted') && (
                        <Button size="sm" variant="outline" onClick={() => setInterviewTarget(app)} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <Video className="h-3.5 w-3.5" /> Interview
                        </Button>
                      )}
                      <select
                        value={app.status}
                        onChange={e => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[app.status]}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  {app.cover_letter && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg line-clamp-2">{app.cover_letter}</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Rejection reason modal */}
      <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Application">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Rejecting <strong>{rejectTarget?.student_profiles?.profiles?.name}</strong>.
            Optionally provide a reason — it will be shown to the applicant.
          </p>
          <textarea
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            rows={3}
            placeholder="Reason (optional)..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleRejectSubmit} loading={rejectWithReason.isPending || updateStatus.isPending}>
              Reject
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={!!interviewTarget}
        onClose={() => setInterviewTarget(null)}
        application={interviewTarget}
        companyId={profile?.id}
      />

      {/* Applicant detail modal */}
      {selectedApp && (
        <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title="Applicant Details" size="lg">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[
                ['Name', selectedApp.student_profiles?.profiles?.name],
                ['Email', selectedApp.student_profiles?.profiles?.email],
                ['University', selectedApp.student_profiles?.university],
                ['Department', selectedApp.student_profiles?.department],
                ['CGPA', selectedApp.student_profiles?.cgpa],
                ['Experience', selectedApp.student_profiles?.experience_level],
                ['Availability', selectedApp.student_profiles?.availability],
                ['Applied', formatDate(selectedApp.applied_at)],
              ].map(([label, value]) => value ? (
                <div key={label}>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">{value}</p>
                </div>
              ) : null)}
            </div>
            {selectedApp.student_profiles?.bio && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Bio</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedApp.student_profiles.bio}</p>
              </div>
            )}
            {selectedApp.cover_letter && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Cover Letter</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">{selectedApp.cover_letter}</p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {selectedApp.student_profiles?.resume_url && (
                <a href={selectedApp.student_profiles.resume_url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm"><FileText className="h-3.5 w-3.5 mr-1" /> Resume</Button>
                </a>
              )}
              {selectedApp.student_profiles?.linkedin_url && (
                <a href={selectedApp.student_profiles.linkedin_url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1" /> LinkedIn</Button>
                </a>
              )}
              {selectedApp.student_profiles?.github_url && (
                <a href={selectedApp.student_profiles.github_url} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm"><ExternalLink className="h-3.5 w-3.5 mr-1" /> GitHub</Button>
                </a>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, DollarSign, Calendar, ArrowLeft, Users, Building2, CheckCircle } from 'lucide-react';
import { useCheckApplied, useApplyToJob, useSaveJob, useUnsaveJob } from '@/hooks/useApplications';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { cn, formatCurrency, formatDate, JOB_TYPE_COLORS } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function JobDetailClient({ job }) {
  const router = useRouter();
  const { user, isStudent } = useAuth();
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: applied } = useCheckApplied(job.id, user?.id);
  const applyMutation = useApplyToJob();
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const company = job.company_profiles;

  async function handleApply() {
    if (!user) { router.push('/login'); return; }
    try {
      await applyMutation.mutateAsync({ jobId: job.id, studentId: user.id, coverLetter });
      toast.success('Application submitted!');
      setApplyModal(false);
      setCoverLetter('');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSave() {
    if (!user) { router.push('/login'); return; }
    try {
      await saveMutation.mutateAsync({ jobId: job.id, studentId: user.id });
      toast.success('Job saved!');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleUnsave() {
    if (!user) return;
    try {
      await unsaveMutation.mutateAsync({ jobId: job.id, studentId: user.id });
      toast.success('Removed from saved jobs');
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                {company?.logo_url ? (
                  <img src={company.logo_url} alt={company.company_name} className="h-16 w-16 rounded-xl object-cover border border-gray-100 dark:border-gray-700 shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                    {company?.company_name?.[0] ?? '?'}
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {company?.company_name}
                    {company?.is_verified && <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={JOB_TYPE_COLORS[job.job_type]}>{job.job_type}</Badge>
                <Badge variant="default">{job.work_mode}</Badge>
                {job.categories && <Badge variant="indigo">{job.categories.name}</Badge>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
                {[
                  { icon: MapPin,     label: 'Location', value: job.location },
                  { icon: Clock,      label: 'Duration',  value: job.duration || 'Not specified' },
                  { icon: DollarSign, label: 'Salary',    value: job.budget_min ? `${formatCurrency(job.budget_min)}${job.budget_max ? `–${formatCurrency(job.budget_max)}` : ''}/mo` : 'Not disclosed' },
                  { icon: Calendar,   label: 'Deadline',  value: formatDate(job.deadline) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><Icon className="h-3 w-3" />{label}</p>
                    <p className="text-sm font-medium text-gray-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{job.description}</div>
            </div>
          </Card>

          {job.requirements && (
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{job.requirements}</div>
              </div>
            </Card>
          )}

          {job.skills_required && (
            <Card>
              <div className="p-6">
                <h2 className="font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills_required.split(',').map(s => (
                    <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">{s.trim()}</span>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <div className="p-5 flex flex-col gap-3">
              {isStudent && !applied && (
                <Button className="w-full" onClick={() => setApplyModal(true)}>Apply Now</Button>
              )}
              {isStudent && applied && (
                <div className="w-full py-2.5 px-4 bg-green-50 text-green-700 text-sm font-medium rounded-lg text-center flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Applied — {applied.status}
                </div>
              )}
              {isStudent && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={applied ? handleUnsave : handleSave}
                  loading={saveMutation.isPending || unsaveMutation.isPending}
                >
                  {applied ? 'Remove Saved' : 'Save Job'}
                </Button>
              )}
              {!user && (
                <Link href="/login">
                  <Button className="w-full">Login to Apply</Button>
                </Link>
              )}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 justify-center">
                <Users className="h-3.5 w-3.5" /> {job.applications_count} applicants
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900 mb-3">About the Company</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium">{company?.company_name}</p>
                {company?.industry && <p className="text-gray-400">{company.industry}</p>}
                {company?.company_location && (
                  <p className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{company.company_location}</p>
                )}
                {company?.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline block truncate">
                    {company.website}
                  </a>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={applyModal} onClose={() => setApplyModal(false)} title="Apply for this position">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Applying for <strong>{job.title}</strong> at {company?.company_name}.
          </p>
          <Textarea
            label="Cover Letter (optional)"
            placeholder="Tell the employer why you're a great fit..."
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            rows={6}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setApplyModal(false)}>Cancel</Button>
            <Button onClick={handleApply} loading={applyMutation.isPending}>Submit Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

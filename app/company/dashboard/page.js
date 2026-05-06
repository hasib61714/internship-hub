'use client';

import { motion } from 'framer-motion';
import { Briefcase, Users, Plus, Eye, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCompanyJobs } from '@/hooks/useJobs';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { StatCardSkeleton, ListRowSkeleton } from '@/components/SkeletonCard';
import { STATUS_COLORS, timeAgo } from '@/lib/utils';

export default function CompanyDashboard() {
  const { user, profile } = useAuth();
  const { data: jobs = [], isLoading } = useCompanyJobs(user?.id);

  const counts = {
    total:           jobs.length,
    active:          jobs.filter(j => j.status === 'active').length,
    pending:         jobs.filter(j => j.status === 'pending').length,
    totalApplicants: jobs.reduce((s, j) => s + (j.applications_count ?? 0), 0),
  };

  const statCards = [
    { label: 'Total Jobs',       value: counts.total,           icon: Briefcase,   color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Active',           value: counts.active,          icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Pending Review',   value: counts.pending,         icon: Clock,       color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Total Applicants', value: counts.totalApplicants, icon: Users,       color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader
        title="Company Dashboard"
        description="Manage your job postings and applicants"
        action={
          <Link href="/company/post-job">
            <Button><Plus className="h-4 w-4 mr-1" /> Post a Job</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ label, value, icon, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <StatCard label={label} value={value} icon={icon} color={color} bg={bg} />
              </motion.div>
            ))
        }
      </div>

      {/* Recent jobs */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Job Postings</h2>
          <Link href="/company/my-jobs">
            <Button variant="ghost" size="sm" className="text-blue-600">View all</Button>
          </Link>
        </div>

        {isLoading ? (
          <ListRowSkeleton rows={4} />
        ) : jobs.length === 0 ? (
          <div className="p-10 text-center">
            <Briefcase className="h-10 w-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No jobs posted yet</p>
            <Link href="/company/post-job" className="text-blue-500 text-sm hover:underline">Post your first job</Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 dark:divide-gray-700/50">
            {jobs.slice(0, 5).map(job => (
              <li key={job.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</p>
                  <p className="text-xs text-gray-400">{timeAgo(job.created_at)} · {job.applications_count} applicants</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                  <Link href={`/company/jobs/${job.id}/applications`}>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

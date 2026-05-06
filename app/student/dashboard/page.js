'use client';

import { motion } from 'framer-motion';
import { Briefcase, FileText, BookmarkCheck, User, ArrowRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMyApplications } from '@/hooks/useApplications';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { StatCardSkeleton, ListRowSkeleton } from '@/components/SkeletonCard';
import { STATUS_COLORS, timeAgo } from '@/lib/utils';
import AIJobMatch from '@/components/AIJobMatch';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const { data: applications = [], isLoading } = useMyApplications(user?.id);

  const counts = {
    total:       applications.length,
    pending:     applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted:    applications.filter(a => a.status === 'accepted').length,
  };

  const statCards = [
    { label: 'Applied',     value: counts.total,       icon: FileText,      color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Pending',     value: counts.pending,     icon: Clock,         color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Shortlisted', value: counts.shortlisted, icon: Briefcase,     color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Accepted',    value: counts.accepted,    icon: BookmarkCheck, color: 'text-green-600',  bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader
          title={`Welcome back, ${profile?.name ?? '...'} 👋`}
          description="Track your applications and find new opportunities."
        />
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ label, value, icon, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <StatCard label={label} value={value} icon={icon} color={color} bg={bg} />
              </motion.div>
            ))
        }
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { href: '/jobs',                  icon: Briefcase,     label: 'Browse Jobs',    desc: 'Find new opportunities' },
          { href: '/student/saved-jobs',   icon: BookmarkCheck, label: 'Saved Jobs',     desc: 'Jobs you bookmarked' },
          { href: '/student/cv-analyzer',  icon: Sparkles,      label: 'AI CV Analyzer', desc: 'Get AI feedback on your CV' },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group p-5">
              <Icon className="h-6 w-6 text-blue-500 mb-2" />
              <p className="font-semibold text-gray-800 group-hover:text-blue-600">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* AI Job Matches */}
      <AIJobMatch />

      {/* Recent applications */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <Link href="/student/applications">
            <Button variant="ghost" size="sm" className="text-blue-600">
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <ListRowSkeleton rows={4} />
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No applications yet. <Link href="/jobs" className="text-blue-500 hover:underline">Browse jobs</Link></p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {applications.slice(0, 5).map(app => (
              <li key={app.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.jobs?.title}</p>
                  <p className="text-xs text-gray-400">{app.jobs?.company_profiles?.company_name} · {timeAgo(app.applied_at)}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>{app.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

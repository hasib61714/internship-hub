'use client';

import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, Clock, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { StatCardSkeleton } from '@/components/SkeletonCard';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getAdminStats,
  });

  const statCards = [
    { label: 'Total Jobs',     value: stats?.totalJobs,         icon: Briefcase, color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Total Users',    value: stats?.totalUsers,        icon: Users,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Applications',   value: stats?.totalApplications, icon: FileText,  color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Pending Review', value: stats?.pendingJobs,       icon: Clock,     color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const quickLinks = [
    { href: '/admin/pending-jobs',  icon: Clock,     label: 'Review Jobs',    badge: stats?.pendingJobs },
    { href: '/admin/users',         icon: Users,     label: 'Manage Users' },
    { href: '/admin/verifications', icon: Building2, label: 'Verifications' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader title="Admin Dashboard" description="Platform overview and management" />

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

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {quickLinks.map(({ href, icon: Icon, label, badge }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group p-5">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-blue-500" />
                {badge ? (
                  <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">{badge}</span>
                ) : null}
              </div>
              <p className="font-semibold text-gray-800 group-hover:text-blue-600 mt-3">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

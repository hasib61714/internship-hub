'use client';

import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAdminAnalytics } from '@/hooks/useJobs';
import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '@/lib/queries';
import { Card } from '@/components/ui/Card';
import StatCard from '@/components/StatCard';
import PageHeader from '@/components/PageHeader';
import { StatCardSkeleton } from '@/components/SkeletonCard';
import { Briefcase, Users, Building2, FileText } from 'lucide-react';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#84cc16'];

export default function AdminAnalyticsPage() {
  const { data: analytics, isLoading } = useAdminAnalytics();
  const { data: stats } = useQuery({ queryKey: ['admin-stats'], queryFn: getAdminStats });

  const overviewCards = [
    { label: 'Total Jobs',       value: stats?.totalJobs,         icon: Briefcase, color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Total Users',      value: stats?.totalUsers,        icon: Users,     color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Applications',     value: stats?.totalApplications, icon: FileText,  color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Verified Co.',     value: analytics?.verifiedCompanies, icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageHeader title="Analytics" description="Platform performance overview" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {!stats
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : overviewCards.map(({ label, value, icon, color, bg }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <StatCard label={label} value={value} icon={icon} color={color} bg={bg} />
              </motion.div>
            ))
        }
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-72 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jobs by Category */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Active Jobs by Category</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={analytics?.jobsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {(analytics?.jobsByCategory ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Jobs by Type */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Jobs by Type</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics?.jobsByType} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Applications by Status */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Applications by Status</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics?.applicationsByStatus} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4,4,0,0]}>
                    {(analytics?.applicationsByStatus ?? []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Last 30 days highlights */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Last 30 Days</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Jobs Posted</span>
                  <span className="text-2xl font-bold text-blue-600">{analytics?.recentJobsCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Users Registered</span>
                  <span className="text-2xl font-bold text-green-600">{analytics?.recentUsersCount ?? 0}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Companies</span>
                  <span className="text-2xl font-bold text-purple-600">{analytics?.verifiedCompanies ?? 0}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

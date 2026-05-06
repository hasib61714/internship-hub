'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, ShieldCheck, Search, UserX, UserCheck, Filter } from 'lucide-react';
import { useAllUsers, useSuspendUser, useActivateUser } from '@/hooks/useAdmin';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

const ROLE_ICONS = { student: GraduationCap, company: Building2, admin: ShieldCheck };
const ROLE_COLORS = { student: 'blue', company: 'purple', admin: 'red' };

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAllUsers();
  const suspend = useSuspendUser();
  const activate = useActivateUser();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchStatus = !statusFilter
        || (statusFilter === 'suspended' && u.is_suspended)
        || (statusFilter === 'active' && !u.is_suspended);
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  async function handleToggleSuspend(u) {
    const action = u.is_suspended ? 'Activate' : 'Suspend';
    if (!confirm(`${action} "${u.name}"?`)) return;
    try {
      if (u.is_suspended) await activate.mutateAsync(u.id);
      else await suspend.mutateAsync(u.id);
      toast.success(`User ${u.is_suspended ? 'activated' : 'suspended'}`);
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="All Users"
        description={isLoading ? 'Loading...' : `${filtered.length} of ${users.length} users`}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <ListRowSkeleton key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No users match your filters.</p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {filtered.map((u, i) => {
                  const Icon = ROLE_ICONS[u.role] ?? GraduationCap;
                  return (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {u.avatar_url ? (
                            <img src={u.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold flex items-center justify-center text-xs">
                              {u.name?.[0]?.toUpperCase() ?? '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={ROLE_COLORS[u.role]} className="flex items-center gap-1 w-fit">
                          <Icon className="h-3 w-3" />{u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {u.is_suspended ? (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Suspended</span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(u.created_at)}</td>
                      <td className="px-6 py-4">
                        {u.role !== 'admin' && (
                          <Button
                            size="sm"
                            variant={u.is_suspended ? 'outline' : 'ghost'}
                            onClick={() => handleToggleSuspend(u)}
                            className={u.is_suspended ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600 hover:bg-red-50'}
                            loading={suspend.isPending || activate.isPending}
                          >
                            {u.is_suspended ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                            {u.is_suspended ? 'Activate' : 'Suspend'}
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

'use client';

import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';

const TYPE_COLORS = {
  job_approved:  'bg-green-100 text-green-700',
  job_rejected:  'bg-red-100 text-red-700',
  app_update:    'bg-blue-100 text-blue-700',
  verification:  'bg-purple-100 text-purple-700',
  message:       'bg-yellow-100 text-yellow-700',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { data: notifications = [], isLoading } = useNotifications(user?.id);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllRead();

  const unread = notifications.filter(n => !n.is_read).length;

  function handleClick(n) {
    if (!n.is_read) markRead.mutate(n.id);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `${unread} unread` : 'All caught up!'}
        action={unread > 0 ? (
          <Button variant="outline" size="sm" onClick={() => markAll.mutate(user.id)} loading={markAll.isPending}>
            <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
          </Button>
        ) : null}
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className={cn(
                  'p-4 cursor-pointer transition-all',
                  !n.is_read ? 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'opacity-70'
                )}
                onClick={() => handleClick(n)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', TYPE_COLORS[n.type] ?? 'bg-gray-100 text-gray-600')}>
                        {n.type?.replace(/_/g, ' ')}
                      </span>
                      {!n.is_read && <span className="h-2 w-2 bg-blue-500 rounded-full" />}
                    </div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                  {n.link && (
                    <Link href={n.link} onClick={e => e.stopPropagation()} className="text-blue-500 hover:text-blue-700 shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

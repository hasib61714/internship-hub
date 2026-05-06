'use client';

import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations } from '@/hooks/useMessages';
import { Card } from '@/components/ui/Card';
import PageHeader from '@/components/PageHeader';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
  const { user, profile } = useAuth();
  const { data: conversations = [], isLoading } = useConversations(user?.id);

  function getOther(conv) {
    if (profile?.role === 'student') return conv.company;
    return conv.student;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader title="Messages" description="Your conversations" />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No conversations yet.</p>
          <p className="text-sm text-gray-400 mt-1">Start a conversation from a job posting.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map((conv, i) => {
            const other = getOther(conv);
            return (
              <motion.div key={conv.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/messages/${conv.id}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      {other?.avatar_url ? (
                        <img src={other.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center">
                          {other?.name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{other?.name ?? 'Unknown'}</p>
                        {conv.jobs && <p className="text-xs text-gray-400 truncate">Re: {conv.jobs.title}</p>}
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(conv.last_message_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

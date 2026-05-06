'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages, useSendMessage, useMarkMessagesRead } from '@/hooks/useMessages';
import { useConversations } from '@/hooks/useMessages';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function ConversationPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const { data: messages = [], isLoading } = useMessages(id);
  const { data: conversations = [] } = useConversations(user?.id);
  const sendMessage = useSendMessage();
  const markRead = useMarkMessagesRead();

  const conversation = conversations.find(c => c.id === id);
  const otherParty = profile?.role === 'student' ? conversation?.company : conversation?.student;

  useEffect(() => {
    if (id && user?.id) markRead.mutate({ conversationId: id, userId: user.id });
  }, [id, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage.mutateAsync({ conversationId: id, senderId: user.id, content: text.trim() });
    setText('');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
          <ArrowLeft className="h-4 w-4" />
        </button>
        {otherParty?.avatar_url ? (
          <img src={otherParty.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-600 font-semibold flex items-center justify-center text-sm">
            {otherParty?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">{otherParty?.name ?? 'Conversation'}</p>
          {conversation?.jobs && <p className="text-xs text-gray-400">Re: {conversation.jobs.title}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={cn('h-10 rounded-xl w-48 animate-pulse', i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800 ml-auto' : 'bg-gray-100 dark:bg-gray-800')} />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-8">No messages yet. Say hello!</p>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm',
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                )}>
                  <p>{msg.content}</p>
                  <p className={cn('text-[10px] mt-1', isMe ? 'text-blue-200' : 'text-gray-400')}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" disabled={!text.trim()} loading={sendMessage.isPending} className="px-4">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

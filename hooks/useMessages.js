import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  getConversations, getOrCreateConversation,
  getMessages, sendMessage, markMessagesRead,
} from '@/lib/queries';

export function useConversations(userId) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`conversations:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `student_id=eq.${userId}`,
      }, () => qc.invalidateQueries({ queryKey: ['conversations', userId] }))
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
        filter: `company_id=eq.${userId}`,
      }, () => qc.invalidateQueries({ queryKey: ['conversations', userId] }))
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userId, qc]);

  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => getConversations(userId),
    enabled: !!userId,
  });
}

export function useMessages(conversationId) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        qc.setQueryData(['messages', conversationId], (old = []) => {
          const exists = old.some(m => m.id === payload.new.id);
          return exists ? old : [...old, payload.new];
        });
        qc.invalidateQueries({ queryKey: ['conversations'] });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [conversationId, qc]);

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_data, { conversationId }) => {
      qc.invalidateQueries({ queryKey: ['messages', conversationId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useGetOrCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: getOrCreateConversation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['conversations'] }),
  });
}

export function useMarkMessagesRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, userId }) => markMessagesRead(conversationId, userId),
    onSuccess: (_data, { conversationId }) => qc.invalidateQueries({ queryKey: ['messages', conversationId] }),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations, getOrCreateConversation,
  getMessages, sendMessage, markMessagesRead,
} from '@/lib/queries';

export function useConversations(userId) {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => getConversations(userId),
    enabled: !!userId,
    refetchInterval: 15000,
  });
}

export function useMessages(conversationId) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
    refetchInterval: 5000,
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications, markNotificationRead,
  markAllNotificationsRead, createNotification,
} from '@/lib/queries';

export function useNotifications(userId) {
  return useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useCreateNotification() {
  return useMutation({ mutationFn: createNotification });
}

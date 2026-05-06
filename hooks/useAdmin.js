import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllUsers, suspendUser, activateUser,
  getPendingVerifications, verifyCompany, rejectCompanyVerification,
} from '@/lib/queries';

export function useAllUsers() {
  return useQuery({ queryKey: ['admin-users'], queryFn: getAllUsers });
}

export function useSuspendUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: suspendUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
}

export function usePendingVerifications() {
  return useQuery({ queryKey: ['verifications'], queryFn: getPendingVerifications });
}

export function useVerifyCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: verifyCompany,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  });
}

export function useRejectCompanyVerification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }) => rejectCompanyVerification(id, note),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['verifications'] }),
  });
}

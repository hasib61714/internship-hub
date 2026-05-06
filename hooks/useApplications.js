import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMyApplications, getJobApplications,
  applyToJob, updateApplicationStatus, checkIfApplied,
  withdrawApplication, rejectApplicationWithReason,
  getSavedJobs, saveJob, unsaveJob,
} from '@/lib/queries';

// Applications
export function useMyApplications(studentId) {
  return useQuery({
    queryKey: ['applications', 'student', studentId],
    queryFn: () => getMyApplications(studentId),
    enabled: !!studentId,
  });
}

export function useJobApplications(jobId) {
  return useQuery({
    queryKey: ['applications', 'job', jobId],
    queryFn: () => getJobApplications(jobId),
    enabled: !!jobId,
  });
}

export function useCheckApplied(jobId, studentId) {
  return useQuery({
    queryKey: ['applications', 'check', jobId, studentId],
    queryFn: () => checkIfApplied(jobId, studentId),
    enabled: !!jobId && !!studentId,
  });
}

export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: applyToJob,
    onSuccess: (_data, { studentId }) => {
      qc.invalidateQueries({ queryKey: ['applications', 'student', studentId] });
      qc.invalidateQueries({ queryKey: ['applications', 'check'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useWithdrawApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useRejectApplicationWithReason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => rejectApplicationWithReason(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['applications'] }),
  });
}

// Saved Jobs
export function useSavedJobs(studentId) {
  return useQuery({
    queryKey: ['saved-jobs', studentId],
    queryFn: () => getSavedJobs(studentId),
    enabled: !!studentId,
  });
}

export function useSaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, studentId }) => saveJob(jobId, studentId),
    onSuccess: (_data, { studentId }) => qc.invalidateQueries({ queryKey: ['saved-jobs', studentId] }),
  });
}

export function useUnsaveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId, studentId }) => unsaveJob(jobId, studentId),
    onSuccess: (_data, { studentId }) => qc.invalidateQueries({ queryKey: ['saved-jobs', studentId] }),
  });
}

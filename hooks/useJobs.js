import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getJobs, getJob, getCompanyJobs, getFeaturedJobs,
  createJob, updateJob, deleteJob, getCategories,
  getPendingJobs, approveJob, rejectJob, rejectJobWithReason,
  getJobTemplates, createJobTemplate, deleteJobTemplate,
  getAdminAnalytics,
} from '@/lib/queries';

export const jobKeys = {
  all:        () => ['jobs'],
  list:       (filters) => ['jobs', 'list', filters],
  featured:   () => ['jobs', 'featured'],
  detail:     (id) => ['jobs', id],
  company:    (id) => ['jobs', 'company', id],
  pending:    () => ['jobs', 'pending'],
};

export function useJobs(filters = {}) {
  return useQuery({ queryKey: jobKeys.list(filters), queryFn: () => getJobs(filters) });
}

export function useFeaturedJobs() {
  return useQuery({ queryKey: jobKeys.featured(), queryFn: () => getFeaturedJobs() });
}

export function useJob(id) {
  return useQuery({ queryKey: jobKeys.detail(id), queryFn: () => getJob(id), enabled: !!id });
}

export function useCompanyJobs(companyId) {
  return useQuery({
    queryKey: jobKeys.company(companyId),
    queryFn: () => getCompanyJobs(companyId),
    enabled: !!companyId,
  });
}

export function usePendingJobs() {
  return useQuery({ queryKey: jobKeys.pending(), queryFn: getPendingJobs });
}

export function useCategories() {
  return useQuery({ queryKey: ['categories'], queryFn: getCategories, staleTime: Infinity });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all() }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateJob(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: jobKeys.all() });
      qc.invalidateQueries({ queryKey: jobKeys.detail(id) });
    },
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.all() }),
  });
}

export function useApproveJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveJob,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.pending() });
      qc.invalidateQueries({ queryKey: jobKeys.all() });
    },
  });
}

export function useRejectJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectJob,
    onSuccess: () => qc.invalidateQueries({ queryKey: jobKeys.pending() }),
  });
}

export function useRejectJobWithReason() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => rejectJobWithReason(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.pending() });
      qc.invalidateQueries({ queryKey: jobKeys.all() });
    },
  });
}

export function useJobTemplates(companyId) {
  return useQuery({
    queryKey: ['job-templates', companyId],
    queryFn: () => getJobTemplates(companyId),
    enabled: !!companyId,
  });
}

export function useCreateJobTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createJobTemplate,
    onSuccess: (_data, { companyId }) => qc.invalidateQueries({ queryKey: ['job-templates', companyId] }),
  });
}

export function useDeleteJobTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteJobTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['job-templates'] }),
  });
}

export function useAdminAnalytics() {
  return useQuery({ queryKey: ['admin-analytics'], queryFn: getAdminAnalytics });
}

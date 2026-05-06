import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

function db() { return createClient(); }

export function useStudentInterviews(userId) {
  return useQuery({
    queryKey: ['interviews', 'student', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db()
        .from('interviews')
        .select('*, applications(id, jobs(title, company_profiles(company_name)))')
        .eq('student_id', userId)
        .order('scheduled_at', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function useApplicationInterview(applicationId) {
  return useQuery({
    queryKey: ['interviews', 'application', applicationId],
    enabled: !!applicationId,
    queryFn: async () => {
      const { data, error } = await db()
        .from('interviews')
        .select('*')
        .eq('application_id', applicationId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useScheduleInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ applicationId, companyId, studentId, scheduledAt, meetingLink, notes }) => {
      const { data, error } = await db().from('interviews').upsert({
        application_id: applicationId,
        company_id: companyId,
        student_id: studentId,
        scheduled_at: scheduledAt,
        meeting_link: meetingLink,
        notes: notes ?? null,
        status: 'scheduled',
      }, { onConflict: 'application_id' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { applicationId }) => {
      qc.invalidateQueries({ queryKey: ['interviews', 'application', applicationId] });
    },
  });
}

export function useCancelInterview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await db().from('interviews').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

function db() { return createClient(); }

export function useSkillTests() {
  return useQuery({
    queryKey: ['skill-tests'],
    queryFn: async () => {
      const { data, error } = await db().from('skill_tests').select('id, title, category, duration_minutes, passing_score').order('created_at');
      if (error) throw error;
      return data;
    },
  });
}

export function useSkillTest(id) {
  return useQuery({
    queryKey: ['skill-test', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await db().from('skill_tests').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });
}

export function useMyAttempts(userId) {
  return useQuery({
    queryKey: ['test-attempts', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db().from('test_attempts').select('*, skill_tests(title, category)').eq('student_id', userId);
      if (error) throw error;
      return data;
    },
  });
}

export function useSubmitTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ studentId, testId, score, passed, answers }) => {
      const { data, error } = await db().from('test_attempts').upsert({
        student_id: studentId, test_id: testId, score, passed, answers,
      }, { onConflict: 'student_id,test_id' }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { studentId }) => {
      qc.invalidateQueries({ queryKey: ['test-attempts', studentId] });
    },
  });
}

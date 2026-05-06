import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

function db() { return createClient(); }

export function useMyDocuments(userId) {
  return useQuery({
    queryKey: ['documents', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await db().from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminDocuments() {
  return useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      const { data, error } = await db()
        .from('documents')
        .select('*, profiles(name, email, role)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, docType, file }) => {
      const supabase = db();
      const ext = file.name.split('.').pop();
      const path = `${userId}/${docType}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('documents').upload(path, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(path);
      const { data, error } = await supabase.from('documents').insert({
        user_id: userId, doc_type: docType, file_url: publicUrl, file_name: file.name,
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => qc.invalidateQueries({ queryKey: ['documents', userId] }),
  });
}

export function useReviewDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, rejectionReason, reviewerId }) => {
      const { error } = await db().from('documents').update({
        status,
        rejection_reason: rejectionReason ?? null,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-documents'] }),
  });
}

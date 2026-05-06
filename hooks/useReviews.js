import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviewsForUser, getMyReview, submitReview } from '@/lib/queries';

export function useReviews(userId) {
  return useQuery({
    queryKey: ['reviews', userId],
    queryFn: () => getReviewsForUser(userId),
    enabled: !!userId,
  });
}

export function useMyReview(applicationId, reviewerId) {
  return useQuery({
    queryKey: ['my-review', applicationId, reviewerId],
    queryFn: () => getMyReview(applicationId, reviewerId),
    enabled: !!applicationId && !!reviewerId,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitReview,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['reviews', vars.revieweeId] });
      qc.invalidateQueries({ queryKey: ['my-review', vars.applicationId] });
    },
  });
}

'use client';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { StarPicker } from '@/components/ui/StarRating';
import { useSubmitReview, useMyReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ReviewModal({ isOpen, onClose, application, revieweeId, revieweeName }) {
  const { user, profile } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const submit = useSubmitReview();
  const { data: existing } = useMyReview(application?.id, user?.id);

  async function handleSubmit() {
    if (!rating) return toast.error('Please select a rating');
    try {
      await submit.mutateAsync({
        applicationId: application.id,
        reviewerId:    user.id,
        revieweeId,
        rating,
        comment,
        reviewerRole: profile.role,
      });
      toast.success('Review submitted!');
      onClose();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate ${revieweeName}`}>
      <div className="space-y-5">
        {existing ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">You already reviewed this person.</p>
            <StarPicker value={existing.rating} onChange={() => {}} />
            {existing.comment && <p className="text-sm text-gray-600 mt-2 italic">"{existing.comment}"</p>}
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-gray-500">How was your experience?</p>
              <StarPicker value={rating} onChange={setRating} />
              <p className="text-xs text-gray-400">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] ?? ''}
              </p>
            </div>
            <textarea
              rows={3}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Write a short review (optional)..."
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
              <Button size="sm" onClick={handleSubmit} disabled={!rating} loading={submit.isPending}>
                Submit Review
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

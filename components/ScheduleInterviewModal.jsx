'use client';

import { useState } from 'react';
import { Video, Calendar, Link as LinkIcon, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useScheduleInterview } from '@/hooks/useInterviews';
import toast from 'react-hot-toast';

export default function ScheduleInterviewModal({ isOpen, onClose, application, companyId }) {
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const schedule = useScheduleInterview();

  const studentName = application?.student_profiles?.profiles?.name ?? 'Applicant';
  const jobTitle = application?.jobs?.title ?? 'this position';

  async function handleSubmit() {
    if (!scheduledAt || !meetingLink) return toast.error('Date and meeting link are required');
    try {
      await schedule.mutateAsync({
        applicationId: application.id,
        companyId,
        studentId: application.student_id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        meetingLink,
        notes,
      });
      toast.success('Interview scheduled!');
      setScheduledAt(''); setMeetingLink(''); setNotes('');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to schedule');
    }
  }

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Interview">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Video className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{studentName}</p>
            <p className="text-xs text-gray-500">For: {jobTitle}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <Calendar className="inline h-3.5 w-3.5 mr-1" />Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            min={minDate.toISOString().slice(0, 16)}
            onChange={e => setScheduledAt(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <LinkIcon className="inline h-3.5 w-3.5 mr-1" />Meeting Link <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={meetingLink}
            onChange={e => setMeetingLink(e.target.value)}
            placeholder="https://meet.google.com/xxx-xxxx-xxx"
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">Google Meet, Zoom, or any video link</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            <FileText className="inline h-3.5 w-3.5 mr-1" />Notes (optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Interview instructions, topics to cover..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!scheduledAt || !meetingLink} loading={schedule.isPending}>
            <Video className="h-3.5 w-3.5" /> Schedule Interview
          </Button>
        </div>
      </div>
    </Modal>
  );
}

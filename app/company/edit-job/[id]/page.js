'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useJob, useUpdateJob } from '@/hooks/useJobs';
import { useCategories } from '@/hooks/useJobs';
import { useAuth } from '@/contexts/AuthContext';
import { Input, Textarea, Select } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { FullPageSpinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.string().optional(),
  skills_required: z.string().optional(),
  job_type: z.string().min(1, 'Job type is required'),
  payment_type: z.string().min(1, 'Payment type is required'),
  experience_level: z.string().min(1, 'Experience level is required'),
  location: z.string().min(2, 'Location is required'),
  work_mode: z.string().min(1, 'Work mode is required'),
  category_id: z.string().optional(),
  budget_min: z.coerce.number().optional().nullable(),
  budget_max: z.coerce.number().optional().nullable(),
  duration: z.string().optional(),
  deadline: z.string().optional(),
});

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const { profile, isCompany } = useAuth();
  const { data: job, isLoading: jobLoading } = useJob(id);
  const { data: categories = [] } = useCategories();
  const updateJob = useUpdateJob();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (job) {
      reset({
        title: job.title ?? '',
        description: job.description ?? '',
        requirements: job.requirements ?? '',
        skills_required: job.skills_required ?? '',
        job_type: job.job_type ?? '',
        payment_type: job.payment_type ?? '',
        experience_level: job.experience_level ?? '',
        location: job.location ?? '',
        work_mode: job.work_mode ?? '',
        category_id: job.category_id ?? '',
        budget_min: job.budget_min ?? '',
        budget_max: job.budget_max ?? '',
        duration: job.duration ?? '',
        deadline: job.deadline ? job.deadline.slice(0, 10) : '',
      });
    }
  }, [job, reset]);

  if (jobLoading) return <FullPageSpinner />;
  if (!job) return <div className="p-8 text-center text-gray-500">Job not found.</div>;
  if (!isCompany || job.company_id !== profile?.id) {
    return <div className="p-8 text-center text-red-500">Access denied.</div>;
  }

  async function onSubmit(values) {
    const updates = {
      ...values,
      budget_min: values.budget_min || null,
      budget_max: values.budget_max || null,
      category_id: values.category_id || null,
      deadline: values.deadline || null,
    };
    try {
      await updateJob.mutateAsync({ id, updates });
      toast.success('Job updated successfully! It will be reviewed by an admin.');
      router.push('/company/my-jobs');
    } catch (err) {
      toast.error(err.message || 'Failed to update job');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-500 mt-1 text-sm">Changes will be reviewed by an admin before going live.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader><h2 className="font-semibold text-gray-800">Basic Information</h2></CardHeader>
              <CardBody className="space-y-4">
                <Input label="Job Title *" {...register('title')} error={errors.title?.message} placeholder="e.g. Frontend Developer Intern" />
                <Textarea label="Job Description *" {...register('description')} error={errors.description?.message} rows={6} placeholder="Describe the role, responsibilities, and what the intern will learn..." />
                <Textarea label="Requirements" {...register('requirements')} error={errors.requirements?.message} rows={4} placeholder="Education level, GPA, prerequisites..." />
                <Input label="Skills Required" {...register('skills_required')} error={errors.skills_required?.message} placeholder="e.g. React, Node.js, Python (comma separated)" />
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-gray-800">Job Details</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select label="Job Type *" {...register('job_type')} error={errors.job_type?.message}>
                    <option value="">Select type</option>
                    <option value="internship">Internship</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="project">Project Based</option>
                    <option value="hourly">Hourly</option>
                  </Select>
                  <Select label="Work Mode *" {...register('work_mode')} error={errors.work_mode?.message}>
                    <option value="">Select mode</option>
                    <option value="remote">Remote</option>
                    <option value="on-site">On-Site</option>
                    <option value="hybrid">Hybrid</option>
                  </Select>
                  <Select label="Experience Level *" {...register('experience_level')} error={errors.experience_level?.message}>
                    <option value="">Select level</option>
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                  </Select>
                  <Select label="Payment Type *" {...register('payment_type')} error={errors.payment_type?.message}>
                    <option value="">Select payment</option>
                    <option value="monthly">Monthly Stipend</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="project">Project Based</option>
                    <option value="unpaid">Unpaid</option>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Location *" {...register('location')} error={errors.location?.message} placeholder="e.g. Dhaka, Bangladesh" />
                  <Select label="Category" {...register('category_id')} error={errors.category_id?.message}>
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Select>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader><h2 className="font-semibold text-gray-800">Compensation & Timeline</h2></CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Min Budget (BDT/mo)" type="number" {...register('budget_min')} error={errors.budget_min?.message} placeholder="e.g. 5000" />
                  <Input label="Max Budget (BDT/mo)" type="number" {...register('budget_max')} error={errors.budget_max?.message} placeholder="e.g. 15000" />
                  <Input label="Duration" {...register('duration')} error={errors.duration?.message} placeholder="e.g. 3 months" />
                  <Input label="Application Deadline" type="date" {...register('deadline')} error={errors.deadline?.message} />
                </div>
              </CardBody>
            </Card>

            <div className="flex justify-end gap-3 pb-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" loading={updateJob.isPending}>Save Changes</Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

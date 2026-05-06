'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateJob, useCategories, useCreateJobTemplate } from '@/hooks/useJobs';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import PageHeader from '@/components/PageHeader';
import toast from 'react-hot-toast';

const schema = z.object({
  title:            z.string().min(3, 'Title required'),
  description:      z.string().min(50, 'Describe the job (min 50 chars)'),
  requirements:     z.string().optional(),
  skills_required:  z.string().optional(),
  category_id:      z.string().optional(),
  job_type:         z.enum(['internship','full-time','part-time','project','hourly']),
  payment_type:     z.enum(['monthly','hourly','project','unpaid']),
  experience_level: z.enum(['entry','junior','mid','senior']),
  location:         z.string().min(2, 'Location required'),
  work_mode:        z.enum(['remote','on-site','hybrid']),
  budget_min:       z.coerce.number().optional().nullable(),
  budget_max:       z.coerce.number().optional().nullable(),
  duration:         z.string().optional(),
  deadline:         z.string().optional(),
});

function PostJobForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();
  const createJob = useCreateJob();
  const createTemplate = useCreateJobTemplate();
  const [templateModal, setTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Pre-fill from template query params
  const defaultsFromParams = Object.fromEntries(searchParams.entries());

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      job_type: 'internship',
      payment_type: 'monthly',
      experience_level: 'entry',
      work_mode: 'remote',
      ...defaultsFromParams,
    },
  });

  async function onSubmit(values) {
    try {
      await createJob.mutateAsync({ ...values, company_id: user.id });
      toast.success('Job submitted for review!');
      router.push('/company/my-jobs');
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSaveTemplate() {
    if (!templateName.trim()) return;
    try {
      await createTemplate.mutateAsync({
        companyId: user.id,
        name: templateName,
        data: getValues(),
      });
      toast.success('Template saved!');
      setTemplateModal(false);
      setTemplateName('');
    } catch (err) {
      toast.error(err.message || 'Failed to save template');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title="Post a New Job"
        description="Fill in the details to post your opportunity"
        action={
          <Button variant="outline" size="sm" onClick={() => setTemplateModal(true)}>
            <Save className="h-4 w-4 mr-1" /> Save as Template
          </Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><h2 className="font-semibold">Job Details</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Job Title *" placeholder="e.g. Frontend Developer Intern" error={errors.title?.message} {...register('title')} />
            <Textarea label="Job Description *" placeholder="Describe the role, responsibilities..." rows={6} error={errors.description?.message} {...register('description')} />
            <Textarea label="Requirements" placeholder="List requirements, qualifications..." rows={4} error={errors.requirements?.message} {...register('requirements')} />
            <Input label="Required Skills" placeholder="React, Node.js, Python (comma-separated)" error={errors.skills_required?.message} {...register('skills_required')} />
            <Select label="Category" error={errors.category_id?.message} {...register('category_id')}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Job Type & Location</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Job Type *" error={errors.job_type?.message} {...register('job_type')}>
                <option value="internship">Internship</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="project">Project-based</option>
                <option value="hourly">Hourly</option>
              </Select>
              <Select label="Work Mode *" error={errors.work_mode?.message} {...register('work_mode')}>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              <Select label="Experience Level" error={errors.experience_level?.message} {...register('experience_level')}>
                <option value="entry">Entry Level</option>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </Select>
              <Select label="Payment Type" error={errors.payment_type?.message} {...register('payment_type')}>
                <option value="monthly">Monthly</option>
                <option value="hourly">Hourly</option>
                <option value="project">Project-based</option>
                <option value="unpaid">Unpaid</option>
              </Select>
            </div>
            <Input label="Location *" placeholder="Dhaka, Bangladesh" error={errors.location?.message} {...register('location')} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Compensation & Timeline</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Min Salary (BDT)" type="number" placeholder="15000" error={errors.budget_min?.message} {...register('budget_min')} />
              <Input label="Max Salary (BDT)" type="number" placeholder="25000" error={errors.budget_max?.message} {...register('budget_max')} />
              <Input label="Duration" placeholder="3 months / 6 months" error={errors.duration?.message} {...register('duration')} />
              <Input label="Application Deadline" type="date" error={errors.deadline?.message} {...register('deadline')} />
            </div>
          </CardBody>
        </Card>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting || createJob.isPending}>
          Submit for Review
        </Button>
      </form>

      {/* Save template modal */}
      <Modal isOpen={templateModal} onClose={() => setTemplateModal(false)} title="Save as Template">
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Give this template a name so you can reuse it later from your templates page.
          </p>
          <Input
            label="Template Name"
            placeholder="e.g. Frontend Intern, Backend Engineer..."
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
          />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setTemplateModal(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveTemplate} disabled={!templateName.trim()} loading={createTemplate.isPending}>
              <Save className="h-4 w-4 mr-1" /> Save Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <Suspense fallback={null}>
      <PostJobForm />
    </Suspense>
  );
}

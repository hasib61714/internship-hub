'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Upload, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getStudentProfile, updateStudentProfile,
  uploadFile, updateProfileAvatar,
} from '@/lib/queries';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import PageHeader from '@/components/PageHeader';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import toast from 'react-hot-toast';

const schema = z.object({
  university:       z.string().optional(),
  department:       z.string().optional(),
  graduation_year:  z.coerce.number().optional().nullable(),
  cgpa:             z.coerce.number().min(0).max(4).optional().nullable(),
  phone:            z.string().optional(),
  skills:           z.string().optional(),
  bio:              z.string().optional(),
  linkedin_url:     z.string().url().optional().or(z.literal('')),
  github_url:       z.string().url().optional().or(z.literal('')),
  portfolio_url:    z.string().url().optional().or(z.literal('')),
  availability:     z.string().optional(),
  experience_level: z.string().optional(),
});

export default function StudentProfilePage() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const avatarRef = useRef(null);
  const resumeRef = useRef(null);

  const { data: studentProfile, isLoading } = useQuery({
    queryKey: ['student-profile', user?.id],
    queryFn: () => getStudentProfile(user.id),
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateStudentProfile(user.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: studentProfile ?? {},
  });

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    setAvatarUploading(true);
    try {
      const url = await uploadFile('avatars', `${user.id}/avatar`, file);
      await updateProfileAvatar(user.id, url);
      qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleResumeChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Resume must be under 5MB'); return; }
    setResumeUploading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage.from('resumes').upload(`${user.id}/resume.pdf`, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(data.path);
      await updateStudentProfile(user.id, { resume_url: publicUrl });
      qc.invalidateQueries({ queryKey: ['student-profile', user.id] });
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setResumeUploading(false);
    }
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader title="My Profile" description="Keep your profile up to date for better opportunities" />

      {/* Avatar upload */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="relative">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" />
              ) : (
                <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold text-2xl flex items-center justify-center">
                  {profile?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <button
                onClick={() => avatarRef.current?.click()}
                disabled={avatarUploading}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" /> : <Camera className="h-3.5 w-3.5 text-gray-500" />}
              </button>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{profile?.name}</p>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 2MB</p>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </CardBody>
      </Card>

      {/* Resume upload */}
      <Card>
        <CardHeader><h2 className="font-semibold">Resume / CV</h2></CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            {studentProfile?.resume_url ? (
              <a href={studentProfile.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline text-sm">
                <FileText className="h-4 w-4" /> View current resume
              </a>
            ) : (
              <p className="text-sm text-gray-400">No resume uploaded yet</p>
            )}
            <Button variant="outline" size="sm" onClick={() => resumeRef.current?.click()} loading={resumeUploading}>
              <Upload className="h-4 w-4 mr-1" />
              {studentProfile?.resume_url ? 'Replace' : 'Upload PDF'}
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">PDF only, max 5MB</p>
          <input ref={resumeRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeChange} />
        </CardBody>
      </Card>

      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">
        <Card>
          <CardHeader><h2 className="font-semibold">Academic Details</h2></CardHeader>
          <CardBody className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="University" placeholder="BUET / DU / NSU..." error={errors.university?.message} {...register('university')} />
              <Input label="Department" placeholder="CSE / EEE / BBA..." error={errors.department?.message} {...register('department')} />
              <Input label="Graduation Year" type="number" placeholder="2025" error={errors.graduation_year?.message} {...register('graduation_year')} />
              <Input label="CGPA (out of 4.0)" type="number" step="0.01" placeholder="3.75" error={errors.cgpa?.message} {...register('cgpa')} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Professional Info</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Phone" placeholder="+880..." error={errors.phone?.message} {...register('phone')} />
            <Select label="Experience Level" error={errors.experience_level?.message} {...register('experience_level')}>
              <option value="">Select level</option>
              <option value="entry">Entry Level</option>
              <option value="junior">Junior (1-2 yrs)</option>
              <option value="mid">Mid (3-5 yrs)</option>
              <option value="senior">Senior (5+ yrs)</option>
            </Select>
            <Select label="Availability" error={errors.availability?.message} {...register('availability')}>
              <option value="">Select availability</option>
              <option value="immediate">Immediately</option>
              <option value="1_month">Within 1 month</option>
              <option value="3_months">Within 3 months</option>
              <option value="not_available">Not available</option>
            </Select>
            <Input label="Skills (comma-separated)" placeholder="React, Node.js, Python..." error={errors.skills?.message} {...register('skills')} />
            <Textarea label="Bio" placeholder="Tell employers about yourself..." error={errors.bio?.message} {...register('bio')} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Links</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="LinkedIn" type="url" placeholder="https://linkedin.com/in/..." error={errors.linkedin_url?.message} {...register('linkedin_url')} />
            <Input label="GitHub" type="url" placeholder="https://github.com/..." error={errors.github_url?.message} {...register('github_url')} />
            <Input label="Portfolio" type="url" placeholder="https://yoursite.com" error={errors.portfolio_url?.message} {...register('portfolio_url')} />
          </CardBody>
        </Card>

        <Button type="submit" className="w-full" loading={mutation.isPending}>Save Profile</Button>
      </form>
    </div>
  );
}

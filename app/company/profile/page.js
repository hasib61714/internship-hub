'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader2, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCompanyProfile, updateCompanyProfile, uploadFile } from '@/lib/queries';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Input, Textarea, Select } from '@/components/ui/Input';
import PageHeader from '@/components/PageHeader';
import { ListRowSkeleton } from '@/components/SkeletonCard';
import toast from 'react-hot-toast';

const schema = z.object({
  company_name:     z.string().min(2, 'Company name required'),
  company_location: z.string().optional(),
  website:          z.string().url().optional().or(z.literal('')),
  phone:            z.string().optional(),
  description:      z.string().optional(),
  industry:         z.string().optional(),
  company_size:     z.string().optional(),
  founded_year:     z.coerce.number().optional().nullable(),
  linkedin_url:     z.string().url().optional().or(z.literal('')),
  twitter_url:      z.string().url().optional().or(z.literal('')),
});

export default function CompanyProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [logoUploading, setLogoUploading] = useState(false);
  const logoRef = useRef(null);

  const { data: companyProfile, isLoading } = useQuery({
    queryKey: ['company-profile', user?.id],
    queryFn: () => getCompanyProfile(user.id),
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateCompanyProfile(user.id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company-profile', user.id] });
      toast.success('Profile updated!');
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    values: companyProfile ?? {},
  });

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Logo must be under 2MB'); return; }
    setLogoUploading(true);
    try {
      const url = await uploadFile('logos', `${user.id}/logo`, file);
      await updateCompanyProfile(user.id, { logo_url: url });
      qc.invalidateQueries({ queryKey: ['company-profile', user.id] });
      toast.success('Logo updated!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setLogoUploading(false);
    }
  }

  if (isLoading) return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <ListRowSkeleton key={i} />)}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader title="Company Profile" description="Manage your company information and branding" />

      {/* Verification status */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
        companyProfile?.is_verified
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700'
          : companyProfile?.verification_rejected
          ? 'bg-red-50 dark:bg-red-900/20 text-red-700'
          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700'
      }`}>
        {companyProfile?.is_verified ? (
          <><CheckCircle className="h-4 w-4" /> Verified Company</>
        ) : companyProfile?.verification_rejected ? (
          <><span className="font-bold">Verification rejected</span>{companyProfile.verification_note && ` — ${companyProfile.verification_note}`}</>
        ) : (
          <><Clock className="h-4 w-4" /> Verification pending — we'll review your profile soon</>
        )}
      </div>

      {/* Logo upload */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-5">
            <div className="relative">
              {companyProfile?.logo_url ? (
                <img src={companyProfile.logo_url} alt="Logo" className="h-20 w-20 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600" />
              ) : (
                <div className="h-20 w-20 rounded-xl bg-blue-100 dark:bg-blue-900 text-blue-600 font-bold text-2xl flex items-center justify-center">
                  {companyProfile?.company_name?.[0] ?? '?'}
                </div>
              )}
              <button
                onClick={() => logoRef.current?.click()}
                disabled={logoUploading}
                className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition"
              >
                {logoUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" /> : <Camera className="h-3.5 w-3.5 text-gray-500" />}
              </button>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{companyProfile?.company_name}</p>
              <p className="text-xs text-gray-400 mt-1">PNG or JPG, max 2MB</p>
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </div>
        </CardBody>
      </Card>

      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">
        <Card>
          <CardHeader><h2 className="font-semibold">Company Details</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Company Name *" error={errors.company_name?.message} {...register('company_name')} />
            <Input label="Industry" placeholder="Technology / Finance / Education..." error={errors.industry?.message} {...register('industry')} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Company Size" error={errors.company_size?.message} {...register('company_size')}>
                <option value="">Select size</option>
                <option value="1-10">1–10 employees</option>
                <option value="11-50">11–50 employees</option>
                <option value="51-200">51–200 employees</option>
                <option value="201-500">201–500 employees</option>
                <option value="500+">500+ employees</option>
              </Select>
              <Input label="Founded Year" type="number" placeholder="2015" error={errors.founded_year?.message} {...register('founded_year')} />
            </div>
            <Textarea label="Company Description" placeholder="What does your company do?" error={errors.description?.message} {...register('description')} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Contact Info</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Location" placeholder="Dhaka, Bangladesh" error={errors.company_location?.message} {...register('company_location')} />
            <Input label="Phone" placeholder="+880..." error={errors.phone?.message} {...register('phone')} />
            <Input label="Website" type="url" placeholder="https://yourcompany.com" error={errors.website?.message} {...register('website')} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><h2 className="font-semibold">Social Links</h2></CardHeader>
          <CardBody className="space-y-4">
            <Input label="LinkedIn" type="url" placeholder="https://linkedin.com/company/..." error={errors.linkedin_url?.message} {...register('linkedin_url')} />
            <Input label="Twitter / X" type="url" placeholder="https://twitter.com/..." error={errors.twitter_url?.message} {...register('twitter_url')} />
          </CardBody>
        </Card>

        <Button type="submit" className="w-full" loading={mutation.isPending}>Save Profile</Button>
      </form>
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import JobDetailClient from './JobDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internhub.vercel.app';

async function getJob(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*, company_profiles(*), categories(name, slug)')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data;
}

export async function generateMetadata({ params }) {
  const job = await getJob(params.id);
  if (!job) return { title: 'Job Not Found' };

  const company = job.company_profiles?.company_name ?? '';
  const title = `${job.title} at ${company}`;
  const description = job.description?.slice(0, 160) ?? '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/jobs/${job.id}`,
      type: 'article',
    },
    twitter: { card: 'summary', title, description },
  };
}

export default async function JobDetailPage({ params }) {
  const job = await getJob(params.id);
  if (!job) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    validThrough: job.deadline,
    employmentType: job.job_type?.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_profiles?.company_name,
      sameAs: job.company_profiles?.website,
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'BD' },
    },
    baseSalary: job.budget_min
      ? {
          '@type': 'MonetaryAmount',
          currency: 'BDT',
          value: { '@type': 'QuantitativeValue', minValue: job.budget_min, maxValue: job.budget_max, unitText: 'MONTH' },
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JobDetailClient job={job} />
    </>
  );
}

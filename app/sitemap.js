import { createClient } from '@/lib/supabase/server';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://internhub.vercel.app';

export default async function sitemap() {
  const supabase = await createClient();

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, updated_at')
    .eq('status', 'active')
    .order('updated_at', { ascending: false })
    .limit(1000);

  const jobUrls = (jobs ?? []).map((job) => ({
    url: `${BASE_URL}/jobs/${job.id}`,
    lastModified: new Date(job.updated_at),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const staticPages = [
    { url: BASE_URL,            priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE_URL}/jobs`,  priority: 0.9, changeFrequency: 'hourly' },
    { url: `${BASE_URL}/login`, priority: 0.4, changeFrequency: 'monthly' },
    { url: `${BASE_URL}/register`, priority: 0.5, changeFrequency: 'monthly' },
  ].map((p) => ({ ...p, lastModified: new Date() }));

  return [...staticPages, ...jobUrls];
}

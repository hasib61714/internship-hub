'use client';

import { useState } from 'react';
import { Zap, MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/PageHeader';
import { timeAgo } from '@/lib/utils';

const SKILLS = ['Design', 'Video Editing', 'Data Entry', 'Writing', 'Web Dev', 'Tutoring', 'Photography', 'Translation'];

async function getMicroJobs(skill) {
  const db = createClient();
  let q = db
    .from('jobs')
    .select('*, company_profiles(company_name, logo_url, is_verified), categories(name)')
    .eq('status', 'active')
    .eq('job_type', 'micro')
    .order('created_at', { ascending: false });
  if (skill) q = q.ilike('title', `%${skill}%`);
  const { data } = await q;
  return data ?? [];
}

export default function MicroJobsPage() {
  const [skill, setSkill] = useState('');
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['micro-jobs', skill],
    queryFn: () => getMicroJobs(skill),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title={<span className="flex items-center gap-2"><Zap className="h-6 w-6 text-yellow-500" /> Quick Hire</span>}
          description="Short tasks. Fast pay. Apply instantly."
        />
        <Link href="/company/post-job?type=micro">
          <Button size="sm"><Zap className="h-4 w-4" /> Post Quick Task</Button>
        </Link>
      </div>

      {/* Skill filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSkill('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!skill ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        {SKILLS.map(s => (
          <button
            key={s}
            onClick={() => setSkill(s === skill ? '' : s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${skill === s ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="p-16 text-center">
          <Zap className="h-12 w-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No quick tasks right now</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon or post one yourself</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map(job => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-400 group">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 text-sm leading-tight">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      {job.company_profiles?.company_name}
                      {job.company_profiles?.is_verified && <span className="text-blue-500">✓</span>}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700 shrink-0">Quick</Badge>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{job.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{job.work_mode}
                    </span>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="h-3 w-3" />
                      {job.salary_min && job.salary_max
                        ? `৳${job.salary_min}–${job.salary_max}`
                        : `৳${job.salary_min || job.salary_max}`}
                    </span>
                  )}
                  <span className="flex items-center gap-1 ml-auto">
                    <Clock className="h-3 w-3" />{timeAgo(job.created_at)}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

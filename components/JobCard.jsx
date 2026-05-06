import Link from 'next/link';
import { MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { JOB_TYPE_COLORS, formatCurrency, timeAgo } from '@/lib/utils';

/**
 * Reusable job card used on the homepage, jobs listing, saved jobs, and company dashboard.
 * @param {Object} job - job row from Supabase (with company_profiles joined)
 * @param {boolean} showTime - show "posted X ago" footer (default true)
 * @param {boolean} animate - wrapper handles animation externally
 */
export default function JobCard({ job, showTime = true }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <div className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
              {job.company_profiles?.company_name?.[0] ?? '?'}
            </div>
            <Badge className={JOB_TYPE_COLORS[job.job_type]}>{job.job_type}</Badge>
          </div>

          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{job.company_profiles?.company_name}</p>

          <div className="flex flex-wrap gap-2 mt-auto">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="h-3 w-3" />{job.location}
            </span>
            {job.budget_min && (
              <span className="text-xs text-green-600 font-medium">
                {formatCurrency(job.budget_min)}{job.budget_max ? `–${formatCurrency(job.budget_max)}` : ''}/mo
              </span>
            )}
          </div>

          {showTime && (
            <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">{timeAgo(job.created_at)}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Users className="h-3 w-3" />{job.applications_count}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

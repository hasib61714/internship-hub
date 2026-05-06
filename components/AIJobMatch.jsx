'use client';

import { useState } from 'react';
import { Sparkles, MapPin, Building2, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';

export default function AIJobMatch() {
  const { profile } = useAuth();
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchMatches() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/match-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: profile?.skills ?? [],
          bio: profile?.bio ?? '',
          experience_level: profile?.experience_level ?? 'entry',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMatches(data.matches);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">AI Job Matches</h2>
        </div>
        <Button size="sm" onClick={fetchMatches} disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white">
          {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Matching…</> : 'Find Matches'}
        </Button>
      </div>

      <div className="p-4">
        {!matches && !loading && (
          <div className="text-center py-8 text-gray-400">
            <Sparkles className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Click "Find Matches" to get AI-powered job recommendations based on your profile.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-10 gap-2 text-purple-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Analyzing your profile…</span>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-500 text-center py-4">{error}</p>
        )}

        {matches && !loading && (
          <ul className="divide-y divide-gray-50 dark:divide-gray-800">
            {matches.length === 0 ? (
              <li className="py-6 text-center text-sm text-gray-400">No matches found. Update your profile with skills.</li>
            ) : matches.map(job => (
              <li key={job.id} className="py-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/jobs/${job.id}`} className="text-sm font-medium text-gray-900 dark:text-white hover:text-purple-600 truncate block">
                    {job.title}
                  </Link>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="h-3 w-3" />{job.company_profiles?.company_name}
                    {job.location && <><MapPin className="h-3 w-3 ml-1" />{job.location}</>}
                  </p>
                  {job.match_reason && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{job.match_reason}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge className="bg-purple-100 text-purple-700 text-xs">{job.match_score}%</Badge>
                  <Link href={`/jobs/${job.id}`}>
                    <ChevronRight className="h-4 w-4 text-gray-300 hover:text-purple-500" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}

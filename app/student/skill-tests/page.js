'use client';

import { Clock, CheckCircle, XCircle, ChevronRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useSkillTests } from '@/hooks/useSkillTests';
import { useMyAttempts } from '@/hooks/useSkillTests';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';

const CATEGORY_COLORS = {
  'Web Dev':    'bg-blue-100 text-blue-700',
  'Programming':'bg-purple-100 text-purple-700',
  'Marketing':  'bg-orange-100 text-orange-700',
  'Design':     'bg-pink-100 text-pink-700',
};

export default function SkillTestsPage() {
  const { user } = useAuth();
  const { data: tests = [], isLoading } = useSkillTests();
  const { data: attempts = [] } = useMyAttempts(user?.id);

  const attemptMap = Object.fromEntries(attempts.map(a => [a.test_id, a]));
  const passed = attempts.filter(a => a.passed).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title={<span className="flex items-center gap-2"><Trophy className="h-6 w-6 text-yellow-500" /> Skill Tests</span>}
          description="Prove your skills and earn badges shown on your profile."
        />
        {passed > 0 && (
          <div className="shrink-0 text-center bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold text-yellow-600">{passed}</p>
            <p className="text-xs text-yellow-700">Badge{passed !== 1 ? 's' : ''} earned</p>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tests.map(test => {
            const attempt = attemptMap[test.id];
            return (
              <Card key={test.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1.5 ${CATEGORY_COLORS[test.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {test.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{test.title}</h3>
                  </div>
                  {attempt && (
                    attempt.passed
                      ? <CheckCircle className="h-6 w-6 text-green-500 shrink-0" />
                      : <XCircle className="h-6 w-6 text-red-400 shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{test.duration_minutes} min</span>
                  <span>Pass: {test.passing_score}%</span>
                  {attempt && <span className={`font-medium ${attempt.passed ? 'text-green-600' : 'text-red-500'}`}>Score: {attempt.score}%</span>}
                </div>

                <Link href={`/student/skill-tests/${test.id}`}>
                  <Button size="sm" variant={attempt?.passed ? 'outline' : 'default'} className="w-full">
                    {attempt ? (attempt.passed ? 'Retake Test' : 'Try Again') : 'Start Test'}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

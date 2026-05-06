'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSkillTest } from '@/hooks/useSkillTests';
import { useSubmitTest } from '@/hooks/useSkillTests';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function TimerBar({ totalSeconds, onExpire }) {
  const [left, setLeft] = useState(totalSeconds);

  useEffect(() => {
    if (left <= 0) { onExpire(); return; }
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onExpire]);

  const pct = (left / totalSeconds) * 100;
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Time left</span>
        <span className={`font-mono font-bold ${pct <= 20 ? 'text-red-500' : ''}`}>{mins}:{secs.toString().padStart(2, '0')}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-1.5 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function TakeTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { data: test, isLoading } = useSkillTest(id);
  const submitTest = useSubmitTest();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const questions = test?.questions ?? [];

  const handleSubmit = useCallback(async (forcedAnswers) => {
    const ans = forcedAnswers ?? answers;
    const correct = questions.filter((q, i) => ans[i] === q.ans).length;
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= (test?.passing_score ?? 70);
    setResult({ score, correct, total: questions.length, passed });
    setSubmitted(true);
    try {
      await submitTest.mutateAsync({ studentId: user.id, testId: id, score, passed, answers: ans });
    } catch (err) {
      console.error(err);
    }
  }, [answers, questions, test, user, id, submitTest]);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Loading test…</div>;
  if (!test) return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400">Test not found.</div>;

  if (submitted && result) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <Card className="p-8 text-center space-y-4">
          {result.passed
            ? <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            : <XCircle className="h-16 w-16 text-red-400 mx-auto" />
          }
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {result.passed ? '🎉 You Passed!' : 'Not Quite'}
          </h2>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{result.score}%</p>
          <p className="text-gray-500 text-sm">{result.correct} / {result.total} correct · Pass mark: {test.passing_score}%</p>
          {result.passed && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
              <Trophy className="h-4 w-4" /> Badge earned: {test.title}
            </div>
          )}
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" onClick={() => router.push('/student/skill-tests')}>Back to Tests</Button>
            {!result.passed && (
              <Button onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false); setResult(null); }}>Try Again</Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  const q = questions[current];
  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">{test.title}</h2>
          <span className="text-xs text-gray-400">{current + 1} / {questions.length}</span>
        </div>

        <TimerBar totalSeconds={test.duration_minutes * 60} onExpire={() => handleSubmit(answers)} />

        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-1 bg-blue-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <p className="text-base font-medium text-gray-900 dark:text-white">{q.q}</p>
        <div className="space-y-2">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswers(prev => ({ ...prev, [current]: i }))}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-colors ${
                answers[current] === i
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300'
              }`}
            >
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border text-xs mr-2 font-mono">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrent(c => c - 1)} disabled={current === 0}>
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        {current < questions.length - 1 ? (
          <Button onClick={() => setCurrent(c => c + 1)} disabled={answers[current] === undefined}>
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => handleSubmit()} disabled={Object.keys(answers).length < questions.length} loading={submitTest.isPending}
            className="bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4" /> Submit Test
          </Button>
        )}
      </div>
    </div>
  );
}

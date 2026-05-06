'use client';

import { useState } from 'react';
import { FileText, Sparkles, CheckCircle, AlertCircle, Lightbulb, Loader2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/contexts/AuthContext';

function ScoreMeter({ score }) {
  const color = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-lg font-bold text-gray-900 dark:text-white w-12 text-right">{score}/100</span>
    </div>
  );
}

function Section({ icon: Icon, title, color, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className={`flex items-center gap-2 font-semibold text-sm mb-2 ${color}`}>
        <Icon className="h-4 w-4" />{title}
      </h3>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
            <span className="text-gray-300 mt-0.5">•</span>{item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CVAnalyzerPage() {
  const { profile } = useAuth();
  const [cvText, setCvText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function analyze() {
    if (!cvText.trim()) return;
    setLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const res = await fetch('/api/ai/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, currentSkills: profile?.skills ?? [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <PageHeader
        title={<span className="flex items-center gap-2"><Sparkles className="h-6 w-6 text-purple-500" /> AI CV Analyzer</span>}
        description="Paste your CV text and get instant AI feedback on strengths, skill gaps, and job suggestions."
      />

      <Card className="p-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Paste your CV / Resume text
        </label>
        <textarea
          rows={10}
          value={cvText}
          onChange={e => setCvText(e.target.value)}
          placeholder="Paste your full CV or resume text here…&#10;&#10;Example:&#10;Name: John Doe&#10;Education: BSc CSE, BUET 2024&#10;Skills: React, Node.js, Python&#10;Experience: Intern at XYZ Corp…"
          className="w-full px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none font-mono"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{cvText.length} / 4000 characters</span>
          <Button onClick={analyze} disabled={!cvText.trim() || loading}
            className="bg-purple-600 hover:bg-purple-700 text-white">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Sparkles className="h-4 w-4" /> Analyze CV</>}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </Card>

      {loading && (
        <Card className="p-12">
          <div className="flex flex-col items-center gap-3 text-purple-600">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm font-medium">Reading your CV and generating insights…</p>
          </div>
        </Card>
      )}

      {analysis && !loading && (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" /> CV Score
            </h3>
            <ScoreMeter score={analysis.overall_score} />
          </Card>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 space-y-4">
              <Section icon={CheckCircle} title="Strengths" color="text-green-600" items={analysis.strengths} />
              <Section icon={FileText} title="Extracted Skills" color="text-blue-600" items={analysis.extracted_skills} />
            </Card>
            <Card className="p-5 space-y-4">
              <Section icon={AlertCircle} title="Skill Gaps" color="text-red-500" items={analysis.skill_gaps} />
              <Section icon={Lightbulb} title="Suggested Roles" color="text-yellow-600" items={analysis.job_suggestions} />
            </Card>
          </div>

          <Card className="p-5">
            <Section icon={Lightbulb} title="Improvement Tips" color="text-purple-600" items={analysis.improvement_tips} />
          </Card>
        </div>
      )}
    </div>
  );
}

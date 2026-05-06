import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function askGroq(systemPrompt, userPrompt) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      temperature: 0.3,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Groq error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function POST(request) {
  try {
    const { skills = [], bio = '', experience_level = 'entry' } = await request.json();

    const supabase = await createClient();
    const { data: jobs } = await supabase
      .from('jobs')
      .select('id, title, description, skills_required, job_type, work_mode, location, salary_min, salary_max, company_profiles(company_name)')
      .eq('status', 'active')
      .limit(30)
      .order('created_at', { ascending: false });

    if (!jobs?.length) return NextResponse.json({ matches: [] });

    const jobList = jobs.map((j, i) =>
      `[${i}] ID:${j.id} | ${j.title} at ${j.company_profiles?.company_name} | Type:${j.job_type} | Skills:${(j.skills_required || []).join(', ')} | ${j.description?.slice(0, 100)}`
    ).join('\n');

    const system = `You are a job matching assistant for an internship platform in Bangladesh. Given a student profile and job list, return top 5 matches as JSON only: { "matches": [{ "id": "uuid", "score": 0-100, "reason": "one sentence" }] }`;
    const user = `Student: skills=[${skills.join(', ')}], bio="${bio}", level=${experience_level}\n\nJobs:\n${jobList}\n\nReturn JSON only.`;

    const text = await askGroq(system, user);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const { matches = [] } = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    const matchedJobs = matches
      .map(m => {
        const job = jobs.find(j => j.id === m.id);
        return job ? { ...job, match_score: m.score, match_reason: m.reason } : null;
      })
      .filter(Boolean);

    return NextResponse.json({ matches: matchedJobs });
  } catch (err) {
    console.error('AI match error:', err);
    return NextResponse.json({ error: err.message || 'Failed to get matches' }, { status: 500 });
  }
}

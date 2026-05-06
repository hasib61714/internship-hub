import { NextResponse } from 'next/server';

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
      max_tokens: 1500,
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
    const { cvText = '', currentSkills = [] } = await request.json();
    if (!cvText.trim()) return NextResponse.json({ error: 'CV text required' }, { status: 400 });

    const system = `You are a career advisor for students in Bangladesh seeking internships. Analyze the CV and return ONLY valid JSON with this exact shape:
{
  "strengths": ["3-5 strong points"],
  "skill_gaps": ["3-5 missing skills for internships"],
  "extracted_skills": ["skills found in CV"],
  "job_suggestions": ["3-5 specific job titles to apply for"],
  "improvement_tips": ["3 actionable tips"],
  "overall_score": 0
}
Return JSON only, no extra text.`;

    const user = `Current skills: ${currentSkills.join(', ') || 'none'}\n\nCV text:\n${cvText.slice(0, 4000)}`;

    const text = await askGroq(system, user);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error('CV analyze error:', err);
    return NextResponse.json({ error: err.message || 'Failed to analyze CV' }, { status: 500 });
  }
}

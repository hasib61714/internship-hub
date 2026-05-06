import { createClient } from '@/lib/supabase/client';

function supabase() { return createClient(); }

// ─────────────── JOBS ───────────────
export async function getJobs({ search = '', categoryId = '', jobType = '', workMode = '', page = 1, limit = 12 } = {}) {
  const db = supabase();
  let q = db
    .from('jobs')
    .select('*, company_profiles(company_name, logo_url, is_verified), categories(name, slug)', { count: 'exact' })
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search)     q = q.ilike('title', `%${search}%`);
  if (categoryId) q = q.eq('category_id', categoryId);
  if (jobType)    q = q.eq('job_type', jobType);
  if (workMode)   q = q.eq('work_mode', workMode);

  const { data, error, count } = await q;
  if (error) throw error;
  return { jobs: data, total: count };
}

export async function getFeaturedJobs(limit = 6) {
  const { data, error } = await supabase()
    .from('jobs')
    .select('*, company_profiles(company_name, logo_url, is_verified), categories(name)')
    .eq('status', 'active')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

export async function getJob(id) {
  const { data, error } = await supabase()
    .from('jobs')
    .select('*, company_profiles(*), categories(name, slug)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getCompanyJobs(companyId) {
  const { data, error } = await supabase()
    .from('jobs')
    .select('*, categories(name)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createJob(jobData) {
  const { data, error } = await supabase().from('jobs').insert(jobData).select().single();
  if (error) throw error;
  return data;
}

export async function updateJob(id, jobData) {
  const { data, error } = await supabase().from('jobs').update({ ...jobData, updated_at: new Date().toISOString() }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteJob(id) {
  const { error } = await supabase().from('jobs').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────── CATEGORIES ───────────────
export async function getCategories() {
  const { data, error } = await supabase().from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

// ─────────────── APPLICATIONS ───────────────
export async function getMyApplications(studentId) {
  const { data, error } = await supabase()
    .from('applications')
    .select('*, jobs(*, company_profiles(company_name, logo_url))')
    .eq('student_id', studentId)
    .order('applied_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getJobApplications(jobId) {
  const { data, error } = await supabase()
    .from('applications')
    .select('*, student_profiles(*, profiles(name, email))')
    .eq('job_id', jobId)
    .order('applied_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function applyToJob({ jobId, studentId, coverLetter }) {
  const { data, error } = await supabase()
    .from('applications')
    .insert({ job_id: jobId, student_id: studentId, cover_letter: coverLetter })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(applicationId, status) {
  const { data, error } = await supabase()
    .from('applications')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function checkIfApplied(jobId, studentId) {
  const { data } = await supabase()
    .from('applications')
    .select('id, status')
    .eq('job_id', jobId)
    .eq('student_id', studentId)
    .single();
  return data;
}

// ─────────────── SAVED JOBS ───────────────
export async function getSavedJobs(studentId) {
  const { data, error } = await supabase()
    .from('saved_jobs')
    .select('*, jobs(*, company_profiles(company_name, logo_url))')
    .eq('student_id', studentId)
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveJob(jobId, studentId) {
  const { data, error } = await supabase()
    .from('saved_jobs')
    .insert({ job_id: jobId, student_id: studentId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function unsaveJob(jobId, studentId) {
  const { error } = await supabase()
    .from('saved_jobs')
    .delete()
    .eq('job_id', jobId)
    .eq('student_id', studentId);
  if (error) throw error;
}

// ─────────────── PROFILES ───────────────
export async function getStudentProfile(id) {
  const { data, error } = await supabase()
    .from('student_profiles')
    .select('*, profiles(name, email)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateStudentProfile(id, profileData) {
  const { data, error } = await supabase()
    .from('student_profiles')
    .update({ ...profileData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCompanyProfile(id) {
  const { data, error } = await supabase()
    .from('company_profiles')
    .select('*, profiles(name, email)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateCompanyProfile(id, profileData) {
  const { data, error } = await supabase()
    .from('company_profiles')
    .update({ ...profileData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─────────────── ADMIN ───────────────
export async function getPendingJobs() {
  const { data, error } = await supabase()
    .from('jobs')
    .select('*, company_profiles(company_name, is_verified)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function approveJob(id) {
  return updateJob(id, { status: 'active' });
}

export async function rejectJob(id) {
  return updateJob(id, { status: 'closed' });
}

export async function getAllUsers() {
  const { data, error } = await supabase()
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPendingVerifications() {
  const { data, error } = await supabase()
    .from('company_profiles')
    .select('*, profiles(name, email)')
    .eq('is_verified', false)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function verifyCompany(id) {
  const { data, error } = await supabase()
    .from('company_profiles')
    .update({ is_verified: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAdminStats() {
  const db = supabase();
  const [jobs, users, applications, pending] = await Promise.all([
    db.from('jobs').select('id', { count: 'exact', head: true }),
    db.from('profiles').select('id', { count: 'exact', head: true }),
    db.from('applications').select('id', { count: 'exact', head: true }),
    db.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);
  return {
    totalJobs: jobs.count ?? 0,
    totalUsers: users.count ?? 0,
    totalApplications: applications.count ?? 0,
    pendingJobs: pending.count ?? 0,
  };
}

export async function rejectJobWithReason(id, reason) {
  const { data, error } = await supabase()
    .from('jobs')
    .update({ status: 'closed', rejection_reason: reason, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function rejectCompanyVerification(id, note) {
  const { data, error } = await supabase()
    .from('company_profiles')
    .update({ is_verified: false, verification_rejected: true, verification_note: note })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function suspendUser(id) {
  const { data, error } = await supabase()
    .from('profiles')
    .update({ is_suspended: true })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function activateUser(id) {
  const { data, error } = await supabase()
    .from('profiles')
    .update({ is_suspended: false })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function withdrawApplication(applicationId) {
  const { error } = await supabase()
    .from('applications')
    .delete()
    .eq('id', applicationId)
    .eq('status', 'pending');
  if (error) throw error;
}

export async function rejectApplicationWithReason(applicationId, reason) {
  const { data, error } = await supabase()
    .from('applications')
    .update({ status: 'rejected', rejection_reason: reason, updated_at: new Date().toISOString() })
    .eq('id', applicationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function incrementJobViews(jobId) {
  await supabase().rpc('increment_job_views', { job_id: jobId });
}

// ─────────────── FILE UPLOADS ───────────────
export async function uploadFile(bucket, path, file) {
  const { data, error } = await supabase().storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase().storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

export async function updateProfileAvatar(userId, avatarUrl) {
  const { error } = await supabase().from('profiles').update({ avatar_url: avatarUrl }).eq('id', userId);
  if (error) throw error;
}

// ─────────────── NOTIFICATIONS ───────────────
export async function getNotifications(userId) {
  const { data, error } = await supabase()
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function markNotificationRead(id) {
  const { error } = await supabase()
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId) {
  const { error } = await supabase()
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
}

export async function createNotification({ userId, title, message, type, link }) {
  const { data, error } = await supabase()
    .from('notifications')
    .insert({ user_id: userId, title, message, type, link })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─────────────── MESSAGES ───────────────
export async function getConversations(userId) {
  const { data, error } = await supabase()
    .from('conversations')
    .select('*, student:student_id(name, avatar_url), company:company_id(name, avatar_url), jobs(title)')
    .or(`student_id.eq.${userId},company_id.eq.${userId}`)
    .order('last_message_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrCreateConversation({ studentId, companyId, jobId }) {
  const db = supabase();
  let q = db.from('conversations').select('*').eq('student_id', studentId).eq('company_id', companyId);
  if (jobId) q = q.eq('job_id', jobId);
  const { data: existing } = await q.maybeSingle();
  if (existing) return existing;
  const { data, error } = await db
    .from('conversations')
    .insert({ student_id: studentId, company_id: companyId, job_id: jobId ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase()
    .from('messages')
    .select('*, sender:sender_id(name, avatar_url)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage({ conversationId, senderId, content }) {
  const db = supabase();
  const { data, error } = await db
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();
  if (error) throw error;
  await db
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  return data;
}

export async function markMessagesRead(conversationId, userId) {
  const { error } = await supabase()
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
  if (error) throw error;
}

// ─────────────── JOB TEMPLATES ───────────────
export async function getJobTemplates(companyId) {
  const { data, error } = await supabase()
    .from('job_templates')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createJobTemplate({ companyId, name, data: templateData }) {
  const { data, error } = await supabase()
    .from('job_templates')
    .insert({ company_id: companyId, name, data: templateData })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJobTemplate(id) {
  const { error } = await supabase().from('job_templates').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────── ADMIN ANALYTICS ───────────────
export async function getAdminAnalytics() {
  const db = supabase();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [
    jobsByCategory, jobsByType, appsByStatus,
    recentJobs, recentUsers, totalVerified,
  ] = await Promise.all([
    db.from('jobs').select('categories(name)', { count: 'exact' }).eq('status', 'active'),
    db.from('jobs').select('job_type').eq('status', 'active'),
    db.from('applications').select('status'),
    db.from('jobs').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
    db.from('company_profiles').select('id', { count: 'exact', head: true }).eq('is_verified', true),
  ]);

  const categoryMap = {};
  (jobsByCategory.data ?? []).forEach(j => {
    const name = j.categories?.name ?? 'Unknown';
    categoryMap[name] = (categoryMap[name] ?? 0) + 1;
  });

  const typeMap = {};
  (jobsByType.data ?? []).forEach(j => {
    typeMap[j.job_type] = (typeMap[j.job_type] ?? 0) + 1;
  });

  const statusMap = {};
  (appsByStatus.data ?? []).forEach(a => {
    statusMap[a.status] = (statusMap[a.status] ?? 0) + 1;
  });

  return {
    jobsByCategory: Object.entries(categoryMap).map(([name, value]) => ({ name, value })),
    jobsByType: Object.entries(typeMap).map(([name, value]) => ({ name, value })),
    applicationsByStatus: Object.entries(statusMap).map(([name, value]) => ({ name, value })),
    recentJobsCount: recentJobs.count ?? 0,
    recentUsersCount: recentUsers.count ?? 0,
    verifiedCompanies: totalVerified.count ?? 0,
  };
}

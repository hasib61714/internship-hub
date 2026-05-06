-- ============================================================
-- InternHub — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES (one row per auth.users user)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  avatar_url    TEXT,
  is_suspended  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read all profiles"    ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile"   ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Trigger can insert profile"     ON profiles FOR INSERT WITH CHECK (TRUE);

-- ─────────────────────────────────────────
-- STUDENT PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_profiles (
  id               UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  university       TEXT,
  department       TEXT,
  graduation_year  INT,
  cgpa             NUMERIC(3,2),
  phone            TEXT,
  skills           TEXT,
  bio              TEXT,
  linkedin_url     TEXT,
  github_url       TEXT,
  portfolio_url    TEXT,
  resume_url       TEXT,
  availability     TEXT,
  experience_level TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view student profiles"       ON student_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Students can update own profile"        ON student_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Students can insert own profile"        ON student_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────
-- COMPANY PROFILES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS company_profiles (
  id                     UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name           TEXT NOT NULL,
  logo_url               TEXT,
  website                TEXT,
  industry               TEXT,
  company_size           TEXT,
  founded_year           INT,
  description            TEXT,
  location               TEXT,
  linkedin_url           TEXT,
  is_verified            BOOLEAN DEFAULT FALSE,
  verification_rejected  BOOLEAN DEFAULT FALSE,
  verification_note      TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW(),
  updated_at             TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE company_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view company profiles"       ON company_profiles FOR SELECT USING (TRUE);
CREATE POLICY "Companies can update own profile"       ON company_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Companies can insert own profile"       ON company_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin can update any company"           ON company_profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Admin can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Seed default categories
INSERT INTO categories (name, slug) VALUES
  ('Software Engineering', 'software-engineering'),
  ('Data Science', 'data-science'),
  ('Design (UI/UX)', 'design'),
  ('Marketing', 'marketing'),
  ('Finance & Accounting', 'finance'),
  ('Business Development', 'business-development'),
  ('Content Writing', 'content-writing'),
  ('Human Resources', 'human-resources'),
  ('Sales', 'sales'),
  ('Research', 'research')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- JOBS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id        UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  requirements      TEXT,
  responsibilities  TEXT,
  location          TEXT,
  work_mode         TEXT CHECK (work_mode IN ('remote', 'onsite', 'hybrid')),
  job_type          TEXT CHECK (job_type IN ('full-time', 'part-time', 'internship', 'contract')),
  salary_min        INT,
  salary_max        INT,
  deadline          DATE,
  status            TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'closed', 'expired')),
  is_featured       BOOLEAN DEFAULT FALSE,
  views             INT DEFAULT 0,
  rejection_reason  TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs"        ON jobs FOR SELECT USING (status = 'active' OR company_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Companies can insert own jobs"      ON jobs FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Companies can update own jobs"      ON jobs FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete own jobs"      ON jobs FOR DELETE USING (auth.uid() = company_id);
CREATE POLICY "Admin can manage all jobs"          ON jobs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Function to increment job views
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS VOID AS $$
  UPDATE jobs SET views = views + 1 WHERE id = job_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ─────────────────────────────────────────
-- JOB TEMPLATES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_templates (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  data       JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE job_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies can manage own templates" ON job_templates FOR ALL USING (auth.uid() = company_id);

-- ─────────────────────────────────────────
-- APPLICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id           UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  student_id       UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  cover_letter     TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shortlisted', 'accepted', 'rejected')),
  rejection_reason TEXT,
  applied_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (job_id, student_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own applications"    ON applications FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert applications"      ON applications FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can delete pending apps"      ON applications FOR DELETE USING (auth.uid() = student_id AND status = 'pending');
CREATE POLICY "Companies can view job applications"   ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.company_id = auth.uid())
);
CREATE POLICY "Companies can update application status" ON applications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.company_id = auth.uid())
);

-- ─────────────────────────────────────────
-- SAVED JOBS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_jobs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
  job_id     UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, job_id)
);

ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can manage own saved jobs" ON saved_jobs FOR ALL USING (auth.uid() = student_id);

-- ─────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT CHECK (type IN ('job_approved', 'job_rejected', 'app_update', 'verification', 'message')),
  link       TEXT,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications"    ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications"  ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Service role can insert"             ON notifications FOR INSERT WITH CHECK (TRUE);

-- ─────────────────────────────────────────
-- CONVERSATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  company_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (
  auth.uid() = student_id OR auth.uid() = company_id
);
CREATE POLICY "Authenticated users can create conversations" ON conversations FOR INSERT WITH CHECK (
  auth.uid() = student_id OR auth.uid() = company_id
);
CREATE POLICY "Participants can update conversations" ON conversations FOR UPDATE USING (
  auth.uid() = student_id OR auth.uid() = company_id
);

-- ─────────────────────────────────────────
-- MESSAGES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content         TEXT NOT NULL,
  is_read         BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND (conversations.student_id = auth.uid() OR conversations.company_id = auth.uid())
  )
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND (conversations.student_id = auth.uid() OR conversations.company_id = auth.uid())
  )
);
CREATE POLICY "Participants can mark messages read" ON messages FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND (conversations.student_id = auth.uid() OR conversations.company_id = auth.uid())
  )
);

-- ─────────────────────────────────────────
-- REALTIME — enable for live chat & notifications
-- ─────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ─────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  company_name TEXT;
BEGIN
  user_role    := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
  user_name    := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  company_name := NEW.raw_user_meta_data->>'company_name';

  INSERT INTO profiles (id, name, email, role)
  VALUES (NEW.id, user_name, NEW.email, user_role);

  IF user_role = 'student' THEN
    INSERT INTO student_profiles (id) VALUES (NEW.id);
  ELSIF user_role = 'company' THEN
    INSERT INTO company_profiles (id, company_name)
    VALUES (NEW.id, COALESCE(company_name, user_name));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

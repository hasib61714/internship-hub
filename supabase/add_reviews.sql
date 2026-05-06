-- ============================================================
-- Reviews & Rating System
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  reviewer_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  reviewer_role  TEXT NOT NULL CHECK (reviewer_role IN ('student', 'company')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (application_id, reviewer_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view reviews"       ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can write own review"    ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update own review"   ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE reviews;

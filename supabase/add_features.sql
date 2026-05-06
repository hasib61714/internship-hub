-- ============================================================
-- Feature: Document Verification
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type        TEXT NOT NULL CHECK (doc_type IN ('nid','trade_license','student_id','other')),
  file_url        TEXT NOT NULL,
  file_name       TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  rejection_reason TEXT,
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own docs"    ON documents FOR ALL   USING (auth.uid() = user_id);
CREATE POLICY "Admins view all docs"     ON documents FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins update docs"       ON documents FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Supabase Storage: create bucket named "documents" (public: false) in dashboard

-- ============================================================
-- Feature: Video Interview Scheduling
-- ============================================================
CREATE TABLE IF NOT EXISTS interviews (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  company_id     UUID NOT NULL REFERENCES profiles(id),
  student_id     UUID NOT NULL REFERENCES profiles(id),
  scheduled_at   TIMESTAMPTZ NOT NULL,
  meeting_link   TEXT NOT NULL,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company manages interviews"   ON interviews FOR ALL    USING (auth.uid() = company_id);
CREATE POLICY "Student views own interviews" ON interviews FOR SELECT USING (auth.uid() = student_id);

-- ============================================================
-- Feature: Skill Tests
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_tests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title            TEXT NOT NULL,
  category         TEXT NOT NULL,
  duration_minutes INT  NOT NULL DEFAULT 15,
  questions        JSONB NOT NULL,
  passing_score    INT  NOT NULL DEFAULT 70,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_attempts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_id      UUID NOT NULL REFERENCES skill_tests(id),
  score        INT NOT NULL,
  passed       BOOLEAN NOT NULL,
  answers      JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, test_id)
);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own attempts" ON test_attempts FOR ALL USING (auth.uid() = student_id);

-- ============================================================
-- Seed: Sample Skill Tests
-- ============================================================
INSERT INTO skill_tests (title, category, duration_minutes, questions, passing_score) VALUES
(
  'HTML & CSS Basics',
  'Web Dev',
  10,
  '[
    {"id":1,"q":"What does HTML stand for?","opts":["Hyper Text Markup Language","High Text Machine Language","Hyper Tabular Markup Language","Home Tool Markup Language"],"ans":0},
    {"id":2,"q":"Which CSS property controls text size?","opts":["font-weight","text-size","font-size","text-style"],"ans":2},
    {"id":3,"q":"Which tag creates a hyperlink?","opts":["<link>","<a>","<href>","<url>"],"ans":1},
    {"id":4,"q":"What does CSS stand for?","opts":["Colorful Style Sheets","Creative Style System","Cascading Style Sheets","Computer Style Sheets"],"ans":2},
    {"id":5,"q":"Which HTML element defines the largest heading?","opts":["<h6>","<heading>","<head>","<h1>"],"ans":3},
    {"id":6,"q":"How do you make text bold in HTML?","opts":["<strong>","<bold>","<b>","Both <strong> and <b>"],"ans":3},
    {"id":7,"q":"Which CSS property sets background color?","opts":["color","bg-color","background","background-color"],"ans":3},
    {"id":8,"q":"Which HTML attribute specifies alternate text for an image?","opts":["title","src","alt","href"],"ans":2},
    {"id":9,"q":"What is the correct CSS syntax to make all <p> red?","opts":["p {color: red;}","p.color = red","all.p {color: red;}","p = {color: red;}"],"ans":0},
    {"id":10,"q":"How do you add a comment in CSS?","opts":["// comment","/* comment */","<!-- comment -->","# comment"],"ans":1}
  ]'::jsonb,
  70
),
(
  'JavaScript Fundamentals',
  'Web Dev',
  15,
  '[
    {"id":1,"q":"Which company created JavaScript?","opts":["Microsoft","Apple","Netscape","Google"],"ans":2},
    {"id":2,"q":"How do you declare a variable in modern JS?","opts":["var x","let x","const x","All of the above"],"ans":3},
    {"id":3,"q":"What does === check?","opts":["Value only","Type only","Value and type","Neither"],"ans":2},
    {"id":4,"q":"Which method adds an element to the end of an array?","opts":["push()","pop()","shift()","unshift()"],"ans":0},
    {"id":5,"q":"What is the output of typeof null?","opts":["null","undefined","object","string"],"ans":2},
    {"id":6,"q":"Which keyword prevents variable re-assignment?","opts":["let","var","const","static"],"ans":2},
    {"id":7,"q":"How do you write a single-line comment?","opts":["<!-- -->","/* */","//","#"],"ans":2},
    {"id":8,"q":"What does JSON stand for?","opts":["JavaScript Object Notation","Java Standard Object Notation","JavaScript Online Notation","None"],"ans":0},
    {"id":9,"q":"Which method removes the last element of an array?","opts":["push()","pop()","splice()","slice()"],"ans":1},
    {"id":10,"q":"What is the correct way to write an arrow function?","opts":["function() =>","=> function()","const f = () => {}","const f => () {}"],"ans":2}
  ]'::jsonb,
  70
),
(
  'Python Basics',
  'Programming',
  12,
  '[
    {"id":1,"q":"Which symbol is used for single-line comments in Python?","opts":["//","#","/*","--"],"ans":1},
    {"id":2,"q":"What is the output of print(type([]))?","opts":["<class list>","<class array>","<class dict>","list"],"ans":0},
    {"id":3,"q":"Which keyword is used to define a function?","opts":["function","def","func","define"],"ans":1},
    {"id":4,"q":"How do you create a list in Python?","opts":["{}","()","[]","<>"],"ans":2},
    {"id":5,"q":"What does len() do?","opts":["Returns largest element","Returns length","Converts to list","Deletes element"],"ans":1},
    {"id":6,"q":"Which of these is a Python tuple?","opts":["[1,2,3]","{1,2,3}","(1,2,3)","<1,2,3>"],"ans":2},
    {"id":7,"q":"What keyword is used for loops?","opts":["foreach","loop","for","repeat"],"ans":2},
    {"id":8,"q":"How do you check if a key exists in a dict?","opts":["key in dict","dict.has(key)","dict.contains(key)","dict.exists(key)"],"ans":0}
  ]'::jsonb,
  60
),
(
  'Digital Marketing Basics',
  'Marketing',
  10,
  '[
    {"id":1,"q":"What does SEO stand for?","opts":["Social Engine Optimization","Search Engine Optimization","Site Engine Optimization","Social Engagement Output"],"ans":1},
    {"id":2,"q":"Which platform is best for B2B marketing?","opts":["Instagram","TikTok","LinkedIn","Snapchat"],"ans":2},
    {"id":3,"q":"What is a CTA?","opts":["Cost To Advertise","Call To Action","Content Track Analytics","Customer Target Audience"],"ans":1},
    {"id":4,"q":"What does CTR measure?","opts":["Cost per click","Click-Through Rate","Content Tracking Rate","Customer Total Revenue"],"ans":1},
    {"id":5,"q":"Which is a key metric in email marketing?","opts":["Bounce rate","Follower count","Page views","Story views"],"ans":0},
    {"id":6,"q":"What is remarketing?","opts":["Re-branding a product","Targeting previous visitors","Creating new ads","Email campaigns"],"ans":1},
    {"id":7,"q":"Google Ads works on which model?","opts":["CPM","CPS","PPC","CPA"],"ans":2},
    {"id":8,"q":"What is the purpose of a landing page?","opts":["Show company info","Convert visitors to leads","Display blog posts","Host images"],"ans":1}
  ]'::jsonb,
  60
);

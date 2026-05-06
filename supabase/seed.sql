-- ============================================================
-- InternHub — Demo Seed Data
-- Run this in: Supabase Dashboard > SQL Editor
-- Run AFTER schema.sql
-- ============================================================

-- ─────────────────────────────────────────
-- DEMO PROFILES (bypasses RLS in SQL editor)
-- ─────────────────────────────────────────

-- Companies
INSERT INTO profiles (id, name, email, role, avatar_url) VALUES
  ('11111111-0000-0000-0000-000000000001', 'TechVista BD',        'hr@techvista.com.bd',     'company', NULL),
  ('11111111-0000-0000-0000-000000000002', 'Shajghor Digital',    'jobs@shajghor.com',       'company', NULL),
  ('11111111-0000-0000-0000-000000000003', 'FinEdge Bangladesh',  'careers@finedge.com.bd',  'company', NULL),
  ('11111111-0000-0000-0000-000000000004', 'CreativeNest',        'hello@creativenest.io',   'company', NULL),
  ('11111111-0000-0000-0000-000000000005', 'DataPulse Analytics', 'team@datapulse.com.bd',   'company', NULL)
ON CONFLICT (id) DO NOTHING;

-- Students
INSERT INTO profiles (id, name, email, role, avatar_url) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Raihan Ahmed',    'raihan@student.com',  'student', NULL),
  ('22222222-0000-0000-0000-000000000002', 'Nusrat Jahan',    'nusrat@student.com',  'student', NULL),
  ('22222222-0000-0000-0000-000000000003', 'Farhan Hossain',  'farhan@student.com',  'student', NULL)
ON CONFLICT (id) DO NOTHING;

-- Admin
INSERT INTO profiles (id, name, email, role) VALUES
  ('33333333-0000-0000-0000-000000000001', 'Admin User', 'admin@internhub.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- COMPANY PROFILES
-- ─────────────────────────────────────────
INSERT INTO company_profiles (id, company_name, industry, company_size, location, website, description, is_verified) VALUES
  (
    '11111111-0000-0000-0000-000000000001',
    'TechVista BD',
    'Software & IT',
    '51-200',
    'Dhaka, Bangladesh',
    'https://techvista.com.bd',
    'TechVista BD is a leading software company in Bangladesh building SaaS products for South Asian markets. We specialize in fintech, edtech, and enterprise solutions.',
    true
  ),
  (
    '11111111-0000-0000-0000-000000000002',
    'Shajghor Digital',
    'E-commerce & Retail',
    '11-50',
    'Chittagong, Bangladesh',
    'https://shajghor.com',
    'Shajghor Digital is revolutionizing online shopping in Bangladesh. We connect local artisans and businesses with millions of customers nationwide.',
    true
  ),
  (
    '11111111-0000-0000-0000-000000000003',
    'FinEdge Bangladesh',
    'Finance & Banking',
    '201-500',
    'Dhaka, Bangladesh',
    'https://finedge.com.bd',
    'FinEdge provides cutting-edge financial technology solutions to banks and NBFIs across Bangladesh. Our products serve 5 million+ customers.',
    true
  ),
  (
    '11111111-0000-0000-0000-000000000004',
    'CreativeNest',
    'Design & Marketing',
    '11-50',
    'Dhaka, Bangladesh',
    'https://creativenest.io',
    'CreativeNest is a full-service creative agency helping brands tell their stories. We work with startups and Fortune 500 companies across Southeast Asia.',
    false
  ),
  (
    '11111111-0000-0000-0000-000000000005',
    'DataPulse Analytics',
    'Data & Analytics',
    '11-50',
    'Dhaka, Bangladesh',
    'https://datapulse.com.bd',
    'DataPulse helps businesses make data-driven decisions through advanced analytics, machine learning, and business intelligence solutions.',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- STUDENT PROFILES
-- ─────────────────────────────────────────
INSERT INTO student_profiles (id, university, department, graduation_year, cgpa, phone, skills, bio, linkedin_url, github_url, availability, experience_level) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    'Bangladesh University of Engineering and Technology (BUET)',
    'Computer Science & Engineering',
    2025,
    3.75,
    '+8801712345678',
    'React, Node.js, Python, PostgreSQL, Docker',
    'Final year CSE student at BUET passionate about full-stack development and open source.',
    'https://linkedin.com/in/raihan-ahmed',
    'https://github.com/raihan-ahmed',
    'immediately',
    'entry'
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'University of Dhaka',
    'Business Administration (MBA)',
    2025,
    3.60,
    '+8801812345678',
    'Digital Marketing, SEO, Content Strategy, Google Analytics, Canva',
    'Marketing enthusiast with hands-on experience in social media management and brand building.',
    'https://linkedin.com/in/nusrat-jahan',
    NULL,
    '1-3 months',
    'entry'
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'North South University',
    'Finance & Banking',
    2024,
    3.45,
    '+8801912345678',
    'Financial Modeling, Excel, Power BI, Python, Bloomberg',
    'Finance graduate with strong analytical skills and interest in investment banking and fintech.',
    'https://linkedin.com/in/farhan-hossain',
    NULL,
    'immediately',
    'entry'
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- JOBS
-- ─────────────────────────────────────────
INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000001',
  c.id,
  'Junior Software Engineer (React)',
  'We are looking for a passionate Junior Software Engineer to join our growing product team at TechVista BD. You will work on building scalable web applications used by thousands of users across Bangladesh.',
  'Basic knowledge of React.js and JavaScript
Familiarity with REST APIs and JSON
Understanding of HTML5 and CSS3
Knowledge of Git version control
Currently enrolled in or recently graduated from a CS/IT program',
  'Develop and maintain React.js components
Collaborate with designers to implement UI/UX designs
Write clean, well-documented code
Participate in daily standups and sprint planning
Debug and fix issues in existing applications',
  'Dhaka, Bangladesh', 'hybrid', 'internship',
  8000, 15000,
  NOW() + INTERVAL '30 days',
  'active', true, 245
FROM categories c WHERE c.slug = 'software-engineering'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000001',
  c.id,
  'Backend Developer Intern (Node.js)',
  'TechVista BD is hiring Backend Developer Interns to work on our core API infrastructure. This is a great opportunity to learn enterprise-level backend development with a mentorship-focused team.',
  'Knowledge of Node.js and Express.js
Basic understanding of databases (PostgreSQL or MongoDB)
Familiarity with RESTful API design
Understanding of authentication concepts (JWT, OAuth)
Good problem-solving skills',
  'Build and maintain RESTful APIs
Design database schemas and write SQL queries
Implement authentication and authorization logic
Write unit tests for backend services
Document API endpoints using Swagger/OpenAPI',
  'Dhaka, Bangladesh', 'remote', 'internship',
  10000, 18000,
  NOW() + INTERVAL '25 days',
  'active', true, 189
FROM categories c WHERE c.slug = 'software-engineering'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000005',
  c.id,
  'Data Analyst Intern',
  'DataPulse Analytics is looking for a Data Analyst Intern to help our clients make sense of their data. You will work with real business datasets and build dashboards that drive decisions.',
  'Proficiency in Excel and basic SQL
Knowledge of Python (pandas, numpy) is a plus
Familiarity with data visualization tools (Power BI or Tableau)
Strong analytical and logical thinking
Currently pursuing a degree in Statistics, Math, CS, or related field',
  'Collect, clean and analyze large datasets
Build reports and dashboards for clients
Identify trends and patterns in business data
Assist senior analysts in ad-hoc data requests
Present findings to non-technical stakeholders',
  'Dhaka, Bangladesh', 'onsite', 'internship',
  9000, 14000,
  NOW() + INTERVAL '20 days',
  'active', true, 312
FROM categories c WHERE c.slug = 'data-science'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000004',
  '11111111-0000-0000-0000-000000000004',
  c.id,
  'UI/UX Design Intern',
  'CreativeNest is seeking a talented UI/UX Design Intern who is passionate about creating beautiful and user-friendly digital experiences. You will work directly with our senior designers on live client projects.',
  'Proficiency in Figma (required)
Understanding of UX principles and user research
Portfolio showing UI/UX projects (academic or personal)
Knowledge of design systems and component libraries
Eye for detail and strong visual design sense',
  'Design wireframes, prototypes, and high-fidelity mockups
Conduct user research and usability testing
Create and maintain design system components
Collaborate with developers to ensure pixel-perfect implementation
Present designs to clients and incorporate feedback',
  'Dhaka, Bangladesh', 'hybrid', 'internship',
  8000, 12000,
  NOW() + INTERVAL '15 days',
  'active', true, 278
FROM categories c WHERE c.slug = 'design'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000005',
  '11111111-0000-0000-0000-000000000002',
  c.id,
  'Digital Marketing Intern',
  'Shajghor Digital is growing fast and we need a Digital Marketing Intern to help scale our online presence. You will manage social media, run campaigns, and help acquire new customers.',
  'Understanding of social media platforms (Facebook, Instagram, TikTok)
Basic knowledge of SEO and Google Analytics
Good written communication skills in Bengali and English
Creative thinking and content creation ability
Knowledge of Canva or Adobe tools is a plus',
  'Manage and grow social media accounts
Create engaging content for Facebook, Instagram, and YouTube
Run and optimize paid advertising campaigns
Track campaign performance and prepare weekly reports
Coordinate with the content and design team',
  'Chittagong, Bangladesh', 'hybrid', 'internship',
  7000, 12000,
  NOW() + INTERVAL '22 days',
  'active', false, 156
FROM categories c WHERE c.slug = 'marketing'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000006',
  '11111111-0000-0000-0000-000000000003',
  c.id,
  'Finance Intern',
  'FinEdge Bangladesh is offering a Finance Internship for final-year students who want to gain real-world experience in financial services and banking technology. Work alongside CFO-level professionals.',
  'Pursuing a degree in Finance, Accounting, or Economics
Proficiency in Excel and financial modeling basics
Understanding of financial statements (P&L, Balance Sheet)
Strong attention to detail and numerical accuracy
Knowledge of Bangladesh banking regulations is a plus',
  'Assist in preparing monthly financial reports
Support the accounting team with reconciliations
Analyze financial data and prepare summaries
Help with budgeting and forecasting processes
Maintain financial records and documentation',
  'Dhaka, Bangladesh', 'onsite', 'internship',
  10000, 16000,
  NOW() + INTERVAL '18 days',
  'active', false, 201
FROM categories c WHERE c.slug = 'finance'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000007',
  '11111111-0000-0000-0000-000000000004',
  c.id,
  'Content Writer Intern',
  'CreativeNest is looking for a creative Content Writer Intern to produce compelling content for our clients across various industries. If you love writing and storytelling, this is for you.',
  'Excellent writing skills in English (Bengali is a plus)
Creative thinking and storytelling ability
Basic understanding of SEO and content marketing
Ability to research and write on diverse topics
Attention to grammar, tone, and style',
  'Write blog posts, articles, and website copy
Create social media captions and ad copy
Research topics and produce well-structured content
Edit and proofread content before publishing
Collaborate with the design team on content campaigns',
  'Dhaka, Bangladesh', 'remote', 'internship',
  6000, 10000,
  NOW() + INTERVAL '28 days',
  'active', false, 134
FROM categories c WHERE c.slug = 'content-writing'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000008',
  '11111111-0000-0000-0000-000000000005',
  c.id,
  'Machine Learning Intern',
  'DataPulse Analytics is hiring a Machine Learning Intern to work on cutting-edge AI projects. You will build and deploy ML models that solve real business problems for our enterprise clients.',
  'Knowledge of Python and ML libraries (scikit-learn, TensorFlow or PyTorch)
Understanding of statistics and linear algebra
Familiarity with data preprocessing and feature engineering
Experience with Jupyter Notebooks
Currently pursuing a degree in CS, Math, Statistics, or related field',
  'Build and train machine learning models
Preprocess and analyze datasets
Evaluate model performance and tune hyperparameters
Deploy models to production environments
Document research and present findings',
  'Dhaka, Bangladesh', 'hybrid', 'internship',
  12000, 20000,
  NOW() + INTERVAL '14 days',
  'active', true, 423
FROM categories c WHERE c.slug = 'data-science'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000009',
  '11111111-0000-0000-0000-000000000001',
  c.id,
  'Full Stack Developer (Part-time)',
  'TechVista BD is looking for a part-time Full Stack Developer to support our product team. This is a paid part-time role ideal for students who want to work while studying.',
  'Solid understanding of React.js and Node.js
Experience with PostgreSQL or MySQL
Knowledge of REST API development
Familiarity with Git and basic DevOps
Ability to commit 20 hours per week',
  'Build features for our web applications
Fix bugs and improve application performance
Review code and participate in technical discussions
Collaborate with the design and product teams
Contribute to technical documentation',
  'Dhaka, Bangladesh', 'remote', 'part-time',
  15000, 25000,
  NOW() + INTERVAL '35 days',
  'active', false, 167
FROM categories c WHERE c.slug = 'software-engineering'
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (
  id, company_id, category_id, title, description, requirements,
  responsibilities, location, work_mode, job_type,
  salary_min, salary_max, deadline, status, is_featured, views
)
SELECT
  '44444444-0000-0000-0000-000000000010',
  '11111111-0000-0000-0000-000000000002',
  c.id,
  'Business Development Intern',
  'Shajghor Digital is expanding rapidly and needs a Business Development Intern to identify new growth opportunities, support partnerships, and help drive revenue.',
  'Strong communication and interpersonal skills
Understanding of e-commerce and digital business models
Ability to research markets and competitors
Proficiency in Excel and PowerPoint
Enthusiasm for startups and growth-stage companies',
  'Research potential partners and clients
Support the sales team with lead generation
Prepare pitch decks and business proposals
Attend client meetings and take notes
Track and report on business development activities',
  'Chittagong, Bangladesh', 'onsite', 'internship',
  7000, 11000,
  NOW() + INTERVAL '21 days',
  'active', false, 98
FROM categories c WHERE c.slug = 'business-development'
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────
-- DEMO APPLICATIONS
-- ─────────────────────────────────────────
INSERT INTO applications (job_id, student_id, cover_letter, status) VALUES
  (
    '44444444-0000-0000-0000-000000000001',
    '22222222-0000-0000-0000-000000000001',
    'I am a final year CSE student at BUET with strong React.js skills. I have built several projects using React and Node.js and I am excited about the opportunity to contribute to TechVista BD''s product team.',
    'shortlisted'
  ),
  (
    '44444444-0000-0000-0000-000000000003',
    '22222222-0000-0000-0000-000000000001',
    'As a CSE student with Python and data analysis experience, I am keen to apply my skills in a real business setting at DataPulse Analytics.',
    'pending'
  ),
  (
    '44444444-0000-0000-0000-000000000005',
    '22222222-0000-0000-0000-000000000002',
    'I have been managing social media for a local NGO for the past year and I am eager to apply my digital marketing knowledge in a professional setting at Shajghor Digital.',
    'accepted'
  ),
  (
    '44444444-0000-0000-0000-000000000006',
    '22222222-0000-0000-0000-000000000003',
    'As a Finance graduate with strong Excel and financial modeling skills, I am very interested in the Finance Intern role at FinEdge Bangladesh.',
    'pending'
  )
ON CONFLICT (job_id, student_id) DO NOTHING;

-- ─────────────────────────────────────────
-- DEMO SAVED JOBS
-- ─────────────────────────────────────────
INSERT INTO saved_jobs (student_id, job_id) VALUES
  ('22222222-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000008'),
  ('22222222-0000-0000-0000-000000000001', '44444444-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000005'),
  ('22222222-0000-0000-0000-000000000002', '44444444-0000-0000-0000-000000000007'),
  ('22222222-0000-0000-0000-000000000003', '44444444-0000-0000-0000-000000000006')
ON CONFLICT (student_id, job_id) DO NOTHING;

-- ─────────────────────────────────────────
-- DEMO NOTIFICATIONS
-- ─────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, type, link, is_read) VALUES
  (
    '22222222-0000-0000-0000-000000000001',
    'Application Shortlisted! 🎉',
    'Congratulations! TechVista BD has shortlisted your application for Junior Software Engineer (React).',
    'app_update',
    '/student/applications',
    false
  ),
  (
    '22222222-0000-0000-0000-000000000002',
    'Application Accepted! 🎉',
    'Great news! Shajghor Digital has accepted your application for Digital Marketing Intern. Check your email for next steps.',
    'app_update',
    '/student/applications',
    false
  ),
  (
    '22222222-0000-0000-0000-000000000003',
    'New Job Match',
    'A new Finance Intern position at FinEdge Bangladesh matches your profile. Apply before the deadline!',
    'app_update',
    '/jobs/44444444-0000-0000-0000-000000000006',
    true
  )
ON CONFLICT DO NOTHING;

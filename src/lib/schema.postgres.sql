-- PostgreSQL Schema for VeloraSkills (Supabase Compatible)

CREATE TABLE IF NOT EXISTS internship_domains (
  id SERIAL PRIMARY KEY,
  name VARCHAR(140) NOT NULL UNIQUE,
  category VARCHAR(20) NOT NULL CHECK (category IN ('tech', 'non_tech')),
  is_featured BOOLEAN DEFAULT FALSE,
  duration_weeks_min SMALLINT DEFAULT 4,
  duration_weeks_max SMALLINT DEFAULT 8,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_domains_category ON internship_domains (category);
CREATE INDEX IF NOT EXISTS idx_domains_featured ON internship_domains (is_featured);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'reviewer', 'support')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id SERIAL PRIMARY KEY,
  intern_id VARCHAR(32) UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  domain VARCHAR(140) NOT NULL,
  domain_id INT NULL REFERENCES internship_domains(id) ON DELETE SET NULL,
  education VARCHAR(160),
  college VARCHAR(190),
  graduation_year INT NULL,
  portfolio_url VARCHAR(255),
  source VARCHAR(60) DEFAULT 'website',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'completed', 'rejected')),
  progress_percent SMALLINT DEFAULT 0,
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('not_required', 'pending', 'verified', 'failed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_email ON internship_applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_domain ON internship_applications (domain);
CREATE INDEX IF NOT EXISTS idx_applications_status ON internship_applications (status);

CREATE TABLE IF NOT EXISTS student_accounts (
  id SERIAL PRIMARY KEY,
  application_id INT NULL REFERENCES internship_applications(id) ON DELETE SET NULL,
  intern_id VARCHAR(32) UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  last_login_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS offer_letters (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  offer_letter_id VARCHAR(64) NOT NULL UNIQUE,
  file_url VARCHAR(255),
  issue_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'issued' CHECK (status IN ('issued', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_tasks (
  id SERIAL PRIMARY KEY,
  domain_id INT NULL REFERENCES internship_domains(id) ON DELETE SET NULL,
  domain VARCHAR(140) NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  instructions_url VARCHAR(255),
  due_days INT DEFAULT 7,
  task_order INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_domain ON internship_tasks (domain);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON internship_tasks (status);

CREATE TABLE IF NOT EXISTS task_submissions (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  task_id INT NOT NULL REFERENCES internship_tasks(id) ON DELETE CASCADE,
  submission_url VARCHAR(255) NOT NULL,
  notes TEXT,
  feedback TEXT,
  score NUMERIC(5,2) NULL,
  status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'approved', 'revision_required', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMPTZ NULL,
  reviewed_by INT NULL REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  payment_reference VARCHAR(100) UNIQUE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'INR',
  provider VARCHAR(80) DEFAULT 'manual',
  receipt_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'refunded')),
  verified_by INT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  paid_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  certificate_id VARCHAR(64) UNIQUE NOT NULL,
  file_url VARCHAR(255),
  qr_url VARCHAR(255),
  issue_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('valid', 'revoked', 'pending')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  rating SMALLINT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_resources (
  id SERIAL PRIMARY KEY,
  domain_id INT NULL REFERENCES internship_domains(id) ON DELETE SET NULL,
  title VARCHAR(180) NOT NULL,
  resource_type VARCHAR(30) DEFAULT 'material' CHECK (resource_type IN ('material', 'github_guide', 'submission_guide', 'faq', 'video', 'blog')),
  url VARCHAR(255),
  description TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  application_id INT NULL REFERENCES internship_applications(id) ON DELETE SET NULL,
  channel VARCHAR(20) DEFAULT 'system' CHECK (channel IN ('email', 'whatsapp', 'system')),
  subject VARCHAR(180),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
  sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  referred_name VARCHAR(160) NOT NULL,
  referred_email VARCHAR(190),
  reward_status VARCHAR(20) DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(40),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_badges (
  id SERIAL PRIMARY KEY,
  application_id INT NOT NULL REFERENCES internship_applications(id) ON DELETE CASCADE,
  badge_id INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uniq_student_badge UNIQUE (application_id, badge_id)
);

CREATE TABLE IF NOT EXISTS career_tool_requests (
  id SERIAL PRIMARY KEY,
  application_id INT NULL REFERENCES internship_applications(id) ON DELETE SET NULL,
  tool_type VARCHAR(40) NOT NULL CHECK (tool_type IN ('resume_builder', 'ats_checker', 'interview_prep', 'career_roadmap', 'portfolio_builder')),
  input_summary TEXT,
  output_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  topic VARCHAR(160),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  category VARCHAR(120),
  excerpt TEXT,
  cover_url VARCHAR(255),
  author VARCHAR(160) DEFAULT 'VeloraSkills',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_type VARCHAR(20) DEFAULT 'system' CHECK (actor_type IN ('admin', 'student', 'system')),
  actor_id INT NULL,
  action VARCHAR(160) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT INTO internship_domains (name, category, is_featured, duration_weeks_min, duration_weeks_max)
VALUES
  ('Web Development', 'tech', FALSE, 4, 8),
  ('Full Stack Development', 'tech', TRUE, 4, 8),
  ('Frontend Development', 'tech', FALSE, 4, 8),
  ('Backend Development', 'tech', FALSE, 4, 8),
  ('Java Development', 'tech', FALSE, 4, 8),
  ('Python Development', 'tech', FALSE, 4, 8),
  ('C++ Programming', 'tech', FALSE, 4, 8),
  ('Data Science', 'tech', FALSE, 4, 8),
  ('Data Analytics', 'tech', TRUE, 4, 8),
  ('Machine Learning', 'tech', TRUE, 4, 8),
  ('Artificial Intelligence', 'tech', TRUE, 4, 8),
  ('Deep Learning', 'tech', FALSE, 4, 8),
  ('Generative AI', 'tech', FALSE, 4, 8),
  ('Cyber Security', 'tech', TRUE, 4, 8),
  ('Ethical Hacking', 'tech', FALSE, 4, 8),
  ('Cloud Computing', 'tech', FALSE, 4, 8),
  ('DevOps Engineering', 'tech', FALSE, 4, 8),
  ('Android App Development', 'tech', FALSE, 4, 8),
  ('Flutter App Development', 'tech', FALSE, 4, 8),
  ('UI/UX Design', 'tech', TRUE, 4, 8),
  ('Graphic Design', 'tech', FALSE, 4, 8),
  ('Blockchain Development', 'tech', FALSE, 4, 8),
  ('Internet of Things (IoT)', 'tech', FALSE, 4, 8),
  ('Software Testing & QA', 'tech', FALSE, 4, 8),
  ('Database Management (SQL)', 'tech', FALSE, 4, 8),
  ('Digital Marketing', 'non_tech', TRUE, 4, 6),
  ('Social Media Marketing', 'non_tech', FALSE, 4, 6),
  ('Content Writing', 'non_tech', FALSE, 4, 6),
  ('Technical Writing', 'non_tech', FALSE, 4, 6),
  ('Human Resource (HR)', 'non_tech', FALSE, 4, 6),
  ('Business Development', 'non_tech', FALSE, 4, 6),
  ('Sales & Marketing', 'non_tech', FALSE, 4, 6),
  ('Finance & Accounting', 'non_tech', FALSE, 4, 6),
  ('Stock Market & Trading', 'non_tech', TRUE, 4, 6),
  ('Cryptocurrency & Blockchain Trading', 'non_tech', FALSE, 4, 6),
  ('Bioinformatics', 'non_tech', TRUE, 4, 6),
  ('Biotechnology Research', 'non_tech', FALSE, 4, 6),
  ('English Speaking & Communication', 'non_tech', TRUE, 4, 6),
  ('Public Speaking & Personality Development', 'non_tech', FALSE, 4, 6),
  ('Entrepreneurship & Startup Management', 'non_tech', FALSE, 4, 6)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  is_featured = EXCLUDED.is_featured,
  duration_weeks_min = EXCLUDED.duration_weeks_min,
  duration_weeks_max = EXCLUDED.duration_weeks_max,
  status = 'active';

INSERT INTO badges (name, description, icon)
VALUES
  ('Fast Starter', 'Awarded for completing onboarding quickly.', 'rocket'),
  ('Task Finisher', 'Awarded for consistent task completion.', 'check'),
  ('Portfolio Ready', 'Awarded for completing a portfolio-ready project.', 'briefcase'),
  ('Verified Intern', 'Awarded after certificate verification is enabled.', 'shield')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

INSERT INTO admin_users (full_name, email, password_hash, role, status)
VALUES
  ('VeloraSkills Admin', 'admin@veloraskills.tech', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'super_admin', 'active')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

INSERT INTO student_accounts (intern_id, full_name, email, password_hash, status)
VALUES
  ('VS-2026-00042', 'Riya Sharma', 'student@veloraskills.tech', '36e382d56a2bbfa3ea08f6ef1e1d0c92d525ed8a1d74659b8c0a2a4ed118f670', 'active')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  password_hash = EXCLUDED.password_hash,
  status = EXCLUDED.status;

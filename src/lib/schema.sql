CREATE DATABASE IF NOT EXISTS veloraskills
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE veloraskills;

CREATE TABLE IF NOT EXISTS internship_domains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(140) NOT NULL UNIQUE,
  category ENUM('tech', 'non_tech') NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  duration_weeks_min TINYINT UNSIGNED DEFAULT 4,
  duration_weeks_max TINYINT UNSIGNED DEFAULT 8,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_domains_category (category),
  INDEX idx_domains_featured (is_featured)
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'reviewer', 'support') DEFAULT 'admin',
  status ENUM('active', 'inactive') DEFAULT 'active',
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS internship_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  intern_id VARCHAR(32) UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  domain VARCHAR(140) NOT NULL,
  domain_id INT NULL,
  education VARCHAR(160),
  college VARCHAR(190),
  graduation_year YEAR NULL,
  portfolio_url VARCHAR(255),
  source VARCHAR(60) DEFAULT 'website',
  status ENUM('pending', 'approved', 'active', 'completed', 'rejected') DEFAULT 'pending',
  progress_percent TINYINT UNSIGNED DEFAULT 0,
  payment_status ENUM('not_required', 'pending', 'verified', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_applications_email (email),
  INDEX idx_applications_domain (domain),
  INDEX idx_applications_status (status),
  FOREIGN KEY (domain_id) REFERENCES internship_domains(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS student_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NULL,
  intern_id VARCHAR(32) UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS offer_letters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  offer_letter_id VARCHAR(64) NOT NULL UNIQUE,
  file_url VARCHAR(255),
  issue_date DATE NOT NULL,
  status ENUM('issued', 'revoked') DEFAULT 'issued',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS internship_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain_id INT NULL,
  domain VARCHAR(140) NOT NULL,
  title VARCHAR(180) NOT NULL,
  description TEXT,
  instructions_url VARCHAR(255),
  due_days INT DEFAULT 7,
  task_order INT DEFAULT 1,
  status ENUM('draft', 'published', 'archived') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_tasks_domain (domain),
  INDEX idx_tasks_status (status),
  FOREIGN KEY (domain_id) REFERENCES internship_domains(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS task_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  task_id INT NOT NULL,
  submission_url VARCHAR(255) NOT NULL,
  notes TEXT,
  feedback TEXT,
  score DECIMAL(5,2) NULL,
  status ENUM('submitted', 'reviewing', 'approved', 'revision_required', 'rejected') DEFAULT 'submitted',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by INT NULL,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES internship_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  payment_reference VARCHAR(100) UNIQUE,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  currency CHAR(3) DEFAULT 'INR',
  provider VARCHAR(80) DEFAULT 'manual',
  receipt_url VARCHAR(255),
  status ENUM('pending', 'verified', 'failed', 'refunded') DEFAULT 'pending',
  verified_by INT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  certificate_id VARCHAR(64) UNIQUE NOT NULL,
  file_url VARCHAR(255),
  qr_url VARCHAR(255),
  issue_date DATE NOT NULL,
  status ENUM('valid', 'revoked', 'pending') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  rating TINYINT UNSIGNED NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain_id INT NULL,
  title VARCHAR(180) NOT NULL,
  resource_type ENUM('material', 'github_guide', 'submission_guide', 'faq', 'video', 'blog') DEFAULT 'material',
  url VARCHAR(255),
  description TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES internship_domains(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NULL,
  channel ENUM('email', 'whatsapp', 'system') DEFAULT 'system',
  subject VARCHAR(180),
  message TEXT NOT NULL,
  status ENUM('queued', 'sent', 'failed') DEFAULT 'queued',
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrer_application_id INT NOT NULL,
  referred_name VARCHAR(160) NOT NULL,
  referred_email VARCHAR(190),
  reward_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (referrer_application_id) REFERENCES internship_applications(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  badge_id INT NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_student_badge (application_id, badge_id),
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS career_tool_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NULL,
  tool_type ENUM('resume_builder', 'ats_checker', 'interview_prep', 'career_roadmap', 'portfolio_builder') NOT NULL,
  input_summary TEXT,
  output_url VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (application_id) REFERENCES internship_applications(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(190) NOT NULL,
  topic VARCHAR(160),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'resolved') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(220) NOT NULL,
  slug VARCHAR(240) NOT NULL UNIQUE,
  category VARCHAR(120),
  excerpt TEXT,
  cover_url VARCHAR(255),
  author VARCHAR(160) DEFAULT 'VeloraSkills',
  status ENUM('draft', 'published') DEFAULT 'draft',
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_type ENUM('admin', 'student', 'system') DEFAULT 'system',
  actor_id INT NULL,
  action VARCHAR(160) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
ON DUPLICATE KEY UPDATE
  category = VALUES(category),
  is_featured = VALUES(is_featured),
  duration_weeks_min = VALUES(duration_weeks_min),
  duration_weeks_max = VALUES(duration_weeks_max),
  status = 'active';

INSERT INTO badges (name, description, icon)
VALUES
  ('Fast Starter', 'Awarded for completing onboarding quickly.', 'rocket'),
  ('Task Finisher', 'Awarded for consistent task completion.', 'check'),
  ('Portfolio Ready', 'Awarded for completing a portfolio-ready project.', 'briefcase'),
  ('Verified Intern', 'Awarded after certificate verification is enabled.', 'shield')
ON DUPLICATE KEY UPDATE
  description = VALUES(description),
  icon = VALUES(icon);

INSERT INTO admin_users (full_name, email, password_hash, role, status)
VALUES
  ('VeloraSkills Admin', 'admin@veloraskills.tech', SHA2('admin123', 256), 'super_admin', 'active')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  status = VALUES(status);

INSERT INTO student_accounts (intern_id, full_name, email, password_hash, status)
VALUES
  ('VS-2026-00042', 'Riya Sharma', 'student@veloraskills.tech', SHA2('student123', 256), 'active')
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name),
  password_hash = VALUES(password_hash),
  status = VALUES(status);

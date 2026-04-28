-- MCSA Platform Database Schema for Neon

-- Profiles (linked to Clerk user IDs)
CREATE TABLE IF NOT EXISTS mcsa_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  organization TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membership plans
CREATE TABLE IF NOT EXISTS mcsa_membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_annual INTEGER,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE
);

-- User memberships
CREATE TABLE IF NOT EXISTS mcsa_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id),
  plan_id UUID REFERENCES mcsa_membership_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course categories
CREATE TABLE IF NOT EXISTS mcsa_course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0
);

-- Courses
CREATE TABLE IF NOT EXISTS mcsa_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES mcsa_course_categories(id),
  course_code TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Certification')),
  duration_hours NUMERIC(4,1) DEFAULT 1.5,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules
CREATE TABLE IF NOT EXISTS mcsa_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES mcsa_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  duration_minutes INTEGER DEFAULT 20,
  order_index INTEGER DEFAULT 0,
  is_preview BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollments
CREATE TABLE IF NOT EXISTS mcsa_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id),
  course_id UUID REFERENCES mcsa_courses(id),
  progress_percent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(clerk_id, course_id)
);

-- Module progress
CREATE TABLE IF NOT EXISTS mcsa_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES mcsa_enrollments(id) ON DELETE CASCADE,
  module_id UUID REFERENCES mcsa_modules(id),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(enrollment_id, module_id)
);

-- Certifications
CREATE TABLE IF NOT EXISTS mcsa_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT NOT NULL REFERENCES mcsa_profiles(clerk_id),
  cert_number TEXT UNIQUE NOT NULL,
  course_id UUID REFERENCES mcsa_courses(id),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE IF NOT EXISTS mcsa_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT,
  access_level TEXT DEFAULT 'free' CHECK (access_level IN ('free', 'member')),
  file_url TEXT,
  external_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON mcsa_profiles(clerk_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_clerk_id ON mcsa_enrollments(clerk_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_id ON mcsa_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_enrollment_id ON mcsa_module_progress(enrollment_id);

SELECT 'Schema created successfully' as status;

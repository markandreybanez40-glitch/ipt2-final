-- ==========================================
-- 001_initial_schema.sql
-- Barangay Butuan City Resident Reporting System
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  barangay TEXT DEFAULT 'Barangay Poblacion, Butuan City',
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'resident',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT profiles_role_check CHECK (role IN ('resident', 'admin'))
);

-- ------------------------------------------
-- 2. REPORTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_number TEXT UNIQUE NOT NULL,
  resident_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'submitted',
  photo_url TEXT,
  admin_remarks TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT reports_status_check CHECK (
    status IN ('submitted', 'under_review', 'in_progress', 'resolved', 'rejected')
  )
);

-- ------------------------------------------
-- 3. REPORT HISTORY TABLE (Timeline)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.report_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  remarks TEXT,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 4. NOTIFICATIONS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'status_update',
  is_read BOOLEAN DEFAULT FALSE,
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- 5. ANNOUNCEMENTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT announcements_status_check CHECK (
    status IN ('draft', 'published', 'archived')
  )
);

-- ------------------------------------------
-- 6. REPORT ATTACHMENTS TABLE
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.report_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  file_name TEXT,
  file_path TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------
-- INDEXES FOR FREQUENT QUERIES
-- ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_reports_resident_id ON public.reports(resident_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_category ON public.reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_report_history_report_id ON public.report_history(report_id);
CREATE INDEX IF NOT EXISTS idx_report_history_created_at ON public.report_history(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_announcements_status ON public.announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_report_attachments_report_id ON public.report_attachments(report_id);

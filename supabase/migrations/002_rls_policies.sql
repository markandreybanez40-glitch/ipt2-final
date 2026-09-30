-- ==========================================
-- 002_rls_policies.sql
-- Row Level Security (RLS) Configuration
-- ==========================================

-- Helper function to check if current user is admin without recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get the current user's profile ID
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
BEGIN
  SELECT id INTO v_profile_id
  FROM public.profiles
  WHERE user_id = auth.uid();
  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------
-- 1. PROFILES RLS
-- ------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Residents can view their own profile; Admins can view all profiles
CREATE POLICY "Users can view own profile or admin can view all"
ON public.profiles FOR SELECT
USING (
  user_id = auth.uid() OR public.is_admin()
);

-- Residents can update their own profile; cannot change their own role to admin
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (
  user_id = auth.uid() OR public.is_admin()
)
WITH CHECK (
  (user_id = auth.uid() AND role = (SELECT role FROM public.profiles WHERE id = profiles.id))
  OR public.is_admin()
);

-- System / trigger can insert profiles
CREATE POLICY "System can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (
  user_id = auth.uid() OR public.is_admin()
);

-- ------------------------------------------
-- 2. REPORTS RLS
-- ------------------------------------------
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Residents can view only their own reports; Admins can view all reports
CREATE POLICY "Residents view own reports or admin views all"
ON public.reports FOR SELECT
USING (
  resident_id = public.current_profile_id() OR public.is_admin()
);

-- Residents can insert reports for themselves
CREATE POLICY "Residents create own reports"
ON public.reports FOR INSERT
WITH CHECK (
  resident_id = public.current_profile_id() OR public.is_admin()
);

-- Only Admins can update reports (status, remarks, assign)
CREATE POLICY "Admins update reports"
ON public.reports FOR UPDATE
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);

-- Only Admins can delete reports if needed
CREATE POLICY "Admins delete reports"
ON public.reports FOR DELETE
USING (
  public.is_admin()
);

-- ------------------------------------------
-- 3. REPORT HISTORY RLS
-- ------------------------------------------
ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;

-- Residents can view history of their own reports; Admins can view all
CREATE POLICY "View report history"
ON public.report_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    WHERE r.id = report_history.report_id
      AND (r.resident_id = public.current_profile_id() OR public.is_admin())
  )
);

-- Admins and report creators (at initial submit) can insert history
CREATE POLICY "Insert report history"
ON public.report_history FOR INSERT
WITH CHECK (
  public.is_admin() OR
  EXISTS (
    SELECT 1 FROM public.reports r
    WHERE r.id = report_history.report_id
      AND r.resident_id = public.current_profile_id()
  )
);

-- ------------------------------------------
-- 4. NOTIFICATIONS RLS
-- ------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT
USING (
  user_id = public.current_profile_id() OR public.is_admin()
);

-- Users can update (mark as read) their own notifications
CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE
USING (
  user_id = public.current_profile_id() OR public.is_admin()
)
WITH CHECK (
  user_id = public.current_profile_id() OR public.is_admin()
);

-- System or admins can insert notifications
CREATE POLICY "System or admin insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (
  true
);

-- ------------------------------------------
-- 5. ANNOUNCEMENTS RLS
-- ------------------------------------------
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Residents view published announcements; Admins view all (draft/published/archived)
CREATE POLICY "View announcements"
ON public.announcements FOR SELECT
USING (
  status = 'published' OR public.is_admin()
);

-- Admins can insert announcements
CREATE POLICY "Admins insert announcements"
ON public.announcements FOR INSERT
WITH CHECK (
  public.is_admin()
);

-- Admins can update announcements
CREATE POLICY "Admins update announcements"
ON public.announcements FOR UPDATE
USING (
  public.is_admin()
)
WITH CHECK (
  public.is_admin()
);

-- Admins can delete announcements
CREATE POLICY "Admins delete announcements"
ON public.announcements FOR DELETE
USING (
  public.is_admin()
);

-- ------------------------------------------
-- 6. REPORT ATTACHMENTS RLS
-- ------------------------------------------
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;

-- View attachments for own report or admin
CREATE POLICY "View report attachments"
ON public.report_attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.reports r
    WHERE r.id = report_attachments.report_id
      AND (r.resident_id = public.current_profile_id() OR public.is_admin())
  )
);

-- Insert attachment for own report or admin
CREATE POLICY "Insert report attachments"
ON public.report_attachments FOR INSERT
WITH CHECK (
  uploaded_by = public.current_profile_id() OR public.is_admin()
);

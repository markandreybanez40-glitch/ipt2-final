-- ==========================================
-- 004_functions_and_triggers.sql
-- Database Triggers, Sequences and Automation Functions
-- ==========================================

-- ------------------------------------------
-- 1. AUTOMATIC UPDATED_AT TIMESTAMP
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_reports_updated_at ON public.reports;
CREATE TRIGGER set_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_announcements_updated_at ON public.announcements;
CREATE TRIGGER set_announcements_updated_at
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------
-- 2. AUTOMATIC PROFILE CREATION ON AUTH SIGNUP
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_role TEXT;
BEGIN
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Determine role safely; default to resident, allow admin only if explicitly flagged in trusted metadata
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'resident');
  IF v_role NOT IN ('resident', 'admin') THEN
    v_role := 'resident';
  END IF;

  INSERT INTO public.profiles (
    user_id,
    full_name,
    email,
    phone,
    address,
    barangay,
    avatar_url,
    role
  ) VALUES (
    NEW.id,
    v_full_name,
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'address',
    COALESCE(NEW.raw_user_meta_data->>'barangay', 'Barangay Poblacion, Butuan City'),
    NEW.raw_user_meta_data->>'avatar_url',
    v_role
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------
-- 3. SEQUENTIAL REPORT NUMBER GENERATOR (BR-0001, BR-0002...)
-- ------------------------------------------
CREATE SEQUENCE IF NOT EXISTS public.report_number_seq START WITH 1;

CREATE OR REPLACE FUNCTION public.generate_report_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.report_number IS NULL OR NEW.report_number = '' THEN
    NEW.report_number := 'BR-' || LPAD(NEXTVAL('public.report_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_report_number ON public.reports;
CREATE TRIGGER set_report_number
  BEFORE INSERT ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_report_number();

-- ------------------------------------------
-- 4. AUTO REPORT TIMELINE / NOTIFICATION TRIGGER
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_report_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into history if status has changed
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.report_history (
      report_id,
      status,
      remarks,
      changed_by,
      created_at
    ) VALUES (
      NEW.id,
      NEW.status,
      COALESCE(NEW.admin_remarks, 'Incident report submitted by resident.'),
      NEW.resident_id,
      NOW()
    );

    -- Also insert notification for resident
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      report_id
    ) VALUES (
      NEW.resident_id,
      'Report Submitted',
      'Your report ' || NEW.report_number || ' (' || NEW.subject || ') has been filed successfully.',
      'status_update',
      NEW.id
    );

  ELSIF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.report_history (
      report_id,
      status,
      remarks,
      changed_by,
      created_at
    ) VALUES (
      NEW.id,
      NEW.status,
      COALESCE(NEW.admin_remarks, 'Status updated to ' || NEW.status),
      NEW.assigned_to,
      NOW()
    );

    -- Notify resident of status update
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      report_id
    ) VALUES (
      NEW.resident_id,
      'Report Status Updated',
      'Your report ' || NEW.report_number || ' is now ' || REPLACE(NEW.status, '_', ' ') || '.',
      'status_update',
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_status_changed ON public.reports;
CREATE TRIGGER on_report_status_changed
  AFTER INSERT OR UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_report_status_change();

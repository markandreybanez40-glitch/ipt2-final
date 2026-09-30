-- ==========================================
-- 003_storage.sql
-- Storage Bucket & Security Policies
-- ==========================================

-- Create storage bucket for report attachments if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'report-attachments',
  'report-attachments',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- ------------------------------------------
-- STORAGE POLICIES
-- ------------------------------------------

-- Allow public read access to uploaded report attachments
CREATE POLICY "Public read report attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'report-attachments');

-- Allow authenticated users to upload their report attachments into folder
CREATE POLICY "Authenticated users upload report attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'report-attachments' AND
  auth.role() = 'authenticated'
);

-- Allow admins or file uploaders to update / delete objects
CREATE POLICY "Users or admin manage report attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'report-attachments' AND
  (auth.uid()::text = (storage.foldername(name))[2] OR public.is_admin())
);

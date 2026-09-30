-- ==========================================
-- seed.sql
-- Development & Demo Seed Dataset
-- ==========================================

-- 1. PROFILES (Demo accounts)
-- Note: Replace user_id values with actual auth.users UUIDs in your live Supabase instance.
INSERT INTO public.profiles (
  id,
  user_id,
  full_name,
  email,
  phone,
  address,
  barangay,
  avatar_url,
  role
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Hon. Maria Santos',
    'admin.santos@butuancity.gov.ph',
    '+63 918 987 6543',
    'Barangay Hall Office, J.C. Aquino Ave.',
    'Barangay Poblacion, Butuan City',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'admin'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'Juan Dela Cruz',
    'juan.delacruz@email.com',
    '+63 917 123 4567',
    'Block 4, Lot 12, Mahogany St., Riverside',
    'Barangay Poblacion, Butuan City',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'resident'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'Maria Clara Lopez',
    'maria.lopez@example.com',
    '+63 919 234 5678',
    'Purok 1, Riverside, Butuan City',
    'Barangay Poblacion, Butuan City',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'resident'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000003',
    'Antonio Luna',
    'antonio.luna@example.com',
    '+63 920 345 6789',
    'Lower Purok 2, Butuan City',
    'Barangay Poblacion, Butuan City',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'resident'
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000004',
    'Elena Silang',
    'elena.silang@example.com',
    '+63 921 456 7890',
    'Bougainvillea St., Purok 4, Butuan City',
    'Barangay Poblacion, Butuan City',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'resident'
  )
ON CONFLICT (id) DO NOTHING;

-- 2. SAMPLE REPORTS
INSERT INTO public.reports (
  id,
  report_number,
  resident_id,
  category,
  subject,
  description,
  location,
  date_time,
  status,
  photo_url,
  admin_remarks,
  created_at
) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'BR-0001',
    '00000000-0000-0000-0000-000000000002',
    'Illegal Dumping',
    'Garbage along the river bank',
    'Improper waste disposal and accumulated plastic trash near the riverside park area causing foul odor and blocking water drainage.',
    'Riverside Park, Purok 3, Butuan City',
    NOW() - INTERVAL '2 days',
    'in_progress',
    'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80',
    'Sanitation team deployed for site clearing operations.',
    NOW() - INTERVAL '2 days'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'BR-0002',
    '00000000-0000-0000-0000-000000000002',
    'Street Light Out',
    'Flickering and dead street lights',
    'Three consecutive street light fixtures are completely dark along Rosal Street, making it unsafe for pedestrians at night.',
    'Rosal St., Purok 5, Butuan City',
    NOW() - INTERVAL '3 days',
    'resolved',
    'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    'Electrician crew replaced LED fixtures and repaired junction box.',
    NOW() - INTERVAL '3 days'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'BR-0003',
    '00000000-0000-0000-0000-000000000003',
    'Road Repair',
    'Deep pothole creating traffic hazard',
    'Deep pothole in the middle lane after continuous heavy rainfall. Vehicles swerve abruptly to avoid damage.',
    'Corner Narra & Acacia Ave., Butuan City',
    NOW() - INTERVAL '4 days',
    'under_review',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'Assessing if asphalt patching or concrete overlay is required with DPWH.',
    NOW() - INTERVAL '4 days'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'BR-0004',
    '00000000-0000-0000-0000-000000000004',
    'Flooding',
    'Blocked culvert causing knee-deep flood',
    'Culvert drainage clogged with silt and debris causing water to overflow into adjacent residential yards during rain.',
    'Lower Purok 2, near Barangay Chapel',
    NOW() - INTERVAL '5 days',
    'submitted',
    'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80',
    'Awaiting review queue assignment.',
    NOW() - INTERVAL '5 days'
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'BR-0005',
    '00000000-0000-0000-0000-000000000005',
    'Water Supply Issue',
    'Low water pressure and brown tap water',
    'Water pressure has dropped significantly and water running from faucets has noticeable brown sedimentation.',
    'Bougainvillea St., Purok 4',
    NOW() - INTERVAL '6 days',
    'resolved',
    'https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&w=800&q=80',
    'BCWD completed main pipe flushing; clarity restored.',
    NOW() - INTERVAL '6 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 3. REPORT HISTORY
INSERT INTO public.report_history (
  report_id,
  status,
  remarks,
  changed_by,
  created_at
) VALUES
  ('10000000-0000-0000-0000-000000000001', 'submitted', 'Report filed by resident via web portal.', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '2 days'),
  ('10000000-0000-0000-0000-000000000001', 'in_progress', 'Sanitation truck and team deployed for site clearing operations.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 day'),
  ('10000000-0000-0000-0000-000000000002', 'submitted', 'Report filed by resident.', '00000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 days'),
  ('10000000-0000-0000-0000-000000000002', 'resolved', 'LED fixtures replaced and operational.', '00000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 days');

-- 4. ANNOUNCEMENTS
INSERT INTO public.announcements (
  id,
  title,
  content,
  status,
  created_by,
  published_at
) VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    'Community Clean-Up Drive & Dengue Prevention',
    'Join us this Saturday at 6:00 AM for the Barangay-wide Oplan Clean-up. Volunteers assemble at the Barangay Covered Court.',
    'published',
    '00000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '1 day'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Scheduled Power Interruption Notice',
    'ANECO advisory: Scheduled power service maintenance will affect Purok 2, 3, and 5 on Sunday from 8:00 AM to 4:00 PM for transformer upgrading.',
    'published',
    '00000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '2 days'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Free Anti-Rabies Vaccination for Pets',
    'In partnership with City Vet, free anti-rabies vaccination and pet deworming clinic will be held at the Multi-Purpose Hall on May 10.',
    'published',
    '00000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 5. NOTIFICATIONS
INSERT INTO public.notifications (
  id,
  user_id,
  title,
  message,
  type,
  is_read,
  report_id,
  created_at
) VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'Report Status Updated',
    'Your report BR-0001 is now In Progress. Sanitation crew has been assigned.',
    'status_update',
    false,
    '10000000-0000-0000-0000-000000000001',
    NOW() - INTERVAL '1 hour'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Street Light Report Resolved',
    'Your report BR-0002 has been marked as Resolved. Thank you for your alert!',
    'status_update',
    true,
    '10000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

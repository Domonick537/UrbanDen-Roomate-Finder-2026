/*
  # Add Blocking, Reporting, and Storage Features
  
  1. New Tables
    - `blocked_users`
      - `id` (uuid, primary key)
      - `blocker_id` (uuid, references profiles)
      - `blocked_id` (uuid, references profiles)
      - `created_at` (timestamptz)
    
    - `user_reports`
      - `id` (uuid, primary key)
      - `reporter_id` (uuid, references profiles)
      - `reported_id` (uuid, references profiles)
      - `reason` (text)
      - `description` (text)
      - `status` (text) - pending, reviewed, resolved
      - `created_at` (timestamptz)
    
    - `user_agreements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `terms_accepted` (boolean)
      - `privacy_accepted` (boolean)
      - `accepted_at` (timestamptz)
    
    - `storage.buckets` setup
      - profile-photos bucket for user photos
  
  2. Security
    - Enable RLS on all new tables
    - Add policies for blocking/reporting
    - Add policies for agreement tracking
    - Set up storage policies
  
  3. Indexes
    - Add indexes for performance on lookups
*/

-- Create blocked_users table
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE INDEX IF NOT EXISTS idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked ON blocked_users(blocked_id);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own blocks"
  ON blocked_users FOR SELECT
  TO authenticated
  USING (auth.uid()::text = blocker_id::text);

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = blocker_id::text);

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  TO authenticated
  USING (auth.uid()::text = blocker_id::text);

-- Create user_reports table
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  CHECK (status IN ('pending', 'reviewed', 'resolved'))
);

CREATE INDEX IF NOT EXISTS idx_user_reports_reporter ON user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reported ON user_reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON user_reports(status);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON user_reports FOR SELECT
  TO authenticated
  USING (auth.uid()::text = reporter_id::text);

CREATE POLICY "Users can submit reports"
  ON user_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = reporter_id::text);

-- Create user_agreements table
CREATE TABLE IF NOT EXISTS user_agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  terms_accepted boolean DEFAULT false,
  privacy_accepted boolean DEFAULT false,
  accepted_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_agreements_user ON user_agreements(user_id);

ALTER TABLE user_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own agreements"
  ON user_agreements FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own agreements"
  ON user_agreements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own agreements"
  ON user_agreements FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

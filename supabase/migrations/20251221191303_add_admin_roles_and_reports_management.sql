/*
  # Add Admin Roles and Reports Management

  1. Tables
    - `admin_roles`: Stores admin user IDs and their permissions
    
  2. Views  
    - `reports_with_details`: View combining user_reports with user details
    
  3. Functions
    - Helper functions for admin operations

  4. Security
    - Enable RLS on admin_roles table
    - Add policies for admin-only access
    - Update user_reports table policies for admin access
*/

-- Create admin_roles table
CREATE TABLE IF NOT EXISTS admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'moderator',
  granted_at timestamptz DEFAULT now(),
  granted_by uuid REFERENCES profiles(id),
  UNIQUE(user_id)
);

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- Admin roles can only be viewed by admins themselves
CREATE POLICY "Admins can view admin roles"
  ON admin_roles FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = user_id::text OR
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Only existing admins can grant admin roles
CREATE POLICY "Admins can insert admin roles"
  ON admin_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Add admin viewing access to user_reports
CREATE POLICY "Admins can view all reports"
  ON user_reports FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = reporter_id::text OR
    auth.uid()::text = reported_id::text OR
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Add admin update access to user_reports (need to add admin_notes column first)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_reports' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE user_reports ADD COLUMN admin_notes text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_reports' AND column_name = 'resolved_at'
  ) THEN
    ALTER TABLE user_reports ADD COLUMN resolved_at timestamptz;
  END IF;
END $$;

CREATE POLICY "Admins can update reports"
  ON user_reports FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Create a view for reports with user details
CREATE OR REPLACE VIEW reports_with_details AS
SELECT 
  r.*,
  p_reporter.first_name as reporter_name,
  p_reported.first_name as reported_name,
  p_reported.is_verified as reported_is_verified
FROM user_reports r
LEFT JOIN profiles p_reporter ON r.reporter_id = p_reporter.id
LEFT JOIN profiles p_reported ON r.reported_id = p_reported.id;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(check_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to resolve a report
CREATE OR REPLACE FUNCTION resolve_report(
  report_id uuid,
  notes text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can resolve reports';
  END IF;

  UPDATE user_reports
  SET 
    status = 'resolved',
    resolved_at = now(),
    admin_notes = COALESCE(notes, admin_notes)
  WHERE id = report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON user_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_roles_user_id ON admin_roles(user_id);

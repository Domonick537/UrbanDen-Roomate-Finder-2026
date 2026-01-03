/*
  # Add Verification Documents System

  ## Summary
  Implements a comprehensive government ID verification system that allows users to upload ID photos
  for admin review and approval, resulting in verified badge status similar to Instagram.

  ## New Tables
  
  ### `verification_documents`
  - `id` (uuid, primary key) - Unique document identifier
  - `user_id` (uuid, foreign key) - References the user who submitted the document
  - `document_type` (text) - Type of document (government-id, passport, drivers-license)
  - `file_path` (text) - Path to the document image in Supabase Storage
  - `status` (text) - Approval status: pending, approved, rejected
  - `submitted_at` (timestamptz) - When the document was submitted
  - `reviewed_at` (timestamptz) - When an admin reviewed the document
  - `reviewed_by` (uuid, foreign key) - Admin who reviewed the document
  - `rejection_reason` (text) - Reason for rejection if applicable
  - `created_at` (timestamptz) - Row creation timestamp

  ## Storage
  Creates a 'verification-documents' storage bucket for secure ID photo storage with:
  - Private access (only admins and document owners can view)
  - File size limit: 10MB
  - Allowed MIME types: image/jpeg, image/png, image/webp

  ## Security (RLS Policies)
  
  ### verification_documents table:
  - **Users can view own documents**: Users can SELECT their own verification submissions
  - **Users can insert own documents**: Users can INSERT verification documents for themselves
  - **Admins can view all documents**: Admins can SELECT all verification documents
  - **Admins can update documents**: Admins can UPDATE status, reviewed_at, reviewed_by, and rejection_reason

  ### Storage bucket policies:
  - **Users can upload own documents**: Users can INSERT files to their own user_id folder
  - **Users can view own documents**: Users can SELECT files from their own user_id folder
  - **Admins can view all documents**: Admins can SELECT any verification document
  - **Admins can delete documents**: Admins can DELETE verification documents after review

  ## Functions
  
  ### `approve_verification(document_id uuid)`
  - Admin function to approve a verification document
  - Updates document status to 'approved'
  - Sets user's is_verified flag to true
  - Records reviewer and review timestamp
  
  ### `reject_verification(document_id uuid, reason text)`
  - Admin function to reject a verification document
  - Updates document status to 'rejected'
  - Records rejection reason, reviewer, and review timestamp

  ## Important Notes
  - Document images are encrypted at rest in Supabase Storage
  - Only the user and admins can access verification documents
  - Users receive verified badge only after admin approval
  - Users can resubmit if rejected
  - All actions are audited with timestamps and reviewer info
*/

-- Create verification_documents table
CREATE TABLE IF NOT EXISTS verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'government-id',
  file_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification documents
CREATE POLICY "Users can view own verification documents"
  ON verification_documents FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Users can insert their own verification documents
CREATE POLICY "Users can insert own verification documents"
  ON verification_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can view all verification documents
CREATE POLICY "Admins can view all verification documents"
  ON verification_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Admins can update verification documents
CREATE POLICY "Admins can update verification documents"
  ON verification_documents FOR UPDATE
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

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-documents',
  'verification-documents',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: Users can upload to their own folder
CREATE POLICY "Users can upload own verification documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies: Users can view their own documents
CREATE POLICY "Users can view own verification documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies: Admins can view all documents
CREATE POLICY "Admins can view all verification documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'verification-documents' AND
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Storage policies: Admins can delete documents
CREATE POLICY "Admins can delete verification documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'verification-documents' AND
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE user_id::text = auth.uid()::text
    )
  );

-- Function to approve a verification document
CREATE OR REPLACE FUNCTION approve_verification(document_id uuid)
RETURNS void AS $$
DECLARE
  doc_user_id uuid;
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can approve verifications';
  END IF;

  SELECT user_id INTO doc_user_id
  FROM verification_documents
  WHERE id = document_id;

  IF doc_user_id IS NULL THEN
    RAISE EXCEPTION 'Document not found';
  END IF;

  UPDATE verification_documents
  SET 
    status = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = document_id;

  UPDATE profiles
  SET is_verified = true
  WHERE id = doc_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject a verification document
CREATE OR REPLACE FUNCTION reject_verification(
  document_id uuid,
  reason text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can reject verifications';
  END IF;

  UPDATE verification_documents
  SET 
    status = 'rejected',
    reviewed_at = now(),
    reviewed_by = auth.uid(),
    rejection_reason = COALESCE(reason, rejection_reason)
  WHERE id = document_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_status ON verification_documents(status);
CREATE INDEX IF NOT EXISTS idx_verification_documents_submitted_at ON verification_documents(submitted_at DESC);

-- Create a view for pending verifications (admin use)
CREATE OR REPLACE VIEW pending_verifications AS
SELECT 
  vd.*,
  p.first_name,
  p.age,
  p.created_at as user_created_at
FROM verification_documents vd
JOIN profiles p ON vd.user_id = p.id
WHERE vd.status = 'pending'
ORDER BY vd.submitted_at ASC;

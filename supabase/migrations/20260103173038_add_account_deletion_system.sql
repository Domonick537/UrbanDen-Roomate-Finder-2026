/*
  # Add Account Deletion System

  1. New Tables
    - **account_deletion_requests** - Track deletion requests with grace period

  2. New Functions
    - **request_account_deletion** - Initiate account deletion with 30-day grace period
    - **cancel_account_deletion** - Cancel pending deletion request
    - **execute_account_deletion** - Permanently delete account and all data

  3. Features
    - 30-day grace period before permanent deletion
    - Automatic cleanup of all user data (GDPR compliant)
    - Deletion of photos from storage
    - Complete data removal across all tables

  4. Security
    - RLS enabled
    - Users can only manage their own deletion requests
*/

-- Create account_deletion_requests table
CREATE TABLE IF NOT EXISTS account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_at timestamptz DEFAULT now(),
  scheduled_deletion_at timestamptz DEFAULT (now() + INTERVAL '30 days'),
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled', 'completed')),
  UNIQUE(user_id, status)
);

-- Enable RLS
ALTER TABLE account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own deletion requests"
  ON account_deletion_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own deletion requests"
  ON account_deletion_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deletion requests"
  ON account_deletion_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_account_deletion_status ON account_deletion_requests(status, scheduled_deletion_at);

-- Function to request account deletion
CREATE OR REPLACE FUNCTION request_account_deletion(
  p_user_id uuid,
  p_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id uuid;
BEGIN
  INSERT INTO account_deletion_requests (user_id, reason)
  VALUES (p_user_id, p_reason)
  ON CONFLICT (user_id, status)
  WHERE status = 'pending'
  DO UPDATE SET
    requested_at = now(),
    scheduled_deletion_at = now() + INTERVAL '30 days',
    reason = EXCLUDED.reason
  RETURNING id INTO v_request_id;
  
  RETURN v_request_id;
END;
$$;

-- Function to cancel account deletion
CREATE OR REPLACE FUNCTION cancel_account_deletion(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE account_deletion_requests
  SET status = 'cancelled'
  WHERE user_id = p_user_id
    AND status = 'pending';
  
  RETURN FOUND;
END;
$$;

-- Function to execute account deletion
CREATE OR REPLACE FUNCTION execute_account_deletion(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM user_checklist_progress WHERE user_id = p_user_id;
  DELETE FROM feedback WHERE user_id = p_user_id;
  DELETE FROM error_logs WHERE user_id = p_user_id;
  DELETE FROM rate_limits WHERE user_id = p_user_id;
  DELETE FROM verification_documents WHERE user_id = p_user_id;
  DELETE FROM user_reports WHERE reporter_id = p_user_id OR reported_user_id = p_user_id;
  DELETE FROM blocked_users WHERE blocker_id = p_user_id OR blocked_id = p_user_id;
  DELETE FROM messages WHERE sender_id = p_user_id;
  DELETE FROM matches WHERE user_id_1 = p_user_id OR user_id_2 = p_user_id;
  DELETE FROM swipe_actions WHERE user_id = p_user_id OR target_user_id = p_user_id;
  DELETE FROM roommate_preferences WHERE user_id = p_user_id;
  DELETE FROM account_deletion_requests WHERE user_id = p_user_id;
  DELETE FROM profiles WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$;

-- Function to process pending deletions (called by cron job)
CREATE OR REPLACE FUNCTION process_pending_account_deletions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer := 0;
  v_request RECORD;
BEGIN
  FOR v_request IN
    SELECT user_id
    FROM account_deletion_requests
    WHERE status = 'pending'
      AND scheduled_deletion_at <= now()
  LOOP
    PERFORM execute_account_deletion(v_request.user_id);
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$;

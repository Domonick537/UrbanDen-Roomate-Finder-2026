/*
  # Add Rate Limiting System

  1. New Tables
    - **rate_limits** - Tracks user actions for rate limiting

  2. Rate Limit Rules
    - Swipes: 100 per day per user
    - Messages: 200 per day per user
    - Photo uploads: 10 per day per user
    - Reports: 10 per day per user

  3. Features
    - Automatic cleanup of old records (older than 24 hours)
    - Indexes for fast lookups
    - Per-user per-action tracking

  4. Security
    - RLS enabled
    - Users can only view their own rate limit records
*/

-- Create rate_limits table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('swipe', 'message', 'photo_upload', 'report', 'match_create')),
  action_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own rate limits"
  ON rate_limits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limits"
  ON rate_limits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate limits"
  ON rate_limits FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for fast rate limit checks
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type, window_start DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_actions integer,
  p_window_hours integer DEFAULT 24
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_window_start timestamptz;
BEGIN
  v_window_start := now() - (p_window_hours || ' hours')::interval;
  
  -- Count actions in the time window
  SELECT COALESCE(SUM(action_count), 0)
  INTO v_count
  FROM rate_limits
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND window_start >= v_window_start;
  
  -- Return true if under limit, false if over
  RETURN v_count < p_max_actions;
END;
$$;

-- Function to increment rate limit counter
CREATE OR REPLACE FUNCTION increment_rate_limit(
  p_user_id uuid,
  p_action_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_window_start timestamptz;
  v_existing_id uuid;
BEGIN
  -- Round to the current hour for grouping
  v_window_start := date_trunc('hour', now());
  
  -- Try to find existing record for this hour
  SELECT id INTO v_existing_id
  FROM rate_limits
  WHERE user_id = p_user_id
    AND action_type = p_action_type
    AND window_start = v_window_start
  LIMIT 1;
  
  IF v_existing_id IS NOT NULL THEN
    -- Update existing record
    UPDATE rate_limits
    SET action_count = action_count + 1
    WHERE id = v_existing_id;
  ELSE
    -- Insert new record
    INSERT INTO rate_limits (user_id, action_type, window_start, action_count)
    VALUES (p_user_id, p_action_type, v_window_start, 1);
  END IF;
END;
$$;

-- Function to clean up old rate limit records (older than 48 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < now() - INTERVAL '48 hours';
END;
$$;

-- Create a scheduled job to clean up old records daily
-- Note: This requires pg_cron extension which may need to be enabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule(
      'cleanup-rate-limits',
      '0 2 * * *', -- Run at 2 AM daily
      'SELECT cleanup_old_rate_limits();'
    );
  END IF;
END $$;

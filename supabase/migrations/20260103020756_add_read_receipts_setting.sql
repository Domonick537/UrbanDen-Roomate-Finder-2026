/*
  # Add Read Receipts Setting

  1. Changes
    - Add `show_read_receipts` column to profiles table (boolean, default true)
    - Allows users to control whether they send/receive read receipts

  2. Security
    - No RLS changes needed (profiles table already has appropriate policies)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'show_read_receipts'
  ) THEN
    ALTER TABLE profiles ADD COLUMN show_read_receipts boolean DEFAULT true;
  END IF;
END $$;
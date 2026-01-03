/*
  # Add Location Fields to Roommate Preferences

  ## Summary
  Adds structured location fields to the roommate_preferences table to support hierarchical location selection (country > state/province > city > neighborhood).

  ## Changes Made
  1. New Columns Added
    - `country` (text): Country code (e.g., 'US', 'CA', 'OTHER')
    - `state_code` (text): State/province code (e.g., 'CA', 'NY', 'ON')
    - `city_id` (text): City identifier/slug (e.g., 'los-angeles', 'toronto')
    
  2. Existing Columns
    - `state` (text): Continues to store the full state/province name for display
    - `city` (text): Continues to store the full city name for display
    - `neighborhood` (text): Already exists, stores neighborhood selection

  ## Notes
  - These fields enable dropdown-based location selection with proper filtering
  - The `state` and `city` columns now store display names while `state_code` and `city_id` store identifiers
  - All new columns are nullable to support existing records and optional selection
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roommate_preferences' AND column_name = 'country'
  ) THEN
    ALTER TABLE roommate_preferences ADD COLUMN country text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roommate_preferences' AND column_name = 'state_code'
  ) THEN
    ALTER TABLE roommate_preferences ADD COLUMN state_code text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roommate_preferences' AND column_name = 'city_id'
  ) THEN
    ALTER TABLE roommate_preferences ADD COLUMN city_id text;
  END IF;
END $$;

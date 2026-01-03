/*
  # Add Efficient Unread Message Count Function

  1. New Function
    - **get_unread_count** - Efficiently count unread messages for a user
    
  2. Performance Impact
    - Replaces N+1 query pattern with single SQL query
    - Uses joins instead of multiple round trips
    - Scales efficiently with message volume
*/

-- Function to get unread message count efficiently
CREATE OR REPLACE FUNCTION get_unread_count(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)
  FROM messages m
  INNER JOIN matches mt ON m.match_id = mt.id
  WHERE (mt.user_id_1 = p_user_id OR mt.user_id_2 = p_user_id)
    AND m.sender_id != p_user_id
    AND m.is_read = false;
$$;

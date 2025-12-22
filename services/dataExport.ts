import { supabase } from './supabase';
import { Alert } from 'react-native';

export const exportUserData = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    const { data: preferences } = await supabase
      .from('roommate_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const { data: matches } = await supabase
      .from('matches')
      .select('*')
      .or(`user_id_1.eq.${user.id},user_id_2.eq.${user.id}`);

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('sender_id', user.id);

    const { data: blockedUsers } = await supabase
      .from('blocked_users')
      .select('*')
      .eq('blocker_id', user.id);

    const { data: reports } = await supabase
      .from('user_reports')
      .select('*')
      .eq('reporter_id', user.id);

    const exportData = {
      exported_at: new Date().toISOString(),
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      profile,
      preferences,
      matches: matches || [],
      messages: messages || [],
      blocked_users: blockedUsers || [],
      reports: reports || [],
    };

    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
};

export const deleteUserAccount = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.from('roommate_preferences').delete().eq('user_id', user.id);
    await supabase.from('blocked_users').delete().eq('blocker_id', user.id);
    await supabase.from('user_reports').delete().eq('reporter_id', user.id);

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    return false;
  }
};

import { supabase } from './supabase';

export interface BlockedUser {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedId: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
}

export const blockUser = async (blockerId: string, blockedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blocked_users')
      .insert({
        blocker_id: blockerId,
        blocked_id: blockedId,
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Block user error:', error);
    return false;
  }
};

export const unblockUser = async (blockerId: string, blockedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('blocker_id', blockerId)
      .eq('blocked_id', blockedId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Unblock user error:', error);
    return false;
  }
};

export const isUserBlocked = async (userId: string, targetUserId: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('blocked_users')
      .select('id')
      .or(`and(blocker_id.eq.${userId},blocked_id.eq.${targetUserId}),and(blocker_id.eq.${targetUserId},blocked_id.eq.${userId})`)
      .maybeSingle();

    return !!data;
  } catch (error) {
    console.error('Check blocked error:', error);
    return false;
  }
};

export const getBlockedUsers = async (userId: string): Promise<string[]> => {
  try {
    const { data } = await supabase
      .from('blocked_users')
      .select('blocked_id')
      .eq('blocker_id', userId);

    return (data || []).map(b => b.blocked_id);
  } catch (error) {
    console.error('Get blocked users error:', error);
    return [];
  }
};

export const reportUser = async (
  reporterId: string,
  reportedId: string,
  reason: string,
  description?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_reports')
      .insert({
        reporter_id: reporterId,
        reported_id: reportedId,
        reason,
        description,
        status: 'pending',
      });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Report user error:', error);
    return false;
  }
};

export const getUserReports = async (userId: string): Promise<UserReport[]> => {
  try {
    const { data } = await supabase
      .from('user_reports')
      .select('*')
      .eq('reporter_id', userId)
      .order('created_at', { ascending: false });

    return (data || []).map(report => ({
      id: report.id,
      reporterId: report.reporter_id,
      reportedId: report.reported_id,
      reason: report.reason,
      description: report.description,
      status: report.status,
      createdAt: new Date(report.created_at),
    }));
  } catch (error) {
    console.error('Get user reports error:', error);
    return [];
  }
};

import { supabase } from './supabase';

export interface AdminStats {
  totalUsers: number;
  totalReports: number;
  pendingReports: number;
  totalFeedback: number;
  newFeedback: number;
  totalErrors: number;
  recentErrors: number;
  verificationRequests: number;
}

class AdminService {
  private static instance: AdminService;

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('admin_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      return !error && data !== null;
    } catch (error) {
      console.error('Failed to check admin status:', error);
      return false;
    }
  }

  async getAdminStats(): Promise<AdminStats | null> {
    try {
      const [
        usersCount,
        reportsCount,
        pendingReportsCount,
        feedbackCount,
        newFeedbackCount,
        errorsCount,
        recentErrorsCount,
        verificationCount,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_reports').select('id', { count: 'exact', head: true }),
        supabase.from('user_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('feedback').select('id', { count: 'exact', head: true }),
        supabase.from('feedback').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('error_logs').select('id', { count: 'exact', head: true }),
        supabase.from('error_logs').select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('verification_documents').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      return {
        totalUsers: usersCount.count || 0,
        totalReports: reportsCount.count || 0,
        pendingReports: pendingReportsCount.count || 0,
        totalFeedback: feedbackCount.count || 0,
        newFeedback: newFeedbackCount.count || 0,
        totalErrors: errorsCount.count || 0,
        recentErrors: recentErrorsCount.count || 0,
        verificationRequests: verificationCount.count || 0,
      };
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      return null;
    }
  }

  async getPendingReports() {
    try {
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          reporter:profiles!user_reports_reporter_id_fkey(id, first_name, last_name),
          reported:profiles!user_reports_reported_id_fkey(id, first_name, last_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch pending reports:', error);
      return [];
    }
  }

  async getPendingFeedback() {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*, user:profiles(id, first_name, last_name)')
        .in('status', ['new', 'reviewing'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch pending feedback:', error);
      return [];
    }
  }

  async getRecentErrors(limit: number = 20) {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch recent errors:', error);
      return [];
    }
  }

  async getPendingVerifications() {
    try {
      const { data, error } = await supabase
        .from('verification_documents')
        .select('*, profile:profiles(id, first_name, last_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch pending verifications:', error);
      return [];
    }
  }

  async approveVerification(documentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('verification_documents')
        .update({ status: 'approved' })
        .eq('id', documentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to approve verification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to approve verification'
      };
    }
  }

  async rejectVerification(
    documentId: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('verification_documents')
        .update({
          status: 'rejected',
          admin_notes: reason,
        })
        .eq('id', documentId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to reject verification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reject verification'
      };
    }
  }
}

export const adminService = AdminService.getInstance();

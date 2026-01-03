import { supabase } from './supabase';

export type FeedbackType = 'bug' | 'feature' | 'general';
export type FeedbackStatus = 'new' | 'reviewing' | 'resolved' | 'closed';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Feedback {
  id: string;
  user_id: string;
  type: FeedbackType;
  subject: string;
  message: string;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  created_at: string;
  updated_at: string;
}

class FeedbackService {
  private static instance: FeedbackService;

  private constructor() {}

  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) {
      FeedbackService.instance = new FeedbackService();
    }
    return FeedbackService.instance;
  }

  async submitFeedback(
    type: FeedbackType,
    subject: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { success: false, error: 'You must be logged in to submit feedback' };
      }

      const { error } = await supabase.from('feedback').insert([{
        user_id: user.id,
        type,
        subject,
        message,
      }]);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to submit feedback'
      };
    }
  }

  async getUserFeedback(): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch user feedback:', error);
      return [];
    }
  }

  async getAllFeedback(): Promise<Feedback[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Failed to fetch all feedback:', error);
      return [];
    }
  }

  async updateFeedbackStatus(
    feedbackId: string,
    status: FeedbackStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', feedbackId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to update feedback status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update feedback status'
      };
    }
  }

  async updateFeedbackPriority(
    feedbackId: string,
    priority: FeedbackPriority
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ priority, updated_at: new Date().toISOString() })
        .eq('id', feedbackId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Failed to update feedback priority:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update feedback priority'
      };
    }
  }
}

export const feedbackService = FeedbackService.getInstance();

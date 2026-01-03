import { supabase } from './supabase';

export interface ErrorLog {
  error_type: string;
  error_message: string;
  error_stack?: string;
  user_id?: string;
  context?: any;
  app_version?: string;
  platform?: string;
  timestamp: string;
}

class ErrorMonitoringService {
  private static instance: ErrorMonitoringService;

  private constructor() {}

  static getInstance(): ErrorMonitoringService {
    if (!ErrorMonitoringService.instance) {
      ErrorMonitoringService.instance = new ErrorMonitoringService();
    }
    return ErrorMonitoringService.instance;
  }

  async logError(
    error: Error,
    context?: {
      screen?: string;
      action?: string;
      userId?: string;
      additionalData?: any;
    }
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const errorLog: ErrorLog = {
        error_type: error.name || 'Error',
        error_message: error.message,
        error_stack: error.stack,
        user_id: context?.userId || user?.id,
        context: {
          screen: context?.screen,
          action: context?.action,
          ...context?.additionalData,
        },
        platform: 'web',
        timestamp: new Date().toISOString(),
      };

      await supabase.from('error_logs').insert([errorLog]);

      if (__DEV__) {
        console.error('Error logged:', errorLog);
      }
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  async logEvent(
    eventName: string,
    properties?: Record<string, any>
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('analytics_events').insert([{
        event_name: eventName,
        user_id: user?.id,
        properties,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  }

  async getErrorStats(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('error_type, created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Failed to fetch error stats:', error);
      return [];
    }
  }
}

export const errorMonitoring = ErrorMonitoringService.getInstance();

const __DEV__ = process.env.NODE_ENV === 'development';

import { supabase } from './supabase';

export type AnalyticsEvent =
  | 'app_opened'
  | 'profile_viewed'
  | 'profile_edited'
  | 'swipe_right'
  | 'swipe_left'
  | 'match_created'
  | 'message_sent'
  | 'chat_opened'
  | 'verification_started'
  | 'verification_completed'
  | 'feedback_submitted'
  | 'settings_changed'
  | 'profile_completed'
  | 'photo_uploaded'
  | 'user_blocked'
  | 'user_reported'
  | 'filters_applied';

export interface AnalyticsProperties {
  [key: string]: string | number | boolean | undefined;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private sessionStartTime: Date | null = null;

  private constructor() {
    this.sessionStartTime = new Date();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackEvent(
    eventName: AnalyticsEvent,
    properties?: AnalyticsProperties
  ): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('analytics_events').insert([{
        event_name: eventName,
        user_id: user?.id,
        properties: {
          ...properties,
          platform: 'web',
          timestamp: new Date().toISOString(),
        },
      }]);

      if (__DEV__) {
        console.log('Analytics event tracked:', eventName, properties);
      }
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }

  async trackScreenView(screenName: string): Promise<void> {
    await this.trackEvent('app_opened', { screen: screenName });
  }

  async trackUserAction(
    action: string,
    details?: AnalyticsProperties
  ): Promise<void> {
    await this.trackEvent('app_opened', {
      action,
      ...details,
    });
  }

  async trackSwipe(direction: 'left' | 'right', targetUserId: string): Promise<void> {
    const event = direction === 'right' ? 'swipe_right' : 'swipe_left';
    await this.trackEvent(event, { targetUserId });
  }

  async trackMatch(matchedUserId: string): Promise<void> {
    await this.trackEvent('match_created', { matchedUserId });
  }

  async trackMessage(recipientId: string, messageLength: number): Promise<void> {
    await this.trackEvent('message_sent', {
      recipientId,
      messageLength,
    });
  }

  async trackProfileView(viewedUserId: string): Promise<void> {
    await this.trackEvent('profile_viewed', { viewedUserId });
  }

  async trackPhotoUpload(photoCount: number): Promise<void> {
    await this.trackEvent('photo_uploaded', { photoCount });
  }

  async trackVerificationStart(): Promise<void> {
    await this.trackEvent('verification_started');
  }

  async trackVerificationComplete(): Promise<void> {
    await this.trackEvent('verification_completed');
  }

  async trackFeedbackSubmit(type: string): Promise<void> {
    await this.trackEvent('feedback_submitted', { feedbackType: type });
  }

  async trackUserBlock(blockedUserId: string): Promise<void> {
    await this.trackEvent('user_blocked', { blockedUserId });
  }

  async trackUserReport(reportedUserId: string, reason: string): Promise<void> {
    await this.trackEvent('user_reported', {
      reportedUserId,
      reason,
    });
  }

  async trackFiltersApplied(filterCount: number): Promise<void> {
    await this.trackEvent('filters_applied', { filterCount });
  }

  async getSessionDuration(): Promise<number> {
    if (!this.sessionStartTime) return 0;
    const now = new Date();
    return Math.floor((now.getTime() - this.sessionStartTime.getTime()) / 1000);
  }

  async trackSessionEnd(): Promise<void> {
    const duration = await this.getSessionDuration();
    await this.trackEvent('app_opened', {
      action: 'session_end',
      duration,
    });
  }
}

export const analytics = AnalyticsService.getInstance();

const __DEV__ = process.env.NODE_ENV === 'development';

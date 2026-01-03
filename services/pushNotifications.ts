import { Platform } from 'react-native';

export type NotificationType = 'match' | 'message' | 'verification' | 'general';

export interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (Platform.OS === 'web') {
      console.log('Push notifications are not available on web platform');
      return false;
    }

    this.isInitialized = true;
    return true;
  }

  async requestPermission(): Promise<boolean> {
    if (Platform.OS === 'web') {
      return false;
    }

    return false;
  }

  async sendNotification(
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<void> {
    if (!this.isInitialized && Platform.OS !== 'web') {
      await this.initialize();
    }

    console.log('Push notification:', { type, title, body, data });
  }

  async scheduleNotification(
    notification: PushNotification,
    delaySeconds: number
  ): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('Scheduled notifications not available on web');
      return;
    }

    console.log('Scheduled notification:', notification, 'in', delaySeconds, 'seconds');
  }

  async cancelAllNotifications(): Promise<void> {
    if (Platform.OS === 'web') {
      return;
    }

    console.log('Cancelled all notifications');
  }
}

export const pushNotificationService = PushNotificationService.getInstance();

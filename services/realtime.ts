import { supabase } from './supabase';
import { Message } from '../types';
import { RealtimeChannel } from '@supabase/supabase-js';

export type MessageCallback = (message: Message) => void;

const activeSubscriptions = new Map<string, RealtimeChannel>();

export const subscribeToMessages = (matchId: string, callback: MessageCallback): (() => void) => {
  const channelName = `messages:${matchId}`;

  const existingSubscription = activeSubscriptions.get(channelName);
  if (existingSubscription) {
    existingSubscription.unsubscribe();
    activeSubscriptions.delete(channelName);
  }

  const channel = supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`,
      },
      (payload) => {
        const newMessage: Message = {
          id: payload.new.id,
          matchId: payload.new.match_id,
          senderId: payload.new.sender_id,
          content: payload.new.content,
          timestamp: new Date(payload.new.created_at),
          isRead: payload.new.is_read,
        };
        callback(newMessage);
      }
    )
    .subscribe();

  activeSubscriptions.set(channelName, channel);

  return () => {
    const sub = activeSubscriptions.get(channelName);
    if (sub) {
      sub.unsubscribe();
      activeSubscriptions.delete(channelName);
    }
  };
};

export const cleanupAllSubscriptions = (): void => {
  activeSubscriptions.forEach((channel) => {
    channel.unsubscribe();
  });
  activeSubscriptions.clear();
};

export const markMessagesAsRead = async (matchId: string, userId: string, showReadReceipts: boolean = true): Promise<void> => {
  if (!showReadReceipts) return;

  try {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('match_id', matchId)
      .neq('sender_id', userId)
      .eq('is_read', false);
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};

export const getUnreadMessageCount = async (userId: string): Promise<number> => {
  try {
    const { data, error } = await supabase.rpc('get_unread_count', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }

    return data || 0;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return 0;
  }
};

export const subscribeToNewMatches = (userId: string, callback: (matchId: string) => void): (() => void) => {
  const matchSubscription = supabase
    .channel(`matches:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `or(user_id_1.eq.${userId},user_id_2.eq.${userId})`,
      },
      (payload) => {
        callback(payload.new.id);
      }
    )
    .subscribe();

  return () => {
    matchSubscription.unsubscribe();
  };
};

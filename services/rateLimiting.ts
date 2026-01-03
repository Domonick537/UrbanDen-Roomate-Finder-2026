import { supabase } from './supabase';

export type ActionType = 'swipe' | 'message' | 'photo_upload' | 'report' | 'match_create';

interface RateLimitConfig {
  maxActions: number;
  windowHours: number;
}

const RATE_LIMITS: Record<ActionType, RateLimitConfig> = {
  swipe: { maxActions: 100, windowHours: 24 },
  message: { maxActions: 200, windowHours: 24 },
  photo_upload: { maxActions: 10, windowHours: 24 },
  report: { maxActions: 10, windowHours: 24 },
  match_create: { maxActions: 50, windowHours: 24 },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  resetAt?: Date;
  error?: string;
}

export const checkRateLimit = async (
  userId: string,
  actionType: ActionType
): Promise<RateLimitResult> => {
  try {
    const config = RATE_LIMITS[actionType];

    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_user_id: userId,
      p_action_type: actionType,
      p_max_actions: config.maxActions,
      p_window_hours: config.windowHours,
    });

    if (error) {
      console.error('Rate limit check error:', error);
      return { allowed: true };
    }

    if (!data) {
      const resetAt = new Date();
      resetAt.setHours(resetAt.getHours() + config.windowHours);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        error: `Rate limit exceeded for ${actionType}. Try again later.`,
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return { allowed: true };
  }
};

export const incrementRateLimit = async (
  userId: string,
  actionType: ActionType
): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_rate_limit', {
      p_user_id: userId,
      p_action_type: actionType,
    });

    if (error) {
      console.error('Rate limit increment error:', error);
    }
  } catch (error) {
    console.error('Rate limit increment failed:', error);
  }
};

export const getRateLimitStatus = async (
  userId: string,
  actionType: ActionType
): Promise<{ count: number; limit: number; resetAt: Date }> => {
  try {
    const config = RATE_LIMITS[actionType];
    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - config.windowHours);

    const { data, error } = await supabase
      .from('rate_limits')
      .select('action_count')
      .eq('user_id', userId)
      .eq('action_type', actionType)
      .gte('window_start', windowStart.toISOString());

    if (error) {
      console.error('Rate limit status error:', error);
      return {
        count: 0,
        limit: config.maxActions,
        resetAt: new Date(Date.now() + config.windowHours * 60 * 60 * 1000),
      };
    }

    const count = data?.reduce((sum, record) => sum + (record.action_count || 0), 0) || 0;

    return {
      count,
      limit: config.maxActions,
      resetAt: new Date(Date.now() + config.windowHours * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error('Get rate limit status failed:', error);
    const config = RATE_LIMITS[actionType];
    return {
      count: 0,
      limit: config.maxActions,
      resetAt: new Date(Date.now() + config.windowHours * 60 * 60 * 1000),
    };
  }
};

export const withRateLimit = async <T>(
  userId: string,
  actionType: ActionType,
  action: () => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> => {
  const rateLimitCheck = await checkRateLimit(userId, actionType);

  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      error: rateLimitCheck.error || `Rate limit exceeded for ${actionType}`,
    };
  }

  try {
    const data = await action();
    await incrementRateLimit(userId, actionType);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Action failed',
    };
  }
};

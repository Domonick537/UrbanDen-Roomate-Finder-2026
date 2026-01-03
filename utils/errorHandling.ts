export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  shouldRetry: (error: Error) => {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'ECONNRESET',
      'ENOTFOUND',
      'ECONNREFUSED',
      '503',
      '504',
      '429',
    ];

    return retryableErrors.some(errType =>
      error.message.includes(errType) || error.name.includes(errType)
    );
  },
};

export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: Error;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === opts.maxAttempts || !opts.shouldRetry(lastError)) {
        throw lastError;
      }

      await sleep(delay);
      delay *= opts.backoffMultiplier;
    }
  }

  throw lastError!;
};

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data?: T; error?: Error }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    return {
      data: fallback,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
};

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  isOperational?: boolean;
}

export const createAppError = (
  message: string,
  code?: string,
  statusCode?: number
): AppError => {
  const error = new Error(message) as AppError;
  error.code = code;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const isNetworkError = (error: Error): boolean => {
  const networkErrorPatterns = [
    'network',
    'timeout',
    'offline',
    'econnreset',
    'enotfound',
    'econnrefused',
  ];

  return networkErrorPatterns.some(pattern =>
    error.message.toLowerCase().includes(pattern)
  );
};

export const getUserFriendlyErrorMessage = (error: Error | string): string => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  if (isNetworkError(error as Error)) {
    return 'Network error. Please check your connection and try again.';
  }

  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Incorrect email or password. Please try again.',
    'User already registered': 'An account with this email already exists.',
    'Email not confirmed': 'Please verify your email before logging in.',
    'Invalid email': 'Please enter a valid email address.',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
    'Rate limit exceeded': 'Too many attempts. Please try again later.',
    'Failed to fetch': 'Network error. Please check your connection.',
  };

  for (const [key, friendlyMessage] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
      return friendlyMessage;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

export class ErrorBoundary {
  private static errorCount = 0;
  private static lastErrorTime = 0;
  private static readonly MAX_ERRORS_PER_MINUTE = 10;
  private static readonly MINUTE_MS = 60000;

  static shouldThrottle(): boolean {
    const now = Date.now();

    if (now - this.lastErrorTime > this.MINUTE_MS) {
      this.errorCount = 0;
      this.lastErrorTime = now;
    }

    this.errorCount++;

    return this.errorCount > this.MAX_ERRORS_PER_MINUTE;
  }

  static reset(): void {
    this.errorCount = 0;
    this.lastErrorTime = 0;
  }
}

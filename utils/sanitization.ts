export const sanitizeText = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeHtml = (html: string): string => {
  if (!html) return '';

  const tagPattern = /<\/?[^>]+(>|$)/g;
  return html.replace(tagPattern, '');
};

export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  const lowerUrl = url.toLowerCase().trim();

  if (lowerUrl.startsWith('javascript:') ||
      lowerUrl.startsWith('data:') ||
      lowerUrl.startsWith('vbscript:') ||
      lowerUrl.startsWith('file:')) {
    return '';
  }

  return url;
};

export const sanitizeInput = (input: string, maxLength: number = 5000): string => {
  if (!input) return '';

  let sanitized = input.trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  sanitized = sanitized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized;
};

export const sanitizeMessage = (message: string): string => {
  if (!message) return '';

  let sanitized = sanitizeInput(message, 2000);

  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  return sanitized;
};

export const sanitizeBio = (bio: string): string => {
  return sanitizeInput(bio, 500);
};

export const sanitizeName = (name: string): string => {
  if (!name) return '';

  let sanitized = name.trim();

  sanitized = sanitized.replace(/[^a-zA-Z\s'-]/g, '');

  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }

  return sanitized;
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

export const validateAndSanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 15) {
    return '';
  }

  return digits;
};

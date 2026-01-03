export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
}

const COMMON_PASSWORDS = [
  'password',
  '123456',
  '12345678',
  'qwerty',
  'abc123',
  'monkey',
  '1234567',
  'letmein',
  'trustno1',
  'dragon',
  'baseball',
  'iloveyou',
  'master',
  'sunshine',
  'ashley',
  'bailey',
  'passw0rd',
  'shadow',
  '123123',
  '654321',
];

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (password.length < 6) {
    return { isValid: false, errors, strength: 'weak' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase && !hasNumber && !hasSpecialChar) {
    errors.push('Password must contain at least one uppercase letter, number, or special character');
  }

  const lowerPassword = password.toLowerCase();
  if (COMMON_PASSWORDS.some(common => lowerPassword.includes(common))) {
    errors.push('Password is too common. Please choose a more unique password');
  }

  if (password.length >= 12 && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
    strength = 'strong';
  } else if (password.length >= 10 && ((hasUpperCase && hasLowerCase && hasNumber) ||
             (hasUpperCase && hasLowerCase && hasSpecialChar) ||
             (hasNumber && hasSpecialChar))) {
    strength = 'good';
  } else if (password.length >= 8 && ((hasUpperCase || hasLowerCase) && (hasNumber || hasSpecialChar))) {
    strength = 'fair';
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'fair' | 'good' | 'strong'): string => {
  switch (strength) {
    case 'weak':
      return '#ef4444';
    case 'fair':
      return '#f59e0b';
    case 'good':
      return '#10b981';
    case 'strong':
      return '#059669';
    default:
      return '#6b7280';
  }
};

export const getPasswordStrengthText = (strength: 'weak' | 'fair' | 'good' | 'strong'): string => {
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'fair':
      return 'Fair';
    case 'good':
      return 'Good';
    case 'strong':
      return 'Strong';
    default:
      return '';
  }
};

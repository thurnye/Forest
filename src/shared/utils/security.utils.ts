import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML input to prevent XSS attacks
 * @param dirty - The untrusted HTML string
 * @returns Sanitized HTML string
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: [],
  });
};

/**
 * Sanitizes user input by removing potentially harmful characters
 * @param input - The untrusted user input
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove any script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Trim and normalize whitespace
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  return sanitized;
};

/**
 * Validates that a string is safe for use in URLs
 * @param input - The string to validate
 * @returns True if safe for URLs
 */
export const isValidUrlParam = (input: string): boolean => {
  const urlSafePattern = /^[a-zA-Z0-9\-_.~]+$/;
  return urlSafePattern.test(input);
};

/**
 * Redacts sensitive information from strings for logging
 * @param data - The data to redact
 * @param keysToRedact - Array of keys whose values should be redacted
 * @returns Redacted data
 */
export const redactSensitiveData = (
  data: Record<string, unknown>,
  keysToRedact: string[] = ['password', 'token', 'secret', 'apiKey', 'authorization']
): Record<string, unknown> => {
  const redacted = { ...data };

  keysToRedact.forEach(key => {
    const lowerKey = key.toLowerCase();
    Object.keys(redacted).forEach(dataKey => {
      if (dataKey.toLowerCase().includes(lowerKey)) {
        redacted[dataKey] = '[REDACTED]';
      }
    });
  });

  return redacted;
};

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

/**
 * Validates password strength (MVP requirements)
 * @param password - Password string to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

/**
 * Escapes special characters in a string for safe display
 * @param str - String to escape
 * @returns Escaped string
 */
export const escapeHtml = (str: string): string => {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
};

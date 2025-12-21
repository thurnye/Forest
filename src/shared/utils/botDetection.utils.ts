/**
 * Simple bot detection utilities for MVP
 * These are basic checks and should be enhanced for production
 */

/**
 * Generates a simple browser fingerprint for basic bot detection
 * @returns Fingerprint object
 */
export const generateFingerprint = (): Record<string, unknown> => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    colorDepth: window.screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: Date.now(),
  };
};

/**
 * Checks for common bot user agent patterns
 * @returns True if likely a bot
 */
export const detectBotUserAgent = (): boolean => {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /headless/i,
    /phantom/i,
    /selenium/i,
  ];

  const userAgent = navigator.userAgent;
  return botPatterns.some(pattern => pattern.test(userAgent));
};

/**
 * Checks for automation indicators
 * @returns True if automation is detected
 */
export const detectAutomation = (): boolean => {
  // Check for webdriver
  if (navigator.webdriver) {
    return true;
  }

  // Check for phantom
  if ((window as any)._phantom || (window as any).callPhantom) {
    return true;
  }

  // Check for selenium
  if ((document as any).__selenium_unwrapped || (document as any).__webdriver_evaluate) {
    return true;
  }

  return false;
};

/**
 * Performs comprehensive bot check
 * @returns Object with detection results
 */
export const performBotCheck = (): {
  isLikelyBot: boolean;
  reasons: string[];
  fingerprint: Record<string, unknown>;
} => {
  const reasons: string[] = [];

  if (detectBotUserAgent()) {
    reasons.push('Bot user agent detected');
  }

  if (detectAutomation()) {
    reasons.push('Automation detected');
  }

  // Check for missing browser features
  if (!navigator.languages || navigator.languages.length === 0) {
    reasons.push('Missing browser language support');
  }

  // Check for touch support inconsistency
  const hasTouch = 'ontouchstart' in window;
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  if ((hasTouch && maxTouchPoints === 0) || (!hasTouch && maxTouchPoints > 0)) {
    reasons.push('Touch support inconsistency');
  }

  return {
    isLikelyBot: reasons.length > 0,
    reasons,
    fingerprint: generateFingerprint(),
  };
};

/**
 * Simple rate limit tracker for form submissions
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Checks if an action is rate limited
   * @param key - Unique key for the action (e.g., 'login', 'signup')
   * @param maxAttempts - Maximum attempts allowed
   * @param windowMs - Time window in milliseconds
   * @returns True if rate limit is exceeded
   */
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Filter out old attempts
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return true;
    }

    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return false;
  }

  /**
   * Clears rate limit for a key
   * @param key - The key to clear
   */
  clear(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

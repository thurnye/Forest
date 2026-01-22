/**
 * botDetection.utils.ts
 * Simple bot detection utilities for MVP + headers for ApiClient
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
  return botPatterns.some((pattern) => pattern.test(userAgent));
};

export const detectAutomation = (): boolean => {
  if (navigator.webdriver) return true;
  if ((window as any)._phantom || (window as any).callPhantom) return true;
  if (
    (document as any).__selenium_unwrapped ||
    (document as any).__webdriver_evaluate
  ) {
    return true;
  }
  return false;
};

export const performBotCheck = (): {
  isLikelyBot: boolean;
  reasons: string[];
  fingerprint: Record<string, unknown>;
} => {
  const reasons: string[] = [];

  if (detectBotUserAgent()) reasons.push('Bot user agent detected');
  if (detectAutomation()) reasons.push('Automation detected');

  if (!navigator.languages || navigator.languages.length === 0) {
    reasons.push('Missing browser language support');
  }

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
 * Tiny non-crypto hash to keep header small.
 * Do NOT include timestamp in stable hash.
 */
const hashFingerprint = (fingerprint: Record<string, unknown>): string => {
  const stable = {
    userAgent: fingerprint.userAgent,
    language: fingerprint.language,
    platform: fingerprint.platform,
    screenResolution: fingerprint.screenResolution,
    colorDepth: fingerprint.colorDepth,
    timezone: fingerprint.timezone,
  };

  const str = JSON.stringify(stable);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16);
};

/**
 * ✅ ApiClient expects this:
 * Object.assign(config.headers, getBotDetectionHeaders());
 */
export const getBotDetectionHeaders = (): Record<string, string> => {
  const { isLikelyBot, fingerprint } = performBotCheck();

  return {
    'X-Bot-Fingerprint': hashFingerprint(fingerprint),
    'X-Bot-Likely': String(isLikelyBot),
    // 'X-Bot-Reasons': reasons.slice(0, 5).join('|'),
  };
};

/**
 * Simple rate limit tracker for form submissions
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isRateLimited(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000
  ): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    const recentAttempts = attempts.filter((timestamp) => now - timestamp < windowMs);

    if (recentAttempts.length >= maxAttempts) return true;

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);

    return false;
  }

  clear(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

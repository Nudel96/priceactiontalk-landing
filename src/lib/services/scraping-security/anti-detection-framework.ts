/**
 * Advanced Scraper Security Framework
 * Comprehensive anti-detection system for enterprise-grade web scraping
 */

export interface ProxyConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  type: 'http' | 'https' | 'socks4' | 'socks5';
  country?: string;
  city?: string;
  isResidential: boolean;
  lastUsed?: number;
  failureCount: number;
  isActive: boolean;
}

export interface BrowserFingerprint {
  userAgent: string;
  acceptLanguage: string;
  acceptEncoding: string;
  dnt: string;
  viewport: { width: number; height: number };
  screenResolution: { width: number; height: number };
  timezone: string;
  platform: string;
  referer?: string;
  cookieEnabled: boolean;
  doNotTrack: boolean;
}

export interface ScrapingSession {
  id: string;
  proxy: ProxyConfig;
  fingerprint: BrowserFingerprint;
  cookies: Map<string, string>;
  localStorage: Map<string, string>;
  requestCount: number;
  startTime: number;
  lastActivity: number;
  isActive: boolean;
}

export class AntiDetectionFramework {
  private proxies: ProxyConfig[] = [];
  private activeSessions: Map<string, ScrapingSession> = new Map();
  private readonly MAX_REQUESTS_PER_HOUR = 150;
  private readonly SESSION_ROTATION_MS = 2 * 60 * 60 * 1000; // 2 hours
  private readonly REQUEST_DELAY_MIN = 2000; // 2 seconds
  private readonly REQUEST_DELAY_MAX = 8000; // 8 seconds

  // Real browser User-Agent strings (updated regularly)
  private readonly USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ];

  private readonly ACCEPT_LANGUAGES = [
    'en-US,en;q=0.9',
    'en-GB,en;q=0.9',
    'en-US,en;q=0.9,es;q=0.8',
    'en-US,en;q=0.9,fr;q=0.8',
    'en-US,en;q=0.9,de;q=0.8'
  ];

  private readonly TIMEZONES = [
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Berlin',
    'Asia/Tokyo'
  ];

  constructor() {
    console.log('[ANTI_DETECTION] Initializing Anti-Detection Framework');
    this.initializeProxyPool();
  }

  /**
   * Initialize proxy pool (placeholder for actual proxy service integration)
   */
  private initializeProxyPool(): void {
    // Placeholder proxies - in production, integrate with ProxyMesh, Bright Data, etc.
    this.proxies = [
      {
        host: 'proxy1.example.com',
        port: 8080,
        type: 'http',
        country: 'US',
        city: 'New York',
        isResidential: true,
        failureCount: 0,
        isActive: true
      },
      {
        host: 'proxy2.example.com',
        port: 8080,
        type: 'http',
        country: 'GB',
        city: 'London',
        isResidential: true,
        failureCount: 0,
        isActive: true
      }
      // Add more proxies from actual proxy services
    ];

    console.log(`[ANTI_DETECTION] Initialized proxy pool with ${this.proxies.length} proxies`);
  }

  /**
   * Generate realistic browser fingerprint
   */
  generateBrowserFingerprint(): BrowserFingerprint {
    const userAgent = this.getRandomElement(this.USER_AGENTS);
    const acceptLanguage = this.getRandomElement(this.ACCEPT_LANGUAGES);
    const timezone = this.getRandomElement(this.TIMEZONES);

    // Extract platform from user agent
    let platform = 'Win32';
    if (userAgent.includes('Macintosh')) platform = 'MacIntel';
    if (userAgent.includes('Linux')) platform = 'Linux x86_64';

    // Generate realistic viewport and screen resolution
    const commonResolutions = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1536, height: 864 },
      { width: 1280, height: 720 }
    ];

    const screenResolution = this.getRandomElement(commonResolutions);
    const viewport = {
      width: screenResolution.width - this.getRandomInt(50, 200),
      height: screenResolution.height - this.getRandomInt(100, 300)
    };

    return {
      userAgent,
      acceptLanguage,
      acceptEncoding: 'gzip, deflate, br',
      dnt: Math.random() > 0.7 ? '1' : '0',
      viewport,
      screenResolution,
      timezone,
      platform,
      cookieEnabled: true,
      doNotTrack: Math.random() > 0.7
    };
  }

  /**
   * Create new scraping session with anti-detection measures
   */
  async createSession(): Promise<ScrapingSession> {
    const sessionId = this.generateSessionId();
    const proxy = this.selectOptimalProxy();
    const fingerprint = this.generateBrowserFingerprint();

    const session: ScrapingSession = {
      id: sessionId,
      proxy,
      fingerprint,
      cookies: new Map(),
      localStorage: new Map(),
      requestCount: 0,
      startTime: Date.now(),
      lastActivity: Date.now(),
      isActive: true
    };

    this.activeSessions.set(sessionId, session);
    console.log(`[ANTI_DETECTION] Created new session ${sessionId} with proxy ${proxy.host}:${proxy.port}`);

    return session;
  }

  /**
   * Select optimal proxy based on health and usage
   */
  private selectOptimalProxy(): ProxyConfig {
    const activeProxies = this.proxies.filter(p => p.isActive && p.failureCount < 3);
    
    if (activeProxies.length === 0) {
      console.warn('[ANTI_DETECTION] No active proxies available, using direct connection');
      return {
        host: 'direct',
        port: 0,
        type: 'http',
        isResidential: false,
        failureCount: 0,
        isActive: true
      };
    }

    // Sort by least recently used and lowest failure count
    activeProxies.sort((a, b) => {
      const aScore = (a.lastUsed || 0) + (a.failureCount * 1000000);
      const bScore = (b.lastUsed || 0) + (b.failureCount * 1000000);
      return aScore - bScore;
    });

    const selectedProxy = activeProxies[0];
    selectedProxy.lastUsed = Date.now();

    return selectedProxy;
  }

  /**
   * Calculate intelligent delay between requests
   */
  calculateRequestDelay(session: ScrapingSession): number {
    const baseDelay = this.getRandomInt(this.REQUEST_DELAY_MIN, this.REQUEST_DELAY_MAX);
    
    // Add exponential jitter based on request count
    const jitter = Math.min(5000, session.requestCount * 100);
    
    // Add random variation
    const variation = this.getRandomInt(-500, 500);
    
    return Math.max(1000, baseDelay + jitter + variation);
  }

  /**
   * Simulate human behavior patterns
   */
  async simulateHumanBehavior(session: ScrapingSession): Promise<void> {
    // Simulate mouse movements (placeholder)
    await this.delay(this.getRandomInt(100, 500));
    
    // Simulate scroll behavior (placeholder)
    await this.delay(this.getRandomInt(200, 800));
    
    // Simulate reading time
    await this.delay(this.getRandomInt(1000, 3000));
  }

  /**
   * Check if session should be rotated
   */
  shouldRotateSession(session: ScrapingSession): boolean {
    const now = Date.now();
    const sessionAge = now - session.startTime;
    const timeSinceLastActivity = now - session.lastActivity;

    // Rotate if session is too old
    if (sessionAge > this.SESSION_ROTATION_MS) {
      return true;
    }

    // Rotate if too many requests
    const hoursSinceStart = sessionAge / (60 * 60 * 1000);
    const requestsPerHour = session.requestCount / Math.max(hoursSinceStart, 0.1);
    if (requestsPerHour > this.MAX_REQUESTS_PER_HOUR) {
      return true;
    }

    // Rotate if inactive for too long
    if (timeSinceLastActivity > 30 * 60 * 1000) { // 30 minutes
      return true;
    }

    return false;
  }

  /**
   * Rotate session with new proxy and fingerprint
   */
  async rotateSession(sessionId: string): Promise<ScrapingSession> {
    const oldSession = this.activeSessions.get(sessionId);
    if (oldSession) {
      oldSession.isActive = false;
      this.activeSessions.delete(sessionId);
      console.log(`[ANTI_DETECTION] Rotated session ${sessionId}`);
    }

    return await this.createSession();
  }

  /**
   * Handle proxy failure and mark for rotation
   */
  handleProxyFailure(proxy: ProxyConfig, error: Error): void {
    proxy.failureCount++;
    
    if (proxy.failureCount >= 3) {
      proxy.isActive = false;
      console.warn(`[ANTI_DETECTION] Proxy ${proxy.host}:${proxy.port} marked as inactive after ${proxy.failureCount} failures`);
    }

    console.error(`[ANTI_DETECTION] Proxy failure for ${proxy.host}:${proxy.port}:`, error.message);
  }

  /**
   * Get request headers with anti-detection measures
   */
  getAntiDetectionHeaders(session: ScrapingSession, referer?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'User-Agent': session.fingerprint.userAgent,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': session.fingerprint.acceptLanguage,
      'Accept-Encoding': session.fingerprint.acceptEncoding,
      'DNT': session.fingerprint.dnt,
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    };

    if (referer) {
      headers['Referer'] = referer;
    }

    return headers;
  }

  /**
   * Utility functions
   */
  private getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    activeSessions: number;
    totalRequests: number;
    activeProxies: number;
    failedProxies: number;
  } {
    const activeSessions = Array.from(this.activeSessions.values()).filter(s => s.isActive);
    const totalRequests = activeSessions.reduce((sum, s) => sum + s.requestCount, 0);
    const activeProxies = this.proxies.filter(p => p.isActive).length;
    const failedProxies = this.proxies.filter(p => !p.isActive).length;

    return {
      activeSessions: activeSessions.length,
      totalRequests,
      activeProxies,
      failedProxies
    };
  }

  /**
   * Cleanup inactive sessions
   */
  cleanupSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (!session.isActive || (now - session.lastActivity) > 60 * 60 * 1000) { // 1 hour
        this.activeSessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`[ANTI_DETECTION] Cleaned up ${cleanedCount} inactive sessions`);
    }
  }
}

// Singleton instance
let instance: AntiDetectionFramework | null = null;

export function getAntiDetectionFramework(): AntiDetectionFramework {
  if (!instance) {
    instance = new AntiDetectionFramework();
  }
  return instance;
}

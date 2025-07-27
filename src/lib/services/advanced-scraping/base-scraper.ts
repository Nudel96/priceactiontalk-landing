/**
 * Base Scraper Class - Foundation for all economic data scrapers
 * Implements rate limiting, error handling, and data validation
 */

import type { 
  DataSource, 
  AssetCode, 
  EconomicDataPoint, 
  ScrapingConfig, 
  ScrapingResult,
  DataValidationRule 
} from '$lib/types/advanced-economic';

export abstract class BaseScraper {
  protected config: ScrapingConfig;
  protected lastRequestTime: number = 0;
  protected requestCount: number = 0;
  protected errors: string[] = [];

  constructor(config: ScrapingConfig) {
    this.config = config;
  }

  /**
   * Abstract method to be implemented by each scraper
   */
  abstract scrapeData(assets?: AssetCode[]): Promise<ScrapingResult>;

  /**
   * Rate limiting implementation
   */
  protected async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.config.rate_limit_ms) {
      const waitTime = this.config.rate_limit_ms - timeSinceLastRequest;
      console.log(`[${this.config.source}] Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  /**
   * HTTP request with retry logic and error handling
   */
  protected async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    await this.enforceRateLimit();

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'User-Agent': this.config.user_agent,
        'Accept': 'application/json, text/html, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        ...this.config.headers,
        ...options.headers
      },
      timeout: this.config.timeout_ms
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retry_attempts; attempt++) {
      try {
        console.log(`[${this.config.source}] Request attempt ${attempt}/${this.config.retry_attempts}: ${url}`);
        
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`[${this.config.source}] Request successful: ${url}`);
        return response;

      } catch (error) {
        lastError = error as Error;
        console.error(`[${this.config.source}] Request attempt ${attempt} failed:`, error);
        
        if (attempt < this.config.retry_attempts) {
          const backoffTime = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          console.log(`[${this.config.source}] Retrying in ${backoffTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Data validation using configurable rules
   */
  protected validateDataPoint(dataPoint: EconomicDataPoint, rules: DataValidationRule[]): boolean {
    for (const rule of rules) {
      if (!this.applyValidationRule(dataPoint, rule)) {
        this.errors.push(`Validation failed for ${dataPoint.id}: ${rule.error_message}`);
        return false;
      }
    }
    return true;
  }

  private applyValidationRule(dataPoint: any, rule: DataValidationRule): boolean {
    const value = dataPoint[rule.field];

    switch (rule.rule_type) {
      case 'REQUIRED':
        return value !== undefined && value !== null && value !== '';

      case 'RANGE':
        if (typeof value !== 'number') return false;
        const { min, max } = rule.parameters;
        return value >= min && value <= max;

      case 'FORMAT':
        if (typeof value !== 'string') return false;
        const pattern = new RegExp(rule.parameters.regex);
        return pattern.test(value);

      case 'LOGICAL':
        // Custom logical validation
        return this.customLogicalValidation(dataPoint, rule);

      default:
        return true;
    }
  }

  /**
   * Override this method for custom validation logic
   */
  protected customLogicalValidation(dataPoint: EconomicDataPoint, rule: DataValidationRule): boolean {
    return true;
  }

  /**
   * Calculate surprise score based on actual vs forecast
   */
  protected calculateSurpriseScore(actual: number, forecast: number, isPositiveIndicator: boolean = true): number {
    if (!actual || !forecast) return 0;

    const surprise = (actual - forecast) / Math.abs(forecast);
    
    // For positive indicators (GDP, employment, etc.)
    if (isPositiveIndicator) {
      if (surprise > 0.02) return 1;   // Positive surprise
      if (surprise < -0.02) return -1; // Negative surprise
      return 0;                        // No significant surprise
    } else {
      // For negative indicators (unemployment, inflation above target, etc.)
      if (surprise > 0.02) return -1;  // Worse than expected
      if (surprise < -0.02) return 1;  // Better than expected
      return 0;
    }
  }

  /**
   * Generate unique ID for data point
   */
  protected generateDataPointId(asset: AssetCode, indicator: string, timestamp: string): string {
    return `${asset}_${indicator}_${timestamp.replace(/[^0-9]/g, '')}`;
  }

  /**
   * Get current timestamp in ISO format
   */
  protected getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Clean and normalize text data
   */
  protected cleanText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s.-]/g, '');
  }

  /**
   * Parse number from string with various formats
   */
  protected parseNumber(value: string | number): number | null {
    if (typeof value === 'number') return value;
    if (!value || typeof value !== 'string') return null;

    // Remove common formatting
    const cleaned = value
      .replace(/[,%$€£¥]/g, '')
      .replace(/\s/g, '')
      .trim();

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  /**
   * Get scraping statistics
   */
  public getStats(): { requests: number; errors: number; lastRequest: number } {
    return {
      requests: this.requestCount,
      errors: this.errors.length,
      lastRequest: this.lastRequestTime
    };
  }

  /**
   * Reset scraper state
   */
  public reset(): void {
    this.requestCount = 0;
    this.errors = [];
    this.lastRequestTime = 0;
  }

  /**
   * Check robots.txt compliance (basic implementation)
   */
  protected async checkRobotsTxt(baseUrl: string): Promise<boolean> {
    if (!this.config.respect_robots_txt) return true;

    try {
      const robotsUrl = new URL('/robots.txt', baseUrl).toString();
      const response = await fetch(robotsUrl);
      
      if (!response.ok) return true; // If robots.txt doesn't exist, assume allowed

      const robotsText = await response.text();
      const userAgentSection = this.parseRobotsTxt(robotsText);
      
      // Basic check - in production, use a proper robots.txt parser
      return !userAgentSection.includes('Disallow: /');
    } catch (error) {
      console.warn(`[${this.config.source}] Could not check robots.txt:`, error);
      return true; // Assume allowed if check fails
    }
  }

  private parseRobotsTxt(robotsText: string): string {
    const lines = robotsText.split('\n');
    let inUserAgentSection = false;
    let relevantSection = '';

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.split(':')[1].trim();
        inUserAgentSection = agent === '*' || agent === 'bot' || agent === 'crawler';
      } else if (trimmed.startsWith('user-agent:') && inUserAgentSection) {
        break; // End of our section
      } else if (inUserAgentSection) {
        relevantSection += line + '\n';
      }
    }

    return relevantSection;
  }
}

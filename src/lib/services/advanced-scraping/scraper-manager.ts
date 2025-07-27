/**
 * Scraper Manager - Orchestrates all economic data scrapers
 * Handles scheduling, error recovery, and data aggregation
 */

import { FREDScraper } from './fred-scraper';
import { TradingEconomicsScraper } from './trading-economics-scraper';
import { CFTCScraper } from './cftc-scraper';
import { MarketDataScraper } from './market-data-scraper';
import type { 
  AssetCode, 
  DataSource,
  EconomicDataPoint,
  COTData,
  ScrapingResult,
  SystemHealth 
} from '$lib/types/advanced-economic';

interface ScraperInstance {
  scraper: any;
  source: DataSource;
  enabled: boolean;
  lastRun: string | null;
  lastSuccess: string | null;
  errorCount: number;
  maxErrors: number;
}

export class ScraperManager {
  private scrapers: Map<DataSource, ScraperInstance> = new Map();
  private isRunning: boolean = false;
  private scheduledTasks: Map<string, NodeJS.Timeout> = new Map();
  private dataCache: Map<string, any> = new Map();
  private systemHealth: SystemHealth;

  constructor() {
    this.initializeScrapers();
    this.initializeSystemHealth();
  }

  private initializeScrapers(): void {
    // Initialize all scrapers
    const scraperConfigs: Array<{ source: DataSource; scraper: any; maxErrors: number }> = [
      { source: 'FRED', scraper: new FREDScraper(), maxErrors: 5 },
      { source: 'TRADING_ECONOMICS', scraper: new TradingEconomicsScraper(), maxErrors: 3 },
      { source: 'CFTC', scraper: new CFTCScraper(), maxErrors: 2 },
      { source: 'MARKET_DATA', scraper: new MarketDataScraper(), maxErrors: 3 }
    ];

    for (const config of scraperConfigs) {
      this.scrapers.set(config.source, {
        scraper: config.scraper,
        source: config.source,
        enabled: true,
        lastRun: null,
        lastSuccess: null,
        errorCount: 0,
        maxErrors: config.maxErrors
      });
    }

    console.log(`[SCRAPER_MANAGER] Initialized ${this.scrapers.size} scrapers`);
  }

  private initializeSystemHealth(): void {
    this.systemHealth = {
      timestamp: new Date().toISOString(),
      active_scrapers: this.scrapers.size,
      failed_scrapers: [],
      last_successful_scrape: {},
      total_data_points: 0,
      validation_pass_rate: 0,
      data_freshness_score: 0,
      average_scrape_time_ms: 0,
      error_rate_24h: 0,
      uptime_percentage: 100,
      active_alerts: [],
      system_status: 'HEALTHY'
    };
  }

  /**
   * Start the scraper manager with scheduled tasks
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[SCRAPER_MANAGER] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[SCRAPER_MANAGER] Starting scraper manager...');

    // Schedule different scrapers at different intervals
    this.scheduleTask('FRED_DAILY', () => this.runScraper('FRED'), 24 * 60 * 60 * 1000); // Daily
    this.scheduleTask('TRADING_ECONOMICS_HOURLY', () => this.runScraper('TRADING_ECONOMICS'), 60 * 60 * 1000); // Hourly
    this.scheduleTask('CFTC_WEEKLY', () => this.runScraper('CFTC'), 7 * 24 * 60 * 60 * 1000); // Weekly

    // Health check every 5 minutes
    this.scheduleTask('HEALTH_CHECK', () => this.updateSystemHealth(), 5 * 60 * 1000);

    // Initial data collection
    await this.runAllScrapers();

    console.log('[SCRAPER_MANAGER] Scraper manager started successfully');
  }

  /**
   * Stop the scraper manager
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    
    // Clear all scheduled tasks
    for (const [taskName, timeout] of this.scheduledTasks) {
      clearTimeout(timeout);
      console.log(`[SCRAPER_MANAGER] Stopped task: ${taskName}`);
    }
    
    this.scheduledTasks.clear();
    console.log('[SCRAPER_MANAGER] Scraper manager stopped');
  }

  private scheduleTask(taskName: string, task: () => Promise<void>, intervalMs: number): void {
    const runTask = async () => {
      try {
        await task();
      } catch (error) {
        console.error(`[SCRAPER_MANAGER] Task ${taskName} failed:`, error);
      }
      
      // Schedule next run
      if (this.isRunning) {
        const timeout = setTimeout(runTask, intervalMs);
        this.scheduledTasks.set(taskName, timeout);
      }
    };

    // Initial run
    setTimeout(runTask, 1000); // Start after 1 second
  }

  /**
   * Run all enabled scrapers
   */
  async runAllScrapers(assets?: AssetCode[]): Promise<Map<DataSource, ScrapingResult>> {
    console.log('[SCRAPER_MANAGER] Running all scrapers...');
    
    const results = new Map<DataSource, ScrapingResult>();
    const promises: Promise<void>[] = [];

    for (const [source, instance] of this.scrapers) {
      if (!instance.enabled) continue;

      promises.push(
        this.runScraper(source, assets).then(result => {
          if (result) results.set(source, result);
        })
      );
    }

    await Promise.allSettled(promises);
    
    console.log(`[SCRAPER_MANAGER] Completed scraping from ${results.size} sources`);
    return results;
  }

  /**
   * Run a specific scraper
   */
  async runScraper(source: DataSource, assets?: AssetCode[]): Promise<ScrapingResult | null> {
    const instance = this.scrapers.get(source);
    if (!instance || !instance.enabled) {
      console.warn(`[SCRAPER_MANAGER] Scraper ${source} not available or disabled`);
      return null;
    }

    console.log(`[SCRAPER_MANAGER] Running scraper: ${source}`);
    
    try {
      instance.lastRun = new Date().toISOString();
      
      const result = await instance.scraper.scrapeData(assets);
      
      if (result.success) {
        instance.lastSuccess = new Date().toISOString();
        instance.errorCount = 0;
        
        // Cache the results
        this.cacheResults(source, result);
        
        console.log(`[SCRAPER_MANAGER] ${source} completed successfully: ${result.data_points.length} data points`);
      } else {
        instance.errorCount++;
        console.error(`[SCRAPER_MANAGER] ${source} failed with errors:`, result.errors);
        
        // Disable scraper if too many errors
        if (instance.errorCount >= instance.maxErrors) {
          instance.enabled = false;
          console.error(`[SCRAPER_MANAGER] Disabled ${source} due to excessive errors`);
        }
      }

      return result;

    } catch (error) {
      instance.errorCount++;
      console.error(`[SCRAPER_MANAGER] ${source} threw exception:`, error);
      
      if (instance.errorCount >= instance.maxErrors) {
        instance.enabled = false;
        console.error(`[SCRAPER_MANAGER] Disabled ${source} due to excessive errors`);
      }

      return {
        source,
        success: false,
        data_points: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        execution_time_ms: 0,
        timestamp: new Date().toISOString()
      };
    }
  }

  private cacheResults(source: DataSource, result: ScrapingResult): void {
    const cacheKey = `${source}_${new Date().toISOString().split('T')[0]}`;
    this.dataCache.set(cacheKey, {
      result,
      timestamp: new Date().toISOString()
    });

    // Clean old cache entries (keep last 7 days)
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    for (const [key, value] of this.dataCache) {
      if (new Date(value.timestamp) < cutoffDate) {
        this.dataCache.delete(key);
      }
    }
  }

  /**
   * Get cached data for a source
   */
  getCachedData(source: DataSource, maxAgeHours: number = 24): ScrapingResult | null {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `${source}_${today}`;
    const cached = this.dataCache.get(cacheKey);

    if (!cached) return null;

    const ageMs = Date.now() - new Date(cached.timestamp).getTime();
    const maxAgeMs = maxAgeHours * 60 * 60 * 1000;

    return ageMs <= maxAgeMs ? cached.result : null;
  }

  /**
   * Get aggregated data for all assets
   */
  async getAggregatedData(assets?: AssetCode[]): Promise<{
    dataPoints: EconomicDataPoint[];
    cotData: COTData[];
    lastUpdated: string;
  }> {
    const allDataPoints: EconomicDataPoint[] = [];
    const allCOTData: COTData[] = [];

    // Try to get cached data first
    for (const [source, _] of this.scrapers) {
      const cached = this.getCachedData(source, 6); // 6 hours max age
      if (cached && cached.success) {
        allDataPoints.push(...cached.data_points);
      }
    }

    // If no recent cached data, run scrapers
    if (allDataPoints.length === 0) {
      const results = await this.runAllScrapers(assets);
      
      for (const result of results.values()) {
        if (result.success) {
          allDataPoints.push(...result.data_points);
        }
      }
    }

    return {
      dataPoints: allDataPoints,
      cotData: allCOTData,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Update system health metrics
   */
  private async updateSystemHealth(): Promise<void> {
    const enabledScrapers = Array.from(this.scrapers.values()).filter(s => s.enabled);
    const failedScrapers = Array.from(this.scrapers.values())
      .filter(s => !s.enabled)
      .map(s => s.source);

    // Calculate metrics
    const totalDataPoints = Array.from(this.dataCache.values())
      .reduce((sum, cached) => sum + cached.result.data_points.length, 0);

    const validDataPoints = Array.from(this.dataCache.values())
      .reduce((sum, cached) => 
        sum + cached.result.data_points.filter(dp => dp.validation_passed).length, 0);

    const validationPassRate = totalDataPoints > 0 ? validDataPoints / totalDataPoints : 0;

    // Update system health
    this.systemHealth = {
      timestamp: new Date().toISOString(),
      active_scrapers: enabledScrapers.length,
      failed_scrapers: failedScrapers,
      last_successful_scrape: Object.fromEntries(
        Array.from(this.scrapers.entries())
          .filter(([_, instance]) => instance.lastSuccess)
          .map(([source, instance]) => [source, instance.lastSuccess!])
      ),
      total_data_points: totalDataPoints,
      validation_pass_rate: validationPassRate,
      data_freshness_score: this.calculateFreshnessScore(),
      average_scrape_time_ms: 0, // TODO: Calculate from results
      error_rate_24h: this.calculateErrorRate(),
      uptime_percentage: enabledScrapers.length / this.scrapers.size * 100,
      active_alerts: this.generateAlerts(),
      system_status: this.determineSystemStatus()
    };
  }

  private calculateFreshnessScore(): number {
    // Calculate based on how recent the data is
    const now = Date.now();
    let totalScore = 0;
    let count = 0;

    for (const instance of this.scrapers.values()) {
      if (instance.lastSuccess) {
        const ageHours = (now - new Date(instance.lastSuccess).getTime()) / (1000 * 60 * 60);
        const score = Math.max(0, 100 - ageHours * 4); // Decrease 4 points per hour
        totalScore += score;
        count++;
      }
    }

    return count > 0 ? totalScore / count : 0;
  }

  private calculateErrorRate(): number {
    const totalErrors = Array.from(this.scrapers.values())
      .reduce((sum, instance) => sum + instance.errorCount, 0);
    const totalScrapers = this.scrapers.size;
    
    return totalScrapers > 0 ? (totalErrors / totalScrapers) * 100 : 0;
  }

  private generateAlerts(): string[] {
    const alerts: string[] = [];

    // Check for failed scrapers
    for (const [source, instance] of this.scrapers) {
      if (!instance.enabled) {
        alerts.push(`Scraper ${source} is disabled due to errors`);
      }
      
      if (instance.lastSuccess) {
        const ageHours = (Date.now() - new Date(instance.lastSuccess).getTime()) / (1000 * 60 * 60);
        if (ageHours > 48) {
          alerts.push(`${source} data is stale (${Math.round(ageHours)} hours old)`);
        }
      }
    }

    return alerts;
  }

  private determineSystemStatus(): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    const enabledCount = Array.from(this.scrapers.values()).filter(s => s.enabled).length;
    const totalCount = this.scrapers.size;
    const enabledPercentage = enabledCount / totalCount;

    if (enabledPercentage < 0.5) return 'CRITICAL';
    if (enabledPercentage < 0.8 || this.systemHealth.active_alerts.length > 0) return 'WARNING';
    return 'HEALTHY';
  }

  /**
   * Get current system health
   */
  getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  /**
   * Enable/disable a specific scraper
   */
  setScraperEnabled(source: DataSource, enabled: boolean): void {
    const instance = this.scrapers.get(source);
    if (instance) {
      instance.enabled = enabled;
      if (enabled) {
        instance.errorCount = 0; // Reset error count when re-enabling
      }
      console.log(`[SCRAPER_MANAGER] ${source} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Get scraper statistics
   */
  getScraperStats(): Record<DataSource, any> {
    const stats: Record<string, any> = {};
    
    for (const [source, instance] of this.scrapers) {
      stats[source] = {
        enabled: instance.enabled,
        lastRun: instance.lastRun,
        lastSuccess: instance.lastSuccess,
        errorCount: instance.errorCount,
        maxErrors: instance.maxErrors,
        scraperStats: instance.scraper.getStats?.() || {}
      };
    }

    return stats;
  }
}

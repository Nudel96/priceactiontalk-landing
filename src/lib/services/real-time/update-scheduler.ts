/**
 * Update Scheduler - Manages real-time data collection and updates
 * Coordinates scrapers, scoring engine, and data storage
 */

import { ScraperManager } from '../advanced-scraping/scraper-manager';
import { EconomicScoringEngine } from '../scoring/economic-scoring-engine';
import { RateCutCalculator } from '../scoring/rate-cut-calculator';
import { EconomicDataStore } from '../database/economic-data-store';
import type { 
  AssetCode, 
  EconomicDataPoint, 
  COTData, 
  SentimentData,
  AssetScore,
  SystemHealth 
} from '$lib/types/advanced-economic';

interface UpdateSchedule {
  name: string;
  interval: number; // milliseconds
  lastRun: string | null;
  nextRun: string;
  enabled: boolean;
  running: boolean;
}

interface UpdateResult {
  success: boolean;
  dataPoints: number;
  errors: string[];
  executionTime: number;
  timestamp: string;
}

export class UpdateScheduler {
  private scraperManager: ScraperManager;
  private scoringEngine: EconomicScoringEngine;
  private rateCutCalculator: RateCutCalculator;
  private dataStore: EconomicDataStore;
  
  private schedules: Map<string, UpdateSchedule> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private isRunning: boolean = false;
  private updateHistory: Map<string, UpdateResult[]> = new Map();

  constructor() {
    this.scraperManager = new ScraperManager();
    this.scoringEngine = new EconomicScoringEngine();
    this.rateCutCalculator = new RateCutCalculator();
    this.dataStore = new EconomicDataStore();
    
    this.initializeSchedules();
  }

  private initializeSchedules(): void {
    const schedules: Array<{ name: string; interval: number; enabled: boolean }> = [
      { name: 'MARKET_DATA_UPDATE', interval: 5 * 60 * 1000, enabled: true },       // 5 minutes - Live Marktdaten
      { name: 'ECONOMIC_DATA_UPDATE', interval: 60 * 60 * 1000, enabled: true },    // 1 hour
      { name: 'COT_DATA_UPDATE', interval: 24 * 60 * 60 * 1000, enabled: true },    // 24 hours
      { name: 'SENTIMENT_UPDATE', interval: 2 * 60 * 60 * 1000, enabled: true },    // 2 hours
      { name: 'SCORE_CALCULATION', interval: 10 * 60 * 1000, enabled: true },       // 10 minutes - Häufigere Score-Updates
      { name: 'RATE_CUT_ANALYSIS', interval: 4 * 60 * 60 * 1000, enabled: true },   // 4 hours
      { name: 'SYSTEM_HEALTH_CHECK', interval: 5 * 60 * 1000, enabled: true },      // 5 minutes
      { name: 'DATA_CLEANUP', interval: 24 * 60 * 60 * 1000, enabled: true }        // 24 hours
    ];

    for (const schedule of schedules) {
      this.schedules.set(schedule.name, {
        name: schedule.name,
        interval: schedule.interval,
        lastRun: null,
        nextRun: new Date(Date.now() + schedule.interval).toISOString(),
        enabled: schedule.enabled,
        running: false
      });
    }

    console.log(`[UPDATE_SCHEDULER] Initialized ${this.schedules.size} update schedules`);
  }

  /**
   * Start the update scheduler
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[UPDATE_SCHEDULER] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[UPDATE_SCHEDULER] Starting update scheduler...');

    // Start scraper manager
    await this.scraperManager.start();

    // Schedule all enabled tasks
    for (const [name, schedule] of this.schedules) {
      if (schedule.enabled) {
        this.scheduleTask(name);
      }
    }

    // Initial data collection
    await this.runInitialDataCollection();

    console.log('[UPDATE_SCHEDULER] Update scheduler started successfully');
  }

  /**
   * Stop the update scheduler
   */
  async stop(): Promise<void> {
    if (!this.isRunning) return;

    this.isRunning = false;
    console.log('[UPDATE_SCHEDULER] Stopping update scheduler...');

    // Clear all timers
    for (const [name, timer] of this.timers) {
      clearTimeout(timer);
      console.log(`[UPDATE_SCHEDULER] Stopped timer: ${name}`);
    }
    this.timers.clear();

    // Stop scraper manager
    this.scraperManager.stop();

    console.log('[UPDATE_SCHEDULER] Update scheduler stopped');
  }

  private scheduleTask(taskName: string): void {
    const schedule = this.schedules.get(taskName);
    if (!schedule || !schedule.enabled) return;

    const runTask = async () => {
      if (!this.isRunning || schedule.running) return;

      try {
        schedule.running = true;
        schedule.lastRun = new Date().toISOString();

        console.log(`[UPDATE_SCHEDULER] Running task: ${taskName}`);
        const result = await this.executeTask(taskName);
        
        this.recordUpdateResult(taskName, result);
        
        if (result.success) {
          console.log(`[UPDATE_SCHEDULER] Task ${taskName} completed successfully`);
        } else {
          console.error(`[UPDATE_SCHEDULER] Task ${taskName} failed:`, result.errors);
        }

      } catch (error) {
        console.error(`[UPDATE_SCHEDULER] Task ${taskName} threw exception:`, error);
        this.recordUpdateResult(taskName, {
          success: false,
          dataPoints: 0,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          executionTime: 0,
          timestamp: new Date().toISOString()
        });
      } finally {
        schedule.running = false;
        schedule.nextRun = new Date(Date.now() + schedule.interval).toISOString();
        
        // Schedule next run
        if (this.isRunning && schedule.enabled) {
          const timer = setTimeout(runTask, schedule.interval);
          this.timers.set(taskName, timer);
        }
      }
    };

    // Initial delay to spread out tasks
    const initialDelay = Math.random() * 60000; // 0-60 seconds
    const timer = setTimeout(runTask, initialDelay);
    this.timers.set(taskName, timer);
  }

  private async executeTask(taskName: string): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      switch (taskName) {
        case 'MARKET_DATA_UPDATE':
          return await this.updateMarketData();
        
        case 'ECONOMIC_DATA_UPDATE':
          return await this.updateEconomicData();
        
        case 'COT_DATA_UPDATE':
          return await this.updateCOTData();
        
        case 'SENTIMENT_UPDATE':
          return await this.updateSentimentData();
        
        case 'SCORE_CALCULATION':
          return await this.calculateScores();
        
        case 'RATE_CUT_ANALYSIS':
          return await this.analyzeRateCutProbabilities();
        
        case 'SYSTEM_HEALTH_CHECK':
          return await this.checkSystemHealth();
        
        case 'DATA_CLEANUP':
          return await this.cleanupOldData();
        
        default:
          throw new Error(`Unknown task: ${taskName}`);
      }
    } catch (error) {
      return {
        success: false,
        dataPoints: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async updateMarketData(): Promise<UpdateResult> {
    const startTime = Date.now();

    try {
      // Fokus auf Live-Marktdaten (MARKET_DATA Scraper)
      const result = await this.scraperManager.runScraper('MARKET_DATA');

      let totalDataPoints = 0;
      const errors: string[] = [];

      if (result && result.success) {
        await this.dataStore.storeEconomicData(result.data_points);
        totalDataPoints = result.data_points.length;
        console.log(`[UPDATE_SCHEDULER] Market data updated: ${totalDataPoints} data points`);
      } else {
        errors.push(...(result?.errors || ['Market data scraper failed']));
      }

      return {
        success: errors.length === 0,
        dataPoints: totalDataPoints,
        errors,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async updateEconomicData(): Promise<UpdateResult> {
    // Similar to market data but with different focus
    return await this.updateMarketData();
  }

  private async updateCOTData(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      const result = await this.scraperManager.runScraper('CFTC');
      
      if (result && result.success) {
        // COT data would be in a different format, handle accordingly
        return {
          success: true,
          dataPoints: 0, // COT data is stored separately
          errors: [],
          executionTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          dataPoints: 0,
          errors: result?.errors || ['COT scraper failed'],
          executionTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        };
      }
    } catch (error) {
      throw error;
    }
  }

  private async updateSentimentData(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      // Placeholder for sentiment data collection
      // In practice, this would scrape sentiment from various sources
      
      return {
        success: true,
        dataPoints: 0,
        errors: [],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async calculateScores(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      // Get latest economic data
      const economicData = await this.dataStore.getEconomicData();
      const cotData = await this.dataStore.getCOTData();
      const sentimentData = await this.dataStore.getSentimentData();

      // Create maps for easier lookup
      const cotDataMap = new Map<AssetCode, COTData>();
      cotData.forEach(cot => cotDataMap.set(cot.asset, cot));

      const sentimentDataMap = new Map<AssetCode, SentimentData>();
      sentimentData.forEach(sentiment => sentimentDataMap.set(sentiment.asset, sentiment));

      // Calculate scores for all assets
      const scores = await this.scoringEngine.calculateAllAssetScores(
        economicData,
        cotDataMap,
        sentimentDataMap
      );

      // Store the scores
      await this.dataStore.storeAssetScores(scores);

      return {
        success: true,
        dataPoints: scores.length,
        errors: [],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async analyzeRateCutProbabilities(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      // Get economic data grouped by asset
      const economicData = await this.dataStore.getEconomicData();
      const economicDataMap = new Map<AssetCode, EconomicDataPoint[]>();
      
      economicData.forEach(dataPoint => {
        if (!economicDataMap.has(dataPoint.asset)) {
          economicDataMap.set(dataPoint.asset, []);
        }
        economicDataMap.get(dataPoint.asset)!.push(dataPoint);
      });

      // Calculate rate cut probabilities
      const probabilities = this.rateCutCalculator.calculateAllRateCutProbabilities(economicDataMap);

      // Store the probabilities (you might want to create a separate storage method)
      // For now, we'll log them
      console.log('[UPDATE_SCHEDULER] Rate cut probabilities calculated:', probabilities.length);

      return {
        success: true,
        dataPoints: probabilities.length,
        errors: [],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async checkSystemHealth(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      const health = this.scraperManager.getSystemHealth();
      await this.dataStore.storeSystemHealth(health);

      return {
        success: health.system_status !== 'CRITICAL',
        dataPoints: 1,
        errors: health.active_alerts,
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async cleanupOldData(): Promise<UpdateResult> {
    const startTime = Date.now();
    
    try {
      // Clear old cache entries
      this.dataStore.clearCache();
      
      // In a real implementation, you'd also clean up old database records
      
      return {
        success: true,
        dataPoints: 0,
        errors: [],
        executionTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw error;
    }
  }

  private async runInitialDataCollection(): Promise<void> {
    console.log('[UPDATE_SCHEDULER] Running initial data collection...');
    
    try {
      // Run critical updates immediately
      await this.executeTask('MARKET_DATA_UPDATE');
      await this.executeTask('SCORE_CALCULATION');
      await this.executeTask('SYSTEM_HEALTH_CHECK');
      
      console.log('[UPDATE_SCHEDULER] Initial data collection completed');
    } catch (error) {
      console.error('[UPDATE_SCHEDULER] Initial data collection failed:', error);
    }
  }

  private recordUpdateResult(taskName: string, result: UpdateResult): void {
    if (!this.updateHistory.has(taskName)) {
      this.updateHistory.set(taskName, []);
    }
    
    const history = this.updateHistory.get(taskName)!;
    history.push(result);
    
    // Keep only last 100 results per task
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
  }

  /**
   * Get update schedules status
   */
  getScheduleStatus(): Array<UpdateSchedule & { lastResult?: UpdateResult }> {
    return Array.from(this.schedules.values()).map(schedule => {
      const history = this.updateHistory.get(schedule.name);
      const lastResult = history && history.length > 0 ? history[history.length - 1] : undefined;
      
      return {
        ...schedule,
        lastResult
      };
    });
  }

  /**
   * Enable/disable a specific schedule
   */
  setScheduleEnabled(taskName: string, enabled: boolean): void {
    const schedule = this.schedules.get(taskName);
    if (!schedule) return;

    schedule.enabled = enabled;
    
    if (enabled && this.isRunning) {
      this.scheduleTask(taskName);
    } else {
      const timer = this.timers.get(taskName);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(taskName);
      }
    }
    
    console.log(`[UPDATE_SCHEDULER] Schedule ${taskName} ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Manually trigger a specific task
   */
  async triggerTask(taskName: string): Promise<UpdateResult> {
    const schedule = this.schedules.get(taskName);
    if (!schedule) {
      throw new Error(`Unknown task: ${taskName}`);
    }

    if (schedule.running) {
      throw new Error(`Task ${taskName} is already running`);
    }

    console.log(`[UPDATE_SCHEDULER] Manually triggering task: ${taskName}`);
    const result = await this.executeTask(taskName);
    this.recordUpdateResult(taskName, result);
    
    return result;
  }

  /**
   * Get update history for a specific task
   */
  getUpdateHistory(taskName: string, limit: number = 10): UpdateResult[] {
    const history = this.updateHistory.get(taskName) || [];
    return history.slice(-limit);
  }
}

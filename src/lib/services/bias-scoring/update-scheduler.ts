/**
 * Update Scheduler - Manages efficient fundamental data collection with hybrid scheduling
 * Implements regular interval checks and event-triggered updates with rate limiting
 */

import { ChangeDetectionEngine, type DataSource, type ChangeDetectionResult } from './change-detection-engine';
import { BiasScoringDatabase } from '../database/bias-scoring-database';

export interface ScheduledEvent {
  id: string;
  asset: string;
  eventType: 'earnings' | 'economic_data' | 'central_bank' | 'guidance';
  scheduledTime: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  triggered: boolean;
  bufferMinutes: number; // Wait time after scheduled release
}

export interface UpdateJob {
  id: string;
  asset: string;
  dataType: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  scheduledTime: string;
  lastRun?: string;
  nextRun: string;
  intervalMinutes: number;
  isRunning: boolean;
  retryCount: number;
  maxRetries: number;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  backoffMultiplier: number;
  maxBackoffMinutes: number;
}

export class UpdateScheduler {
  private changeDetectionEngine: ChangeDetectionEngine;
  private db: BiasScoringDatabase;
  private scheduledJobs: Map<string, UpdateJob> = new Map();
  private eventCalendar: Map<string, ScheduledEvent> = new Map();
  private rateLimiters: Map<string, RateLimitConfig> = new Map();
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Default configurations
  private readonly DEFAULT_INTERVALS = {
    earnings: 6 * 60, // 6 hours
    revenue: 6 * 60,
    debt_ratio: 24 * 60, // 24 hours
    economic_indicator: 4 * 60, // 4 hours
    central_bank: 2 * 60, // 2 hours
    guidance: 12 * 60 // 12 hours
  };

  private readonly DEFAULT_RATE_LIMITS: RateLimitConfig = {
    requestsPerMinute: 10,
    requestsPerHour: 300,
    requestsPerDay: 5000,
    backoffMultiplier: 2,
    maxBackoffMinutes: 60
  };

  constructor(changeDetectionEngine: ChangeDetectionEngine, database: BiasScoringDatabase) {
    this.changeDetectionEngine = changeDetectionEngine;
    this.db = database;
    this.initializeDefaultJobs();
    this.initializeEventCalendar();
  }

  /**
   * Start the update scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('[UPDATE_SCHEDULER] Already running');
      return;
    }

    this.isRunning = true;
    console.log('[UPDATE_SCHEDULER] ✅ Starting update scheduler');

    // Run scheduler every minute to check for due jobs
    this.intervalId = setInterval(() => {
      this.processScheduledJobs().catch(console.error);
      this.processEventTriggers().catch(console.error);
    }, 60 * 1000); // Check every minute

    // Initial run
    this.processScheduledJobs().catch(console.error);
  }

  /**
   * Stop the update scheduler
   */
  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('[UPDATE_SCHEDULER] ⏹️ Stopped update scheduler');
  }

  /**
   * Add a scheduled event (earnings release, economic data, etc.)
   */
  addScheduledEvent(event: ScheduledEvent): void {
    this.eventCalendar.set(event.id, event);
    console.log(`[UPDATE_SCHEDULER] Added scheduled event: ${event.description} at ${event.scheduledTime}`);
  }

  /**
   * Trigger immediate update for specific asset and data type
   */
  async triggerImmediateUpdate(asset: string, dataType: string, reason: string = 'Manual trigger'): Promise<ChangeDetectionResult | null> {
    try {
      console.log(`[UPDATE_SCHEDULER] 🚀 Triggering immediate update for ${asset} - ${dataType} (${reason})`);

      // Check rate limits
      if (!this.checkRateLimit(asset)) {
        console.log(`[UPDATE_SCHEDULER] ⚠️ Rate limit exceeded for ${asset}, skipping update`);
        return null;
      }

      // Create data source configuration
      const dataSource: DataSource = {
        name: `${asset}_${dataType}_source`,
        url: this.getDataSourceUrl(asset, dataType),
        asset: asset,
        dataType: dataType,
        extractionMethod: 'api'
      };

      // Fetch current data (this would be replaced with actual API calls)
      const currentData = await this.fetchCurrentData(dataSource);

      // Detect changes
      const result = await this.changeDetectionEngine.detectChanges(dataSource, currentData);

      // Update rate limiter
      this.updateRateLimit(asset);

      return result;

    } catch (error) {
      console.error(`[UPDATE_SCHEDULER] ❌ Error in immediate update for ${asset}:`, error);
      return null;
    }
  }

  /**
   * Process scheduled jobs
   */
  private async processScheduledJobs(): Promise<void> {
    const now = new Date();
    const dueJobs = Array.from(this.scheduledJobs.values())
      .filter(job => !job.isRunning && new Date(job.nextRun) <= now)
      .sort((a, b) => {
        // Sort by priority (HIGH > MEDIUM > LOW) then by scheduled time
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime();
      });

    for (const job of dueJobs) {
      await this.executeJob(job);
    }
  }

  /**
   * Process event triggers
   */
  private async processEventTriggers(): Promise<void> {
    const now = new Date();
    const triggeredEvents = Array.from(this.eventCalendar.values())
      .filter(event => {
        if (event.triggered) return false;
        const eventTime = new Date(event.scheduledTime);
        const bufferTime = new Date(eventTime.getTime() + event.bufferMinutes * 60 * 1000);
        return now >= bufferTime;
      });

    for (const event of triggeredEvents) {
      await this.processEventTrigger(event);
    }
  }

  /**
   * Execute a scheduled job
   */
  private async executeJob(job: UpdateJob): Promise<void> {
    try {
      job.isRunning = true;
      job.lastRun = new Date().toISOString();

      console.log(`[UPDATE_SCHEDULER] 🔄 Executing job: ${job.asset} - ${job.dataType}`);

      const result = await this.triggerImmediateUpdate(job.asset, job.dataType, 'Scheduled update');

      if (result && result.hasChanges) {
        console.log(`[UPDATE_SCHEDULER] ✅ Job completed with changes: ${job.asset} - ${job.dataType}`);
        job.retryCount = 0; // Reset retry count on success
      } else {
        console.log(`[UPDATE_SCHEDULER] ℹ️ Job completed, no changes: ${job.asset} - ${job.dataType}`);
      }

      // Schedule next run
      job.nextRun = new Date(Date.now() + job.intervalMinutes * 60 * 1000).toISOString();

    } catch (error) {
      console.error(`[UPDATE_SCHEDULER] ❌ Job failed: ${job.asset} - ${job.dataType}:`, error);
      
      job.retryCount++;
      if (job.retryCount < job.maxRetries) {
        // Exponential backoff for retries
        const backoffMinutes = Math.min(5 * Math.pow(2, job.retryCount), 60);
        job.nextRun = new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString();
        console.log(`[UPDATE_SCHEDULER] 🔄 Scheduling retry ${job.retryCount}/${job.maxRetries} in ${backoffMinutes} minutes`);
      } else {
        // Max retries reached, schedule normal next run
        job.nextRun = new Date(Date.now() + job.intervalMinutes * 60 * 1000).toISOString();
        job.retryCount = 0;
        console.log(`[UPDATE_SCHEDULER] ⚠️ Max retries reached, scheduling normal next run`);
      }
    } finally {
      job.isRunning = false;
    }
  }

  /**
   * Process event trigger
   */
  private async processEventTrigger(event: ScheduledEvent): Promise<void> {
    try {
      console.log(`[UPDATE_SCHEDULER] 📅 Processing event trigger: ${event.description}`);

      event.triggered = true;
      
      // Determine data type based on event type
      const dataType = this.getDataTypeFromEventType(event.eventType);
      
      const result = await this.triggerImmediateUpdate(event.asset, dataType, `Event: ${event.description}`);

      if (result && result.hasChanges) {
        console.log(`[UPDATE_SCHEDULER] ✅ Event trigger completed with changes: ${event.description}`);
      } else {
        console.log(`[UPDATE_SCHEDULER] ℹ️ Event trigger completed, no changes: ${event.description}`);
      }

    } catch (error) {
      console.error(`[UPDATE_SCHEDULER] ❌ Event trigger failed: ${event.description}:`, error);
    }
  }

  /**
   * Initialize default scheduled jobs for all assets
   */
  private initializeDefaultJobs(): void {
    const assets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
    const dataTypes = ['earnings', 'revenue', 'debt_ratio', 'economic_indicator'];

    for (const asset of assets) {
      for (const dataType of dataTypes) {
        const jobId = `${asset}_${dataType}`;
        const intervalMinutes = this.DEFAULT_INTERVALS[dataType as keyof typeof this.DEFAULT_INTERVALS] || 240;
        
        const job: UpdateJob = {
          id: jobId,
          asset: asset,
          dataType: dataType,
          priority: dataType === 'economic_indicator' ? 'HIGH' : 'MEDIUM',
          scheduledTime: new Date().toISOString(),
          nextRun: new Date(Date.now() + Math.random() * 60 * 60 * 1000).toISOString(), // Random initial delay
          intervalMinutes: intervalMinutes,
          isRunning: false,
          retryCount: 0,
          maxRetries: 3
        };

        this.scheduledJobs.set(jobId, job);
      }
    }

    console.log(`[UPDATE_SCHEDULER] Initialized ${this.scheduledJobs.size} scheduled jobs`);
  }

  /**
   * Initialize event calendar with known economic events
   */
  private initializeEventCalendar(): void {
    // This would be populated with real economic calendar data
    // For now, adding some example events
    const now = new Date();
    
    const events: ScheduledEvent[] = [
      {
        id: 'fed_meeting_' + now.getTime(),
        asset: 'USD',
        eventType: 'central_bank',
        scheduledTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        description: 'Federal Reserve Meeting',
        priority: 'HIGH',
        triggered: false,
        bufferMinutes: 5
      }
    ];

    for (const event of events) {
      this.eventCalendar.set(event.id, event);
    }

    console.log(`[UPDATE_SCHEDULER] Initialized ${events.length} calendar events`);
  }

  /**
   * Check rate limits for an asset
   */
  private checkRateLimit(asset: string): boolean {
    // Simplified rate limiting - in production this would be more sophisticated
    return true;
  }

  /**
   * Update rate limiter after request
   */
  private updateRateLimit(asset: string): void {
    // Update rate limiting counters
  }

  /**
   * Get data source URL for asset and data type
   */
  private getDataSourceUrl(asset: string, dataType: string): string {
    // This would return actual API URLs based on asset and data type
    return `https://api.example.com/${asset}/${dataType}`;
  }

  /**
   * Fetch current data from source (placeholder)
   */
  private async fetchCurrentData(dataSource: DataSource): Promise<any[]> {
    // This would implement actual data fetching from APIs
    // For now, return mock data
    return [
      {
        value: Math.random() * 100,
        timestamp: new Date().toISOString(),
        id: `mock_${Date.now()}`
      }
    ];
  }

  /**
   * Get data type from event type
   */
  private getDataTypeFromEventType(eventType: string): string {
    switch (eventType) {
      case 'earnings': return 'earnings';
      case 'economic_data': return 'economic_indicator';
      case 'central_bank': return 'economic_indicator';
      case 'guidance': return 'guidance';
      default: return 'economic_indicator';
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    isRunning: boolean;
    totalJobs: number;
    runningJobs: number;
    nextJobTime: string | null;
    eventCount: number;
  } {
    const runningJobs = Array.from(this.scheduledJobs.values()).filter(job => job.isRunning).length;
    const nextJob = Array.from(this.scheduledJobs.values())
      .filter(job => !job.isRunning)
      .sort((a, b) => new Date(a.nextRun).getTime() - new Date(b.nextRun).getTime())[0];

    return {
      isRunning: this.isRunning,
      totalJobs: this.scheduledJobs.size,
      runningJobs: runningJobs,
      nextJobTime: nextJob?.nextRun || null,
      eventCount: this.eventCalendar.size
    };
  }
}

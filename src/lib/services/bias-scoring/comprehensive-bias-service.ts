/**
 * Comprehensive Bias Service - Main integration service for fundamental bias scoring
 * Coordinates change detection, scheduling, and scoring engines
 */

import { BiasScoringDatabase, type BiasScore, type FundamentalDataSnapshot } from '../database/bias-scoring-database';
import { ChangeDetectionEngine, type DataSource, type ChangeDetectionResult } from './change-detection-engine';
import { UpdateScheduler, type ScheduledEvent } from './update-scheduler';
import { BiasScoringEngine, type ScoringResult, type FundamentalFactor } from './bias-scoring-engine';

export interface BiasServiceStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  totalAssets: number;
  assetsWithScores: number;
  schedulerStatus: any;
  databaseHealth: 'HEALTHY' | 'WARNING' | 'ERROR';
  averageConfidence: number;
  systemLoad: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AssetBiasOverview {
  asset: string;
  currentBias: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  score: number;
  confidence: number;
  lastUpdated: string;
  bullishFactors: string[];
  bearishFactors: string[];
  dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
  changesSinceLastUpdate: number;
}

export class ComprehensiveBiasService {
  private db: BiasScoringDatabase;
  private changeDetectionEngine: ChangeDetectionEngine;
  private updateScheduler: UpdateScheduler;
  private biasScoringEngine: BiasScoringEngine;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;

  constructor() {
    this.db = new BiasScoringDatabase();
    this.changeDetectionEngine = new ChangeDetectionEngine(this.db);
    this.updateScheduler = new UpdateScheduler(this.changeDetectionEngine, this.db);
    this.biasScoringEngine = new BiasScoringEngine(this.db);
  }

  /**
   * Initialize the bias scoring service
   */
  async initialize(): Promise<void> {
    try {
      console.log('[BIAS_SERVICE] 🚀 Initializing Comprehensive Bias Service...');

      // Initialize with some sample data for testing
      await this.seedSampleData();

      // Calculate initial scores for all assets
      await this.biasScoringEngine.recalculateAllScores();

      this.isInitialized = true;
      console.log('[BIAS_SERVICE] ✅ Bias service initialized successfully');

    } catch (error) {
      console.error('[BIAS_SERVICE] ❌ Error initializing bias service:', error);
      throw error;
    }
  }

  /**
   * Start the bias scoring service
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isRunning) {
      console.log('[BIAS_SERVICE] Service already running');
      return;
    }

    try {
      console.log('[BIAS_SERVICE] 🔄 Starting bias scoring service...');

      // Start the update scheduler
      this.updateScheduler.start();

      this.isRunning = true;
      console.log('[BIAS_SERVICE] ✅ Bias scoring service started');

    } catch (error) {
      console.error('[BIAS_SERVICE] ❌ Error starting bias service:', error);
      throw error;
    }
  }

  /**
   * Stop the bias scoring service
   */
  stop(): void {
    if (!this.isRunning) return;

    console.log('[BIAS_SERVICE] ⏹️ Stopping bias scoring service...');

    this.updateScheduler.stop();
    this.isRunning = false;

    console.log('[BIAS_SERVICE] ✅ Bias scoring service stopped');
  }

  /**
   * Get bias scores for all assets
   */
  async getAllBiasScores(): Promise<AssetBiasOverview[]> {
    try {
      const biasScores = await this.biasScoringEngine.getAllBiasScores();
      const overviews: AssetBiasOverview[] = [];

      for (const score of biasScores) {
        const overview = await this.createAssetOverview(score);
        overviews.push(overview);
      }

      return overviews.sort((a, b) => a.asset.localeCompare(b.asset));

    } catch (error) {
      console.error('[BIAS_SERVICE] Error getting all bias scores:', error);
      return [];
    }
  }

  /**
   * Get bias score for specific asset
   */
  async getAssetBiasScore(asset: string): Promise<AssetBiasOverview | null> {
    try {
      const biasScore = await this.biasScoringEngine.getBiasScore(asset);
      if (!biasScore) return null;

      return await this.createAssetOverview(biasScore);

    } catch (error) {
      console.error(`[BIAS_SERVICE] Error getting bias score for ${asset}:`, error);
      return null;
    }
  }

  /**
   * Trigger immediate update for specific asset
   */
  async triggerAssetUpdate(asset: string, reason: string = 'Manual trigger'): Promise<ChangeDetectionResult[]> {
    try {
      console.log(`[BIAS_SERVICE] 🔄 Triggering update for ${asset} (${reason})`);

      const dataTypes = ['earnings', 'revenue', 'debt_ratio', 'economic_indicator'];
      const results: ChangeDetectionResult[] = [];

      for (const dataType of dataTypes) {
        const result = await this.updateScheduler.triggerImmediateUpdate(asset, dataType, reason);
        if (result) {
          results.push(result);
        }
      }

      // Recalculate bias score if any changes were detected
      const hasChanges = results.some(r => r.hasChanges);
      if (hasChanges) {
        await this.biasScoringEngine.calculateBiasScore(asset);
        console.log(`[BIAS_SERVICE] ✅ Updated bias score for ${asset} after detecting changes`);
      }

      return results;

    } catch (error) {
      console.error(`[BIAS_SERVICE] Error triggering update for ${asset}:`, error);
      return [];
    }
  }

  /**
   * Add scheduled event (earnings, economic data release, etc.)
   */
  addScheduledEvent(event: ScheduledEvent): void {
    this.updateScheduler.addScheduledEvent(event);
    console.log(`[BIAS_SERVICE] Added scheduled event: ${event.description}`);
  }

  /**
   * Get service status
   */
  getServiceStatus(): BiasServiceStatus {
    const schedulerStatus = this.updateScheduler.getStatus();
    const allScores = this.db.getAllLatestBiasScores();
    
    const averageConfidence = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score.confidence, 0) / allScores.length
      : 0;

    return {
      isRunning: this.isRunning,
      lastUpdate: allScores.length > 0 ? allScores[0].last_updated : null,
      totalAssets: 11, // USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, NZD, XAU, XAG
      assetsWithScores: allScores.length,
      schedulerStatus: schedulerStatus,
      databaseHealth: this.checkDatabaseHealth(),
      averageConfidence: averageConfidence,
      systemLoad: this.calculateSystemLoad(schedulerStatus)
    };
  }

  /**
   * Get fundamental factors configuration
   */
  getFundamentalFactors(): Map<string, FundamentalFactor> {
    return this.biasScoringEngine.getFundamentalFactors();
  }

  /**
   * Force recalculation of all bias scores
   */
  async recalculateAllScores(): Promise<ScoringResult[]> {
    console.log('[BIAS_SERVICE] 🔄 Force recalculating all bias scores...');
    return await this.biasScoringEngine.recalculateAllScores();
  }

  /**
   * Create asset overview from bias score
   */
  private async createAssetOverview(biasScore: BiasScore): Promise<AssetBiasOverview> {
    const fundamentalData = this.db.getLatestFundamentalData(biasScore.asset);
    const recentChanges = fundamentalData.filter(data => 
      data.change_detected && 
      new Date(data.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    ).length;

    const dataQuality = this.assessDataQuality(fundamentalData);

    return {
      asset: biasScore.asset,
      currentBias: biasScore.bias,
      score: biasScore.total_score,
      confidence: biasScore.confidence,
      lastUpdated: biasScore.last_updated,
      bullishFactors: JSON.parse(biasScore.bullish_factors),
      bearishFactors: JSON.parse(biasScore.bearish_factors),
      dataQuality: dataQuality,
      changesSinceLastUpdate: recentChanges
    };
  }

  /**
   * Assess data quality based on available fundamental data
   */
  private assessDataQuality(fundamentalData: FundamentalDataSnapshot[]): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (fundamentalData.length >= 8) return 'HIGH';
    if (fundamentalData.length >= 4) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Check database health
   */
  private checkDatabaseHealth(): 'HEALTHY' | 'WARNING' | 'ERROR' {
    try {
      const scores = this.db.getAllLatestBiasScores();
      if (scores.length >= 8) return 'HEALTHY';
      if (scores.length >= 4) return 'WARNING';
      return 'ERROR';
    } catch (error) {
      return 'ERROR';
    }
  }

  /**
   * Calculate system load based on scheduler status
   */
  private calculateSystemLoad(schedulerStatus: any): 'LOW' | 'MEDIUM' | 'HIGH' {
    const runningJobs = schedulerStatus.runningJobs || 0;
    if (runningJobs >= 5) return 'HIGH';
    if (runningJobs >= 2) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Seed sample data for testing
   */
  private async seedSampleData(): Promise<void> {
    const assets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
    const dataTypes = ['earnings', 'revenue', 'debt_ratio', 'economic_indicator'];
    const now = new Date().toISOString();

    console.log('[BIAS_SERVICE] 🌱 Seeding sample fundamental data...');

    for (const asset of assets) {
      for (const dataType of dataTypes) {
        const snapshot: FundamentalDataSnapshot = {
          asset: asset,
          data_type: dataType,
          value: this.generateSampleValue(dataType),
          previous_value: this.generateSampleValue(dataType),
          timestamp: now,
          source: 'SAMPLE_DATA',
          content_hash: `sample_${asset}_${dataType}_${Date.now()}`,
          last_updated: now,
          change_detected: Math.random() > 0.5
        };

        this.db.storeFundamentalSnapshot(snapshot);
      }
    }

    console.log('[BIAS_SERVICE] ✅ Sample data seeded successfully');
  }

  /**
   * Generate sample values for different data types
   */
  private generateSampleValue(dataType: string): number {
    switch (dataType) {
      case 'earnings':
        return Math.random() * 100 + 50; // 50-150
      case 'revenue':
        return Math.random() * 1000 + 500; // 500-1500
      case 'debt_ratio':
        return Math.random() * 1.5 + 0.2; // 0.2-1.7
      case 'economic_indicator':
        return Math.random() * 100; // 0-100
      default:
        return Math.random() * 100;
    }
  }

  /**
   * Close the service and cleanup resources
   */
  async close(): Promise<void> {
    this.stop();
    this.db.close();
    console.log('[BIAS_SERVICE] ✅ Service closed and resources cleaned up');
  }
}

/**
 * Advanced Economic Service - Main integration service
 * Coordinates all advanced economic data collection, analysis, and scoring
 */

import { UpdateScheduler } from './real-time/update-scheduler';
import { EconomicDataStore } from './database/economic-data-store';
import { EconomicScoringEngine } from './scoring/economic-scoring-engine';
import { RateCutCalculator } from './scoring/rate-cut-calculator';
import type { 
  AssetCode, 
  EconomicDataPoint, 
  COTData, 
  SentimentData,
  AssetScore,
  EconomicCalendarEvent,
  SystemHealth 
} from '$lib/types/advanced-economic';

interface ServiceStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  dataQuality: number;
  systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  activeAssets: AssetCode[];
  totalDataPoints: number;
}

export class AdvancedEconomicService {
  private static instance: AdvancedEconomicService | null = null;
  
  private updateScheduler: UpdateScheduler;
  private dataStore: EconomicDataStore;
  private scoringEngine: EconomicScoringEngine;
  private rateCutCalculator: RateCutCalculator;
  
  private isInitialized: boolean = false;
  private serviceStatus: ServiceStatus;

  private constructor() {
    this.updateScheduler = new UpdateScheduler();
    this.dataStore = new EconomicDataStore();
    this.scoringEngine = new EconomicScoringEngine();
    this.rateCutCalculator = new RateCutCalculator();
    
    this.serviceStatus = {
      isRunning: false,
      lastUpdate: null,
      dataQuality: 0,
      systemHealth: 'HEALTHY',
      activeAssets: [],
      totalDataPoints: 0
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): AdvancedEconomicService {
    if (!AdvancedEconomicService.instance) {
      AdvancedEconomicService.instance = new AdvancedEconomicService();
    }
    return AdvancedEconomicService.instance;
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[ADVANCED_ECONOMIC_SERVICE] Already initialized');
      return;
    }

    try {
      console.log('[ADVANCED_ECONOMIC_SERVICE] Initializing...');
      
      // Start the update scheduler
      await this.updateScheduler.start();
      
      // Update service status
      this.serviceStatus.isRunning = true;
      this.serviceStatus.lastUpdate = new Date().toISOString();
      
      this.isInitialized = true;
      console.log('[ADVANCED_ECONOMIC_SERVICE] Initialized successfully');
      
      // Update status periodically
      this.startStatusUpdates();
      
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Shutdown the service
   */
  async shutdown(): Promise<void> {
    if (!this.isInitialized) return;

    try {
      console.log('[ADVANCED_ECONOMIC_SERVICE] Shutting down...');
      
      await this.updateScheduler.stop();
      
      this.serviceStatus.isRunning = false;
      this.isInitialized = false;
      
      console.log('[ADVANCED_ECONOMIC_SERVICE] Shutdown complete');
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Shutdown error:', error);
    }
  }

  /**
   * Get economic data for assets
   */
  async getEconomicData(
    assets?: AssetCode[], 
    indicators?: string[], 
    maxAgeHours: number = 24
  ): Promise<EconomicDataPoint[]> {
    try {
      return await this.dataStore.getEconomicData(assets, indicators, maxAgeHours);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting economic data:', error);
      return [];
    }
  }

  /**
   * Get asset scores
   */
  async getAssetScores(assets?: AssetCode[]): Promise<AssetScore[]> {
    try {
      return await this.dataStore.getAssetScores(assets);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting asset scores:', error);
      return [];
    }
  }

  /**
   * Get rate cut probabilities
   */
  async getRateCutProbabilities(assets?: AssetCode[]): Promise<any[]> {
    try {
      // Get economic data grouped by asset
      const economicData = await this.dataStore.getEconomicData(assets);
      const economicDataMap = new Map<AssetCode, EconomicDataPoint[]>();
      
      economicData.forEach(dataPoint => {
        if (!economicDataMap.has(dataPoint.asset)) {
          economicDataMap.set(dataPoint.asset, []);
        }
        economicDataMap.get(dataPoint.asset)!.push(dataPoint);
      });

      // Calculate probabilities
      const allProbabilities = this.rateCutCalculator.calculateAllRateCutProbabilities(economicDataMap);
      
      // Filter by requested assets if specified
      return assets ? allProbabilities.filter(p => assets.includes(p.asset)) : allProbabilities;
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting rate cut probabilities:', error);
      return [];
    }
  }

  /**
   * Get COT data
   */
  async getCOTData(assets?: AssetCode[]): Promise<COTData[]> {
    try {
      return await this.dataStore.getCOTData(assets);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting COT data:', error);
      return [];
    }
  }

  /**
   * Get sentiment data
   */
  async getSentimentData(assets?: AssetCode[]): Promise<SentimentData[]> {
    try {
      return await this.dataStore.getSentimentData(assets);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting sentiment data:', error);
      return [];
    }
  }

  /**
   * Get economic calendar events
   */
  async getCalendarEvents(
    assets?: AssetCode[], 
    startDate?: string, 
    endDate?: string
  ): Promise<EconomicCalendarEvent[]> {
    try {
      return await this.dataStore.getCalendarEvents(assets, startDate, endDate);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting calendar events:', error);
      return [];
    }
  }

  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(assets?: AssetCode[]): Promise<{
    assetScores: AssetScore[];
    rateCutProbabilities: any[];
    economicData: EconomicDataPoint[];
    cotData: COTData[];
    sentimentData: SentimentData[];
    calendarEvents: EconomicCalendarEvent[];
    systemHealth: SystemHealth | null;
    lastUpdated: string;
  }> {
    try {
      const [
        assetScores,
        rateCutProbabilities,
        economicData,
        cotData,
        sentimentData,
        calendarEvents,
        systemHealth
      ] = await Promise.all([
        this.getAssetScores(assets),
        this.getRateCutProbabilities(assets),
        this.getEconomicData(assets),
        this.getCOTData(assets),
        this.getSentimentData(assets),
        this.getCalendarEvents(assets),
        this.dataStore.getSystemHealth()
      ]);

      return {
        assetScores,
        rateCutProbabilities,
        economicData,
        cotData,
        sentimentData,
        calendarEvents,
        systemHealth,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting dashboard data:', error);
      throw error;
    }
  }

  /**
   * Manually trigger data update
   */
  async triggerUpdate(taskName?: string): Promise<void> {
    try {
      if (taskName) {
        await this.updateScheduler.triggerTask(taskName);
      } else {
        // Trigger all critical updates
        await Promise.all([
          this.updateScheduler.triggerTask('MARKET_DATA_UPDATE'),
          this.updateScheduler.triggerTask('SCORE_CALCULATION'),
          this.updateScheduler.triggerTask('RATE_CUT_ANALYSIS')
        ]);
      }
      
      this.serviceStatus.lastUpdate = new Date().toISOString();
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error triggering update:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getServiceStatus(): ServiceStatus {
    return { ...this.serviceStatus };
  }

  /**
   * Get system health
   */
  async getSystemHealth(): Promise<SystemHealth | null> {
    try {
      return await this.dataStore.getSystemHealth();
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting system health:', error);
      return null;
    }
  }

  /**
   * Get update schedules status
   */
  getUpdateSchedules(): any[] {
    return this.updateScheduler.getScheduleStatus();
  }

  /**
   * Enable/disable specific update schedule
   */
  setScheduleEnabled(taskName: string, enabled: boolean): void {
    this.updateScheduler.setScheduleEnabled(taskName, enabled);
  }

  /**
   * Get detailed score explanation for an asset
   */
  async getScoreExplanation(asset: AssetCode): Promise<string | null> {
    try {
      const scores = await this.getAssetScores([asset]);
      if (scores.length === 0) return null;
      
      return this.scoringEngine.getScoreExplanation(scores[0]);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting score explanation:', error);
      return null;
    }
  }

  /**
   * Get rate cut summary
   */
  async getRateCutSummary(): Promise<any> {
    try {
      const probabilities = await this.getRateCutProbabilities();
      return this.rateCutCalculator.getRateCutSummary(probabilities);
    } catch (error) {
      console.error('[ADVANCED_ECONOMIC_SERVICE] Error getting rate cut summary:', error);
      return {
        most_likely_cuts: [],
        most_likely_hikes: [],
        neutral_stance: []
      };
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return this.dataStore.getCacheStats();
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.dataStore.clearCache();
  }

  private startStatusUpdates(): void {
    // Update service status every 5 minutes
    setInterval(async () => {
      try {
        const systemHealth = await this.getSystemHealth();
        const economicData = await this.getEconomicData();
        
        this.serviceStatus.systemHealth = systemHealth?.system_status || 'CRITICAL';
        this.serviceStatus.totalDataPoints = economicData.length;
        this.serviceStatus.activeAssets = [...new Set(economicData.map(dp => dp.asset))];
        
        // Calculate data quality based on freshness and validation
        const validData = economicData.filter(dp => dp.validation_passed);
        this.serviceStatus.dataQuality = economicData.length > 0 ? validData.length / economicData.length : 0;
        
      } catch (error) {
        console.error('[ADVANCED_ECONOMIC_SERVICE] Error updating status:', error);
        this.serviceStatus.systemHealth = 'CRITICAL';
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Check if service is ready
   */
  isReady(): boolean {
    return this.isInitialized && this.serviceStatus.isRunning;
  }

  /**
   * Get available assets
   */
  getAvailableAssets(): AssetCode[] {
    return ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
  }

  /**
   * Get supported indicators
   */
  getSupportedIndicators(): string[] {
    return [
      'UNEMPLOYMENT',
      'INFLATION_CPI',
      'INFLATION_PPI',
      'GDP_GROWTH',
      'INTEREST_RATE',
      'PMI_MANUFACTURING',
      'PMI_SERVICES',
      'RETAIL_SALES',
      'INDUSTRIAL_PRODUCTION',
      'CONSUMER_CONFIDENCE',
      'TRADE_BALANCE',
      'CURRENT_ACCOUNT',
      'GOVERNMENT_DEBT',
      'CURRENCY_RATE',
      'BOND_YIELD',
      'PRECIOUS_METAL_PRICE',
      'COT_COMMERCIAL',
      'COT_NON_COMMERCIAL',
      'COT_RETAIL',
      'SENTIMENT_RETAIL',
      'SENTIMENT_INSTITUTIONAL',
      'RATE_CUT_PROBABILITY'
    ];
  }
}

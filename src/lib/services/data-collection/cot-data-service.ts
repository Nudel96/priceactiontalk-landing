/**
 * COT Data Service - Integration layer for CFTC COT data
 * Handles caching, historical data, and integration with existing data validation framework
 */

import { CFTCCOTScraper, type COTDataPoint } from './cftc-cot-scraper';
import { getDataFreshnessMonitor } from '$lib/services/data-validation/data-freshness-monitor';

export interface COTAnalysis {
  asset: string;
  current_sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  commercial_bias: 'LONG' | 'SHORT' | 'NEUTRAL';
  noncommercial_bias: 'LONG' | 'SHORT' | 'NEUTRAL';
  contrarian_signal: 'BUY' | 'SELL' | 'HOLD';
  strength_score: number; // 0-100
  last_updated: string;
}

export interface COTHistoricalData {
  asset: string;
  data_points: COTDataPoint[];
  trend_analysis: {
    commercial_trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    noncommercial_trend: 'INCREASING' | 'DECREASING' | 'STABLE';
    weeks_analyzed: number;
  };
}

export class COTDataService {
  private scraper: CFTCCOTScraper;
  private cache: Map<string, { data: COTDataPoint; timestamp: number }> = new Map();
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours (COT data is weekly)
  private monitor = getDataFreshnessMonitor();

  constructor() {
    this.scraper = new CFTCCOTScraper();
    console.log('[COT_SERVICE] COT Data Service initialized');
  }

  /**
   * Get current COT data for all assets
   */
  async getAllCOTData(useCache: boolean = true): Promise<COTDataPoint[]> {
    try {
      console.log('[COT_SERVICE] Fetching COT data for all assets...');
      
      if (useCache) {
        const cachedData = this.getCachedData();
        if (cachedData.length > 0) {
          console.log(`[COT_SERVICE] Using cached COT data (${cachedData.length} assets)`);
          return cachedData;
        }
      }

      const freshData = await this.scraper.fetchAllCOTData();
      
      // Cache the fresh data
      freshData.forEach(data => {
        this.cache.set(data.asset, {
          data,
          timestamp: Date.now()
        });
      });

      // Validate data with our existing framework
      this.validateCOTData(freshData);

      console.log(`[COT_SERVICE] ✅ Fresh COT data retrieved and cached (${freshData.length} assets)`);
      return freshData;

    } catch (error) {
      console.error('[COT_SERVICE] Error fetching COT data:', error);
      
      // Return cached data as fallback
      const cachedData = this.getCachedData();
      if (cachedData.length > 0) {
        console.log('[COT_SERVICE] Using cached data as fallback');
        return cachedData;
      }
      
      throw error;
    }
  }

  /**
   * Get COT data for a specific asset
   */
  async getCOTDataForAsset(asset: string, useCache: boolean = true): Promise<COTDataPoint | null> {
    try {
      if (useCache) {
        const cached = this.cache.get(asset);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION_MS) {
          return cached.data;
        }
      }

      const data = await this.scraper.getCOTDataForAsset(asset);
      
      if (data) {
        // Cache the data
        this.cache.set(asset, {
          data,
          timestamp: Date.now()
        });

        // Validate with existing framework
        this.monitor.validateData(
          'CFTC_SOCRATA',
          asset,
          data.open_interest,
          data.last_updated
        );
      }

      return data;

    } catch (error) {
      console.error(`[COT_SERVICE] Error fetching COT data for ${asset}:`, error);
      
      // Return cached data as fallback
      const cached = this.cache.get(asset);
      if (cached) {
        console.log(`[COT_SERVICE] Using cached data for ${asset} as fallback`);
        return cached.data;
      }
      
      return null;
    }
  }

  /**
   * Analyze COT data to generate trading signals
   */
  analyzeCOTData(data: COTDataPoint): COTAnalysis {
    // Calculate bias based on net positions
    const commercial_bias = this.calculateBias(data.commercial_net, data.open_interest);
    const noncommercial_bias = this.calculateBias(data.noncommercial_net, data.open_interest);

    // Generate contrarian signal (opposite of non-commercial bias)
    let contrarian_signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (noncommercial_bias === 'LONG' && data.noncommercial_pct > 60) {
      contrarian_signal = 'SELL'; // Non-commercials are heavily long, contrarian sell
    } else if (noncommercial_bias === 'SHORT' && data.noncommercial_pct > 60) {
      contrarian_signal = 'BUY'; // Non-commercials are heavily short, contrarian buy
    }

    // Calculate overall sentiment
    let current_sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
    if (commercial_bias === 'LONG' && noncommercial_bias === 'LONG') {
      current_sentiment = 'BULLISH';
    } else if (commercial_bias === 'SHORT' && noncommercial_bias === 'SHORT') {
      current_sentiment = 'BEARISH';
    }

    // Calculate strength score (0-100)
    const strength_score = Math.min(100, Math.max(0, 
      (data.commercial_pct + data.noncommercial_pct) / 2
    ));

    return {
      asset: data.asset,
      current_sentiment,
      commercial_bias,
      noncommercial_bias,
      contrarian_signal,
      strength_score,
      last_updated: data.last_updated
    };
  }

  /**
   * Calculate bias based on net position and open interest
   */
  private calculateBias(net_position: number, open_interest: number): 'LONG' | 'SHORT' | 'NEUTRAL' {
    if (open_interest === 0) return 'NEUTRAL';
    
    const percentage = (net_position / open_interest) * 100;
    
    if (percentage > 10) return 'LONG';
    if (percentage < -10) return 'SHORT';
    return 'NEUTRAL';
  }

  /**
   * Get cached data for all assets
   */
  private getCachedData(): COTDataPoint[] {
    const now = Date.now();
    const validCachedData: COTDataPoint[] = [];

    for (const [asset, cached] of this.cache.entries()) {
      if ((now - cached.timestamp) < this.CACHE_DURATION_MS) {
        validCachedData.push(cached.data);
      } else {
        // Remove expired cache
        this.cache.delete(asset);
      }
    }

    return validCachedData;
  }

  /**
   * Validate COT data using existing framework
   */
  private validateCOTData(data: COTDataPoint[]): void {
    data.forEach(cotData => {
      try {
        // Validate with our existing data freshness monitor
        const validation = this.monitor.validateData(
          'CFTC_SOCRATA',
          cotData.asset,
          cotData.open_interest,
          cotData.last_updated
        );

        if (!validation.isAccurate) {
          console.warn(`[COT_SERVICE] ⚠️ COT data validation failed for ${cotData.asset}:`, validation.validationErrors);
        }

        // Additional COT-specific validation
        if (!cotData.validation_passed) {
          console.warn(`[COT_SERVICE] ⚠️ COT internal validation failed for ${cotData.asset}`);
        }

        // Check data freshness (COT data is weekly, so allow up to 10 days)
        const dataAge = Date.now() - new Date(cotData.report_date).getTime();
        const maxAge = 10 * 24 * 60 * 60 * 1000; // 10 days
        
        if (dataAge > maxAge) {
          console.warn(`[COT_SERVICE] ⚠️ COT data for ${cotData.asset} is ${Math.floor(dataAge / (24 * 60 * 60 * 1000))} days old`);
        }

      } catch (error) {
        console.error(`[COT_SERVICE] Error validating COT data for ${cotData.asset}:`, error);
      }
    });
  }

  /**
   * Get COT analysis for all assets
   */
  async getAllCOTAnalysis(): Promise<COTAnalysis[]> {
    try {
      const cotData = await this.getAllCOTData();
      return cotData.map(data => this.analyzeCOTData(data));
    } catch (error) {
      console.error('[COT_SERVICE] Error generating COT analysis:', error);
      return [];
    }
  }

  /**
   * Get supported assets
   */
  getSupportedAssets(): string[] {
    return this.scraper.getSupportedAssets();
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[COT_SERVICE] Cache cleared');
  }

  /**
   * Get cache status
   */
  getCacheStatus(): { asset: string; age_hours: number; valid: boolean }[] {
    const now = Date.now();
    const status: { asset: string; age_hours: number; valid: boolean }[] = [];

    for (const [asset, cached] of this.cache.entries()) {
      const age_hours = (now - cached.timestamp) / (60 * 60 * 1000);
      const valid = age_hours < (this.CACHE_DURATION_MS / (60 * 60 * 1000));
      
      status.push({ asset, age_hours, valid });
    }

    return status;
  }
}

// Singleton instance
let instance: COTDataService | null = null;

export function getCOTDataService(): COTDataService {
  if (!instance) {
    instance = new COTDataService();
  }
  return instance;
}

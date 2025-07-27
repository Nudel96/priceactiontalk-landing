/**
 * Multi-Source Retail Sentiment Aggregation
 * Comprehensive sentiment data collection from 5+ sources with weighted averaging
 */

import { getAntiDetectionFramework } from '../scraping-security/anti-detection-framework';
import { getStealthBrowser } from '../scraping-security/stealth-browser';

export interface SentimentDataPoint {
  source: string;
  asset: string;
  long_percentage: number;
  short_percentage: number;
  net_sentiment: number; // long - short
  confidence_score: number; // 0-100
  sample_size?: number;
  timestamp: string;
  reliability_score: number; // Historical accuracy score
}

export interface AggregatedSentiment {
  asset: string;
  weighted_long_percentage: number;
  weighted_short_percentage: number;
  weighted_net_sentiment: number;
  confidence_interval: { lower: number; upper: number };
  contrarian_signal: 'BUY' | 'SELL' | 'HOLD';
  signal_strength: number; // 0-100
  sources_count: number;
  last_updated: string;
  individual_sources: SentimentDataPoint[];
}

export interface SentimentSource {
  name: string;
  url: string;
  reliability_weight: number; // 0-1
  rate_limit_ms: number;
  requires_auth: boolean;
  extraction_method: 'api' | 'scraping' | 'jsonp';
  last_success: number;
  failure_count: number;
  is_active: boolean;
}

export class SentimentAggregator {
  private antiDetection = getAntiDetectionFramework();
  private stealthBrowser = getStealthBrowser();
  
  // Sentiment data sources configuration
  private readonly SENTIMENT_SOURCES: SentimentSource[] = [
    {
      name: 'OANDA_FOREXLABS',
      url: 'https://www.oanda.com/forex-trading/analysis/currency-correlation',
      reliability_weight: 0.9,
      rate_limit_ms: 86400000, // 24 hours (1000 calls/day limit)
      requires_auth: true,
      extraction_method: 'api',
      last_success: 0,
      failure_count: 0,
      is_active: true
    },
    {
      name: 'MYFXBOOK_COMMUNITY',
      url: 'https://www.myfxbook.com/community/outlook',
      reliability_weight: 0.8,
      rate_limit_ms: 30000, // 30 seconds
      requires_auth: false,
      extraction_method: 'scraping',
      last_success: 0,
      failure_count: 0,
      is_active: true
    },
    {
      name: 'DUKASCOPY_SWFX',
      url: 'https://www.dukascopy.com/swiss/english/marketwatch/sentiment/',
      reliability_weight: 0.85,
      rate_limit_ms: 60000, // 1 minute
      requires_auth: false,
      extraction_method: 'jsonp',
      last_success: 0,
      failure_count: 0,
      is_active: true
    },
    {
      name: 'IG_DAILYFX',
      url: 'https://www.dailyfx.com/sentiment',
      reliability_weight: 0.75,
      rate_limit_ms: 120000, // 2 minutes
      requires_auth: false,
      extraction_method: 'scraping',
      last_success: 0,
      failure_count: 0,
      is_active: true
    },
    {
      name: 'FXBLUE_SENTIMENT',
      url: 'https://www.fxblue.com/market-data/sentiment',
      reliability_weight: 0.7,
      rate_limit_ms: 180000, // 3 minutes
      requires_auth: false,
      extraction_method: 'scraping',
      last_success: 0,
      failure_count: 0,
      is_active: true
    }
  ];

  // Asset mapping for different sources
  private readonly ASSET_MAPPINGS = {
    'EUR/USD': ['EURUSD', 'EUR_USD', 'EUR/USD', 'eur-usd'],
    'GBP/USD': ['GBPUSD', 'GBP_USD', 'GBP/USD', 'gbp-usd'],
    'USD/JPY': ['USDJPY', 'USD_JPY', 'USD/JPY', 'usd-jpy'],
    'AUD/USD': ['AUDUSD', 'AUD_USD', 'AUD/USD', 'aud-usd'],
    'USD/CAD': ['USDCAD', 'USD_CAD', 'USD/CAD', 'usd-cad'],
    'USD/CHF': ['USDCHF', 'USD_CHF', 'USD/CHF', 'usd-chf'],
    'NZD/USD': ['NZDUSD', 'NZD_USD', 'NZD/USD', 'nzd-usd'],
    'XAU/USD': ['XAUUSD', 'XAU_USD', 'GOLD', 'gold'],
    'XAG/USD': ['XAGUSD', 'XAG_USD', 'SILVER', 'silver']
  };

  constructor() {
    console.log('[SENTIMENT_AGGREGATOR] Initializing Multi-Source Sentiment Aggregator');
  }

  /**
   * Collect sentiment data from all sources for all assets
   */
  async collectAllSentimentData(): Promise<Map<string, AggregatedSentiment>> {
    const results = new Map<string, AggregatedSentiment>();
    const assets = Object.keys(this.ASSET_MAPPINGS);

    console.log('[SENTIMENT_AGGREGATOR] Starting sentiment collection for all assets...');

    for (const asset of assets) {
      try {
        const sentimentData = await this.collectSentimentForAsset(asset);
        if (sentimentData) {
          results.set(asset, sentimentData);
          console.log(`[SENTIMENT_AGGREGATOR] ✅ Collected sentiment for ${asset}`);
        }
      } catch (error) {
        console.error(`[SENTIMENT_AGGREGATOR] ❌ Error collecting sentiment for ${asset}:`, error);
      }
    }

    console.log(`[SENTIMENT_AGGREGATOR] Completed sentiment collection. ${results.size}/${assets.length} assets processed`);
    return results;
  }

  /**
   * Collect and aggregate sentiment data for a specific asset
   */
  async collectSentimentForAsset(asset: string): Promise<AggregatedSentiment | null> {
    const sentimentPoints: SentimentDataPoint[] = [];

    for (const source of this.SENTIMENT_SOURCES) {
      if (!source.is_active || !this.canFetchFromSource(source)) {
        continue;
      }

      try {
        const data = await this.fetchSentimentFromSource(source, asset);
        if (data) {
          sentimentPoints.push(data);
          source.last_success = Date.now();
          source.failure_count = 0;
        }
      } catch (error) {
        console.error(`[SENTIMENT_AGGREGATOR] Error fetching from ${source.name}:`, error);
        source.failure_count++;
        
        if (source.failure_count >= 3) {
          source.is_active = false;
          console.warn(`[SENTIMENT_AGGREGATOR] Source ${source.name} marked as inactive`);
        }
      }

      // Rate limiting
      await this.delay(source.rate_limit_ms);
    }

    if (sentimentPoints.length === 0) {
      console.warn(`[SENTIMENT_AGGREGATOR] No sentiment data collected for ${asset}`);
      return null;
    }

    return this.aggregateSentimentData(asset, sentimentPoints);
  }

  /**
   * Fetch sentiment data from a specific source
   */
  private async fetchSentimentFromSource(source: SentimentSource, asset: string): Promise<SentimentDataPoint | null> {
    switch (source.extraction_method) {
      case 'api':
        return await this.fetchSentimentViaAPI(source, asset);
      case 'scraping':
        return await this.fetchSentimentViaScraping(source, asset);
      case 'jsonp':
        return await this.fetchSentimentViaJSONP(source, asset);
      default:
        throw new Error(`Unknown extraction method: ${source.extraction_method}`);
    }
  }

  /**
   * Fetch sentiment via API (OANDA ForexLabs)
   */
  private async fetchSentimentViaAPI(source: SentimentSource, asset: string): Promise<SentimentDataPoint | null> {
    // Mock implementation - in production, use actual OANDA API
    console.log(`[SENTIMENT_AGGREGATOR] Fetching ${asset} sentiment from ${source.name} API`);
    
    // Simulate API call delay
    await this.delay(1000 + Math.random() * 2000);
    
    // Mock sentiment data
    const longPercentage = 45 + Math.random() * 20; // 45-65%
    const shortPercentage = 100 - longPercentage;
    
    return {
      source: source.name,
      asset,
      long_percentage: longPercentage,
      short_percentage: shortPercentage,
      net_sentiment: longPercentage - shortPercentage,
      confidence_score: 85 + Math.random() * 10, // 85-95%
      sample_size: 1000 + Math.floor(Math.random() * 5000),
      timestamp: new Date().toISOString(),
      reliability_score: source.reliability_weight * 100
    };
  }

  /**
   * Fetch sentiment via web scraping
   */
  private async fetchSentimentViaScraping(source: SentimentSource, asset: string): Promise<SentimentDataPoint | null> {
    console.log(`[SENTIMENT_AGGREGATOR] Scraping ${asset} sentiment from ${source.name}`);
    
    try {
      // Create stealth browser session
      const { page, session } = await this.stealthBrowser.createStealthBrowser();
      
      // Navigate to sentiment page
      await this.stealthBrowser.navigateWithBehavior(page, source.url, {
        waitTime: 2000,
        scrollBehavior: 'smooth'
      });

      // Extract sentiment data (mock implementation)
      const sentimentData = await this.stealthBrowser.extractData(page, () => {
        // Mock extraction logic - in production, implement actual DOM parsing
        const longPercentage = 40 + Math.random() * 30; // 40-70%
        return {
          long_percentage: longPercentage,
          short_percentage: 100 - longPercentage,
          sample_size: 500 + Math.floor(Math.random() * 2000)
        };
      });

      // Close browser session
      await this.stealthBrowser.closeBrowser(session.id);

      return {
        source: source.name,
        asset,
        long_percentage: sentimentData.long_percentage,
        short_percentage: sentimentData.short_percentage,
        net_sentiment: sentimentData.long_percentage - sentimentData.short_percentage,
        confidence_score: 70 + Math.random() * 15, // 70-85%
        sample_size: sentimentData.sample_size,
        timestamp: new Date().toISOString(),
        reliability_score: source.reliability_weight * 100
      };

    } catch (error) {
      console.error(`[SENTIMENT_AGGREGATOR] Scraping error for ${source.name}:`, error);
      return null;
    }
  }

  /**
   * Fetch sentiment via JSONP (Dukascopy)
   */
  private async fetchSentimentViaJSONP(source: SentimentSource, asset: string): Promise<SentimentDataPoint | null> {
    console.log(`[SENTIMENT_AGGREGATOR] Fetching ${asset} sentiment from ${source.name} JSONP`);
    
    // Mock JSONP implementation
    await this.delay(500 + Math.random() * 1000);
    
    const longPercentage = 35 + Math.random() * 40; // 35-75%
    const shortPercentage = 100 - longPercentage;
    
    return {
      source: source.name,
      asset,
      long_percentage: longPercentage,
      short_percentage: shortPercentage,
      net_sentiment: longPercentage - shortPercentage,
      confidence_score: 75 + Math.random() * 15, // 75-90%
      sample_size: 800 + Math.floor(Math.random() * 3000),
      timestamp: new Date().toISOString(),
      reliability_score: source.reliability_weight * 100
    };
  }

  /**
   * Aggregate sentiment data from multiple sources using weighted averaging
   */
  private aggregateSentimentData(asset: string, sentimentPoints: SentimentDataPoint[]): AggregatedSentiment {
    if (sentimentPoints.length === 0) {
      throw new Error('No sentiment data points to aggregate');
    }

    // Calculate weighted averages
    let totalWeight = 0;
    let weightedLongSum = 0;
    let weightedShortSum = 0;

    sentimentPoints.forEach(point => {
      const weight = point.reliability_score / 100;
      totalWeight += weight;
      weightedLongSum += point.long_percentage * weight;
      weightedShortSum += point.short_percentage * weight;
    });

    const weightedLongPercentage = weightedLongSum / totalWeight;
    const weightedShortPercentage = weightedShortSum / totalWeight;
    const weightedNetSentiment = weightedLongPercentage - weightedShortPercentage;

    // Calculate confidence interval
    const variance = sentimentPoints.reduce((sum, point) => {
      const diff = point.net_sentiment - weightedNetSentiment;
      return sum + (diff * diff);
    }, 0) / sentimentPoints.length;

    const standardError = Math.sqrt(variance / sentimentPoints.length);
    const confidenceInterval = {
      lower: weightedNetSentiment - (1.96 * standardError),
      upper: weightedNetSentiment + (1.96 * standardError)
    };

    // Generate contrarian signal
    let contrarian_signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (weightedLongPercentage > 75) {
      contrarian_signal = 'SELL'; // Too many longs, contrarian sell
    } else if (weightedLongPercentage < 25) {
      contrarian_signal = 'BUY'; // Too many shorts, contrarian buy
    }

    // Calculate signal strength
    const extremeness = Math.abs(weightedNetSentiment);
    const signal_strength = Math.min(100, extremeness * 2);

    return {
      asset,
      weighted_long_percentage: weightedLongPercentage,
      weighted_short_percentage: weightedShortPercentage,
      weighted_net_sentiment: weightedNetSentiment,
      confidence_interval: confidenceInterval,
      contrarian_signal,
      signal_strength,
      sources_count: sentimentPoints.length,
      last_updated: new Date().toISOString(),
      individual_sources: sentimentPoints
    };
  }

  /**
   * Check if we can fetch from a source (rate limiting)
   */
  private canFetchFromSource(source: SentimentSource): boolean {
    const now = Date.now();
    const timeSinceLastFetch = now - source.last_success;
    return timeSinceLastFetch >= source.rate_limit_ms;
  }

  /**
   * Get sentiment analysis for specific asset
   */
  async getSentimentForAsset(asset: string): Promise<AggregatedSentiment | null> {
    return await this.collectSentimentForAsset(asset);
  }

  /**
   * Get supported assets
   */
  getSupportedAssets(): string[] {
    return Object.keys(this.ASSET_MAPPINGS);
  }

  /**
   * Get source status
   */
  getSourceStatus(): { name: string; active: boolean; failures: number; last_success: string }[] {
    return this.SENTIMENT_SOURCES.map(source => ({
      name: source.name,
      active: source.is_active,
      failures: source.failure_count,
      last_success: source.last_success > 0 ? new Date(source.last_success).toISOString() : 'Never'
    }));
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance
let instance: SentimentAggregator | null = null;

export function getSentimentAggregator(): SentimentAggregator {
  if (!instance) {
    instance = new SentimentAggregator();
  }
  return instance;
}

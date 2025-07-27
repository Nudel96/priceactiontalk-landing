/**
 * FRED (Federal Reserve Economic Data) Scraper
 * Collects US economic indicators from the Federal Reserve Bank of St. Louis
 */

import { BaseScraper } from './base-scraper';
import type { 
  AssetCode, 
  EconomicDataPoint, 
  ScrapingResult, 
  IndicatorType,
  DataValidationRule 
} from '$lib/types/advanced-economic';

interface FREDSeriesConfig {
  seriesId: string;
  indicator: IndicatorType;
  asset: AssetCode;
  isPositiveIndicator: boolean;
  importanceWeight: number;
  unit: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
}

export class FREDScraper extends BaseScraper {
  private readonly API_KEY = 'demo'; // Replace with actual FRED API key
  private readonly BASE_URL = 'https://api.stlouisfed.org/fred';

  // FRED series mapping for US economic indicators
  private readonly SERIES_CONFIG: FREDSeriesConfig[] = [
    {
      seriesId: 'UNRATE',
      indicator: 'UNEMPLOYMENT',
      asset: 'USD',
      isPositiveIndicator: false, // Lower unemployment is better
      importanceWeight: 5,
      unit: '%',
      frequency: 'MONTHLY'
    },
    {
      seriesId: 'CPIAUCSL',
      indicator: 'INFLATION_CPI',
      asset: 'USD',
      isPositiveIndicator: false, // Depends on target, but generally lower is better
      importanceWeight: 5,
      unit: '% YoY',
      frequency: 'MONTHLY'
    },
    {
      seriesId: 'GDPC1',
      indicator: 'GDP_GROWTH',
      asset: 'USD',
      isPositiveIndicator: true,
      importanceWeight: 5,
      unit: '% QoQ',
      frequency: 'QUARTERLY'
    },
    {
      seriesId: 'FEDFUNDS',
      indicator: 'INTEREST_RATE',
      asset: 'USD',
      isPositiveIndicator: true, // Higher rates generally strengthen currency
      importanceWeight: 5,
      unit: '%',
      frequency: 'MONTHLY'
    },
    {
      seriesId: 'INDPRO',
      indicator: 'INDUSTRIAL_PRODUCTION',
      asset: 'USD',
      isPositiveIndicator: true,
      importanceWeight: 4,
      unit: 'Index',
      frequency: 'MONTHLY'
    },
    {
      seriesId: 'RSAFS',
      indicator: 'RETAIL_SALES',
      asset: 'USD',
      isPositiveIndicator: true,
      importanceWeight: 4,
      unit: '$ Millions',
      frequency: 'MONTHLY'
    },
    {
      seriesId: 'UMCSENT',
      indicator: 'CONSUMER_CONFIDENCE',
      asset: 'USD',
      isPositiveIndicator: true,
      importanceWeight: 3,
      unit: 'Index',
      frequency: 'MONTHLY'
    },
    // Gold Price (London PM Fix)
    {
      seriesId: 'GOLDPMGBD228NLBM',
      indicator: 'PRECIOUS_METAL_PRICE',
      asset: 'XAU',
      isPositiveIndicator: true,
      importanceWeight: 5,
      unit: 'USD/oz',
      frequency: 'DAILY'
    },
    // Silver Price
    {
      seriesId: 'SILVERPRICE',
      indicator: 'PRECIOUS_METAL_PRICE',
      asset: 'XAG',
      isPositiveIndicator: true,
      importanceWeight: 4,
      unit: 'USD/oz',
      frequency: 'DAILY'
    }
  ];

  constructor() {
    super({
      source: 'FRED',
      base_url: 'https://api.stlouisfed.org/fred',
      endpoints: {
        series: '/series/observations',
        releases: '/releases',
        categories: '/categories'
      },
      headers: {
        'Accept': 'application/json'
      },
      rate_limit_ms: 1000, // FRED allows 120 requests per minute
      retry_attempts: 3,
      timeout_ms: 10000,
      respect_robots_txt: true,
      user_agent: 'PriceActionTalk-EconomicBot/1.0'
    });
  }

  async scrapeData(assets?: AssetCode[]): Promise<ScrapingResult> {
    const startTime = Date.now();
    const dataPoints: EconomicDataPoint[] = [];
    const errors: string[] = [];

    try {
      console.log('[FRED] Starting data collection...');

      // Filter series for requested assets (USD only for FRED)
      const relevantSeries = this.SERIES_CONFIG.filter(series => 
        !assets || assets.includes(series.asset)
      );

      for (const seriesConfig of relevantSeries) {
        try {
          const dataPoint = await this.scrapeSeries(seriesConfig);
          if (dataPoint) {
            dataPoints.push(dataPoint);
          }
        } catch (error) {
          const errorMsg = `Failed to scrape ${seriesConfig.seriesId}: ${error}`;
          errors.push(errorMsg);
          console.error(`[FRED] ${errorMsg}`);
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`[FRED] Collected ${dataPoints.length} data points`);

      return {
        source: 'FRED',
        success: errors.length === 0,
        data_points: dataPoints,
        errors,
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };

    } catch (error) {
      console.error('[FRED] Scraping failed:', error);
      return {
        source: 'FRED',
        success: false,
        data_points: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };
    }
  }

  private async scrapeSeries(config: FREDSeriesConfig): Promise<EconomicDataPoint | null> {
    const url = `${this.BASE_URL}/series/observations?series_id=${config.seriesId}&api_key=${this.API_KEY}&file_type=json&limit=3&sort_order=desc`;

    try {
      const response = await this.makeRequest(url);
      const data = await response.json();

      if (!data.observations || data.observations.length === 0) {
        throw new Error('No observations found');
      }

      // Get the latest observation
      const latest = data.observations[0];
      const previous = data.observations[1];

      // Parse values
      const actualValue = this.parseNumber(latest.value);
      const previousValue = previous ? this.parseNumber(previous.value) : null;

      if (actualValue === null) {
        throw new Error('Could not parse actual value');
      }

      // Create data point
      const dataPoint: EconomicDataPoint = {
        id: this.generateDataPointId(config.asset, config.indicator, latest.date),
        asset: config.asset,
        indicator: config.indicator,
        source: 'FRED',
        timestamp: this.getCurrentTimestamp(),
        actual: actualValue,
        previous: previousValue || undefined,
        unit: config.unit,
        frequency: config.frequency,
        release_date: latest.date,
        importance_weight: config.importanceWeight,
        confidence_level: 0.95, // FRED data is highly reliable
        last_updated: this.getCurrentTimestamp(),
        scrape_success: true,
        validation_passed: false // Will be set after validation
      };

      // Calculate trend score if we have previous value
      if (previousValue !== null) {
        const change = actualValue - previousValue;
        const changePercent = Math.abs(change / previousValue);
        
        if (changePercent > 0.01) { // Significant change (>1%)
          dataPoint.trend_score = config.isPositiveIndicator 
            ? (change > 0 ? 1 : -1)
            : (change > 0 ? -1 : 1);
        } else {
          dataPoint.trend_score = 0;
        }
      }

      // Validate data point
      const validationRules: DataValidationRule[] = [
        {
          field: 'actual',
          rule_type: 'REQUIRED',
          parameters: {},
          error_message: 'Actual value is required'
        },
        {
          field: 'actual',
          rule_type: 'RANGE',
          parameters: { min: -1000, max: 1000000 },
          error_message: 'Actual value out of reasonable range'
        }
      ];

      dataPoint.validation_passed = this.validateDataPoint(dataPoint, validationRules);

      return dataPoint;

    } catch (error) {
      console.error(`[FRED] Error scraping ${config.seriesId}:`, error);
      throw error;
    }
  }

  /**
   * Get available FRED series for a specific category
   */
  async getAvailableSeries(categoryId?: number): Promise<any[]> {
    const url = categoryId 
      ? `${this.BASE_URL}/category/series?category_id=${categoryId}&api_key=${this.API_KEY}&file_type=json`
      : `${this.BASE_URL}/series?api_key=${this.API_KEY}&file_type=json`;

    try {
      const response = await this.makeRequest(url);
      const data = await response.json();
      return data.seriess || [];
    } catch (error) {
      console.error('[FRED] Error fetching available series:', error);
      return [];
    }
  }

  /**
   * Get release calendar for upcoming data
   */
  async getReleaseCalendar(): Promise<any[]> {
    const url = `${this.BASE_URL}/releases?api_key=${this.API_KEY}&file_type=json`;

    try {
      const response = await this.makeRequest(url);
      const data = await response.json();
      return data.releases || [];
    } catch (error) {
      console.error('[FRED] Error fetching release calendar:', error);
      return [];
    }
  }
}

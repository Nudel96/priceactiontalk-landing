/**
 * Trading Economics Scraper
 * Collects economic calendar, forecasts, and global economic indicators
 */

import { BaseScraper } from './base-scraper';
import type { 
  AssetCode, 
  EconomicDataPoint, 
  EconomicCalendarEvent,
  ScrapingResult, 
  IndicatorType 
} from '$lib/types/advanced-economic';

interface TradingEconomicsIndicator {
  country: string;
  asset: AssetCode;
  category: string;
  title: string;
  latest_value: number;
  previous_value: number;
  forecast: number;
  unit: string;
  frequency: string;
  importance: 'Low' | 'Medium' | 'High';
  next_release: string;
  indicator_type: IndicatorType;
}

export class TradingEconomicsScraper extends BaseScraper {
  private readonly API_KEY = 'demo'; // Replace with actual Trading Economics API key
  private readonly BASE_URL = 'https://api.tradingeconomics.com';

  // Country to asset mapping
  private readonly COUNTRY_ASSET_MAP: Record<string, AssetCode> = {
    'United States': 'USD',
    'Euro Area': 'EUR',
    'European Union': 'EUR',
    'United Kingdom': 'GBP',
    'Japan': 'JPY',
    'Australia': 'AUD',
    'Canada': 'CAD',
    'Switzerland': 'CHF',
    'China': 'CNY',
    'New Zealand': 'NZD'
  };

  // Indicator mapping
  private readonly INDICATOR_MAP: Record<string, IndicatorType> = {
    'Unemployment Rate': 'UNEMPLOYMENT',
    'Inflation Rate': 'INFLATION_CPI',
    'GDP Growth Rate': 'GDP_GROWTH',
    'Interest Rate': 'INTEREST_RATE',
    'Manufacturing PMI': 'PMI_MANUFACTURING',
    'Services PMI': 'PMI_SERVICES',
    'Retail Sales': 'RETAIL_SALES',
    'Industrial Production': 'INDUSTRIAL_PRODUCTION',
    'Consumer Confidence': 'CONSUMER_CONFIDENCE',
    'Trade Balance': 'TRADE_BALANCE',
    'Current Account': 'CURRENT_ACCOUNT',
    'Government Debt': 'GOVERNMENT_DEBT'
  };

  constructor() {
    super({
      source: 'TRADING_ECONOMICS',
      base_url: 'https://api.tradingeconomics.com',
      endpoints: {
        indicators: '/indicators',
        calendar: '/calendar',
        forecasts: '/forecasts',
        countries: '/countries'
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.TRADING_ECONOMICS_API_KEY || 'demo'}`
      },
      rate_limit_ms: 2000, // Conservative rate limiting
      retry_attempts: 3,
      timeout_ms: 15000,
      respect_robots_txt: true,
      user_agent: 'PriceActionTalk-EconomicBot/1.0'
    });
  }

  async scrapeData(assets?: AssetCode[]): Promise<ScrapingResult> {
    const startTime = Date.now();
    const dataPoints: EconomicDataPoint[] = [];
    const errors: string[] = [];

    try {
      console.log('[TRADING_ECONOMICS] Starting data collection...');

      // Get countries for requested assets
      const countries = this.getCountriesForAssets(assets);
      
      for (const country of countries) {
        try {
          const countryData = await this.scrapeCountryIndicators(country);
          dataPoints.push(...countryData);
        } catch (error) {
          const errorMsg = `Failed to scrape ${country}: ${error}`;
          errors.push(errorMsg);
          console.error(`[TRADING_ECONOMICS] ${errorMsg}`);
        }

        // Rate limiting between countries
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`[TRADING_ECONOMICS] Collected ${dataPoints.length} data points`);

      return {
        source: 'TRADING_ECONOMICS',
        success: errors.length < countries.length, // Success if at least one country worked
        data_points: dataPoints,
        errors,
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };

    } catch (error) {
      console.error('[TRADING_ECONOMICS] Scraping failed:', error);
      return {
        source: 'TRADING_ECONOMICS',
        success: false,
        data_points: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        execution_time_ms: Date.now() - startTime,
        timestamp: this.getCurrentTimestamp()
      };
    }
  }

  private getCountriesForAssets(assets?: AssetCode[]): string[] {
    if (!assets) {
      return Object.keys(this.COUNTRY_ASSET_MAP);
    }

    return Object.entries(this.COUNTRY_ASSET_MAP)
      .filter(([_, asset]) => assets.includes(asset))
      .map(([country, _]) => country);
  }

  private async scrapeCountryIndicators(country: string): Promise<EconomicDataPoint[]> {
    const asset = this.COUNTRY_ASSET_MAP[country];
    if (!asset) {
      throw new Error(`No asset mapping for country: ${country}`);
    }

    const url = `${this.BASE_URL}/indicators/country/${encodeURIComponent(country)}?c=${this.API_KEY}&f=json`;

    try {
      const response = await this.makeRequest(url);
      const indicators: any[] = await response.json();

      const dataPoints: EconomicDataPoint[] = [];

      for (const indicator of indicators) {
        try {
          const dataPoint = this.parseIndicator(indicator, asset);
          if (dataPoint) {
            dataPoints.push(dataPoint);
          }
        } catch (error) {
          console.warn(`[TRADING_ECONOMICS] Failed to parse indicator for ${country}:`, error);
        }
      }

      return dataPoints;

    } catch (error) {
      console.error(`[TRADING_ECONOMICS] Error scraping ${country}:`, error);
      throw error;
    }
  }

  private parseIndicator(indicator: any, asset: AssetCode): EconomicDataPoint | null {
    // Map Trading Economics indicator to our types
    const indicatorType = this.INDICATOR_MAP[indicator.Category] || 
                         this.INDICATOR_MAP[indicator.Title];

    if (!indicatorType) {
      return null; // Skip unmapped indicators
    }

    const actual = this.parseNumber(indicator.LatestValue || indicator.LastUpdate);
    const previous = this.parseNumber(indicator.PreviousValue);
    const forecast = this.parseNumber(indicator.Forecast);

    if (actual === null) {
      return null;
    }

    // Calculate surprise score
    let surpriseScore = 0;
    let surprise = 0;
    if (forecast !== null && actual !== null) {
      surprise = (actual - forecast) / Math.abs(forecast);
      surpriseScore = this.calculateSurpriseScore(actual, forecast, this.isPositiveIndicator(indicatorType));
    }

    // Map importance
    const importanceWeight = this.mapImportance(indicator.Importance || 'Medium');

    const dataPoint: EconomicDataPoint = {
      id: this.generateDataPointId(asset, indicatorType, indicator.LastUpdate || new Date().toISOString()),
      asset,
      indicator: indicatorType,
      source: 'TRADING_ECONOMICS',
      timestamp: this.getCurrentTimestamp(),
      actual,
      forecast: forecast || undefined,
      previous: previous || undefined,
      surprise,
      surprise_score: surpriseScore,
      unit: indicator.Unit || '',
      frequency: this.mapFrequency(indicator.Frequency),
      release_date: indicator.LastUpdate || this.getCurrentTimestamp(),
      next_release: indicator.NextRelease,
      importance_weight: importanceWeight,
      confidence_level: 0.85, // Trading Economics is generally reliable
      last_updated: this.getCurrentTimestamp(),
      scrape_success: true,
      validation_passed: true
    };

    return dataPoint;
  }

  private isPositiveIndicator(indicator: IndicatorType): boolean {
    const positiveIndicators: IndicatorType[] = [
      'GDP_GROWTH',
      'PMI_MANUFACTURING',
      'PMI_SERVICES',
      'RETAIL_SALES',
      'INDUSTRIAL_PRODUCTION',
      'CONSUMER_CONFIDENCE',
      'INTEREST_RATE' // Generally positive for currency strength
    ];

    return positiveIndicators.includes(indicator);
  }

  private mapImportance(importance: string): number {
    switch (importance.toLowerCase()) {
      case 'high': return 5;
      case 'medium': return 3;
      case 'low': return 1;
      default: return 3;
    }
  }

  private mapFrequency(frequency: string): 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' {
    if (!frequency) return 'MONTHLY';
    
    const freq = frequency.toLowerCase();
    if (freq.includes('daily')) return 'DAILY';
    if (freq.includes('weekly')) return 'WEEKLY';
    if (freq.includes('quarterly')) return 'QUARTERLY';
    if (freq.includes('yearly') || freq.includes('annual')) return 'YEARLY';
    return 'MONTHLY';
  }

  /**
   * Get economic calendar events
   */
  async getEconomicCalendar(startDate?: string, endDate?: string): Promise<EconomicCalendarEvent[]> {
    const start = startDate || new Date().toISOString().split('T')[0];
    const end = endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `${this.BASE_URL}/calendar?c=${this.API_KEY}&d1=${start}&d2=${end}&f=json`;

    try {
      const response = await this.makeRequest(url);
      const events: any[] = await response.json();

      return events.map(event => this.parseCalendarEvent(event)).filter(Boolean) as EconomicCalendarEvent[];

    } catch (error) {
      console.error('[TRADING_ECONOMICS] Error fetching calendar:', error);
      return [];
    }
  }

  private parseCalendarEvent(event: any): EconomicCalendarEvent | null {
    const asset = this.COUNTRY_ASSET_MAP[event.Country];
    const indicatorType = this.INDICATOR_MAP[event.Event];

    if (!asset || !indicatorType) {
      return null;
    }

    return {
      id: `${asset}_${event.Event}_${event.Date}`.replace(/[^a-zA-Z0-9_]/g, '_'),
      asset,
      indicator: indicatorType,
      event_name: event.Event,
      event_time: event.Date,
      impact: this.mapImpact(event.Importance),
      forecast: this.parseNumber(event.Forecast),
      previous: this.parseNumber(event.Previous),
      actual: this.parseNumber(event.Actual),
      source: 'TRADING_ECONOMICS',
      last_updated: this.getCurrentTimestamp()
    };
  }

  private mapImpact(importance: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    switch (importance?.toLowerCase()) {
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'MEDIUM';
    }
  }
}

/**
 * Advanced Economic Data Types for Real-time Collection and Analysis System
 * Supports 11 assets: USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, NZD, XAU, XAG
 */

export type AssetCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'NZD' | 'XAU' | 'XAG';

export type DataSource =
  | 'FRED'           // Federal Reserve Economic Data
  | 'ECB'            // European Central Bank
  | 'BOE'            // Bank of England
  | 'BOJ'            // Bank of Japan
  | 'BLS'            // Bureau of Labor Statistics
  | 'EUROSTAT'       // European Union Statistics
  | 'TRADING_ECONOMICS' // Trading Economics
  | 'INVESTING_COM'  // Investing.com
  | 'CFTC'           // Commodity Futures Trading Commission
  | 'DAILYFX'        // DailyFX
  | 'MARKET_DATA'    // Real-time market data
  | 'MANUAL'         // Manual data entry
  | 'CALCULATED';    // Calculated/derived data

export type IndicatorType = 
  | 'UNEMPLOYMENT'
  | 'INFLATION_CPI'
  | 'INFLATION_PPI'
  | 'GDP_GROWTH'
  | 'INTEREST_RATE'
  | 'PMI_MANUFACTURING'
  | 'PMI_SERVICES'
  | 'RETAIL_SALES'
  | 'INDUSTRIAL_PRODUCTION'
  | 'CONSUMER_CONFIDENCE'
  | 'TRADE_BALANCE'
  | 'CURRENT_ACCOUNT'
  | 'GOVERNMENT_DEBT'
  | 'CURRENCY_RATE'
  | 'BOND_YIELD'
  | 'PRECIOUS_METAL_PRICE'
  | 'COT_COMMERCIAL'
  | 'COT_NON_COMMERCIAL'
  | 'COT_RETAIL'
  | 'SENTIMENT_RETAIL'
  | 'SENTIMENT_INSTITUTIONAL'
  | 'RATE_CUT_PROBABILITY';

export interface EconomicDataPoint {
  id: string;
  asset: AssetCode;
  indicator: IndicatorType;
  source: DataSource;
  timestamp: string;
  
  // Core values
  actual?: number;
  forecast?: number;
  previous?: number;
  
  // Metadata
  unit: string;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  release_date: string;
  next_release?: string;
  
  // Analysis
  surprise?: number;           // (actual - forecast) / |forecast|
  surprise_score?: number;     // -1, 0, or +1 based on surprise
  trend_score?: number;        // -1, 0, or +1 based on trend
  importance_weight: number;   // 1-5 scale
  
  // Quality control
  confidence_level: number;    // 0-1 scale
  last_updated: string;
  scrape_success: boolean;
  validation_passed: boolean;
}

export interface COTData {
  asset: AssetCode;
  report_date: string;
  
  // Commercial traders (smart money)
  commercial_long: number;
  commercial_short: number;
  commercial_net: number;
  
  // Non-commercial traders (speculators)
  non_commercial_long: number;
  non_commercial_short: number;
  non_commercial_net: number;
  
  // Retail traders
  retail_long: number;
  retail_short: number;
  retail_net: number;
  
  // Analysis
  commercial_sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  retail_sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  contrarian_signal: 'BUY' | 'SELL' | 'HOLD';
  
  source: DataSource;
  last_updated: string;
}

export interface SentimentData {
  asset: AssetCode;
  timestamp: string;
  
  // Retail sentiment
  retail_long_percentage: number;
  retail_short_percentage: number;
  retail_sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  
  // Institutional sentiment
  institutional_sentiment?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  
  // Fear & Greed indicators
  fear_greed_index?: number;
  volatility_index?: number;
  
  // Contrarian analysis
  contrarian_score: number;    // -1 to +1
  
  source: DataSource;
  last_updated: string;
}

export interface EconomicCalendarEvent {
  id: string;
  asset: AssetCode;
  indicator: IndicatorType;
  
  // Event details
  event_name: string;
  event_time: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Values
  forecast?: number;
  previous?: number;
  actual?: number;
  
  // Analysis
  surprise?: number;
  market_reaction?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  
  source: DataSource;
  last_updated: string;
}

export interface AssetScore {
  asset: AssetCode;
  timestamp: string;
  
  // Component scores (-5 to +5 each)
  economic_score: number;      // Based on economic surprises
  sentiment_score: number;     // Based on sentiment analysis
  cot_score: number;          // Based on COT data
  technical_score: number;     // Based on price action
  central_bank_score: number;  // Based on monetary policy
  
  // Overall score
  total_score: number;         // Sum of component scores
  normalized_score: number;    // -1 to +1 scale
  
  // Signal
  signal: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidence: number;          // 0-1 scale
  
  // Breakdown
  bullish_factors: string[];
  bearish_factors: string[];
  
  last_updated: string;
}

export interface ScrapingConfig {
  source: DataSource;
  base_url: string;
  endpoints: Record<string, string>;
  headers: Record<string, string>;
  rate_limit_ms: number;
  retry_attempts: number;
  timeout_ms: number;
  respect_robots_txt: boolean;
  user_agent: string;
}

export interface ScrapingResult {
  source: DataSource;
  asset?: AssetCode;
  success: boolean;
  data_points: EconomicDataPoint[];
  errors: string[];
  execution_time_ms: number;
  timestamp: string;
}

export interface DataValidationRule {
  field: string;
  rule_type: 'RANGE' | 'REQUIRED' | 'FORMAT' | 'LOGICAL';
  parameters: Record<string, any>;
  error_message: string;
}

export interface SystemHealth {
  timestamp: string;
  
  // Scraper status
  active_scrapers: number;
  failed_scrapers: string[];
  last_successful_scrape: Record<DataSource, string>;
  
  // Data quality
  total_data_points: number;
  validation_pass_rate: number;
  data_freshness_score: number;
  
  // Performance
  average_scrape_time_ms: number;
  error_rate_24h: number;
  uptime_percentage: number;
  
  // Alerts
  active_alerts: string[];
  system_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

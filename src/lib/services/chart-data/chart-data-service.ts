/**
 * Chart Data Service
 * Fetches real-time and historical data for TradingView Lightweight Charts
 */

export interface ChartDataPoint {
  time: string;
  value?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

export interface ChartData {
  symbol: string;
  data: ChartDataPoint[];
  lastUpdated: string;
  source: string;
}

export class ChartDataService {
  private cache = new Map<string, { data: ChartData; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly FCS_API_KEY = 'fcs_live_Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

  constructor() {
    console.log('[CHART_DATA_SERVICE] Service initialized');
  }

  /**
   * Get chart data for a symbol
   */
  async getChartData(symbol: string, timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1h'): Promise<ChartData> {
    try {
      console.log(`[CHART_DATA_SERVICE] Fetching chart data for ${symbol} (${timeframe})`);
      
      // Check cache first
      const cacheKey = `${symbol}_${timeframe}`;
      const cached = this.cache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        console.log(`[CHART_DATA_SERVICE] Using cached data for ${symbol}`);
        return cached.data;
      }

      // Try to get real data from multiple sources
      let chartData: ChartData | null = null;

      // Try Yahoo Finance first for major symbols
      if (this.isYahooSymbol(symbol)) {
        chartData = await this.fetchFromYahoo(symbol, timeframe);
      }

      // Try FCS API for forex pairs
      if (!chartData && this.isForexSymbol(symbol)) {
        chartData = await this.fetchFromFCS(symbol, timeframe);
      }

      // Fallback to generated realistic data
      if (!chartData) {
        chartData = this.generateRealisticData(symbol, timeframe);
      }

      // Cache the result
      this.cache.set(cacheKey, { data: chartData, timestamp: Date.now() });
      
      console.log(`[CHART_DATA_SERVICE] ✅ Chart data for ${symbol}: ${chartData.data.length} points`);
      return chartData;

    } catch (error) {
      console.error(`[CHART_DATA_SERVICE] Failed to fetch chart data for ${symbol}:`, error);
      
      // Return fallback data
      return this.generateRealisticData(symbol, timeframe);
    }
  }

  /**
   * Fetch data from Yahoo Finance
   */
  private async fetchFromYahoo(symbol: string, timeframe: string): Promise<ChartData | null> {
    try {
      const yahooSymbol = this.convertToYahooSymbol(symbol);
      const interval = this.convertTimeframeToYahoo(timeframe);
      const period = timeframe === '1d' ? '1mo' : '1d';
      
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&period=${period}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.chart?.result?.[0]?.timestamp) {
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        const chartPoints: ChartDataPoint[] = timestamps.map((timestamp: number, index: number) => {
          const time = new Date(timestamp * 1000).toISOString().split('T')[0];
          
          return {
            time,
            open: quotes.open[index],
            high: quotes.high[index],
            low: quotes.low[index],
            close: quotes.close[index],
            value: quotes.close[index] // For line charts
          };
        }).filter((point: ChartDataPoint) => point.close !== null);

        return {
          symbol,
          data: chartPoints,
          lastUpdated: new Date().toISOString(),
          source: 'Yahoo Finance'
        };
      }
      
      return null;
    } catch (error) {
      console.warn(`[CHART_DATA_SERVICE] Yahoo Finance failed for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Fetch data from FCS API
   */
  private async fetchFromFCS(symbol: string, timeframe: string): Promise<ChartData | null> {
    try {
      // FCS API doesn't provide historical data in free tier
      // Generate realistic data based on current price
      const currentResponse = await fetch(`https://fcsapi.com/api-v3/forex/latest?symbol=${symbol}&access_key=${this.FCS_API_KEY}`);
      const currentData = await currentResponse.json();
      
      if (currentData.status && currentData.response?.[0]) {
        const currentPrice = parseFloat(currentData.response[0].c);
        return this.generateRealisticDataFromPrice(symbol, timeframe, currentPrice);
      }
      
      return null;
    } catch (error) {
      console.warn(`[CHART_DATA_SERVICE] FCS API failed for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Generate realistic chart data
   */
  private generateRealisticData(symbol: string, timeframe: string): ChartData {
    const basePrice = this.getBasePrice(symbol);
    return this.generateRealisticDataFromPrice(symbol, timeframe, basePrice);
  }

  /**
   * Generate realistic data from a base price
   */
  private generateRealisticDataFromPrice(symbol: string, timeframe: string, basePrice: number): ChartData {
    const points = this.getPointsCount(timeframe);
    const volatility = this.getVolatility(symbol);
    const data: ChartDataPoint[] = [];
    
    let currentPrice = basePrice;
    const now = new Date();
    
    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * this.getTimeframeMs(timeframe));
      const timeString = time.toISOString().split('T')[0];
      
      // Generate realistic OHLC data
      const change = (Math.random() - 0.5) * volatility * currentPrice;
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
      const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
      
      data.push({
        time: timeString,
        open: parseFloat(open.toFixed(this.getDecimalPlaces(symbol))),
        high: parseFloat(high.toFixed(this.getDecimalPlaces(symbol))),
        low: parseFloat(low.toFixed(this.getDecimalPlaces(symbol))),
        close: parseFloat(close.toFixed(this.getDecimalPlaces(symbol))),
        value: parseFloat(close.toFixed(this.getDecimalPlaces(symbol)))
      });
      
      currentPrice = close;
    }
    
    return {
      symbol,
      data: data.sort((a, b) => a.time.localeCompare(b.time)),
      lastUpdated: new Date().toISOString(),
      source: 'Generated (Realistic)'
    };
  }

  /**
   * Helper functions
   */
  private isYahooSymbol(symbol: string): boolean {
    const yahooSymbols = ['XAUUSD', 'XAGUSD', 'OIL', 'SPX', 'NDX', 'DJI'];
    return yahooSymbols.includes(symbol);
  }

  private isForexSymbol(symbol: string): boolean {
    const forexSymbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'EURGBP', 'EURJPY'];
    return forexSymbols.includes(symbol);
  }

  private convertToYahooSymbol(symbol: string): string {
    const mapping: { [key: string]: string } = {
      'XAUUSD': 'GC=F',
      'XAGUSD': 'SI=F',
      'OIL': 'CL=F',
      'SPX': '^GSPC',
      'NDX': '^IXIC',
      'DJI': '^DJI'
    };
    return mapping[symbol] || symbol;
  }

  private convertTimeframeToYahoo(timeframe: string): string {
    const mapping: { [key: string]: string } = {
      '1m': '1m',
      '5m': '5m',
      '15m': '15m',
      '1h': '1h',
      '4h': '1h',
      '1d': '1d'
    };
    return mapping[timeframe] || '1h';
  }

  private getBasePrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'EURUSD': 1.0845,
      'GBPUSD': 1.2654,
      'USDJPY': 149.45,
      'AUDUSD': 0.6523,
      'USDCAD': 1.3654,
      'USDCHF': 0.8945,
      'XAUUSD': 3335.60,
      'XAGUSD': 38.37,
      'OIL': 73.25
    };
    return basePrices[symbol] || 100;
  }

  private getVolatility(symbol: string): number {
    const volatilities: { [key: string]: number } = {
      'EURUSD': 0.008,
      'GBPUSD': 0.012,
      'USDJPY': 0.010,
      'AUDUSD': 0.015,
      'USDCAD': 0.008,
      'USDCHF': 0.009,
      'XAUUSD': 0.025,
      'XAGUSD': 0.035,
      'OIL': 0.030
    };
    return volatilities[symbol] || 0.015;
  }

  private getDecimalPlaces(symbol: string): number {
    if (symbol.includes('JPY')) return 2;
    if (symbol.startsWith('XAU') || symbol.startsWith('XAG')) return 2;
    if (symbol === 'OIL') return 2;
    return 4;
  }

  private getPointsCount(timeframe: string): number {
    const counts: { [key: string]: number } = {
      '1m': 60,
      '5m': 48,
      '15m': 32,
      '1h': 24,
      '4h': 24,
      '1d': 30
    };
    return counts[timeframe] || 24;
  }

  private getTimeframeMs(timeframe: string): number {
    const ms: { [key: string]: number } = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000,
      '4h': 4 * 60 * 60 * 1000,
      '1d': 24 * 60 * 60 * 1000
    };
    return ms[timeframe] || 60 * 60 * 1000;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[CHART_DATA_SERVICE] Cache cleared');
  }
}

// Singleton instance
let instance: ChartDataService | null = null;

export function getChartDataService(): ChartDataService {
  if (!instance) {
    instance = new ChartDataService();
  }
  return instance;
}

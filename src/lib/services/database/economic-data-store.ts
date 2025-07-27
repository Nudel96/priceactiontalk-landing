/**
 * Economic Data Store - Database integration layer
 * Handles storage, retrieval, and caching of economic data
 */

import type { 
  AssetCode, 
  EconomicDataPoint, 
  COTData, 
  SentimentData,
  AssetScore,
  EconomicCalendarEvent,
  SystemHealth 
} from '$lib/types/advanced-economic';

interface CacheEntry<T> {
  data: T;
  timestamp: string;
  expiry: string;
}

export class EconomicDataStore {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly CACHE_DURATIONS = {
    economic_data: 30 * 60 * 1000,      // 30 minutes
    cot_data: 7 * 24 * 60 * 60 * 1000,  // 7 days (COT data is weekly)
    sentiment_data: 2 * 60 * 60 * 1000, // 2 hours (retail sentiment changes slowly)
    asset_scores: 15 * 60 * 1000,       // 15 minutes
    calendar_events: 24 * 60 * 60 * 1000, // 24 hours (events don't change once published)
    system_health: 5 * 60 * 1000,       // 5 minutes
    fundamental_news: 24 * 60 * 60 * 1000, // 24 hours (news doesn't change once published)
    forex_rates: 30 * 1000,             // 30 seconds (real-time rates)
    precious_metals: 60 * 1000          // 1 minute (precious metals rates)
  };

  /**
   * Store economic data points
   */
  async storeEconomicData(dataPoints: EconomicDataPoint[]): Promise<void> {
    try {
      // In a real implementation, this would write to a database
      // For now, we'll use localStorage as a simple persistence layer
      
      const existingData = this.getStoredData('economic_data') || [];
      const updatedData = this.mergeDataPoints(existingData, dataPoints);
      
      this.setStoredData('economic_data', updatedData);
      this.setCacheEntry('economic_data', updatedData, this.CACHE_DURATIONS.economic_data);
      
      console.log(`[DATA_STORE] Stored ${dataPoints.length} economic data points`);
    } catch (error) {
      console.error('[DATA_STORE] Error storing economic data:', error);
      throw error;
    }
  }

  /**
   * Retrieve economic data for specific assets
   */
  async getEconomicData(
    assets?: AssetCode[], 
    indicators?: string[], 
    maxAgeHours: number = 24
  ): Promise<EconomicDataPoint[]> {
    try {
      // Try cache first
      const cached = this.getCacheEntry('economic_data');
      if (cached) {
        return this.filterEconomicData(cached, assets, indicators, maxAgeHours);
      }

      // Fallback to stored data
      const storedData = this.getStoredData('economic_data') || [];
      this.setCacheEntry('economic_data', storedData, this.CACHE_DURATIONS.economic_data);
      
      return this.filterEconomicData(storedData, assets, indicators, maxAgeHours);
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving economic data:', error);
      return [];
    }
  }

  /**
   * Store COT data
   */
  async storeCOTData(cotData: COTData[]): Promise<void> {
    try {
      const existingData = this.getStoredData('cot_data') || [];
      const updatedData = this.mergeCOTData(existingData, cotData);
      
      this.setStoredData('cot_data', updatedData);
      this.setCacheEntry('cot_data', updatedData, this.CACHE_DURATIONS.cot_data);
      
      console.log(`[DATA_STORE] Stored COT data for ${cotData.length} assets`);
    } catch (error) {
      console.error('[DATA_STORE] Error storing COT data:', error);
      throw error;
    }
  }

  /**
   * Retrieve COT data
   */
  async getCOTData(assets?: AssetCode[]): Promise<COTData[]> {
    try {
      const cached = this.getCacheEntry('cot_data');
      const data = cached || this.getStoredData('cot_data') || [];
      
      if (!cached) {
        this.setCacheEntry('cot_data', data, this.CACHE_DURATIONS.cot_data);
      }

      return assets ? data.filter((cot: COTData) => assets.includes(cot.asset)) : data;
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving COT data:', error);
      return [];
    }
  }

  /**
   * Store sentiment data
   */
  async storeSentimentData(sentimentData: SentimentData[]): Promise<void> {
    try {
      const existingData = this.getStoredData('sentiment_data') || [];
      const updatedData = this.mergeSentimentData(existingData, sentimentData);
      
      this.setStoredData('sentiment_data', updatedData);
      this.setCacheEntry('sentiment_data', updatedData, this.CACHE_DURATIONS.sentiment_data);
      
      console.log(`[DATA_STORE] Stored sentiment data for ${sentimentData.length} assets`);
    } catch (error) {
      console.error('[DATA_STORE] Error storing sentiment data:', error);
      throw error;
    }
  }

  /**
   * Retrieve sentiment data
   */
  async getSentimentData(assets?: AssetCode[]): Promise<SentimentData[]> {
    try {
      const cached = this.getCacheEntry('sentiment_data');
      const data = cached || this.getStoredData('sentiment_data') || [];
      
      if (!cached) {
        this.setCacheEntry('sentiment_data', data, this.CACHE_DURATIONS.sentiment_data);
      }

      return assets ? data.filter((sentiment: SentimentData) => assets.includes(sentiment.asset)) : data;
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving sentiment data:', error);
      return [];
    }
  }

  /**
   * Store asset scores
   */
  async storeAssetScores(scores: AssetScore[]): Promise<void> {
    try {
      this.setStoredData('asset_scores', scores);
      this.setCacheEntry('asset_scores', scores, this.CACHE_DURATIONS.asset_scores);
      
      console.log(`[DATA_STORE] Stored scores for ${scores.length} assets`);
    } catch (error) {
      console.error('[DATA_STORE] Error storing asset scores:', error);
      throw error;
    }
  }

  /**
   * Retrieve asset scores
   */
  async getAssetScores(assets?: AssetCode[]): Promise<AssetScore[]> {
    try {
      const cached = this.getCacheEntry('asset_scores');
      const data = cached || this.getStoredData('asset_scores') || [];
      
      if (!cached) {
        this.setCacheEntry('asset_scores', data, this.CACHE_DURATIONS.asset_scores);
      }

      return assets ? data.filter((score: AssetScore) => assets.includes(score.asset)) : data;
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving asset scores:', error);
      return [];
    }
  }

  /**
   * Store economic calendar events
   */
  async storeCalendarEvents(events: EconomicCalendarEvent[]): Promise<void> {
    try {
      const existingData = this.getStoredData('calendar_events') || [];
      const updatedData = this.mergeCalendarEvents(existingData, events);
      
      this.setStoredData('calendar_events', updatedData);
      this.setCacheEntry('calendar_events', updatedData, this.CACHE_DURATIONS.calendar_events);
      
      console.log(`[DATA_STORE] Stored ${events.length} calendar events`);
    } catch (error) {
      console.error('[DATA_STORE] Error storing calendar events:', error);
      throw error;
    }
  }

  /**
   * Retrieve economic calendar events
   */
  async getCalendarEvents(
    assets?: AssetCode[], 
    startDate?: string, 
    endDate?: string
  ): Promise<EconomicCalendarEvent[]> {
    try {
      const cached = this.getCacheEntry('calendar_events');
      const data = cached || this.getStoredData('calendar_events') || [];
      
      if (!cached) {
        this.setCacheEntry('calendar_events', data, this.CACHE_DURATIONS.calendar_events);
      }

      return this.filterCalendarEvents(data, assets, startDate, endDate);
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving calendar events:', error);
      return [];
    }
  }

  /**
   * Store system health data
   */
  async storeSystemHealth(health: SystemHealth): Promise<void> {
    try {
      this.setStoredData('system_health', health);
      this.setCacheEntry('system_health', health, this.CACHE_DURATIONS.system_health);
      
      console.log('[DATA_STORE] Stored system health data');
    } catch (error) {
      console.error('[DATA_STORE] Error storing system health:', error);
      throw error;
    }
  }

  /**
   * Retrieve system health data
   */
  async getSystemHealth(): Promise<SystemHealth | null> {
    try {
      const cached = this.getCacheEntry('system_health');
      const data = cached || this.getStoredData('system_health');
      
      if (!cached && data) {
        this.setCacheEntry('system_health', data, this.CACHE_DURATIONS.system_health);
      }

      return data;
    } catch (error) {
      console.error('[DATA_STORE] Error retrieving system health:', error);
      return null;
    }
  }

  // Private helper methods

  private mergeDataPoints(existing: EconomicDataPoint[], newData: EconomicDataPoint[]): EconomicDataPoint[] {
    const merged = [...existing];
    
    for (const newPoint of newData) {
      const existingIndex = merged.findIndex(point => point.id === newPoint.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = newPoint; // Update existing
      } else {
        merged.push(newPoint); // Add new
      }
    }

    // Keep only last 1000 data points per asset to prevent memory issues
    const assetCounts: Record<AssetCode, number> = {} as Record<AssetCode, number>;
    return merged
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter(point => {
        assetCounts[point.asset] = (assetCounts[point.asset] || 0) + 1;
        return assetCounts[point.asset] <= 1000;
      });
  }

  private mergeCOTData(existing: COTData[], newData: COTData[]): COTData[] {
    const merged = [...existing];
    
    for (const newCOT of newData) {
      const existingIndex = merged.findIndex(cot => 
        cot.asset === newCOT.asset && cot.report_date === newCOT.report_date
      );
      if (existingIndex >= 0) {
        merged[existingIndex] = newCOT;
      } else {
        merged.push(newCOT);
      }
    }

    // Keep only last 52 weeks per asset
    const assetCounts: Record<AssetCode, number> = {} as Record<AssetCode, number>;
    return merged
      .sort((a, b) => new Date(b.report_date).getTime() - new Date(a.report_date).getTime())
      .filter(cot => {
        assetCounts[cot.asset] = (assetCounts[cot.asset] || 0) + 1;
        return assetCounts[cot.asset] <= 52;
      });
  }

  private mergeSentimentData(existing: SentimentData[], newData: SentimentData[]): SentimentData[] {
    const merged = [...existing];
    
    for (const newSentiment of newData) {
      const existingIndex = merged.findIndex(sentiment => 
        sentiment.asset === newSentiment.asset && 
        sentiment.timestamp.split('T')[0] === newSentiment.timestamp.split('T')[0]
      );
      if (existingIndex >= 0) {
        merged[existingIndex] = newSentiment;
      } else {
        merged.push(newSentiment);
      }
    }

    // Keep only last 30 days per asset
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return merged.filter(sentiment => new Date(sentiment.timestamp) > cutoffDate);
  }

  private mergeCalendarEvents(existing: EconomicCalendarEvent[], newData: EconomicCalendarEvent[]): EconomicCalendarEvent[] {
    const merged = [...existing];
    
    for (const newEvent of newData) {
      const existingIndex = merged.findIndex(event => event.id === newEvent.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = newEvent;
      } else {
        merged.push(newEvent);
      }
    }

    // Keep only events from last 30 days and next 30 days
    const now = new Date();
    const pastCutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const futureCutoff = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return merged.filter(event => {
      const eventDate = new Date(event.event_time);
      return eventDate >= pastCutoff && eventDate <= futureCutoff;
    });
  }

  private filterEconomicData(
    data: EconomicDataPoint[], 
    assets?: AssetCode[], 
    indicators?: string[], 
    maxAgeHours: number = 24
  ): EconomicDataPoint[] {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
    
    return data.filter(point => {
      if (new Date(point.timestamp) < cutoffTime) return false;
      if (assets && !assets.includes(point.asset)) return false;
      if (indicators && !indicators.includes(point.indicator)) return false;
      return true;
    });
  }

  private filterCalendarEvents(
    data: EconomicCalendarEvent[], 
    assets?: AssetCode[], 
    startDate?: string, 
    endDate?: string
  ): EconomicCalendarEvent[] {
    return data.filter(event => {
      if (assets && !assets.includes(event.asset)) return false;
      if (startDate && event.event_time < startDate) return false;
      if (endDate && event.event_time > endDate) return false;
      return true;
    });
  }

  // Cache management
  private setCacheEntry<T>(key: string, data: T, durationMs: number): void {
    const expiry = new Date(Date.now() + durationMs).toISOString();
    this.cache.set(key, {
      data,
      timestamp: new Date().toISOString(),
      expiry
    });
  }

  private getCacheEntry<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (new Date() > new Date(entry.expiry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Storage management (localStorage for now, replace with actual DB)
  private setStoredData(key: string, data: any): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`economic_data_${key}`, JSON.stringify(data));
      }
    } catch (error) {
      console.warn('[DATA_STORE] localStorage not available:', error);
    }
  }

  private getStoredData(key: string): any {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(`economic_data_${key}`);
        return stored ? JSON.parse(stored) : null;
      }
    } catch (error) {
      console.warn('[DATA_STORE] Error reading from localStorage:', error);
    }
    return null;
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    console.log('[DATA_STORE] Cache cleared');
  }

  /**
   * Smart cache management - only clear expired entries
   */
  cleanupExpiredCache(): void {
    const now = new Date();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > new Date(entry.expiry)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`[DATA_STORE] Cleaned up ${removedCount} expired cache entries`);
    }
  }

  /**
   * Check if data should be refreshed based on type and age
   */
  shouldRefreshData(dataType: string, lastUpdate: string): boolean {
    const now = Date.now();
    const lastUpdateTime = new Date(lastUpdate).getTime();
    const age = now - lastUpdateTime;

    // Special rules for different data types
    switch (dataType) {
      case 'cot_data':
        // COT data is only updated weekly (Fridays), so don't refresh until next week
        const dayOfWeek = new Date().getDay();
        const hourOfDay = new Date().getHours();
        // Only refresh on Fridays after 3 PM ET (when CFTC releases data)
        return dayOfWeek === 5 && hourOfDay >= 15 && age > 24 * 60 * 60 * 1000;

      case 'fundamental_news':
        // News doesn't change once published, only refresh if very old
        return age > 7 * 24 * 60 * 60 * 1000; // 7 days

      case 'calendar_events':
        // Events don't change once published, only refresh for future events
        return age > 24 * 60 * 60 * 1000; // 24 hours

      case 'forex_rates':
        // Real-time data, refresh frequently during market hours
        const isMarketHours = this.isForexMarketOpen();
        return isMarketHours ? age > 30 * 1000 : age > 5 * 60 * 1000; // 30s during market, 5min off-market

      default:
        return age > (this.CACHE_DURATIONS[dataType as keyof typeof this.CACHE_DURATIONS] || 15 * 60 * 1000);
    }
  }

  /**
   * Check if forex market is currently open
   */
  private isForexMarketOpen(): boolean {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcDay = now.getUTCDay();

    // Forex market is open 24/5, closed from Friday 22:00 UTC to Sunday 22:00 UTC
    if (utcDay === 6) return false; // Saturday
    if (utcDay === 0 && utcHour < 22) return false; // Sunday before 22:00 UTC
    if (utcDay === 5 && utcHour >= 22) return false; // Friday after 22:00 UTC

    return true;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { entries: number; totalSize: number; hitRate: number } {
    const entries = this.cache.size;
    const totalSize = JSON.stringify(Array.from(this.cache.values())).length;
    
    return {
      entries,
      totalSize,
      hitRate: 0 // TODO: Implement hit rate tracking
    };
  }
}

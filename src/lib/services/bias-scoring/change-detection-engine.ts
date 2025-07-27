/**
 * Change Detection Engine - Detects fundamental data changes efficiently
 * Implements incremental data update strategy with timestamp checks, unique identifiers, and content hashing
 */

import crypto from 'crypto';
import { BiasScoringDatabase, type FundamentalDataSnapshot, type ChangeDetectionMetadata } from '../database/bias-scoring-database';

export interface DataSource {
  name: string;
  url: string;
  asset: string;
  dataType: string;
  extractionMethod: 'api' | 'scraping';
  timestampField?: string;
  idField?: string;
  lastKnownTimestamp?: string;
  lastKnownIds?: string[];
  lastContentHash?: string;
}

export interface ChangeDetectionResult {
  hasChanges: boolean;
  newData: FundamentalDataSnapshot[];
  changedData: FundamentalDataSnapshot[];
  detectionMethod: 'timestamp' | 'id' | 'hash';
  processingTime: number;
  dataSource: string;
}

export class ChangeDetectionEngine {
  private db: BiasScoringDatabase;
  private readonly SUPPORTED_ASSETS = [
    'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'
  ];

  constructor(database: BiasScoringDatabase) {
    this.db = database;
  }

  /**
   * Check for fundamental data changes using multiple detection methods
   */
  async detectChanges(dataSource: DataSource, currentData: any[]): Promise<ChangeDetectionResult> {
    const startTime = Date.now();
    const result: ChangeDetectionResult = {
      hasChanges: false,
      newData: [],
      changedData: [],
      detectionMethod: 'timestamp',
      processingTime: 0,
      dataSource: dataSource.name
    };

    try {
      console.log(`[CHANGE_DETECTION] Checking for changes in ${dataSource.name} for ${dataSource.asset}`);

      // Get existing metadata for this asset and data source
      const metadata = this.db.getChangeDetectionMetadata(`${dataSource.asset}_${dataSource.dataType}`);

      // Method 1: Timestamp-based detection
      if (dataSource.timestampField && this.hasTimestampChanges(currentData, metadata, dataSource.timestampField)) {
        result.detectionMethod = 'timestamp';
        result.hasChanges = true;
        result.newData = await this.extractNewDataByTimestamp(currentData, metadata, dataSource);
      }
      // Method 2: ID-based detection
      else if (dataSource.idField && this.hasIdChanges(currentData, metadata, dataSource.idField)) {
        result.detectionMethod = 'id';
        result.hasChanges = true;
        result.newData = await this.extractNewDataByIds(currentData, metadata, dataSource);
      }
      // Method 3: Content hash detection
      else {
        const currentHash = this.calculateContentHash(currentData);
        if (this.hasContentHashChanges(currentHash, metadata)) {
          result.detectionMethod = 'hash';
          result.hasChanges = true;
          result.newData = await this.extractNewDataByHash(currentData, dataSource);
        }
      }

      // Update metadata if changes were detected
      if (result.hasChanges) {
        await this.updateDetectionMetadata(dataSource, currentData, result.detectionMethod);
        console.log(`[CHANGE_DETECTION] ✅ Changes detected for ${dataSource.asset} using ${result.detectionMethod} method`);
      } else {
        console.log(`[CHANGE_DETECTION] No changes detected for ${dataSource.asset}`);
      }

      result.processingTime = Date.now() - startTime;
      return result;

    } catch (error) {
      console.error(`[CHANGE_DETECTION] ❌ Error detecting changes for ${dataSource.asset}:`, error);
      result.processingTime = Date.now() - startTime;
      return result;
    }
  }

  /**
   * Check if timestamp-based changes exist
   */
  private hasTimestampChanges(currentData: any[], metadata: ChangeDetectionMetadata | null, timestampField: string): boolean {
    if (!metadata || !metadata.last_data_timestamp) return true;

    const latestTimestamp = this.getLatestTimestamp(currentData, timestampField);
    return latestTimestamp > metadata.last_data_timestamp;
  }

  /**
   * Check if ID-based changes exist
   */
  private hasIdChanges(currentData: any[], metadata: ChangeDetectionMetadata | null, idField: string): boolean {
    if (!metadata || !metadata.known_record_ids) return true;

    const knownIds = JSON.parse(metadata.known_record_ids);
    const currentIds = currentData.map(item => item[idField]).filter(id => id);
    
    return currentIds.some(id => !knownIds.includes(id));
  }

  /**
   * Check if content hash changes exist
   */
  private hasContentHashChanges(currentHash: string, metadata: ChangeDetectionMetadata | null): boolean {
    if (!metadata || !metadata.content_hash) return true;
    return currentHash !== metadata.content_hash;
  }

  /**
   * Extract new data based on timestamp
   */
  private async extractNewDataByTimestamp(
    currentData: any[], 
    metadata: ChangeDetectionMetadata | null, 
    dataSource: DataSource
  ): Promise<FundamentalDataSnapshot[]> {
    const lastTimestamp = metadata?.last_data_timestamp || '1970-01-01T00:00:00Z';
    const timestampField = dataSource.timestampField!;

    return currentData
      .filter(item => item[timestampField] > lastTimestamp)
      .map(item => this.convertToSnapshot(item, dataSource));
  }

  /**
   * Extract new data based on IDs
   */
  private async extractNewDataByIds(
    currentData: any[], 
    metadata: ChangeDetectionMetadata | null, 
    dataSource: DataSource
  ): Promise<FundamentalDataSnapshot[]> {
    const knownIds = metadata ? JSON.parse(metadata.known_record_ids) : [];
    const idField = dataSource.idField!;

    return currentData
      .filter(item => item[idField] && !knownIds.includes(item[idField]))
      .map(item => this.convertToSnapshot(item, dataSource));
  }

  /**
   * Extract new data based on content hash (all data is considered new)
   */
  private async extractNewDataByHash(currentData: any[], dataSource: DataSource): Promise<FundamentalDataSnapshot[]> {
    return currentData.map(item => this.convertToSnapshot(item, dataSource));
  }

  /**
   * Convert raw data item to FundamentalDataSnapshot
   */
  private convertToSnapshot(item: any, dataSource: DataSource): FundamentalDataSnapshot {
    const timestamp = new Date().toISOString();
    const value = this.extractNumericValue(item, dataSource.dataType);
    
    return {
      asset: dataSource.asset,
      data_type: dataSource.dataType,
      value: value,
      timestamp: timestamp,
      source: dataSource.name,
      content_hash: this.calculateItemHash(item),
      last_updated: timestamp,
      change_detected: true
    };
  }

  /**
   * Extract numeric value from data item based on data type
   */
  private extractNumericValue(item: any, dataType: string): number {
    switch (dataType) {
      case 'earnings':
        return parseFloat(item.earnings || item.netIncome || item.value || 0);
      case 'revenue':
        return parseFloat(item.revenue || item.totalRevenue || item.value || 0);
      case 'debt_ratio':
        return parseFloat(item.debtToEquity || item.debtRatio || item.value || 0);
      case 'profit_margin':
        return parseFloat(item.profitMargin || item.netMargin || item.value || 0);
      case 'roe':
        return parseFloat(item.returnOnEquity || item.roe || item.value || 0);
      case 'economic_indicator':
        return parseFloat(item.actual || item.value || item.current || 0);
      default:
        return parseFloat(item.value || item.price || item.rate || 0);
    }
  }

  /**
   * Calculate content hash for data array
   */
  private calculateContentHash(data: any[]): string {
    const content = JSON.stringify(data, Object.keys(data).sort());
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Calculate hash for individual item
   */
  private calculateItemHash(item: any): string {
    const content = JSON.stringify(item, Object.keys(item).sort());
    return crypto.createHash('md5').update(content).digest('hex');
  }

  /**
   * Get latest timestamp from data array
   */
  private getLatestTimestamp(data: any[], timestampField: string): string {
    return data.reduce((latest, item) => {
      const timestamp = item[timestampField];
      return timestamp > latest ? timestamp : latest;
    }, '1970-01-01T00:00:00Z');
  }

  /**
   * Update detection metadata after successful change detection
   */
  private async updateDetectionMetadata(
    dataSource: DataSource, 
    currentData: any[], 
    detectionMethod: string
  ): Promise<void> {
    const now = new Date().toISOString();
    const assetKey = `${dataSource.asset}_${dataSource.dataType}`;

    let knownIds: string[] = [];
    let contentHash = '';
    let lastDataTimestamp = now;

    if (detectionMethod === 'id' && dataSource.idField) {
      knownIds = currentData.map(item => item[dataSource.idField!]).filter(id => id);
    }

    if (detectionMethod === 'hash') {
      contentHash = this.calculateContentHash(currentData);
    }

    if (detectionMethod === 'timestamp' && dataSource.timestampField) {
      lastDataTimestamp = this.getLatestTimestamp(currentData, dataSource.timestampField);
    }

    const metadata: ChangeDetectionMetadata = {
      asset: assetKey,
      last_check_timestamp: now,
      last_data_timestamp: lastDataTimestamp,
      known_record_ids: JSON.stringify(knownIds),
      content_hash: contentHash,
      check_frequency_minutes: 240, // 4 hours default
      next_scheduled_check: new Date(Date.now() + 240 * 60 * 1000).toISOString()
    };

    this.db.updateChangeDetectionMetadata(metadata);
  }

  /**
   * Get assets that need checking based on schedule
   */
  getAssetsNeedingCheck(): string[] {
    const now = new Date().toISOString();
    const assetsToCheck: string[] = [];

    for (const asset of this.SUPPORTED_ASSETS) {
      const dataTypes = ['earnings', 'revenue', 'debt_ratio', 'economic_indicator'];
      
      for (const dataType of dataTypes) {
        const assetKey = `${asset}_${dataType}`;
        const metadata = this.db.getChangeDetectionMetadata(assetKey);
        
        if (!metadata || metadata.next_scheduled_check <= now) {
          assetsToCheck.push(assetKey);
        }
      }
    }

    return assetsToCheck;
  }

  /**
   * Reset detection metadata for an asset (useful for testing)
   */
  resetDetectionMetadata(asset: string, dataType: string): void {
    const assetKey = `${asset}_${dataType}`;
    const now = new Date().toISOString();

    const metadata: ChangeDetectionMetadata = {
      asset: assetKey,
      last_check_timestamp: '1970-01-01T00:00:00Z',
      last_data_timestamp: '1970-01-01T00:00:00Z',
      known_record_ids: '[]',
      content_hash: '',
      check_frequency_minutes: 240,
      next_scheduled_check: now
    };

    this.db.updateChangeDetectionMetadata(metadata);
    console.log(`[CHANGE_DETECTION] Reset metadata for ${assetKey}`);
  }
}

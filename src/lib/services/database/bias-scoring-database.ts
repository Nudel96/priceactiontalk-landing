/**
 * Bias Scoring Database - SQLite database management for fundamental bias scoring system
 * Handles storage of fundamental data snapshots, bias scores, and change detection metadata
 */

import Database from 'better-sqlite3';
import path from 'path';

export interface FundamentalDataSnapshot {
  id?: number;
  asset: string;
  data_type: string; // 'earnings', 'revenue', 'debt_ratio', 'economic_indicator', etc.
  value: number;
  previous_value?: number;
  timestamp: string;
  source: string;
  content_hash: string;
  last_updated: string;
  change_detected: boolean;
}

export interface BiasScore {
  id?: number;
  asset: string;
  timestamp: string;
  
  // Individual factor scores (-1, 0, +1)
  earnings_growth_score: number;
  revenue_trend_score: number;
  profit_margin_score: number;
  debt_level_score: number;
  liquidity_score: number;
  roe_score: number;
  guidance_score: number;
  external_factors_score: number;
  
  // Total score and bias
  total_score: number;
  bias: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  confidence: number; // 0-1 scale
  
  // Supporting data
  bullish_factors: string; // JSON array
  bearish_factors: string; // JSON array
  last_updated: string;
}

export interface ChangeDetectionMetadata {
  id?: number;
  asset: string;
  last_check_timestamp: string;
  last_data_timestamp: string;
  known_record_ids: string; // JSON array
  content_hash: string;
  check_frequency_minutes: number;
  next_scheduled_check: string;
}

export class BiasScoringDatabase {
  private db: Database.Database;
  private dbPath: string;

  constructor(dbPath?: string) {
    this.dbPath = dbPath || path.join(process.cwd(), 'bias_scoring.db');
    this.db = new Database(this.dbPath);
    this.initializeTables();
  }

  /**
   * Initialize database tables
   */
  private initializeTables(): void {
    try {
      // Fundamental data snapshots table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS fundamental_data_snapshots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset TEXT NOT NULL,
          data_type TEXT NOT NULL,
          value REAL NOT NULL,
          previous_value REAL,
          timestamp TEXT NOT NULL,
          source TEXT NOT NULL,
          content_hash TEXT NOT NULL,
          last_updated TEXT NOT NULL,
          change_detected BOOLEAN DEFAULT FALSE,
          UNIQUE(asset, data_type, timestamp)
        )
      `);

      // Bias scores table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS bias_scores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          earnings_growth_score INTEGER DEFAULT 0,
          revenue_trend_score INTEGER DEFAULT 0,
          profit_margin_score INTEGER DEFAULT 0,
          debt_level_score INTEGER DEFAULT 0,
          liquidity_score INTEGER DEFAULT 0,
          roe_score INTEGER DEFAULT 0,
          guidance_score INTEGER DEFAULT 0,
          external_factors_score INTEGER DEFAULT 0,
          total_score INTEGER DEFAULT 0,
          bias TEXT NOT NULL,
          confidence REAL DEFAULT 0.5,
          bullish_factors TEXT DEFAULT '[]',
          bearish_factors TEXT DEFAULT '[]',
          last_updated TEXT NOT NULL,
          UNIQUE(asset, timestamp)
        )
      `);

      // Change detection metadata table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS change_detection_metadata (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset TEXT NOT NULL UNIQUE,
          last_check_timestamp TEXT NOT NULL,
          last_data_timestamp TEXT NOT NULL,
          known_record_ids TEXT DEFAULT '[]',
          content_hash TEXT DEFAULT '',
          check_frequency_minutes INTEGER DEFAULT 240,
          next_scheduled_check TEXT NOT NULL
        )
      `);

      // Create indexes for better performance
      this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_fundamental_asset_type ON fundamental_data_snapshots(asset, data_type);
        CREATE INDEX IF NOT EXISTS idx_fundamental_timestamp ON fundamental_data_snapshots(timestamp);
        CREATE INDEX IF NOT EXISTS idx_bias_asset ON bias_scores(asset);
        CREATE INDEX IF NOT EXISTS idx_bias_timestamp ON bias_scores(timestamp);
        CREATE INDEX IF NOT EXISTS idx_change_detection_asset ON change_detection_metadata(asset);
      `);

      console.log('[BIAS_DB] ✅ Database tables initialized successfully');
    } catch (error) {
      console.error('[BIAS_DB] ❌ Error initializing database tables:', error);
      throw error;
    }
  }

  /**
   * Store fundamental data snapshot
   */
  storeFundamentalSnapshot(snapshot: FundamentalDataSnapshot): void {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO fundamental_data_snapshots 
        (asset, data_type, value, previous_value, timestamp, source, content_hash, last_updated, change_detected)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        snapshot.asset,
        snapshot.data_type,
        snapshot.value,
        snapshot.previous_value,
        snapshot.timestamp,
        snapshot.source,
        snapshot.content_hash,
        snapshot.last_updated,
        snapshot.change_detected
      );

      console.log(`[BIAS_DB] Stored fundamental snapshot for ${snapshot.asset} - ${snapshot.data_type}`);
    } catch (error) {
      console.error('[BIAS_DB] Error storing fundamental snapshot:', error);
      throw error;
    }
  }

  /**
   * Get latest fundamental data for an asset
   */
  getLatestFundamentalData(asset: string, dataType?: string): FundamentalDataSnapshot[] {
    try {
      let query = `
        SELECT * FROM fundamental_data_snapshots 
        WHERE asset = ?
      `;
      const params: any[] = [asset];

      if (dataType) {
        query += ` AND data_type = ?`;
        params.push(dataType);
      }

      query += ` ORDER BY timestamp DESC LIMIT 50`;

      const stmt = this.db.prepare(query);
      return stmt.all(...params) as FundamentalDataSnapshot[];
    } catch (error) {
      console.error('[BIAS_DB] Error getting fundamental data:', error);
      return [];
    }
  }

  /**
   * Store bias score
   */
  storeBiasScore(score: BiasScore): void {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO bias_scores 
        (asset, timestamp, earnings_growth_score, revenue_trend_score, profit_margin_score, 
         debt_level_score, liquidity_score, roe_score, guidance_score, external_factors_score,
         total_score, bias, confidence, bullish_factors, bearish_factors, last_updated)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        score.asset,
        score.timestamp,
        score.earnings_growth_score,
        score.revenue_trend_score,
        score.profit_margin_score,
        score.debt_level_score,
        score.liquidity_score,
        score.roe_score,
        score.guidance_score,
        score.external_factors_score,
        score.total_score,
        score.bias,
        score.confidence,
        score.bullish_factors,
        score.bearish_factors,
        score.last_updated
      );

      console.log(`[BIAS_DB] Stored bias score for ${score.asset}: ${score.bias} (${score.total_score})`);
    } catch (error) {
      console.error('[BIAS_DB] Error storing bias score:', error);
      throw error;
    }
  }

  /**
   * Get latest bias score for an asset
   */
  getLatestBiasScore(asset: string): BiasScore | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM bias_scores 
        WHERE asset = ? 
        ORDER BY timestamp DESC 
        LIMIT 1
      `);
      
      return stmt.get(asset) as BiasScore || null;
    } catch (error) {
      console.error('[BIAS_DB] Error getting bias score:', error);
      return null;
    }
  }

  /**
   * Get all latest bias scores
   */
  getAllLatestBiasScores(): BiasScore[] {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM bias_scores b1
        WHERE b1.timestamp = (
          SELECT MAX(b2.timestamp) 
          FROM bias_scores b2 
          WHERE b2.asset = b1.asset
        )
        ORDER BY b1.asset
      `);
      
      return stmt.all() as BiasScore[];
    } catch (error) {
      console.error('[BIAS_DB] Error getting all bias scores:', error);
      return [];
    }
  }

  /**
   * Update change detection metadata
   */
  updateChangeDetectionMetadata(metadata: ChangeDetectionMetadata): void {
    try {
      const stmt = this.db.prepare(`
        INSERT OR REPLACE INTO change_detection_metadata 
        (asset, last_check_timestamp, last_data_timestamp, known_record_ids, 
         content_hash, check_frequency_minutes, next_scheduled_check)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        metadata.asset,
        metadata.last_check_timestamp,
        metadata.last_data_timestamp,
        metadata.known_record_ids,
        metadata.content_hash,
        metadata.check_frequency_minutes,
        metadata.next_scheduled_check
      );

      console.log(`[BIAS_DB] Updated change detection metadata for ${metadata.asset}`);
    } catch (error) {
      console.error('[BIAS_DB] Error updating change detection metadata:', error);
      throw error;
    }
  }

  /**
   * Get change detection metadata for an asset
   */
  getChangeDetectionMetadata(asset: string): ChangeDetectionMetadata | null {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM change_detection_metadata 
        WHERE asset = ?
      `);
      
      return stmt.get(asset) as ChangeDetectionMetadata || null;
    } catch (error) {
      console.error('[BIAS_DB] Error getting change detection metadata:', error);
      return null;
    }
  }

  /**
   * Close database connection
   */
  close(): void {
    this.db.close();
  }
}

/**
 * Bias Scoring Engine - Point-based fundamental analysis scoring system
 * Implements comprehensive scoring with fundamental factors and bias interpretation
 */

import { BiasScoringDatabase, type FundamentalDataSnapshot, type BiasScore } from '../database/bias-scoring-database';

export interface FundamentalFactor {
  name: string;
  weight: number; // 1-3 scale (1=low importance, 3=high importance)
  dataType: string;
  isPositive: boolean; // true if higher values are bullish
  description: string;
  thresholds: {
    strong_bullish: number;
    bullish: number;
    neutral_high: number;
    neutral_low: number;
    bearish: number;
    strong_bearish: number;
  };
}

export interface ScoringResult {
  asset: string;
  timestamp: string;
  factorScores: Map<string, number>;
  totalScore: number;
  weightedScore: number;
  bias: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
  confidence: number;
  bullishFactors: string[];
  bearishFactors: string[];
  processingTime: number;
}

export class BiasScoringEngine {
  private db: BiasScoringDatabase;
  private fundamentalFactors: Map<string, FundamentalFactor> = new Map();

  constructor(database: BiasScoringDatabase) {
    this.db = database;
    this.initializeFundamentalFactors();
  }

  /**
   * Calculate comprehensive bias score for an asset
   */
  async calculateBiasScore(asset: string): Promise<ScoringResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      console.log(`[BIAS_SCORING] Calculating bias score for ${asset}`);

      // Get latest fundamental data for the asset
      const fundamentalData = this.db.getLatestFundamentalData(asset);
      
      if (fundamentalData.length === 0) {
        console.log(`[BIAS_SCORING] No fundamental data found for ${asset}, using neutral score`);
        return this.createNeutralResult(asset, timestamp, Date.now() - startTime);
      }

      // Calculate individual factor scores
      const factorScores = new Map<string, number>();
      const bullishFactors: string[] = [];
      const bearishFactors: string[] = [];

      for (const [factorName, factor] of this.fundamentalFactors) {
        const score = this.calculateFactorScore(fundamentalData, factor);
        factorScores.set(factorName, score);

        // Track bullish/bearish factors
        if (score > 0) {
          bullishFactors.push(`${factor.description} (+${score})`);
        } else if (score < 0) {
          bearishFactors.push(`${factor.description} (${score})`);
        }
      }

      // Calculate total and weighted scores
      const totalScore = Array.from(factorScores.values()).reduce((sum, score) => sum + score, 0);
      const weightedScore = this.calculateWeightedScore(factorScores);

      // Determine bias and confidence
      const bias = this.determineBias(weightedScore);
      const confidence = this.calculateConfidence(factorScores, fundamentalData.length);

      const result: ScoringResult = {
        asset,
        timestamp,
        factorScores,
        totalScore,
        weightedScore,
        bias,
        confidence,
        bullishFactors,
        bearishFactors,
        processingTime: Date.now() - startTime
      };

      // Store the bias score in database
      await this.storeBiasScore(result);

      console.log(`[BIAS_SCORING] ✅ Calculated bias for ${asset}: ${bias} (Score: ${weightedScore.toFixed(2)}, Confidence: ${(confidence * 100).toFixed(1)}%)`);
      return result;

    } catch (error) {
      console.error(`[BIAS_SCORING] ❌ Error calculating bias score for ${asset}:`, error);
      return this.createNeutralResult(asset, timestamp, Date.now() - startTime);
    }
  }

  /**
   * Calculate score for a specific fundamental factor
   */
  private calculateFactorScore(fundamentalData: FundamentalDataSnapshot[], factor: FundamentalFactor): number {
    // Find the most recent data point for this factor
    const relevantData = fundamentalData
      .filter(data => data.data_type === factor.dataType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (relevantData.length === 0) {
      return 0; // No data available for this factor
    }

    const currentData = relevantData[0];
    const currentValue = currentData.value;
    const previousValue = currentData.previous_value;

    // Calculate change-based score if we have previous value
    let changeScore = 0;
    if (previousValue !== undefined && previousValue !== null) {
      const changePercent = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
      changeScore = this.getChangeScore(changePercent, factor);
    }

    // Calculate absolute value score
    const absoluteScore = this.getAbsoluteScore(currentValue, factor);

    // Combine scores (change is weighted more heavily for recent data)
    const hasRecentChange = currentData.change_detected;
    const finalScore = hasRecentChange 
      ? (changeScore * 0.7 + absoluteScore * 0.3)
      : absoluteScore;

    return Math.round(finalScore);
  }

  /**
   * Get score based on change percentage
   */
  private getChangeScore(changePercent: number, factor: FundamentalFactor): number {
    const absChange = Math.abs(changePercent);
    const direction = factor.isPositive ? 1 : -1;
    const sign = changePercent >= 0 ? 1 : -1;

    if (absChange >= 20) return 2 * direction * sign; // Strong change
    if (absChange >= 10) return 1 * direction * sign; // Moderate change
    if (absChange >= 5) return 0.5 * direction * sign; // Slight change
    return 0; // No significant change
  }

  /**
   * Get score based on absolute value
   */
  private getAbsoluteScore(value: number, factor: FundamentalFactor): number {
    const thresholds = factor.thresholds;
    const direction = factor.isPositive ? 1 : -1;

    if (factor.isPositive) {
      if (value >= thresholds.strong_bullish) return 2;
      if (value >= thresholds.bullish) return 1;
      if (value >= thresholds.neutral_high) return 0;
      if (value >= thresholds.neutral_low) return 0;
      if (value >= thresholds.bearish) return -1;
      return -2;
    } else {
      if (value <= thresholds.strong_bullish) return 2;
      if (value <= thresholds.bullish) return 1;
      if (value <= thresholds.neutral_low) return 0;
      if (value <= thresholds.neutral_high) return 0;
      if (value <= thresholds.bearish) return -1;
      return -2;
    }
  }

  /**
   * Calculate weighted score considering factor importance
   */
  private calculateWeightedScore(factorScores: Map<string, number>): number {
    let weightedSum = 0;
    let totalWeight = 0;

    for (const [factorName, score] of factorScores) {
      const factor = this.fundamentalFactors.get(factorName);
      if (factor) {
        weightedSum += score * factor.weight;
        totalWeight += factor.weight;
      }
    }

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Determine bias based on weighted score
   */
  private determineBias(weightedScore: number): 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH' {
    if (weightedScore >= 1.5) return 'STRONG_BULLISH';
    if (weightedScore >= 0.5) return 'BULLISH';
    if (weightedScore >= -0.5) return 'NEUTRAL';
    if (weightedScore >= -1.5) return 'BEARISH';
    return 'STRONG_BEARISH';
  }

  /**
   * Calculate confidence based on data quality and consistency
   */
  private calculateConfidence(factorScores: Map<string, number>, dataPointCount: number): number {
    // Base confidence on data availability
    const dataQuality = Math.min(dataPointCount / 10, 1); // Max confidence with 10+ data points

    // Reduce confidence if scores are conflicting
    const scores = Array.from(factorScores.values());
    const positiveScores = scores.filter(s => s > 0).length;
    const negativeScores = scores.filter(s => s < 0).length;
    const totalScores = scores.filter(s => s !== 0).length;

    let consistency = 1;
    if (totalScores > 0) {
      const majorityDirection = positiveScores > negativeScores ? positiveScores : negativeScores;
      consistency = majorityDirection / totalScores;
    }

    return Math.min(dataQuality * consistency, 1);
  }

  /**
   * Store bias score in database
   */
  private async storeBiasScore(result: ScoringResult): Promise<void> {
    const biasScore: BiasScore = {
      asset: result.asset,
      timestamp: result.timestamp,
      earnings_growth_score: result.factorScores.get('earnings_growth') || 0,
      revenue_trend_score: result.factorScores.get('revenue_trend') || 0,
      profit_margin_score: result.factorScores.get('profit_margin') || 0,
      debt_level_score: result.factorScores.get('debt_level') || 0,
      liquidity_score: result.factorScores.get('liquidity') || 0,
      roe_score: result.factorScores.get('roe') || 0,
      guidance_score: result.factorScores.get('guidance') || 0,
      external_factors_score: result.factorScores.get('external_factors') || 0,
      total_score: result.totalScore,
      bias: result.bias,
      confidence: result.confidence,
      bullish_factors: JSON.stringify(result.bullishFactors),
      bearish_factors: JSON.stringify(result.bearishFactors),
      last_updated: result.timestamp
    };

    this.db.storeBiasScore(biasScore);
  }

  /**
   * Create neutral result for assets with no data
   */
  private createNeutralResult(asset: string, timestamp: string, processingTime: number): ScoringResult {
    return {
      asset,
      timestamp,
      factorScores: new Map(),
      totalScore: 0,
      weightedScore: 0,
      bias: 'NEUTRAL',
      confidence: 0.1,
      bullishFactors: [],
      bearishFactors: ['No fundamental data available'],
      processingTime
    };
  }

  /**
   * Initialize fundamental factors with their scoring criteria
   */
  private initializeFundamentalFactors(): void {
    const factors: FundamentalFactor[] = [
      {
        name: 'earnings_growth',
        weight: 3,
        dataType: 'earnings',
        isPositive: true,
        description: 'Earnings Growth',
        thresholds: {
          strong_bullish: 20, // >20% growth
          bullish: 10,        // >10% growth
          neutral_high: 5,    // >5% growth
          neutral_low: -5,    // >-5% decline
          bearish: -10,       // >-10% decline
          strong_bearish: -20 // <-20% decline
        }
      },
      {
        name: 'revenue_trend',
        weight: 3,
        dataType: 'revenue',
        isPositive: true,
        description: 'Revenue Trend',
        thresholds: {
          strong_bullish: 15,
          bullish: 8,
          neutral_high: 3,
          neutral_low: -3,
          bearish: -8,
          strong_bearish: -15
        }
      },
      {
        name: 'profit_margin',
        weight: 2,
        dataType: 'profit_margin',
        isPositive: true,
        description: 'Profit Margin',
        thresholds: {
          strong_bullish: 25,
          bullish: 15,
          neutral_high: 10,
          neutral_low: 5,
          bearish: 2,
          strong_bearish: 0
        }
      },
      {
        name: 'debt_level',
        weight: 2,
        dataType: 'debt_ratio',
        isPositive: false, // Lower debt is better
        description: 'Debt Level',
        thresholds: {
          strong_bullish: 0.3, // <30% debt ratio
          bullish: 0.5,        // <50% debt ratio
          neutral_high: 0.7,   // <70% debt ratio
          neutral_low: 1.0,    // <100% debt ratio
          bearish: 1.5,        // <150% debt ratio
          strong_bearish: 2.0  // >200% debt ratio
        }
      },
      {
        name: 'roe',
        weight: 2,
        dataType: 'roe',
        isPositive: true,
        description: 'Return on Equity',
        thresholds: {
          strong_bullish: 20,
          bullish: 15,
          neutral_high: 10,
          neutral_low: 5,
          bearish: 0,
          strong_bearish: -5
        }
      },
      {
        name: 'external_factors',
        weight: 2,
        dataType: 'economic_indicator',
        isPositive: true,
        description: 'External Economic Factors',
        thresholds: {
          strong_bullish: 80,
          bullish: 60,
          neutral_high: 55,
          neutral_low: 45,
          bearish: 40,
          strong_bearish: 20
        }
      }
    ];

    for (const factor of factors) {
      this.fundamentalFactors.set(factor.name, factor);
    }

    console.log(`[BIAS_SCORING] Initialized ${factors.length} fundamental factors`);
  }

  /**
   * Get all bias scores for all assets
   */
  async getAllBiasScores(): Promise<BiasScore[]> {
    return this.db.getAllLatestBiasScores();
  }

  /**
   * Get bias score for specific asset
   */
  async getBiasScore(asset: string): Promise<BiasScore | null> {
    return this.db.getLatestBiasScore(asset);
  }

  /**
   * Recalculate all asset scores
   */
  async recalculateAllScores(): Promise<ScoringResult[]> {
    const assets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
    const results: ScoringResult[] = [];

    console.log('[BIAS_SCORING] Recalculating scores for all assets...');

    for (const asset of assets) {
      try {
        const result = await this.calculateBiasScore(asset);
        results.push(result);
      } catch (error) {
        console.error(`[BIAS_SCORING] Error calculating score for ${asset}:`, error);
      }
    }

    console.log(`[BIAS_SCORING] ✅ Recalculated scores for ${results.length}/${assets.length} assets`);
    return results;
  }

  /**
   * Get fundamental factors configuration
   */
  getFundamentalFactors(): Map<string, FundamentalFactor> {
    return this.fundamentalFactors;
  }

  /**
   * Update fundamental factor configuration
   */
  updateFundamentalFactor(factorName: string, factor: FundamentalFactor): void {
    this.fundamentalFactors.set(factorName, factor);
    console.log(`[BIAS_SCORING] Updated fundamental factor: ${factorName}`);
  }
}

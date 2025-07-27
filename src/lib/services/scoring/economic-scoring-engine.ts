/**
 * Economic Scoring Engine - Advanced point-based analysis system
 * Generates bullish/bearish signals based on economic data surprises and trends
 */

import type { 
  AssetCode, 
  EconomicDataPoint, 
  COTData, 
  SentimentData,
  AssetScore,
  IndicatorType 
} from '$lib/types/advanced-economic';

interface ScoringWeights {
  economic_surprise: number;
  trend_momentum: number;
  cot_positioning: number;
  sentiment_contrarian: number;
  central_bank_policy: number;
  data_freshness: number;
}

interface IndicatorScoring {
  indicator: IndicatorType;
  weight: number;
  isPositive: boolean;
  criticalLevel?: number;
  description: string;
}

export class EconomicScoringEngine {
  private readonly DEFAULT_WEIGHTS: ScoringWeights = {
    economic_surprise: 0.35,    // 35% - Economic data surprises
    trend_momentum: 0.25,       // 25% - Trend analysis
    cot_positioning: 0.20,      // 20% - COT smart money positioning
    sentiment_contrarian: 0.10, // 10% - Contrarian sentiment analysis
    central_bank_policy: 0.10,  // 10% - Central bank policy stance
    data_freshness: 0.05        // 5% - Data recency penalty
  };

  // Indicator importance and characteristics
  private readonly INDICATOR_CONFIGS: IndicatorScoring[] = [
    {
      indicator: 'UNEMPLOYMENT',
      weight: 5,
      isPositive: false, // Lower is better
      criticalLevel: 5.0,
      description: 'Unemployment Rate - Lower values indicate stronger economy'
    },
    {
      indicator: 'INFLATION_CPI',
      weight: 5,
      isPositive: false, // Depends on target, but generally moderate is best
      criticalLevel: 3.0,
      description: 'Consumer Price Index - Target around 2-3%'
    },
    {
      indicator: 'GDP_GROWTH',
      weight: 5,
      isPositive: true,
      criticalLevel: 2.0,
      description: 'GDP Growth Rate - Higher growth strengthens currency'
    },
    {
      indicator: 'INTEREST_RATE',
      weight: 5,
      isPositive: true, // Higher rates generally strengthen currency
      description: 'Central Bank Interest Rate - Higher rates attract capital'
    },
    {
      indicator: 'PMI_MANUFACTURING',
      weight: 4,
      isPositive: true,
      criticalLevel: 50.0,
      description: 'Manufacturing PMI - Above 50 indicates expansion'
    },
    {
      indicator: 'PMI_SERVICES',
      weight: 4,
      isPositive: true,
      criticalLevel: 50.0,
      description: 'Services PMI - Above 50 indicates expansion'
    },
    {
      indicator: 'RETAIL_SALES',
      weight: 4,
      isPositive: true,
      description: 'Retail Sales - Consumer spending indicator'
    },
    {
      indicator: 'INDUSTRIAL_PRODUCTION',
      weight: 3,
      isPositive: true,
      description: 'Industrial Production - Manufacturing output'
    },
    {
      indicator: 'CONSUMER_CONFIDENCE',
      weight: 3,
      isPositive: true,
      description: 'Consumer Confidence - Future spending indicator'
    },
    {
      indicator: 'TRADE_BALANCE',
      weight: 3,
      isPositive: true, // Surplus is generally positive
      description: 'Trade Balance - Export vs Import balance'
    }
  ];

  /**
   * Calculate comprehensive score for an asset
   */
  async calculateAssetScore(
    asset: AssetCode,
    economicData: EconomicDataPoint[],
    cotData?: COTData,
    sentimentData?: SentimentData,
    customWeights?: Partial<ScoringWeights>
  ): Promise<AssetScore> {
    const weights = { ...this.DEFAULT_WEIGHTS, ...customWeights };
    const timestamp = new Date().toISOString();

    // Filter data for this asset
    const assetData = economicData.filter(dp => dp.asset === asset);

    // Calculate component scores
    const economicScore = this.calculateEconomicScore(assetData);
    const sentimentScore = this.calculateSentimentScore(cotData, sentimentData);
    const cotScore = this.calculateCOTScore(cotData);
    const technicalScore = 0; // Placeholder for technical analysis
    const centralBankScore = this.calculateCentralBankScore(assetData);

    // Apply weights and calculate total
    const weightedScores = {
      economic: economicScore * weights.economic_surprise,
      sentiment: sentimentScore * weights.sentiment_contrarian,
      cot: cotScore * weights.cot_positioning,
      technical: technicalScore * weights.trend_momentum,
      central_bank: centralBankScore * weights.central_bank_policy
    };

    const totalScore = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);
    const normalizedScore = Math.max(-1, Math.min(1, totalScore / 15)); // Normalize to -1 to +1

    // Generate signal
    const signal = this.generateSignal(normalizedScore);
    const confidence = this.calculateConfidence(assetData, totalScore);

    // Identify factors
    const { bullishFactors, bearishFactors } = this.identifyFactors(assetData, cotData, sentimentData);

    return {
      asset,
      timestamp,
      economic_score: economicScore,
      sentiment_score: sentimentScore,
      cot_score: cotScore,
      technical_score: technicalScore,
      central_bank_score: centralBankScore,
      total_score: totalScore,
      normalized_score: normalizedScore,
      signal,
      confidence,
      bullish_factors: bullishFactors,
      bearish_factors: bearishFactors,
      last_updated: timestamp
    };
  }

  private calculateEconomicScore(data: EconomicDataPoint[]): number {
    if (data.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const dataPoint of data) {
      const config = this.INDICATOR_CONFIGS.find(c => c.indicator === dataPoint.indicator);
      if (!config) continue;

      let pointScore = 0;

      // Surprise score (actual vs forecast)
      if (dataPoint.surprise_score !== undefined) {
        pointScore += dataPoint.surprise_score * 2; // -2 to +2
      }

      // Trend score
      if (dataPoint.trend_score !== undefined) {
        pointScore += dataPoint.trend_score; // -1 to +1
      }

      // Absolute level check (for indicators with critical levels)
      if (config.criticalLevel && dataPoint.actual !== undefined) {
        if (config.isPositive) {
          pointScore += dataPoint.actual > config.criticalLevel ? 1 : -1;
        } else {
          pointScore += dataPoint.actual < config.criticalLevel ? 1 : -1;
        }
      }

      // Data freshness penalty
      const ageHours = this.getDataAgeHours(dataPoint.timestamp);
      const freshnessPenalty = Math.min(0.5, ageHours / 168); // Max 0.5 penalty after 1 week
      pointScore *= (1 - freshnessPenalty);

      totalScore += pointScore * config.weight;
      totalWeight += config.weight;
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  private calculateSentimentScore(cotData?: COTData, sentimentData?: SentimentData): number {
    let score = 0;

    // COT-based sentiment (contrarian approach)
    if (cotData) {
      // Follow smart money (commercial traders)
      if (cotData.commercial_sentiment === 'BULLISH') score += 2;
      else if (cotData.commercial_sentiment === 'BEARISH') score -= 2;

      // Contrarian to retail sentiment
      if (cotData.retail_sentiment === 'BULLISH') score -= 1;
      else if (cotData.retail_sentiment === 'BEARISH') score += 1;
    }

    // Retail sentiment (contrarian approach)
    if (sentimentData) {
      score += sentimentData.contrarian_score * 2;
    }

    return Math.max(-3, Math.min(3, score));
  }

  private calculateCOTScore(cotData?: COTData): number {
    if (!cotData) return 0;

    let score = 0;

    // Commercial net positioning (smart money)
    const commercialBias = cotData.commercial_net > 0 ? 1 : -1;
    const commercialStrength = Math.min(2, Math.abs(cotData.commercial_net) / 10000);
    score += commercialBias * commercialStrength;

    // Retail positioning (contrarian)
    const retailBias = cotData.retail_net > 0 ? -0.5 : 0.5;
    score += retailBias;

    return Math.max(-3, Math.min(3, score));
  }

  private calculateCentralBankScore(data: EconomicDataPoint[]): number {
    const interestRateData = data.find(dp => dp.indicator === 'INTEREST_RATE');
    const inflationData = data.find(dp => dp.indicator === 'INFLATION_CPI');

    let score = 0;

    // Interest rate trend
    if (interestRateData?.trend_score) {
      score += interestRateData.trend_score * 2; // Rate hikes are bullish for currency
    }

    // Inflation vs target analysis
    if (inflationData?.actual !== undefined) {
      const inflationTarget = 2.0; // Assume 2% target
      const deviation = Math.abs(inflationData.actual - inflationTarget);
      
      if (deviation < 0.5) {
        score += 1; // On target is good
      } else if (inflationData.actual > inflationTarget + 1) {
        score += 0.5; // High inflation may lead to rate hikes
      } else {
        score -= 0.5; // Too low inflation is concerning
      }
    }

    return Math.max(-3, Math.min(3, score));
  }

  private generateSignal(normalizedScore: number): 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL' {
    if (normalizedScore >= 0.6) return 'STRONG_BUY';
    if (normalizedScore >= 0.2) return 'BUY';
    if (normalizedScore >= -0.2) return 'HOLD';
    if (normalizedScore >= -0.6) return 'SELL';
    return 'STRONG_SELL';
  }

  private calculateConfidence(data: EconomicDataPoint[], totalScore: number): number {
    let confidence = 0.5; // Base confidence

    // More data points increase confidence
    const dataPointBonus = Math.min(0.3, data.length * 0.05);
    confidence += dataPointBonus;

    // Recent data increases confidence
    const avgAge = data.reduce((sum, dp) => sum + this.getDataAgeHours(dp.timestamp), 0) / data.length;
    const freshnessBonus = Math.max(0, 0.2 - avgAge / 168); // Bonus decreases over week
    confidence += freshnessBonus;

    // Strong signals increase confidence
    const strengthBonus = Math.min(0.2, Math.abs(totalScore) / 10);
    confidence += strengthBonus;

    return Math.max(0, Math.min(1, confidence));
  }

  private identifyFactors(
    data: EconomicDataPoint[], 
    cotData?: COTData, 
    sentimentData?: SentimentData
  ): { bullishFactors: string[]; bearishFactors: string[] } {
    const bullishFactors: string[] = [];
    const bearishFactors: string[] = [];

    // Economic factors
    for (const dataPoint of data) {
      const config = this.INDICATOR_CONFIGS.find(c => c.indicator === dataPoint.indicator);
      if (!config) continue;

      if (dataPoint.surprise_score === 1) {
        bullishFactors.push(`${config.description} beat expectations`);
      } else if (dataPoint.surprise_score === -1) {
        bearishFactors.push(`${config.description} missed expectations`);
      }

      if (dataPoint.trend_score === 1) {
        bullishFactors.push(`${config.description} showing positive trend`);
      } else if (dataPoint.trend_score === -1) {
        bearishFactors.push(`${config.description} showing negative trend`);
      }
    }

    // COT factors
    if (cotData) {
      if (cotData.commercial_sentiment === 'BULLISH') {
        bullishFactors.push('Smart money (commercial traders) positioned bullish');
      } else if (cotData.commercial_sentiment === 'BEARISH') {
        bearishFactors.push('Smart money (commercial traders) positioned bearish');
      }

      if (cotData.retail_sentiment === 'BULLISH') {
        bearishFactors.push('Retail traders overly bullish (contrarian signal)');
      } else if (cotData.retail_sentiment === 'BEARISH') {
        bullishFactors.push('Retail traders overly bearish (contrarian signal)');
      }
    }

    // Sentiment factors
    if (sentimentData) {
      if (sentimentData.contrarian_score > 0.5) {
        bullishFactors.push('Contrarian sentiment analysis suggests upside');
      } else if (sentimentData.contrarian_score < -0.5) {
        bearishFactors.push('Contrarian sentiment analysis suggests downside');
      }
    }

    return { bullishFactors, bearishFactors };
  }

  private getDataAgeHours(timestamp: string): number {
    return (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60);
  }

  /**
   * Calculate scores for all assets
   */
  async calculateAllAssetScores(
    economicData: EconomicDataPoint[],
    cotDataMap: Map<AssetCode, COTData>,
    sentimentDataMap: Map<AssetCode, SentimentData>
  ): Promise<AssetScore[]> {
    const assets: AssetCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
    const scores: AssetScore[] = [];

    for (const asset of assets) {
      try {
        const assetEconomicData = economicData.filter(dp => dp.asset === asset);
        const cotData = cotDataMap.get(asset);
        const sentimentData = sentimentDataMap.get(asset);

        const score = await this.calculateAssetScore(asset, assetEconomicData, cotData, sentimentData);
        scores.push(score);
      } catch (error) {
        console.error(`Error calculating score for ${asset}:`, error);
      }
    }

    // Sort by total score (descending)
    return scores.sort((a, b) => b.total_score - a.total_score);
  }

  /**
   * Get scoring explanation for an asset
   */
  getScoreExplanation(score: AssetScore): string {
    const explanations: string[] = [];

    explanations.push(`Overall Signal: ${score.signal} (Confidence: ${(score.confidence * 100).toFixed(1)}%)`);
    explanations.push(`Total Score: ${score.total_score.toFixed(2)}/15`);
    
    explanations.push('\nComponent Breakdown:');
    explanations.push(`• Economic Data: ${score.economic_score.toFixed(2)}/5`);
    explanations.push(`• Sentiment Analysis: ${score.sentiment_score.toFixed(2)}/3`);
    explanations.push(`• COT Positioning: ${score.cot_score.toFixed(2)}/3`);
    explanations.push(`• Central Bank Policy: ${score.central_bank_score.toFixed(2)}/3`);

    if (score.bullish_factors.length > 0) {
      explanations.push('\nBullish Factors:');
      score.bullish_factors.forEach(factor => explanations.push(`• ${factor}`));
    }

    if (score.bearish_factors.length > 0) {
      explanations.push('\nBearish Factors:');
      score.bearish_factors.forEach(factor => explanations.push(`• ${factor}`));
    }

    return explanations.join('\n');
  }
}

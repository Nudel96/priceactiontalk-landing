/**
 * Rate Cut Probability Calculator
 * Analyzes economic data to predict central bank rate decisions
 */

import type { AssetCode, EconomicDataPoint, IndicatorType } from '$lib/types/advanced-economic';

interface RateCutProbability {
  asset: AssetCode;
  current_rate: number;
  next_meeting_date: string;
  cut_probability: number;
  hold_probability: number;
  hike_probability: number;
  expected_change: number;
  confidence: number;
  key_factors: string[];
  last_updated: string;
}

interface CentralBankProfile {
  asset: AssetCode;
  bank_name: string;
  inflation_target: number;
  unemployment_target?: number;
  dual_mandate: boolean; // Fed has dual mandate, others focus on inflation
  hawkish_bias: number; // -1 (dovish) to +1 (hawkish)
  meeting_frequency: number; // meetings per year
}

export class RateCutCalculator {
  private readonly CENTRAL_BANKS: CentralBankProfile[] = [
    {
      asset: 'USD',
      bank_name: 'Federal Reserve',
      inflation_target: 2.0,
      unemployment_target: 4.0,
      dual_mandate: true,
      hawkish_bias: 0,
      meeting_frequency: 8
    },
    {
      asset: 'EUR',
      bank_name: 'European Central Bank',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: -0.2, // Historically more dovish
      meeting_frequency: 8
    },
    {
      asset: 'GBP',
      bank_name: 'Bank of England',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: 0.1,
      meeting_frequency: 8
    },
    {
      asset: 'JPY',
      bank_name: 'Bank of Japan',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: -0.5, // Very dovish historically
      meeting_frequency: 8
    },
    {
      asset: 'AUD',
      bank_name: 'Reserve Bank of Australia',
      inflation_target: 2.5,
      dual_mandate: false,
      hawkish_bias: 0,
      meeting_frequency: 11
    },
    {
      asset: 'CAD',
      bank_name: 'Bank of Canada',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: 0,
      meeting_frequency: 8
    },
    {
      asset: 'CHF',
      bank_name: 'Swiss National Bank',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: -0.3, // Historically dovish
      meeting_frequency: 4
    },
    {
      asset: 'CNY',
      bank_name: 'People\'s Bank of China',
      inflation_target: 3.0,
      dual_mandate: false,
      hawkish_bias: 0,
      meeting_frequency: 4
    },
    {
      asset: 'NZD',
      bank_name: 'Reserve Bank of New Zealand',
      inflation_target: 2.0,
      dual_mandate: false,
      hawkish_bias: 0.1,
      meeting_frequency: 7
    }
  ];

  /**
   * Calculate rate cut probability for an asset
   */
  calculateRateCutProbability(
    asset: AssetCode,
    economicData: EconomicDataPoint[],
    currentRate?: number
  ): RateCutProbability {
    const bankProfile = this.CENTRAL_BANKS.find(bank => bank.asset === asset);
    if (!bankProfile) {
      throw new Error(`No central bank profile found for ${asset}`);
    }

    // Get relevant economic indicators
    const inflation = this.getLatestValue(economicData, 'INFLATION_CPI');
    const unemployment = this.getLatestValue(economicData, 'UNEMPLOYMENT');
    const gdpGrowth = this.getLatestValue(economicData, 'GDP_GROWTH');
    const pmiManufacturing = this.getLatestValue(economicData, 'PMI_MANUFACTURING');
    const pmiServices = this.getLatestValue(economicData, 'PMI_SERVICES');
    const retailSales = this.getLatestValue(economicData, 'RETAIL_SALES');

    // Calculate individual factor scores
    const inflationScore = this.calculateInflationScore(inflation, bankProfile);
    const unemploymentScore = this.calculateUnemploymentScore(unemployment, bankProfile);
    const growthScore = this.calculateGrowthScore(gdpGrowth, pmiManufacturing, pmiServices, retailSales);
    const trendScore = this.calculateTrendScore(economicData);

    // Combine scores with weights
    let totalScore = 0;
    let weights = 0;

    // Inflation is always important
    totalScore += inflationScore * 0.4;
    weights += 0.4;

    // Unemployment (if dual mandate)
    if (bankProfile.dual_mandate && unemploymentScore !== null) {
      totalScore += unemploymentScore * 0.3;
      weights += 0.3;
    }

    // Growth indicators
    totalScore += growthScore * 0.2;
    weights += 0.2;

    // Trend analysis
    totalScore += trendScore * 0.1;
    weights += 0.1;

    // Apply central bank bias
    totalScore += bankProfile.hawkish_bias;

    // Normalize score to probability
    const normalizedScore = totalScore / weights;
    
    // Convert to probabilities (sigmoid-like function)
    const cutProbability = this.scoreToProbability(normalizedScore, 'CUT');
    const holdProbability = this.scoreToProbability(normalizedScore, 'HOLD');
    const hikeProbability = this.scoreToProbability(normalizedScore, 'HIKE');

    // Normalize probabilities to sum to 100%
    const total = cutProbability + holdProbability + hikeProbability;
    const normalizedCut = cutProbability / total;
    const normalizedHold = holdProbability / total;
    const normalizedHike = hikeProbability / total;

    // Calculate expected change
    const expectedChange = (normalizedHike * 0.25) + (normalizedHold * 0) + (normalizedCut * -0.25);

    // Identify key factors
    const keyFactors = this.identifyKeyFactors(
      inflation, unemployment, gdpGrowth, pmiManufacturing, bankProfile
    );

    // Calculate confidence based on data quality and consistency
    const confidence = this.calculateConfidence(economicData, normalizedScore);

    return {
      asset,
      current_rate: currentRate || this.getLatestValue(economicData, 'INTEREST_RATE') || 0,
      next_meeting_date: this.estimateNextMeetingDate(bankProfile),
      cut_probability: Math.round(normalizedCut * 100) / 100,
      hold_probability: Math.round(normalizedHold * 100) / 100,
      hike_probability: Math.round(normalizedHike * 100) / 100,
      expected_change: Math.round(expectedChange * 10000) / 10000, // Basis points precision
      confidence: Math.round(confidence * 100) / 100,
      key_factors: keyFactors,
      last_updated: new Date().toISOString()
    };
  }

  private getLatestValue(data: EconomicDataPoint[], indicator: IndicatorType): number | null {
    const indicatorData = data
      .filter(dp => dp.indicator === indicator)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return indicatorData.length > 0 ? indicatorData[0].actual || null : null;
  }

  private calculateInflationScore(inflation: number | null, bankProfile: CentralBankProfile): number {
    if (inflation === null) return 0;

    const target = bankProfile.inflation_target;
    const deviation = inflation - target;

    // Score based on deviation from target
    if (Math.abs(deviation) < 0.2) {
      return 0; // On target - neutral
    } else if (deviation > 1.0) {
      return 1; // High inflation - hawkish (rate hike likely)
    } else if (deviation > 0.5) {
      return 0.5; // Moderately high inflation
    } else if (deviation < -1.0) {
      return -1; // Very low inflation - dovish (rate cut likely)
    } else if (deviation < -0.5) {
      return -0.5; // Moderately low inflation
    }

    return deviation > 0 ? 0.3 : -0.3; // Slight deviation
  }

  private calculateUnemploymentScore(unemployment: number | null, bankProfile: CentralBankProfile): number | null {
    if (!bankProfile.dual_mandate || unemployment === null || !bankProfile.unemployment_target) {
      return null;
    }

    const target = bankProfile.unemployment_target;
    const deviation = unemployment - target;

    // Higher unemployment suggests need for stimulus (rate cuts)
    if (deviation > 2.0) return -1; // Very high unemployment
    if (deviation > 1.0) return -0.5; // High unemployment
    if (Math.abs(deviation) < 0.5) return 0; // On target
    if (deviation < -1.0) return 0.5; // Very low unemployment (overheating)
    if (deviation < -0.5) return 0.3; // Low unemployment

    return 0;
  }

  private calculateGrowthScore(
    gdp: number | null,
    pmiMfg: number | null,
    pmiSvc: number | null,
    retail: number | null
  ): number {
    let score = 0;
    let count = 0;

    // GDP Growth
    if (gdp !== null) {
      if (gdp < 0) score -= 1; // Recession
      else if (gdp < 1) score -= 0.5; // Slow growth
      else if (gdp > 3) score += 0.5; // Strong growth
      count++;
    }

    // PMI Manufacturing
    if (pmiMfg !== null) {
      if (pmiMfg < 45) score -= 0.5; // Contraction
      else if (pmiMfg > 55) score += 0.5; // Strong expansion
      count++;
    }

    // PMI Services
    if (pmiSvc !== null) {
      if (pmiSvc < 45) score -= 0.5; // Contraction
      else if (pmiSvc > 55) score += 0.5; // Strong expansion
      count++;
    }

    return count > 0 ? score / count : 0;
  }

  private calculateTrendScore(data: EconomicDataPoint[]): number {
    const trendScores = data
      .filter(dp => dp.trend_score !== undefined)
      .map(dp => dp.trend_score!);

    if (trendScores.length === 0) return 0;

    const avgTrend = trendScores.reduce((sum, score) => sum + score, 0) / trendScores.length;
    return avgTrend * 0.5; // Moderate weight for trends
  }

  private scoreToProbability(score: number, action: 'CUT' | 'HOLD' | 'HIKE'): number {
    // Convert normalized score to probability using sigmoid-like functions
    switch (action) {
      case 'CUT':
        return Math.max(0.05, 1 / (1 + Math.exp(score * 3))); // Higher for negative scores
      case 'HIKE':
        return Math.max(0.05, 1 / (1 + Math.exp(-score * 3))); // Higher for positive scores
      case 'HOLD':
        return Math.max(0.1, 1 - Math.abs(score) * 0.8); // Higher for neutral scores
      default:
        return 0.33;
    }
  }

  private identifyKeyFactors(
    inflation: number | null,
    unemployment: number | null,
    gdp: number | null,
    pmi: number | null,
    bankProfile: CentralBankProfile
  ): string[] {
    const factors: string[] = [];

    if (inflation !== null) {
      const target = bankProfile.inflation_target;
      if (inflation > target + 1) {
        factors.push(`Inflation at ${inflation.toFixed(1)}% well above ${target}% target`);
      } else if (inflation < target - 1) {
        factors.push(`Inflation at ${inflation.toFixed(1)}% well below ${target}% target`);
      }
    }

    if (unemployment !== null && bankProfile.dual_mandate && bankProfile.unemployment_target) {
      const target = bankProfile.unemployment_target;
      if (unemployment > target + 1) {
        factors.push(`Unemployment at ${unemployment.toFixed(1)}% above ${target}% target`);
      }
    }

    if (gdp !== null) {
      if (gdp < 0) {
        factors.push(`GDP contracting at ${gdp.toFixed(1)}% rate`);
      } else if (gdp > 3) {
        factors.push(`Strong GDP growth at ${gdp.toFixed(1)}%`);
      }
    }

    if (pmi !== null) {
      if (pmi < 45) {
        factors.push(`Manufacturing PMI at ${pmi.toFixed(1)} indicates contraction`);
      } else if (pmi > 55) {
        factors.push(`Manufacturing PMI at ${pmi.toFixed(1)} indicates strong expansion`);
      }
    }

    if (bankProfile.hawkish_bias > 0.2) {
      factors.push(`${bankProfile.bank_name} has historically hawkish bias`);
    } else if (bankProfile.hawkish_bias < -0.2) {
      factors.push(`${bankProfile.bank_name} has historically dovish bias`);
    }

    return factors;
  }

  private calculateConfidence(data: EconomicDataPoint[], score: number): number {
    let confidence = 0.5; // Base confidence

    // More recent data increases confidence
    const avgAge = data.reduce((sum, dp) => {
      const ageHours = (Date.now() - new Date(dp.timestamp).getTime()) / (1000 * 60 * 60);
      return sum + ageHours;
    }, 0) / data.length;

    const freshnessBonus = Math.max(0, 0.3 - avgAge / (24 * 7)); // Bonus decreases over week
    confidence += freshnessBonus;

    // More data points increase confidence
    const dataBonus = Math.min(0.2, data.length * 0.02);
    confidence += dataBonus;

    // Extreme scores increase confidence
    const extremeBonus = Math.min(0.2, Math.abs(score) * 0.1);
    confidence += extremeBonus;

    return Math.max(0.1, Math.min(1, confidence));
  }

  private estimateNextMeetingDate(bankProfile: CentralBankProfile): string {
    // Simple estimation - in practice, you'd use actual meeting calendars
    const now = new Date();
    const daysUntilNext = Math.ceil(365 / bankProfile.meeting_frequency / 2);
    const nextMeeting = new Date(now.getTime() + daysUntilNext * 24 * 60 * 60 * 1000);
    return nextMeeting.toISOString().split('T')[0];
  }

  /**
   * Calculate rate cut probabilities for all major currencies
   */
  calculateAllRateCutProbabilities(
    economicDataMap: Map<AssetCode, EconomicDataPoint[]>
  ): RateCutProbability[] {
    const probabilities: RateCutProbability[] = [];

    for (const bankProfile of this.CENTRAL_BANKS) {
      try {
        const data = economicDataMap.get(bankProfile.asset) || [];
        const probability = this.calculateRateCutProbability(bankProfile.asset, data);
        probabilities.push(probability);
      } catch (error) {
        console.error(`Error calculating rate cut probability for ${bankProfile.asset}:`, error);
      }
    }

    return probabilities.sort((a, b) => b.cut_probability - a.cut_probability);
  }

  /**
   * Get rate cut probability summary
   */
  getRateCutSummary(probabilities: RateCutProbability[]): {
    most_likely_cuts: RateCutProbability[];
    most_likely_hikes: RateCutProbability[];
    neutral_stance: RateCutProbability[];
  } {
    return {
      most_likely_cuts: probabilities.filter(p => p.cut_probability > 0.4).slice(0, 3),
      most_likely_hikes: probabilities.filter(p => p.hike_probability > 0.4).slice(0, 3),
      neutral_stance: probabilities.filter(p => p.hold_probability > 0.5).slice(0, 3)
    };
  }
}

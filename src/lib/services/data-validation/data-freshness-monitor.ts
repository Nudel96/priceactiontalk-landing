/**
 * Data Freshness Monitor - Validates data accuracy and freshness
 * Prevents outdated data from being displayed to users
 */

export interface DataFreshnessCheck {
  source: string;
  asset: string;
  lastUpdated: string;
  currentValue: number;
  expectedRange: { min: number; max: number };
  isFresh: boolean;
  isAccurate: boolean;
  stalenessMinutes: number;
  validationErrors: string[];
}

export interface DataValidationConfig {
  maxStaleMinutes: number;
  priceValidationRanges: Record<string, { min: number; max: number }>;
  criticalAssets: string[];
}

export class DataFreshnessMonitor {
  private config: DataValidationConfig;
  private validationHistory: Map<string, DataFreshnessCheck[]> = new Map();

  constructor(config?: Partial<DataValidationConfig>) {
    this.config = {
      maxStaleMinutes: 5, // Data older than 5 minutes is considered stale
      priceValidationRanges: {
        'XAU': { min: 2000, max: 4000 }, // Gold: $2000-$4000/oz
        'XAG': { min: 20, max: 50 },     // Silver: $20-$50/oz
        'EUR/USD': { min: 0.9, max: 1.3 },
        'GBP/USD': { min: 1.0, max: 1.6 },
        'USD/JPY': { min: 100, max: 200 },
        'AUD/USD': { min: 0.5, max: 0.9 },
        'USD/CAD': { min: 1.0, max: 1.6 },
        'USD/CHF': { min: 0.7, max: 1.2 }
      },
      criticalAssets: ['XAU', 'XAG', 'EUR/USD', 'GBP/USD'],
      ...config
    };
  }

  /**
   * Validate data freshness and accuracy
   */
  validateData(
    source: string,
    asset: string,
    currentValue: number,
    lastUpdated: string
  ): DataFreshnessCheck {
    const now = new Date();
    const updateTime = new Date(lastUpdated);
    const stalenessMinutes = (now.getTime() - updateTime.getTime()) / (1000 * 60);
    
    const validationErrors: string[] = [];
    
    // Check freshness
    const isFresh = stalenessMinutes <= this.config.maxStaleMinutes;
    if (!isFresh) {
      validationErrors.push(`Data is ${stalenessMinutes.toFixed(1)} minutes old (max: ${this.config.maxStaleMinutes})`);
    }
    
    // Check accuracy (price range validation)
    const expectedRange = this.config.priceValidationRanges[asset];
    let isAccurate = true;
    
    if (expectedRange) {
      isAccurate = currentValue >= expectedRange.min && currentValue <= expectedRange.max;
      if (!isAccurate) {
        validationErrors.push(`Price ${currentValue} outside expected range ${expectedRange.min}-${expectedRange.max}`);
      }
    }
    
    const check: DataFreshnessCheck = {
      source,
      asset,
      lastUpdated,
      currentValue,
      expectedRange: expectedRange || { min: 0, max: Infinity },
      isFresh,
      isAccurate,
      stalenessMinutes,
      validationErrors
    };
    
    // Store validation history
    const key = `${source}-${asset}`;
    if (!this.validationHistory.has(key)) {
      this.validationHistory.set(key, []);
    }
    const history = this.validationHistory.get(key)!;
    history.push(check);
    
    // Keep only last 10 checks
    if (history.length > 10) {
      history.shift();
    }
    
    return check;
  }

  /**
   * Get validation status for all monitored assets
   */
  getValidationStatus(): {
    totalAssets: number;
    freshAssets: number;
    accurateAssets: number;
    criticalIssues: DataFreshnessCheck[];
    overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  } {
    const allChecks: DataFreshnessCheck[] = [];
    
    for (const history of this.validationHistory.values()) {
      if (history.length > 0) {
        allChecks.push(history[history.length - 1]); // Latest check
      }
    }
    
    const freshAssets = allChecks.filter(c => c.isFresh).length;
    const accurateAssets = allChecks.filter(c => c.isAccurate).length;
    
    // Check for critical issues
    const criticalIssues = allChecks.filter(check => {
      const isCriticalAsset = this.config.criticalAssets.includes(check.asset);
      const hasIssues = !check.isFresh || !check.isAccurate;
      return isCriticalAsset && hasIssues;
    });
    
    // Determine overall health
    let overallHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL' = 'HEALTHY';
    
    if (criticalIssues.length > 0) {
      overallHealth = 'CRITICAL';
    } else if (freshAssets < allChecks.length * 0.8 || accurateAssets < allChecks.length * 0.9) {
      overallHealth = 'WARNING';
    }
    
    return {
      totalAssets: allChecks.length,
      freshAssets,
      accurateAssets,
      criticalIssues,
      overallHealth
    };
  }

  /**
   * Get validation history for a specific asset
   */
  getAssetHistory(source: string, asset: string): DataFreshnessCheck[] {
    const key = `${source}-${asset}`;
    return this.validationHistory.get(key) || [];
  }

  /**
   * Check if data should be displayed to users
   */
  shouldDisplayData(source: string, asset: string): {
    shouldDisplay: boolean;
    reason?: string;
    fallbackRecommended: boolean;
  } {
    const history = this.getAssetHistory(source, asset);
    if (history.length === 0) {
      return {
        shouldDisplay: false,
        reason: 'No validation data available',
        fallbackRecommended: true
      };
    }
    
    const latestCheck = history[history.length - 1];
    const isCriticalAsset = this.config.criticalAssets.includes(asset);
    
    // Critical assets must be both fresh and accurate
    if (isCriticalAsset) {
      if (!latestCheck.isFresh || !latestCheck.isAccurate) {
        return {
          shouldDisplay: false,
          reason: `Critical asset ${asset} failed validation: ${latestCheck.validationErrors.join(', ')}`,
          fallbackRecommended: true
        };
      }
    }
    
    // Non-critical assets can be displayed if they're at least accurate
    if (!latestCheck.isAccurate) {
      return {
        shouldDisplay: false,
        reason: `Asset ${asset} price outside expected range`,
        fallbackRecommended: true
      };
    }
    
    return {
      shouldDisplay: true,
      fallbackRecommended: !latestCheck.isFresh
    };
  }

  /**
   * Generate alerts for data quality issues
   */
  generateAlerts(): {
    level: 'INFO' | 'WARNING' | 'CRITICAL';
    message: string;
    asset?: string;
    timestamp: string;
  }[] {
    const alerts: any[] = [];
    const status = this.getValidationStatus();
    
    // Critical alerts
    for (const issue of status.criticalIssues) {
      alerts.push({
        level: 'CRITICAL',
        message: `Critical asset ${issue.asset} has data quality issues: ${issue.validationErrors.join(', ')}`,
        asset: issue.asset,
        timestamp: new Date().toISOString()
      });
    }
    
    // Warning alerts
    if (status.overallHealth === 'WARNING') {
      alerts.push({
        level: 'WARNING',
        message: `Data quality degraded: ${status.freshAssets}/${status.totalAssets} assets fresh, ${status.accurateAssets}/${status.totalAssets} accurate`,
        timestamp: new Date().toISOString()
      });
    }
    
    return alerts;
  }

  /**
   * Update validation ranges (for dynamic adjustment)
   */
  updateValidationRange(asset: string, min: number, max: number): void {
    this.config.priceValidationRanges[asset] = { min, max };
  }

  /**
   * Clear validation history
   */
  clearHistory(): void {
    this.validationHistory.clear();
  }
}

// Singleton instance
let instance: DataFreshnessMonitor | null = null;

export function getDataFreshnessMonitor(): DataFreshnessMonitor {
  if (!instance) {
    instance = new DataFreshnessMonitor();
  }
  return instance;
}

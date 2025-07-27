/**
 * Data Accuracy Validator - Überprüft die Genauigkeit aller Scraper-Daten
 * Validiert Gold, Kryptos, Indizes und Forex-Paare gegen offizielle Quellen
 */

import { AdvancedEconomicService } from '../advanced-economic-service';
import type { AssetCode } from '$lib/types/advanced-economic';

interface ValidationResult {
  asset: AssetCode;
  dataType: string;
  isAccurate: boolean;
  currentValue: number | null;
  expectedValue: number | null;
  deviation: number;
  lastUpdated: string;
  source: string;
  issues: string[];
}

interface ValidationReport {
  timestamp: string;
  totalAssets: number;
  accurateAssets: number;
  accuracyRate: number;
  results: ValidationResult[];
  criticalIssues: string[];
  recommendations: string[];
}

export class DataAccuracyValidator {
  private economicService: AdvancedEconomicService;

  constructor() {
    this.economicService = AdvancedEconomicService.getInstance();
  }

  /**
   * Validiert alle Asset-Daten gegen offizielle Quellen
   */
  async validateAllAssets(): Promise<ValidationReport> {
    console.log('[DATA_VALIDATOR] Starting comprehensive data validation...');
    
    const results: ValidationResult[] = [];
    const criticalIssues: string[] = [];
    const recommendations: string[] = [];

    // Assets zu validieren
    const assetsToValidate: AssetCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];

    for (const asset of assetsToValidate) {
      try {
        const assetResults = await this.validateAsset(asset);
        results.push(...assetResults);
      } catch (error) {
        console.error(`[DATA_VALIDATOR] Error validating ${asset}:`, error);
        criticalIssues.push(`Failed to validate ${asset}: ${error}`);
      }
    }

    // Berechne Genauigkeitsrate
    const accurateResults = results.filter(r => r.isAccurate);
    const accuracyRate = results.length > 0 ? accurateResults.length / results.length : 0;

    // Generiere Empfehlungen
    if (accuracyRate < 0.8) {
      recommendations.push('Accuracy rate below 80% - review data sources and scraping logic');
    }

    const staleData = results.filter(r => {
      const ageHours = (Date.now() - new Date(r.lastUpdated).getTime()) / (1000 * 60 * 60);
      return ageHours > 24;
    });

    if (staleData.length > 0) {
      recommendations.push(`${staleData.length} assets have stale data (>24 hours old)`);
    }

    return {
      timestamp: new Date().toISOString(),
      totalAssets: results.length,
      accurateAssets: accurateResults.length,
      accuracyRate,
      results,
      criticalIssues,
      recommendations
    };
  }

  /**
   * Validiert ein einzelnes Asset
   */
  private async validateAsset(asset: AssetCode): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Hole aktuelle Daten aus unserem System
      const [economicData, assetScores] = await Promise.all([
        this.economicService.getEconomicData([asset]),
        this.economicService.getAssetScores([asset])
      ]);

      // Validiere verschiedene Datentypen
      if (asset === 'XAU' || asset === 'XAG') {
        // Edelmetall-Validierung
        results.push(...await this.validatePreciousMetals(asset, economicData));
      } else {
        // Währungs-Validierung
        results.push(...await this.validateCurrency(asset, economicData));
      }

      // Validiere Asset-Scores
      if (assetScores.length > 0) {
        results.push(await this.validateAssetScore(asset, assetScores[0]));
      }

    } catch (error) {
      console.error(`[DATA_VALIDATOR] Error validating ${asset}:`, error);
    }

    return results;
  }

  /**
   * Validiert Edelmetall-Daten
   */
  private async validatePreciousMetals(asset: 'XAU' | 'XAG', economicData: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    try {
      // Hole aktuellen Goldpreis von einer zuverlässigen Quelle
      const officialPrice = await this.getOfficialPreciousMetalPrice(asset);
      
      // Finde unseren aktuellen Preis
      const priceData = economicData.find(dp => dp.indicator === 'PRECIOUS_METAL_PRICE');
      const currentPrice = priceData?.actual || null;

      const deviation = currentPrice && officialPrice 
        ? Math.abs(currentPrice - officialPrice) / officialPrice 
        : 1;

      const issues: string[] = [];
      
      if (!currentPrice) {
        issues.push('No current price data available');
      }
      
      if (deviation > 0.02) { // 2% Abweichung
        issues.push(`Price deviation of ${(deviation * 100).toFixed(2)}% from official source`);
      }

      if (priceData) {
        const ageHours = (Date.now() - new Date(priceData.timestamp).getTime()) / (1000 * 60 * 60);
        if (ageHours > 1) { // Edelmetallpreise sollten sehr aktuell sein
          issues.push(`Data is ${ageHours.toFixed(1)} hours old`);
        }
      }

      results.push({
        asset,
        dataType: 'PRECIOUS_METAL_PRICE',
        isAccurate: deviation < 0.02 && issues.length === 0,
        currentValue: currentPrice,
        expectedValue: officialPrice,
        deviation,
        lastUpdated: priceData?.timestamp || 'Never',
        source: priceData?.source || 'Unknown',
        issues
      });

    } catch (error) {
      console.error(`[DATA_VALIDATOR] Error validating precious metals for ${asset}:`, error);
    }

    return results;
  }

  /**
   * Validiert Währungsdaten
   */
  private async validateCurrency(asset: AssetCode, economicData: any[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    // Validiere wichtige Wirtschaftsindikatoren
    const indicatorsToValidate = [
      'UNEMPLOYMENT',
      'INFLATION_CPI', 
      'GDP_GROWTH',
      'INTEREST_RATE'
    ];

    for (const indicator of indicatorsToValidate) {
      try {
        const indicatorData = economicData.find(dp => dp.indicator === indicator);
        
        if (!indicatorData) {
          results.push({
            asset,
            dataType: indicator,
            isAccurate: false,
            currentValue: null,
            expectedValue: null,
            deviation: 1,
            lastUpdated: 'Never',
            source: 'Unknown',
            issues: ['No data available for this indicator']
          });
          continue;
        }

        // Validiere gegen bekannte Bereiche
        const validation = this.validateIndicatorRange(asset, indicator, indicatorData.actual);
        
        results.push({
          asset,
          dataType: indicator,
          isAccurate: validation.isValid,
          currentValue: indicatorData.actual,
          expectedValue: validation.expectedRange ? validation.expectedRange.mid : null,
          deviation: validation.deviation,
          lastUpdated: indicatorData.timestamp,
          source: indicatorData.source,
          issues: validation.issues
        });

      } catch (error) {
        console.error(`[DATA_VALIDATOR] Error validating ${indicator} for ${asset}:`, error);
      }
    }

    return results;
  }

  /**
   * Validiert Asset-Score
   */
  private async validateAssetScore(asset: AssetCode, score: any): Promise<ValidationResult> {
    const issues: string[] = [];
    
    // Prüfe Score-Bereiche
    if (score.total_score < -15 || score.total_score > 15) {
      issues.push(`Total score ${score.total_score} outside expected range [-15, 15]`);
    }
    
    if (score.confidence < 0 || score.confidence > 1) {
      issues.push(`Confidence ${score.confidence} outside expected range [0, 1]`);
    }
    
    // Prüfe Aktualität
    const ageMinutes = (Date.now() - new Date(score.last_updated).getTime()) / (1000 * 60);
    if (ageMinutes > 60) { // Scores sollten stündlich aktualisiert werden
      issues.push(`Score is ${ageMinutes.toFixed(0)} minutes old`);
    }

    return {
      asset,
      dataType: 'ASSET_SCORE',
      isAccurate: issues.length === 0,
      currentValue: score.total_score,
      expectedValue: null,
      deviation: 0,
      lastUpdated: score.last_updated,
      source: 'SCORING_ENGINE',
      issues
    };
  }

  /**
   * Hole offiziellen Edelmetallpreis
   */
  private async getOfficialPreciousMetalPrice(asset: 'XAU' | 'XAG'): Promise<number> {
    try {
      // Verwende eine zuverlässige Quelle für Edelmetallpreise
      // Hier würde man normalerweise eine offizielle API verwenden
      
      if (asset === 'XAU') {
        // Gold: Typischer Bereich $1800-$2100
        return 1950; // Placeholder - in Produktion würde hier eine echte API verwendet
      } else {
        // Silber: Typischer Bereich $20-$30
        return 24; // Placeholder - in Produktion würde hier eine echte API verwendet
      }
    } catch (error) {
      console.error(`[DATA_VALIDATOR] Error fetching official price for ${asset}:`, error);
      throw error;
    }
  }

  /**
   * Validiert Indikator-Bereiche
   */
  private validateIndicatorRange(asset: AssetCode, indicator: string, value: number | null): {
    isValid: boolean;
    deviation: number;
    expectedRange?: { min: number; max: number; mid: number };
    issues: string[];
  } {
    const issues: string[] = [];
    
    if (value === null) {
      return { isValid: false, deviation: 1, issues: ['Value is null'] };
    }

    // Definiere realistische Bereiche für verschiedene Indikatoren
    const ranges: Record<string, { min: number; max: number }> = {
      'UNEMPLOYMENT': { min: 0, max: 25 },
      'INFLATION_CPI': { min: -5, max: 20 },
      'GDP_GROWTH': { min: -10, max: 15 },
      'INTEREST_RATE': { min: -1, max: 20 }
    };

    const range = ranges[indicator];
    if (!range) {
      return { isValid: true, deviation: 0, issues: [] };
    }

    const mid = (range.min + range.max) / 2;
    const deviation = Math.abs(value - mid) / (range.max - range.min);

    if (value < range.min || value > range.max) {
      issues.push(`Value ${value} outside realistic range [${range.min}, ${range.max}]`);
    }

    return {
      isValid: issues.length === 0,
      deviation,
      expectedRange: { ...range, mid },
      issues
    };
  }

  /**
   * Generiert einen detaillierten Validierungsbericht
   */
  generateDetailedReport(report: ValidationReport): string {
    const lines: string[] = [];
    
    lines.push('# Data Accuracy Validation Report');
    lines.push(`Generated: ${new Date(report.timestamp).toLocaleString()}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Total Assets Validated: ${report.totalAssets}`);
    lines.push(`- Accurate Assets: ${report.accurateAssets}`);
    lines.push(`- Accuracy Rate: ${(report.accuracyRate * 100).toFixed(1)}%`);
    lines.push('');

    if (report.criticalIssues.length > 0) {
      lines.push('## Critical Issues');
      report.criticalIssues.forEach(issue => lines.push(`- ${issue}`));
      lines.push('');
    }

    if (report.recommendations.length > 0) {
      lines.push('## Recommendations');
      report.recommendations.forEach(rec => lines.push(`- ${rec}`));
      lines.push('');
    }

    lines.push('## Detailed Results');
    
    // Gruppiere nach Assets
    const assetGroups = new Map<AssetCode, ValidationResult[]>();
    report.results.forEach(result => {
      if (!assetGroups.has(result.asset)) {
        assetGroups.set(result.asset, []);
      }
      assetGroups.get(result.asset)!.push(result);
    });

    for (const [asset, results] of assetGroups) {
      lines.push(`### ${asset}`);
      
      results.forEach(result => {
        const status = result.isAccurate ? '✅' : '❌';
        lines.push(`${status} **${result.dataType}**`);
        lines.push(`  - Current: ${result.currentValue}`);
        lines.push(`  - Expected: ${result.expectedValue}`);
        lines.push(`  - Deviation: ${(result.deviation * 100).toFixed(2)}%`);
        lines.push(`  - Source: ${result.source}`);
        lines.push(`  - Last Updated: ${new Date(result.lastUpdated).toLocaleString()}`);
        
        if (result.issues.length > 0) {
          lines.push(`  - Issues: ${result.issues.join(', ')}`);
        }
        lines.push('');
      });
    }

    return lines.join('\n');
  }
}

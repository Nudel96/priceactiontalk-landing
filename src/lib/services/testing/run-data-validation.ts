/**
 * Data Validation Runner - Führt die Datenvalidierung aus
 */

import { DataAccuracyValidator } from './data-accuracy-validator';
import { AdvancedEconomicService } from '../advanced-economic-service';

export async function runDataValidation(): Promise<void> {
  console.log('🔍 Starting comprehensive data validation...');
  
  try {
    // Initialisiere Services
    const economicService = AdvancedEconomicService.getInstance();
    
    if (!economicService.isReady()) {
      console.log('📡 Initializing economic service...');
      await economicService.initialize();
    }

    // Führe Validierung durch
    const validator = new DataAccuracyValidator();
    const report = await validator.validateAllAssets();

    // Zeige Ergebnisse
    console.log('\n📊 VALIDATION RESULTS:');
    console.log(`✅ Accuracy Rate: ${(report.accuracyRate * 100).toFixed(1)}%`);
    console.log(`📈 Accurate Assets: ${report.accurateAssets}/${report.totalAssets}`);

    if (report.criticalIssues.length > 0) {
      console.log('\n🚨 CRITICAL ISSUES:');
      report.criticalIssues.forEach(issue => console.log(`  ❌ ${issue}`));
    }

    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach(rec => console.log(`  💡 ${rec}`));
    }

    // Detaillierte Ergebnisse für problematische Assets
    const problematicAssets = report.results.filter(r => !r.isAccurate);
    if (problematicAssets.length > 0) {
      console.log('\n⚠️  PROBLEMATIC DATA:');
      problematicAssets.forEach(result => {
        console.log(`  ${result.asset} - ${result.dataType}:`);
        console.log(`    Current: ${result.currentValue}`);
        console.log(`    Expected: ${result.expectedValue}`);
        console.log(`    Issues: ${result.issues.join(', ')}`);
      });
    }

    // Spezielle Überprüfung für Gold
    const goldResults = report.results.filter(r => r.asset === 'XAU');
    if (goldResults.length > 0) {
      console.log('\n🥇 GOLD DATA ANALYSIS:');
      goldResults.forEach(result => {
        console.log(`  ${result.dataType}: ${result.isAccurate ? '✅' : '❌'}`);
        console.log(`    Value: ${result.currentValue}`);
        console.log(`    Last Updated: ${new Date(result.lastUpdated).toLocaleString()}`);
        if (result.issues.length > 0) {
          console.log(`    Issues: ${result.issues.join(', ')}`);
        }
      });
    }

    // Generiere detaillierten Bericht
    const detailedReport = validator.generateDetailedReport(report);
    console.log('\n📄 Detailed report generated');
    
    // In einer echten Anwendung würde der Bericht gespeichert werden
    // Für jetzt zeigen wir nur die wichtigsten Informationen

  } catch (error) {
    console.error('❌ Data validation failed:', error);
  }
}

// Führe Validierung aus, wenn das Modul direkt aufgerufen wird
if (typeof window !== 'undefined') {
  // Browser-Umgebung
  (window as any).runDataValidation = runDataValidation;
}

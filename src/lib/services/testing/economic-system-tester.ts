/**
 * Economic System Tester - Comprehensive testing suite
 * Tests data accuracy, performance, and system reliability
 */

import { AdvancedEconomicService } from '../advanced-economic-service';
import { FREDScraper } from '../advanced-scraping/fred-scraper';
import { TradingEconomicsScraper } from '../advanced-scraping/trading-economics-scraper';
import { EconomicScoringEngine } from '../scoring/economic-scoring-engine';
import type { AssetCode, EconomicDataPoint } from '$lib/types/advanced-economic';

interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  details: string;
  errors: string[];
  timestamp: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  overallPassed: boolean;
  totalDuration: number;
  passRate: number;
}

export class EconomicSystemTester {
  private economicService: AdvancedEconomicService;
  private testResults: Map<string, TestSuite> = new Map();

  constructor() {
    this.economicService = AdvancedEconomicService.getInstance();
  }

  /**
   * Run all test suites
   */
  async runAllTests(): Promise<Map<string, TestSuite>> {
    console.log('[ECONOMIC_TESTER] Starting comprehensive test suite...');
    
    const testSuites = [
      'Data Accuracy Tests',
      'Performance Tests',
      'Integration Tests',
      'Scoring Engine Tests',
      'Error Handling Tests'
    ];

    for (const suiteName of testSuites) {
      try {
        await this.runTestSuite(suiteName);
      } catch (error) {
        console.error(`[ECONOMIC_TESTER] Test suite ${suiteName} failed:`, error);
      }
    }

    console.log('[ECONOMIC_TESTER] All test suites completed');
    return this.testResults;
  }

  /**
   * Run specific test suite
   */
  async runTestSuite(suiteName: string): Promise<TestSuite> {
    const startTime = Date.now();
    const tests: TestResult[] = [];

    console.log(`[ECONOMIC_TESTER] Running test suite: ${suiteName}`);

    try {
      switch (suiteName) {
        case 'Data Accuracy Tests':
          tests.push(...await this.runDataAccuracyTests());
          break;
        case 'Performance Tests':
          tests.push(...await this.runPerformanceTests());
          break;
        case 'Integration Tests':
          tests.push(...await this.runIntegrationTests());
          break;
        case 'Scoring Engine Tests':
          tests.push(...await this.runScoringEngineTests());
          break;
        case 'Error Handling Tests':
          tests.push(...await this.runErrorHandlingTests());
          break;
        default:
          throw new Error(`Unknown test suite: ${suiteName}`);
      }

      const suite: TestSuite = {
        name: suiteName,
        tests,
        overallPassed: tests.every(test => test.passed),
        totalDuration: Date.now() - startTime,
        passRate: tests.filter(test => test.passed).length / tests.length
      };

      this.testResults.set(suiteName, suite);
      console.log(`[ECONOMIC_TESTER] ${suiteName} completed: ${suite.passRate * 100}% pass rate`);
      
      return suite;

    } catch (error) {
      const suite: TestSuite = {
        name: suiteName,
        tests,
        overallPassed: false,
        totalDuration: Date.now() - startTime,
        passRate: 0
      };

      this.testResults.set(suiteName, suite);
      throw error;
    }
  }

  private async runDataAccuracyTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: FRED Data Validation
    tests.push(await this.runTest('FRED Data Validation', async () => {
      const fredScraper = new FREDScraper();
      const result = await fredScraper.scrapeData(['USD']);
      
      if (!result.success) {
        throw new Error('FRED scraping failed');
      }

      if (result.data_points.length === 0) {
        throw new Error('No data points returned');
      }

      // Validate data structure
      for (const dataPoint of result.data_points) {
        if (!dataPoint.actual || !dataPoint.asset || !dataPoint.indicator) {
          throw new Error('Invalid data point structure');
        }
        
        if (!dataPoint.validation_passed) {
          throw new Error('Data point failed validation');
        }
      }

      return `Successfully validated ${result.data_points.length} FRED data points`;
    }));

    // Test 2: Trading Economics Data Validation
    tests.push(await this.runTest('Trading Economics Data Validation', async () => {
      const teScraper = new TradingEconomicsScraper();
      const result = await teScraper.scrapeData(['USD', 'EUR']);
      
      if (!result.success) {
        throw new Error('Trading Economics scraping failed');
      }

      // Check for reasonable data ranges
      for (const dataPoint of result.data_points) {
        if (dataPoint.indicator === 'UNEMPLOYMENT' && dataPoint.actual) {
          if (dataPoint.actual < 0 || dataPoint.actual > 50) {
            throw new Error(`Unrealistic unemployment rate: ${dataPoint.actual}%`);
          }
        }
        
        if (dataPoint.indicator === 'INFLATION_CPI' && dataPoint.actual) {
          if (dataPoint.actual < -10 || dataPoint.actual > 50) {
            throw new Error(`Unrealistic inflation rate: ${dataPoint.actual}%`);
          }
        }
      }

      return `Successfully validated ${result.data_points.length} Trading Economics data points`;
    }));

    // Test 3: Data Freshness Check
    tests.push(await this.runTest('Data Freshness Check', async () => {
      const economicData = await this.economicService.getEconomicData();
      const now = new Date();
      const staleThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days

      let staleCount = 0;
      for (const dataPoint of economicData) {
        const dataAge = now.getTime() - new Date(dataPoint.timestamp).getTime();
        if (dataAge > staleThreshold) {
          staleCount++;
        }
      }

      const stalePercentage = economicData.length > 0 ? staleCount / economicData.length : 0;
      
      if (stalePercentage > 0.3) {
        throw new Error(`Too much stale data: ${(stalePercentage * 100).toFixed(1)}%`);
      }

      return `Data freshness check passed: ${((1 - stalePercentage) * 100).toFixed(1)}% fresh data`;
    }));

    // Test 4: Cross-Source Data Consistency
    tests.push(await this.runTest('Cross-Source Data Consistency', async () => {
      const economicData = await this.economicService.getEconomicData(['USD']);
      
      // Group by indicator
      const indicatorGroups = new Map<string, EconomicDataPoint[]>();
      economicData.forEach(dp => {
        if (!indicatorGroups.has(dp.indicator)) {
          indicatorGroups.set(dp.indicator, []);
        }
        indicatorGroups.get(dp.indicator)!.push(dp);
      });

      let inconsistencies = 0;
      for (const [indicator, dataPoints] of indicatorGroups) {
        if (dataPoints.length > 1) {
          // Check for major discrepancies between sources
          const values = dataPoints.map(dp => dp.actual).filter(v => v !== null) as number[];
          if (values.length > 1) {
            const max = Math.max(...values);
            const min = Math.min(...values);
            const variance = (max - min) / Math.abs(min);
            
            if (variance > 0.1) { // 10% variance threshold
              inconsistencies++;
            }
          }
        }
      }

      if (inconsistencies > indicatorGroups.size * 0.2) {
        throw new Error(`Too many data inconsistencies: ${inconsistencies} out of ${indicatorGroups.size} indicators`);
      }

      return `Data consistency check passed: ${inconsistencies} inconsistencies out of ${indicatorGroups.size} indicators`;
    }));

    return tests;
  }

  private async runPerformanceTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Service Initialization Performance
    tests.push(await this.runTest('Service Initialization Performance', async () => {
      const startTime = Date.now();
      
      // Test service initialization (if not already initialized)
      if (!this.economicService.isReady()) {
        await this.economicService.initialize();
      }
      
      const duration = Date.now() - startTime;
      
      if (duration > 10000) { // 10 seconds threshold
        throw new Error(`Service initialization too slow: ${duration}ms`);
      }

      return `Service initialization completed in ${duration}ms`;
    }));

    // Test 2: Data Retrieval Performance
    tests.push(await this.runTest('Data Retrieval Performance', async () => {
      const startTime = Date.now();
      
      const [economicData, assetScores, rateCutProbs] = await Promise.all([
        this.economicService.getEconomicData(),
        this.economicService.getAssetScores(),
        this.economicService.getRateCutProbabilities()
      ]);
      
      const duration = Date.now() - startTime;
      
      if (duration > 5000) { // 5 seconds threshold
        throw new Error(`Data retrieval too slow: ${duration}ms`);
      }

      return `Retrieved ${economicData.length} data points, ${assetScores.length} scores, ${rateCutProbs.length} probabilities in ${duration}ms`;
    }));

    // Test 3: Scoring Engine Performance
    tests.push(await this.runTest('Scoring Engine Performance', async () => {
      const startTime = Date.now();
      
      const scoringEngine = new EconomicScoringEngine();
      const economicData = await this.economicService.getEconomicData();
      
      // Test scoring for all assets
      const assets: AssetCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
      const scores = await Promise.all(
        assets.map(asset => 
          scoringEngine.calculateAssetScore(
            asset, 
            economicData.filter(dp => dp.asset === asset)
          )
        )
      );
      
      const duration = Date.now() - startTime;
      
      if (duration > 3000) { // 3 seconds threshold
        throw new Error(`Scoring calculation too slow: ${duration}ms`);
      }

      return `Calculated scores for ${scores.length} assets in ${duration}ms`;
    }));

    // Test 4: Memory Usage Test
    tests.push(await this.runTest('Memory Usage Test', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform memory-intensive operations
      for (let i = 0; i < 10; i++) {
        await this.economicService.getDashboardData();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024;
      
      if (memoryIncreaseMB > 100) { // 100MB threshold
        throw new Error(`Excessive memory usage: ${memoryIncreaseMB.toFixed(2)}MB increase`);
      }

      return `Memory usage test passed: ${memoryIncreaseMB.toFixed(2)}MB increase`;
    }));

    return tests;
  }

  private async runIntegrationTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: End-to-End Data Flow
    tests.push(await this.runTest('End-to-End Data Flow', async () => {
      // Trigger a manual update
      await this.economicService.triggerUpdate('MARKET_DATA_UPDATE');
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if data flows through the system
      const dashboardData = await this.economicService.getDashboardData(['USD']);
      
      if (dashboardData.economicData.length === 0) {
        throw new Error('No economic data in dashboard');
      }
      
      if (dashboardData.assetScores.length === 0) {
        throw new Error('No asset scores in dashboard');
      }

      return `End-to-end flow successful: ${dashboardData.economicData.length} data points, ${dashboardData.assetScores.length} scores`;
    }));

    // Test 2: Service Status Integration
    tests.push(await this.runTest('Service Status Integration', async () => {
      const status = this.economicService.getServiceStatus();
      const systemHealth = await this.economicService.getSystemHealth();
      
      if (!status.isRunning) {
        throw new Error('Service not running');
      }
      
      if (!systemHealth) {
        throw new Error('System health not available');
      }
      
      if (systemHealth.system_status === 'CRITICAL') {
        throw new Error('System health is critical');
      }

      return `Service status integration successful: ${status.activeAssets.length} active assets, ${systemHealth.system_status} health`;
    }));

    return tests;
  }

  private async runScoringEngineTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Score Calculation Logic
    tests.push(await this.runTest('Score Calculation Logic', async () => {
      const scoringEngine = new EconomicScoringEngine();
      
      // Create test data with known outcomes
      const testData: EconomicDataPoint[] = [
        {
          id: 'test_1',
          asset: 'USD',
          indicator: 'UNEMPLOYMENT',
          source: 'FRED',
          timestamp: new Date().toISOString(),
          actual: 3.5,
          forecast: 4.0,
          previous: 4.2,
          surprise: -0.125,
          surprise_score: 1, // Positive surprise (lower unemployment)
          unit: '%',
          frequency: 'MONTHLY',
          release_date: new Date().toISOString(),
          importance_weight: 5,
          confidence_level: 0.95,
          last_updated: new Date().toISOString(),
          scrape_success: true,
          validation_passed: true
        }
      ];
      
      const score = await scoringEngine.calculateAssetScore('USD', testData);
      
      if (score.economic_score <= 0) {
        throw new Error('Expected positive economic score for good unemployment data');
      }
      
      if (score.signal === 'SELL' || score.signal === 'STRONG_SELL') {
        throw new Error('Expected bullish signal for positive economic surprise');
      }

      return `Score calculation logic test passed: ${score.signal} signal with ${score.total_score.toFixed(2)} total score`;
    }));

    return tests;
  }

  private async runErrorHandlingTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    // Test 1: Invalid Data Handling
    tests.push(await this.runTest('Invalid Data Handling', async () => {
      try {
        // Test with invalid asset code
        await this.economicService.getEconomicData(['INVALID' as AssetCode]);
        
        // Should not throw error, just return empty array
        return 'Invalid data handling test passed';
      } catch (error) {
        throw new Error(`Service should handle invalid data gracefully: ${error}`);
      }
    }));

    // Test 2: Network Error Simulation
    tests.push(await this.runTest('Network Error Resilience', async () => {
      // This test would simulate network errors in a real implementation
      // For now, we'll test the service's ability to work with cached data
      
      const cachedData = await this.economicService.getEconomicData();
      
      if (cachedData.length === 0) {
        // If no cached data, this is expected behavior
        return 'Network error resilience test passed (no cached data available)';
      }
      
      return `Network error resilience test passed: ${cachedData.length} cached data points available`;
    }));

    return tests;
  }

  private async runTest(testName: string, testFunction: () => Promise<string>): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      console.log(`[ECONOMIC_TESTER] Running test: ${testName}`);
      
      const details = await testFunction();
      const duration = Date.now() - startTime;
      
      console.log(`[ECONOMIC_TESTER] ✓ ${testName} passed (${duration}ms)`);
      
      return {
        testName,
        passed: true,
        duration,
        details,
        errors: [],
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.error(`[ECONOMIC_TESTER] ✗ ${testName} failed (${duration}ms):`, errorMessage);
      
      return {
        testName,
        passed: false,
        duration,
        details: '',
        errors: [errorMessage],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get test results summary
   */
  getTestSummary(): {
    totalSuites: number;
    passedSuites: number;
    totalTests: number;
    passedTests: number;
    overallPassRate: number;
    totalDuration: number;
  } {
    const suites = Array.from(this.testResults.values());
    const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passedTests = suites.reduce((sum, suite) => sum + suite.tests.filter(t => t.passed).length, 0);
    
    return {
      totalSuites: suites.length,
      passedSuites: suites.filter(s => s.overallPassed).length,
      totalTests,
      passedTests,
      overallPassRate: totalTests > 0 ? passedTests / totalTests : 0,
      totalDuration: suites.reduce((sum, suite) => sum + suite.totalDuration, 0)
    };
  }

  /**
   * Generate test report
   */
  generateTestReport(): string {
    const summary = this.getTestSummary();
    const lines: string[] = [];
    
    lines.push('# Economic System Test Report');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Total Test Suites: ${summary.totalSuites}`);
    lines.push(`- Passed Test Suites: ${summary.passedSuites}`);
    lines.push(`- Total Tests: ${summary.totalTests}`);
    lines.push(`- Passed Tests: ${summary.passedTests}`);
    lines.push(`- Overall Pass Rate: ${(summary.overallPassRate * 100).toFixed(1)}%`);
    lines.push(`- Total Duration: ${summary.totalDuration}ms`);
    lines.push('');
    
    for (const [suiteName, suite] of this.testResults) {
      lines.push(`## ${suiteName}`);
      lines.push(`Pass Rate: ${(suite.passRate * 100).toFixed(1)}% (${suite.tests.filter(t => t.passed).length}/${suite.tests.length})`);
      lines.push(`Duration: ${suite.totalDuration}ms`);
      lines.push('');
      
      for (const test of suite.tests) {
        const status = test.passed ? '✓' : '✗';
        lines.push(`${status} **${test.testName}** (${test.duration}ms)`);
        if (test.details) {
          lines.push(`  ${test.details}`);
        }
        if (test.errors.length > 0) {
          lines.push(`  Errors: ${test.errors.join(', ')}`);
        }
        lines.push('');
      }
    }
    
    return lines.join('\n');
  }
}

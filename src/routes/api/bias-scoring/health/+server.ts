/**
 * Bias Scoring Health API
 * Provides system health monitoring and diagnostics
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ComprehensiveBiasService } from '$lib/services/bias-scoring/comprehensive-bias-service';
import { BiasScoringDatabase } from '$lib/services/database/bias-scoring-database';

/**
 * GET /api/bias-scoring/health
 * Get comprehensive system health information
 */
export const GET: RequestHandler = async ({ url }) => {
  try {
    const detailed = url.searchParams.get('detailed') === 'true';
    const startTime = Date.now();

    // Test database connectivity
    let databaseHealth = 'UNKNOWN';
    let databaseError = null;
    let biasScoreCount = 0;
    let fundamentalDataCount = 0;

    try {
      const testDb = new BiasScoringDatabase();
      const scores = testDb.getAllLatestBiasScores();
      biasScoreCount = scores.length;
      
      // Count fundamental data points for all assets
      const assets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
      for (const asset of assets) {
        const data = testDb.getLatestFundamentalData(asset);
        fundamentalDataCount += data.length;
      }
      
      testDb.close();
      databaseHealth = 'HEALTHY';
    } catch (error) {
      databaseHealth = 'ERROR';
      databaseError = error instanceof Error ? error.message : 'Unknown database error';
    }

    // Test service connectivity (if available)
    let serviceHealth = 'UNKNOWN';
    let serviceStatus = null;
    let serviceError = null;

    try {
      // Try to get service status without initializing if not already running
      const service = new ComprehensiveBiasService();
      serviceStatus = service.getServiceStatus();
      serviceHealth = serviceStatus.isRunning ? 'RUNNING' : 'STOPPED';
    } catch (error) {
      serviceHealth = 'ERROR';
      serviceError = error instanceof Error ? error.message : 'Unknown service error';
    }

    const processingTime = Date.now() - startTime;

    const healthData: any = {
      overall: databaseHealth === 'HEALTHY' ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      processingTime: processingTime,
      components: {
        database: {
          status: databaseHealth,
          biasScoreCount: biasScoreCount,
          fundamentalDataCount: fundamentalDataCount,
          error: databaseError
        },
        service: {
          status: serviceHealth,
          error: serviceError
        }
      }
    };

    if (detailed && serviceStatus) {
      healthData.components.service.details = serviceStatus;
    }

    // Determine HTTP status code based on health
    const httpStatus = healthData.overall === 'HEALTHY' ? 200 : 503;

    return json({
      success: true,
      data: healthData
    }, { status: httpStatus });

  } catch (error) {
    console.error('[BIAS_HEALTH] Error in health check:', error);
    return json({
      success: false,
      data: {
        overall: 'ERROR',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
        components: {
          database: { status: 'UNKNOWN' },
          service: { status: 'UNKNOWN' }
        }
      }
    }, { status: 500 });
  }
};

/**
 * POST /api/bias-scoring/health
 * Run diagnostic tests
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const { test } = body;
    const startTime = Date.now();

    const results: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    };

    switch (test) {
      case 'database':
        // Comprehensive database test
        try {
          const testDb = new BiasScoringDatabase();
          
          // Test basic operations
          const testSnapshot = {
            asset: 'TEST',
            data_type: 'test_data',
            value: 123.45,
            timestamp: new Date().toISOString(),
            source: 'HEALTH_CHECK',
            content_hash: 'test_hash',
            last_updated: new Date().toISOString(),
            change_detected: true
          };

          testDb.storeFundamentalSnapshot(testSnapshot);
          const retrievedData = testDb.getLatestFundamentalData('TEST', 'test_data');
          
          testDb.close();

          results.tests.database = {
            status: 'PASSED',
            operations: {
              store: 'SUCCESS',
              retrieve: 'SUCCESS',
              dataIntegrity: retrievedData.length > 0 ? 'SUCCESS' : 'FAILED'
            }
          };
        } catch (error) {
          results.tests.database = {
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
        break;

      case 'service':
        // Service functionality test
        try {
          const service = new ComprehensiveBiasService();
          await service.initialize();
          
          const status = service.getServiceStatus();
          await service.close();

          results.tests.service = {
            status: 'PASSED',
            initialization: 'SUCCESS',
            statusRetrieval: 'SUCCESS',
            cleanup: 'SUCCESS'
          };
        } catch (error) {
          results.tests.service = {
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
        break;

      case 'full':
        // Run all tests
        const fullTestResults = await runFullDiagnostics();
        results.tests = fullTestResults;
        break;

      default:
        return json({ error: `Unknown test: ${test}` }, { status: 400 });
    }

    results.processingTime = Date.now() - startTime;
    results.overall = Object.values(results.tests).every((test: any) => test.status === 'PASSED') 
      ? 'PASSED' 
      : 'FAILED';

    return json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('[BIAS_HEALTH] Error in diagnostic test:', error);
    return json({
      success: false,
      error: 'Diagnostic test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

/**
 * Run comprehensive diagnostics
 */
async function runFullDiagnostics(): Promise<any> {
  const tests: any = {};

  // Database tests
  try {
    const testDb = new BiasScoringDatabase();
    
    // Test table creation and basic operations
    const testSnapshot = {
      asset: 'DIAGNOSTIC',
      data_type: 'full_test',
      value: 999.99,
      timestamp: new Date().toISOString(),
      source: 'FULL_DIAGNOSTIC',
      content_hash: 'diagnostic_hash',
      last_updated: new Date().toISOString(),
      change_detected: true
    };

    testDb.storeFundamentalSnapshot(testSnapshot);
    const retrievedData = testDb.getLatestFundamentalData('DIAGNOSTIC');
    const allScores = testDb.getAllLatestBiasScores();
    
    testDb.close();

    tests.database = {
      status: 'PASSED',
      tableAccess: 'SUCCESS',
      dataStorage: 'SUCCESS',
      dataRetrieval: 'SUCCESS',
      scoreRetrieval: 'SUCCESS',
      recordCount: retrievedData.length
    };
  } catch (error) {
    tests.database = {
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Service tests
  try {
    const service = new ComprehensiveBiasService();
    await service.initialize();
    
    const status = service.getServiceStatus();
    const factors = service.getFundamentalFactors();
    
    await service.close();

    tests.service = {
      status: 'PASSED',
      initialization: 'SUCCESS',
      statusCheck: 'SUCCESS',
      factorRetrieval: 'SUCCESS',
      factorCount: factors.size,
      cleanup: 'SUCCESS'
    };
  } catch (error) {
    tests.service = {
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  // Performance test
  try {
    const startTime = Date.now();
    const testDb = new BiasScoringDatabase();
    
    // Simulate multiple operations
    for (let i = 0; i < 10; i++) {
      testDb.getLatestFundamentalData('USD');
    }
    
    testDb.close();
    const performanceTime = Date.now() - startTime;

    tests.performance = {
      status: performanceTime < 1000 ? 'PASSED' : 'WARNING',
      operationTime: performanceTime,
      threshold: 1000,
      operations: 10
    };
  } catch (error) {
    tests.performance = {
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return tests;
}

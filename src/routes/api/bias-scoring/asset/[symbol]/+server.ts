/**
 * Asset-specific Bias Scoring API
 * Provides detailed bias information for individual assets
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ComprehensiveBiasService } from '$lib/services/bias-scoring/comprehensive-bias-service';

// Global service instance
let biasService: ComprehensiveBiasService | null = null;

/**
 * Initialize bias service if not already initialized
 */
async function initializeBiasService(): Promise<ComprehensiveBiasService> {
  if (!biasService) {
    biasService = new ComprehensiveBiasService();
    await biasService.initialize();
    await biasService.start();
  }
  return biasService;
}

/**
 * GET /api/bias-scoring/asset/[symbol]
 * Get detailed bias information for a specific asset
 */
export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const service = await initializeBiasService();
    const symbol = params.symbol?.toUpperCase();
    const includeHistory = url.searchParams.get('history') === 'true';
    const includeFundamentals = url.searchParams.get('fundamentals') === 'true';

    if (!symbol) {
      return json({ error: 'Asset symbol is required' }, { status: 400 });
    }

    // Validate asset symbol
    const validAssets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
    if (!validAssets.includes(symbol)) {
      return json({ 
        error: `Invalid asset symbol: ${symbol}. Valid assets: ${validAssets.join(', ')}` 
      }, { status: 400 });
    }

    // Get current bias score
    const biasScore = await service.getAssetBiasScore(symbol);
    if (!biasScore) {
      return json({ 
        error: `No bias score found for asset: ${symbol}` 
      }, { status: 404 });
    }

    const response: any = {
      success: true,
      data: {
        asset: symbol,
        currentBias: biasScore,
        timestamp: new Date().toISOString()
      }
    };

    // Include fundamental data if requested
    if (includeFundamentals) {
      const fundamentalFactors = service.getFundamentalFactors();
      response.data.fundamentalFactors = Array.from(fundamentalFactors.entries()).map(([name, factor]) => ({
        name,
        ...factor
      }));
    }

    // Include historical data if requested (placeholder for now)
    if (includeHistory) {
      response.data.history = {
        message: 'Historical data feature coming soon',
        availablePeriods: ['1D', '7D', '30D', '90D']
      };
    }

    return json(response);

  } catch (error) {
    console.error(`[BIAS_API] Error getting bias for ${params.symbol}:`, error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

/**
 * POST /api/bias-scoring/asset/[symbol]
 * Trigger specific actions for an asset
 */
export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const service = await initializeBiasService();
    const symbol = params.symbol?.toUpperCase();
    const body = await request.json();
    const { action, reason } = body;

    if (!symbol) {
      return json({ error: 'Asset symbol is required' }, { status: 400 });
    }

    // Validate asset symbol
    const validAssets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
    if (!validAssets.includes(symbol)) {
      return json({ 
        error: `Invalid asset symbol: ${symbol}. Valid assets: ${validAssets.join(', ')}` 
      }, { status: 400 });
    }

    switch (action) {
      case 'update':
        // Trigger immediate update for this asset
        const updateResults = await service.triggerAssetUpdate(symbol, reason || 'Manual API trigger');
        
        // Get updated bias score
        const updatedBias = await service.getAssetBiasScore(symbol);
        
        return json({
          success: true,
          data: {
            asset: symbol,
            updateResults: updateResults,
            hasChanges: updateResults.some(r => r.hasChanges),
            updatedBias: updatedBias,
            totalChecks: updateResults.length
          },
          timestamp: new Date().toISOString()
        });

      case 'recalculate':
        // Force recalculation of bias score for this asset
        const scoringEngine = (service as any).biasScoringEngine;
        const recalcResult = await scoringEngine.calculateBiasScore(symbol);
        
        return json({
          success: true,
          data: {
            asset: symbol,
            recalculationResult: {
              bias: recalcResult.bias,
              score: recalcResult.weightedScore,
              confidence: recalcResult.confidence,
              processingTime: recalcResult.processingTime,
              bullishFactors: recalcResult.bullishFactors,
              bearishFactors: recalcResult.bearishFactors
            }
          },
          timestamp: new Date().toISOString()
        });

      default:
        return json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error(`[BIAS_API] Error in POST for ${params.symbol}:`, error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

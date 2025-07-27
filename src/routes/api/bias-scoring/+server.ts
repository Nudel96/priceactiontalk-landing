/**
 * Bias Scoring API - Main endpoint for bias scoring system
 * Provides access to bias scores, fundamental data, and system status
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
 * GET /api/bias-scoring
 * Get all bias scores or specific asset bias score
 */
export const GET: RequestHandler = async ({ url }) => {
  try {
    const service = await initializeBiasService();
    const asset = url.searchParams.get('asset');
    const action = url.searchParams.get('action') || 'scores';

    switch (action) {
      case 'scores':
        if (asset) {
          // Get specific asset bias score
          const assetScore = await service.getAssetBiasScore(asset.toUpperCase());
          if (!assetScore) {
            return json({ error: `No bias score found for asset: ${asset}` }, { status: 404 });
          }
          return json({
            success: true,
            data: assetScore,
            timestamp: new Date().toISOString()
          });
        } else {
          // Get all bias scores
          const allScores = await service.getAllBiasScores();
          return json({
            success: true,
            data: allScores,
            count: allScores.length,
            timestamp: new Date().toISOString()
          });
        }

      case 'status':
        // Get service status
        const status = service.getServiceStatus();
        return json({
          success: true,
          data: status,
          timestamp: new Date().toISOString()
        });

      case 'factors':
        // Get fundamental factors configuration
        const factors = service.getFundamentalFactors();
        const factorsArray = Array.from(factors.entries()).map(([name, factor]) => ({
          name,
          ...factor
        }));
        return json({
          success: true,
          data: factorsArray,
          count: factorsArray.length,
          timestamp: new Date().toISOString()
        });

      default:
        return json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('[BIAS_API] Error in GET request:', error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

/**
 * POST /api/bias-scoring
 * Trigger updates, recalculations, or add scheduled events
 */
export const POST: RequestHandler = async ({ request }) => {
  try {
    const service = await initializeBiasService();
    const body = await request.json();
    const { action, asset, reason, event } = body;

    switch (action) {
      case 'trigger_update':
        if (!asset) {
          return json({ error: 'Asset parameter required for trigger_update' }, { status: 400 });
        }
        
        const updateResults = await service.triggerAssetUpdate(asset.toUpperCase(), reason || 'Manual API trigger');
        return json({
          success: true,
          data: {
            asset: asset.toUpperCase(),
            results: updateResults,
            hasChanges: updateResults.some(r => r.hasChanges),
            totalChecks: updateResults.length
          },
          timestamp: new Date().toISOString()
        });

      case 'recalculate_all':
        const recalcResults = await service.recalculateAllScores();
        return json({
          success: true,
          data: {
            recalculated: recalcResults.length,
            results: recalcResults.map(r => ({
              asset: r.asset,
              bias: r.bias,
              score: r.weightedScore,
              confidence: r.confidence
            }))
          },
          timestamp: new Date().toISOString()
        });

      case 'add_event':
        if (!event) {
          return json({ error: 'Event parameter required for add_event' }, { status: 400 });
        }
        
        service.addScheduledEvent(event);
        return json({
          success: true,
          data: { message: 'Event added successfully', event },
          timestamp: new Date().toISOString()
        });

      default:
        return json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('[BIAS_API] Error in POST request:', error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

/**
 * PUT /api/bias-scoring
 * Update configuration or settings
 */
export const PUT: RequestHandler = async ({ request }) => {
  try {
    const service = await initializeBiasService();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'restart_service':
        service.stop();
        await service.start();
        return json({
          success: true,
          data: { message: 'Service restarted successfully' },
          timestamp: new Date().toISOString()
        });

      default:
        return json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('[BIAS_API] Error in PUT request:', error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

/**
 * DELETE /api/bias-scoring
 * Stop service or cleanup
 */
export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const action = url.searchParams.get('action') || 'stop';

    switch (action) {
      case 'stop':
        if (biasService) {
          biasService.stop();
          return json({
            success: true,
            data: { message: 'Service stopped successfully' },
            timestamp: new Date().toISOString()
          });
        } else {
          return json({
            success: true,
            data: { message: 'Service was not running' },
            timestamp: new Date().toISOString()
          });
        }

      case 'cleanup':
        if (biasService) {
          await biasService.close();
          biasService = null;
          return json({
            success: true,
            data: { message: 'Service cleaned up successfully' },
            timestamp: new Date().toISOString()
          });
        } else {
          return json({
            success: true,
            data: { message: 'No service to cleanup' },
            timestamp: new Date().toISOString()
          });
        }

      default:
        return json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

  } catch (error) {
    console.error('[BIAS_API] Error in DELETE request:', error);
    return json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
};

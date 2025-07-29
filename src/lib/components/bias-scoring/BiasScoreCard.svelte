<script lang="ts">
  import { onMount } from 'svelte';
  import { TrendingUp, TrendingDown, ChartBar, Minus, HelpCircle } from '@lucide/svelte';
  
  export let asset: string;
  export let showDetails: boolean = false;
  export let refreshInterval: number = 30000; // 30 seconds

  interface AssetBiasOverview {
    asset: string;
    currentBias: 'STRONG_BULLISH' | 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'STRONG_BEARISH';
    score: number;
    confidence: number;
    lastUpdated: string;
    bullishFactors: string[];
    bearishFactors: string[];
    dataQuality: 'HIGH' | 'MEDIUM' | 'LOW';
    changesSinceLastUpdate: number;
  }

  let biasData: AssetBiasOverview | null = null;
  let loading = true;
  let error: string | null = null;
  let lastRefresh: Date | null = null;

  // Bias color mapping - Permanent Dark Theme
  const biasColors = {
    'STRONG_BULLISH': 'text-green-400 bg-green-900/20 border-green-700',
    'BULLISH': 'text-green-400 bg-green-900/20 border-green-700',
    'NEUTRAL': 'text-gray-400 bg-gray-700/20 border-gray-600',
    'BEARISH': 'text-red-400 bg-red-900/20 border-red-700',
    'STRONG_BEARISH': 'text-red-400 bg-red-900/20 border-red-700'
  };

  // Data quality colors with dark mode support
  const qualityColors = {
    'HIGH': 'text-green-600 dark:text-green-400',
    'MEDIUM': 'text-yellow-600 dark:text-yellow-400',
    'LOW': 'text-red-600 dark:text-red-400'
  };

  async function fetchBiasData() {
    try {
      loading = true;
      error = null;

      const response = await fetch(`/api/bias-scoring/asset/${asset}`);
      const result = await response.json();

      if (result.success) {
        biasData = result.data.currentBias;
        lastRefresh = new Date();
      } else {
        error = result.error || 'Failed to fetch bias data';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Network error';
      console.error(`Error fetching bias data for ${asset}:`, err);
    } finally {
      loading = false;
    }
  }

  async function triggerUpdate() {
    try {
      const response = await fetch(`/api/bias-scoring/asset/${asset}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', reason: 'Manual refresh from UI' })
      });

      const result = await response.json();
      if (result.success) {
        // Refresh the display data
        await fetchBiasData();
      } else {
        error = result.error || 'Failed to trigger update';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Update failed';
    }
  }

  function formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  function getBiasConfig(bias: string) {
    switch (bias) {
      case 'STRONG_BULLISH':
        return { icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'BULLISH':
        return { icon: ChartBar, color: 'text-green-500', bgColor: 'bg-green-50' };
      case 'NEUTRAL':
        return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-50' };
      case 'BEARISH':
        return { icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-50' };
      case 'STRONG_BEARISH':
        return { icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { icon: HelpCircle, color: 'text-gray-400', bgColor: 'bg-gray-50' };
    }
  }

  onMount(() => {
    fetchBiasData();
    
    // Set up auto-refresh
    const interval = setInterval(fetchBiasData, refreshInterval);
    return () => clearInterval(interval);
  });
</script>

<div class="bg-gray-800 rounded-lg shadow-md border border-gray-600 p-6 transition-all duration-200">
  <!-- Header -->
  <div class="flex items-center justify-between mb-4">
    <div class="flex items-center space-x-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{asset}</h3>
      {#if biasData}
        {@const config = getBiasConfig(biasData.currentBias)}
        <div class="w-8 h-8 rounded-full {config.bgColor} flex items-center justify-center">
          <svelte:component this={config.icon} size={16} class={config.color} />
        </div>
      {/if}
    </div>
    
    <div class="flex items-center space-x-2">
      {#if biasData}
        <span class={`text-xs px-2 py-1 rounded-full ${qualityColors[biasData.dataQuality]}`}>
          {biasData.dataQuality} Quality
        </span>
      {/if}
      
      <button 
        on:click={triggerUpdate}
        class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        disabled={loading}
      >
        {loading ? '⟳' : '🔄'} Update
      </button>
    </div>
  </div>

  {#if loading && !biasData}
    <div class="flex items-center justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-2 text-gray-600">Loading bias data...</span>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="text-red-400">⚠️</div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  {:else if biasData}
    <!-- Main Bias Display -->
    <div class="text-center mb-6">
      <div class={`inline-flex items-center px-4 py-2 rounded-lg border-2 ${biasColors[biasData.currentBias]}`}>
        <span class="text-xl font-bold">{biasData.currentBias.replace('_', ' ')}</span>
      </div>
      
      <div class="mt-2 text-sm text-gray-600">
        Score: <span class="font-semibold">{biasData.score}</span> | 
        Confidence: <span class="font-semibold">{(biasData.confidence * 100).toFixed(1)}%</span>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-600">{biasData.bullishFactors.length}</div>
        <div class="text-xs text-gray-600">Bullish Factors</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-red-600">{biasData.bearishFactors.length}</div>
        <div class="text-xs text-gray-600">Bearish Factors</div>
      </div>
    </div>

    {#if showDetails}
      <!-- Detailed Breakdown -->
      <div class="border-t pt-4 space-y-4">
        <!-- Bullish Factors -->
        {#if biasData.bullishFactors.length > 0}
          <div>
            <h4 class="text-sm font-semibold text-green-700 mb-2">📈 Bullish Factors</h4>
            <ul class="space-y-1">
              {#each biasData.bullishFactors as factor}
                <li class="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {factor}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Bearish Factors -->
        {#if biasData.bearishFactors.length > 0}
          <div>
            <h4 class="text-sm font-semibold text-red-700 mb-2">📉 Bearish Factors</h4>
            <ul class="space-y-1">
              {#each biasData.bearishFactors as factor}
                <li class="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                  {factor}
                </li>
              {/each}
            </ul>
          </div>
        {/if}

        <!-- Recent Changes -->
        {#if biasData.changesSinceLastUpdate > 0}
          <div class="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div class="text-sm font-medium text-blue-800">
              🔄 {biasData.changesSinceLastUpdate} recent change{biasData.changesSinceLastUpdate > 1 ? 's' : ''} detected
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Footer -->
    <div class="border-t pt-3 mt-4">
      <div class="flex justify-between items-center text-xs text-gray-500">
        <span>Last updated: {formatTimestamp(biasData.lastUpdated)}</span>
        {#if lastRefresh}
          <span>Refreshed: {lastRefresh.toLocaleTimeString()}</span>
        {/if}
      </div>
    </div>
  {:else}
    <div class="text-center py-8 text-gray-500">
      No bias data available for {asset}
    </div>
  {/if}
</div>

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>

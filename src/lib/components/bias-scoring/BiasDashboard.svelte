<script lang="ts">
  import { onMount } from 'svelte';
  import { ChartBar, RefreshCw, Loader2 } from '@lucide/svelte';
  import BiasScoreCard from './BiasScoreCard.svelte';
  
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

  interface ServiceStatus {
    isRunning: boolean;
    lastUpdate: string | null;
    totalAssets: number;
    assetsWithScores: number;
    averageConfidence: number;
    systemLoad: 'LOW' | 'MEDIUM' | 'HIGH';
    databaseHealth: 'HEALTHY' | 'WARNING' | 'ERROR';
  }

  let allBiasScores: AssetBiasOverview[] = [];
  let serviceStatus: ServiceStatus | null = null;
  let loading = true;
  let error: string | null = null;
  let selectedView: 'grid' | 'list' = 'grid';
  let filterBias: string = 'ALL';
  let sortBy: 'asset' | 'score' | 'confidence' | 'updated' = 'asset';

  const assets = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
  const biasOptions = ['ALL', 'STRONG_BULLISH', 'BULLISH', 'NEUTRAL', 'BEARISH', 'STRONG_BEARISH'];

  async function fetchAllData() {
    try {
      loading = true;
      error = null;

      // Fetch all bias scores
      const scoresResponse = await fetch('/api/bias-scoring?action=scores');
      const scoresResult = await scoresResponse.json();

      // Fetch service status
      const statusResponse = await fetch('/api/bias-scoring?action=status');
      const statusResult = await statusResponse.json();

      if (scoresResult.success && statusResult.success) {
        allBiasScores = scoresResult.data;
        serviceStatus = statusResult.data;
      } else {
        error = scoresResult.error || statusResult.error || 'Failed to fetch data';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Network error';
      console.error('Error fetching bias dashboard data:', err);
    } finally {
      loading = false;
    }
  }

  async function recalculateAllScores() {
    try {
      const response = await fetch('/api/bias-scoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'recalculate_all' })
      });

      const result = await response.json();
      if (result.success) {
        await fetchAllData(); // Refresh the display
      } else {
        error = result.error || 'Failed to recalculate scores';
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Recalculation failed';
    }
  }

  function getFilteredAndSortedScores(): AssetBiasOverview[] {
    let filtered = allBiasScores;

    // Apply bias filter
    if (filterBias !== 'ALL') {
      filtered = filtered.filter(score => score.currentBias === filterBias);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'asset':
        default:
          return a.asset.localeCompare(b.asset);
      }
    });

    return filtered;
  }

  function getBiasDistribution() {
    const distribution = {
      'STRONG_BULLISH': 0,
      'BULLISH': 0,
      'NEUTRAL': 0,
      'BEARISH': 0,
      'STRONG_BEARISH': 0
    };

    allBiasScores.forEach(score => {
      distribution[score.currentBias]++;
    });

    return distribution;
  }

  function getSystemHealthColor(health: string): string {
    switch (health) {
      case 'HEALTHY': return 'text-green-600';
      case 'WARNING': return 'text-yellow-600';
      case 'ERROR': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  function getLoadColor(load: string): string {
    switch (load) {
      case 'LOW': return 'text-green-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'HIGH': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  onMount(() => {
    fetchAllData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  });

  $: filteredScores = getFilteredAndSortedScores();
  $: biasDistribution = getBiasDistribution();
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <ChartBar size={20} class="text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900">Fundamental Bias Scoring Dashboard</h2>
    </div>
    <div class="flex items-center space-x-3">
      <button
        on:click={fetchAllData}
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        disabled={loading}
      >
        {#if loading}
          <Loader2 size={16} class="animate-spin" />
        {:else}
          <RefreshCw size={16} />
        {/if}
        Refresh
      </button>
      <button
        on:click={recalculateAllScores}
        class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Recalculate All
      </button>
    </div>
  </div>

  {#if error}
    <div class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <div class="text-red-400">⚠️</div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
    </div>
  {/if}

  <!-- System Status -->
  {#if serviceStatus}
    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">🔧 System Status</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold {serviceStatus.isRunning ? 'text-green-600' : 'text-red-600'}">
            {serviceStatus.isRunning ? '✅' : '❌'}
          </div>
          <div class="text-sm text-gray-600">Service Status</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{serviceStatus.assetsWithScores}/{serviceStatus.totalAssets}</div>
          <div class="text-sm text-gray-600">Assets Scored</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold {getSystemHealthColor(serviceStatus.databaseHealth)}">
            {serviceStatus.databaseHealth}
          </div>
          <div class="text-sm text-gray-600">Database Health</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold {getLoadColor(serviceStatus.systemLoad)}">
            {serviceStatus.systemLoad}
          </div>
          <div class="text-sm text-gray-600">System Load</div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Bias Distribution -->
  {#if allBiasScores.length > 0}
    <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Bias Distribution</h3>
      <div class="grid grid-cols-5 gap-4">
        {#each Object.entries(biasDistribution) as [bias, count]}
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-700">{count}</div>
            <div class="text-xs text-gray-600">{bias.replace('_', ' ')}</div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Controls -->
  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-4">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <!-- View Toggle -->
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700">View:</span>
        <button 
          class="px-3 py-1 rounded {selectedView === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
          on:click={() => selectedView = 'grid'}
        >
          Grid
        </button>
        <button 
          class="px-3 py-1 rounded {selectedView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
          on:click={() => selectedView = 'list'}
        >
          List
        </button>
      </div>

      <!-- Filters -->
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Filter:</label>
          <select bind:value={filterBias} class="border border-gray-300 rounded px-2 py-1 text-sm">
            {#each biasOptions as option}
              <option value={option}>{option.replace('_', ' ')}</option>
            {/each}
          </select>
        </div>

        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Sort:</label>
          <select bind:value={sortBy} class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="asset">Asset</option>
            <option value="score">Score</option>
            <option value="confidence">Confidence</option>
            <option value="updated">Last Updated</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <!-- Bias Scores Display -->
  {#if loading && allBiasScores.length === 0}
    <div class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <span class="ml-3 text-gray-600 dark:text-dark-text-secondary">Loading bias scores...</span>
    </div>
  {:else if selectedView === 'grid'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each filteredScores as score (score.asset)}
        <BiasScoreCard asset={score.asset} showDetails={true} />
      {/each}
    </div>
  {:else}
    <div class="bg-white dark:bg-dark-surface rounded-lg shadow-md border border-gray-200 dark:border-dark-border overflow-hidden transition-colors duration-200">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
        <thead class="bg-gray-50 dark:bg-dark-card">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Asset</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Bias</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Score</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Confidence</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Quality</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-muted uppercase tracking-wider">Updated</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-dark-border">
          {#each filteredScores as score (score.asset)}
            <tr class="hover:bg-gray-50 dark:hover:bg-dark-card transition-colors duration-200">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text-primary">{score.asset}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text-primary">{score.currentBias.replace('_', ' ')}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.score}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(score.confidence * 100).toFixed(1)}%</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{score.dataQuality}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(score.lastUpdated).toLocaleString()}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if filteredScores.length === 0 && !loading}
    <div class="text-center py-12 text-gray-500">
      No bias scores match the current filter criteria.
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

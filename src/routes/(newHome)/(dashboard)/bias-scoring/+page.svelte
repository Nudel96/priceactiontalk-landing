<script lang="ts">
  import { onMount } from 'svelte';
  import BiasDashboard from '$lib/components/bias-scoring/BiasDashboard.svelte';
  import BiasScoreCard from '$lib/components/bias-scoring/BiasScoreCard.svelte';

  let activeTab: 'dashboard' | 'individual' | 'health' = 'dashboard';
  let selectedAsset: string = 'USD';
  let healthData: any = null;
  let healthLoading = false;

  const assets = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'XAU', name: 'Gold', flag: '🥇' },
    { code: 'XAG', name: 'Silver', flag: '🥈' }
  ];

  async function fetchHealthData() {
    try {
      healthLoading = true;
      const response = await fetch('/api/bias-scoring/health?detailed=true');
      const result = await response.json();
      healthData = result.data;
    } catch (error) {
      console.error('Error fetching health data:', error);
      healthData = { error: 'Failed to fetch health data' };
    } finally {
      healthLoading = false;
    }
  }

  async function runDiagnostics() {
    try {
      healthLoading = true;
      const response = await fetch('/api/bias-scoring/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: 'full' })
      });
      const result = await response.json();
      healthData = { ...healthData, diagnostics: result.data };
    } catch (error) {
      console.error('Error running diagnostics:', error);
    } finally {
      healthLoading = false;
    }
  }

  function getHealthStatusColor(status: string): string {
    switch (status) {
      case 'HEALTHY': return 'text-green-600';
      case 'WARNING': return 'text-yellow-600';
      case 'ERROR': return 'text-red-600';
      case 'DEGRADED': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  }

  onMount(() => {
    if (activeTab === 'health') {
      fetchHealthData();
    }
  });

  $: if (activeTab === 'health' && !healthData) {
    fetchHealthData();
  }
</script>

<svelte:head>
  <title>Fundamental Bias Scoring - PriceActionTalk</title>
  <meta name="description" content="Advanced fundamental analysis with point-based bias scoring for forex pairs and precious metals" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">📊 Fundamental Bias Scoring System</h1>
      <p class="mt-2 text-gray-600">
        Advanced point-based fundamental analysis with real-time change detection and bias scoring for all major currencies and precious metals.
      </p>
    </div>

    <!-- Navigation Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-8" aria-label="Tabs">
        <button
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = 'dashboard'}
        >
          📈 Dashboard Overview
        </button>
        <button
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'individual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = 'individual'}
        >
          🎯 Individual Assets
        </button>
        <button
          class="py-2 px-1 border-b-2 font-medium text-sm {activeTab === 'health' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
          on:click={() => activeTab = 'health'}
        >
          🔧 System Health
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    {#if activeTab === 'dashboard'}
      <!-- Dashboard Overview -->
      <div class="space-y-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 class="text-lg font-semibold text-blue-900 mb-2">🎯 How It Works</h2>
          <div class="text-sm text-blue-800 space-y-2">
            <p><strong>Change Detection:</strong> Monitors fundamental data using timestamps, unique IDs, and content hashing to detect only new information.</p>
            <p><strong>Smart Scheduling:</strong> Regular 4-hour checks plus event-triggered updates with 5-minute buffers after data releases.</p>
            <p><strong>Point-Based Scoring:</strong> Each fundamental factor (earnings, revenue, debt, etc.) contributes -2 to +2 points based on performance.</p>
            <p><strong>Bias Calculation:</strong> Weighted scores determine overall bias: Strong Bullish (+1.5+), Bullish (+0.5+), Neutral (±0.5), Bearish (-0.5-), Strong Bearish (-1.5-).</p>
          </div>
        </div>
        
        <BiasDashboard />
      </div>

    {:else if activeTab === 'individual'}
      <!-- Individual Assets -->
      <div class="space-y-6">
        <!-- Asset Selector -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Asset for Detailed Analysis</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {#each assets as asset}
              <button
                class="flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors {selectedAsset === asset.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}"
                on:click={() => selectedAsset = asset.code}
              >
                <span class="text-xl">{asset.flag}</span>
                <div class="text-left">
                  <div class="font-semibold text-sm">{asset.code}</div>
                  <div class="text-xs text-gray-600">{asset.name}</div>
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- Selected Asset Details -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BiasScoreCard asset={selectedAsset} showDetails={true} />
          
          <!-- Additional Asset Information -->
          <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📋 Fundamental Factors</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Earnings Growth</span>
                <span class="text-sm text-gray-600">Weight: High (3x)</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Revenue Trend</span>
                <span class="text-sm text-gray-600">Weight: High (3x)</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Profit Margin</span>
                <span class="text-sm text-gray-600">Weight: Medium (2x)</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Debt Level</span>
                <span class="text-sm text-gray-600">Weight: Medium (2x)</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Return on Equity</span>
                <span class="text-sm text-gray-600">Weight: Medium (2x)</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">External Factors</span>
                <span class="text-sm text-gray-600">Weight: Medium (2x)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {:else if activeTab === 'health'}
      <!-- System Health -->
      <div class="space-y-6">
        <!-- Health Overview -->
        <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">🔧 System Health Monitor</h2>
            <div class="flex space-x-3">
              <button
                on:click={fetchHealthData}
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={healthLoading}
              >
                {healthLoading ? '⟳' : '🔄'} Refresh
              </button>
              <button
                on:click={runDiagnostics}
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                disabled={healthLoading}
              >
                🔍 Run Diagnostics
              </button>
            </div>
          </div>

          {#if healthLoading}
            <div class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-2 text-gray-600">Loading health data...</span>
            </div>
          {:else if healthData}
            <!-- Overall Health Status -->
            <div class="mb-6">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">
                  {healthData.overall === 'HEALTHY' ? '✅' : healthData.overall === 'DEGRADED' ? '⚠️' : '❌'}
                </span>
                <div>
                  <div class="text-xl font-bold {getHealthStatusColor(healthData.overall)}">
                    {healthData.overall}
                  </div>
                  <div class="text-sm text-gray-600">
                    Last checked: {new Date(healthData.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <!-- Component Health -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Database Health -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">💾 Database</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Status:</span>
                    <span class={getHealthStatusColor(healthData.components.database.status)}>
                      {healthData.components.database.status}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>Bias Scores:</span>
                    <span>{healthData.components.database.biasScoreCount}</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Fundamental Data:</span>
                    <span>{healthData.components.database.fundamentalDataCount}</span>
                  </div>
                </div>
              </div>

              <!-- Service Health -->
              <div class="border border-gray-200 rounded-lg p-4">
                <h3 class="font-semibold text-gray-900 mb-3">⚙️ Service</h3>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span>Status:</span>
                    <span class={getHealthStatusColor(healthData.components.service.status)}>
                      {healthData.components.service.status}
                    </span>
                  </div>
                  {#if healthData.components.service.details}
                    <div class="flex justify-between">
                      <span>Running:</span>
                      <span>{healthData.components.service.details.isRunning ? 'Yes' : 'No'}</span>
                    </div>
                    <div class="flex justify-between">
                      <span>Assets:</span>
                      <span>{healthData.components.service.details.assetsWithScores}/{healthData.components.service.details.totalAssets}</span>
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Diagnostics Results -->
            {#if healthData.diagnostics}
              <div class="mt-6 border-t pt-6">
                <h3 class="font-semibold text-gray-900 mb-4">🔍 Diagnostic Results</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {#each Object.entries(healthData.diagnostics.tests) as [testName, testResult]}
                    <div class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium capitalize">{testName}</span>
                        <span class={testResult.status === 'PASSED' ? 'text-green-600' : 'text-red-600'}>
                          {testResult.status === 'PASSED' ? '✅' : '❌'}
                        </span>
                      </div>
                      <div class="text-sm text-gray-600">
                        {#if testResult.error}
                          <div class="text-red-600">{testResult.error}</div>
                        {:else}
                          <div>All checks passed</div>
                        {/if}
                      </div>
                    </div>
                  {/each}
                </div>
              </div>
            {/if}
          {:else}
            <div class="text-center py-8 text-gray-500">
              Click "Refresh" to load health data
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
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

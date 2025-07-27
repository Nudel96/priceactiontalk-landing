<script lang="ts">
	import { TrendingUp, TrendingDown, Activity } from '@lucide/svelte';
	import { AdvancedEconomicService } from '$lib/services/advanced-economic-service';
	import { onMount } from 'svelte';

	// Props
	export let title: string = 'Currency Pair Performance';
	export let showHeader: boolean = true;
	export let selectedCurrency: string = 'USD';

	// State variables
	let economicService: AdvancedEconomicService;
	let assetScores: any[] = [];
	let isLoading = false;
	let lastUpdate = '';
	let error = '';

	// Real-time currency pairs data
	let currencyPairs: any[] = [];

	// API configuration
	const FCS_API_KEY = 'qPzxT3D4qhIm7EDXYyw2dHe'; // Correct FCS API key

	onMount(async () => {
		try {
			economicService = AdvancedEconomicService.getInstance();
			if (!economicService.isReady()) {
				await economicService.initialize();
			}
			await loadData();
		} catch (err) {
			console.error('Error initializing CurrencyPairHeatmap:', err);
			error = 'Failed to load currency data';
		}
	});

	async function loadData() {
		isLoading = true;
		error = '';

		try {
			console.log('[HEATMAP] Loading currency pair data...');

			// Try to get data from economic service first
			if (economicService && economicService.isReady()) {
				try {
					const dashboardData = await economicService.getDashboardData(['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF']);
					if (dashboardData.assetScores && dashboardData.assetScores.length > 0) {
						// Convert asset scores to currency pairs format
						currencyPairs = dashboardData.assetScores.map((score: any) => ({
							symbol: `${score.asset}/USD`,
							bias: score.overall_score > 20 ? 'BULLISH' : score.overall_score < -20 ? 'BEARISH' : 'NEUTRAL',
							score: score.overall_score,
							change: score.overall_score / 10, // Convert score to percentage-like change
							price: 1.0 + (score.overall_score / 1000) // Mock price based on score
						}));

						assetScores = currencyPairs;
						lastUpdate = new Date().toLocaleTimeString();
						console.log('✅ Currency data loaded from economic service:', currencyPairs.length, 'pairs');
						return;
					}
				} catch (serviceError) {
					console.warn('[HEATMAP] Economic service failed, trying FCS API:', serviceError);
				}
			}

			// Fallback to FCS API
			const majorPairs = [
				'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD',
				'EUR/GBP', 'EUR/JPY', 'GBP/JPY'
			];

			console.log(`[HEATMAP] Trying FCS API for ${majorPairs.length} currency pairs...`);
			const symbolParam = majorPairs.join(',');
			const url = `https://fcsapi.com/api-v3/forex/latest?symbol=${symbolParam}&access_key=${FCS_API_KEY}`;

			const response = await fetch(url);
			const data = await response.json();

			if (data.status && data.response) {
				currencyPairs = data.response.map((rate: any) => {
					const change = parseFloat(rate.ch) || 0;
					const changePercent = parseFloat(rate.cp) || 0;
					const price = parseFloat(rate.c);

					// Determine bias based on change
					let bias = 'NEUTRAL';
					if (changePercent > 0.5) bias = 'BULLISH';
					else if (changePercent < -0.5) bias = 'BEARISH';

					return {
						symbol: rate.s,
						bias,
						score: changePercent * 2, // Simple scoring based on change
						change: changePercent,
						price: price
					};
				});

				assetScores = currencyPairs;
				lastUpdate = new Date().toLocaleTimeString();
				console.log('✅ Real-time forex data loaded from FCS API:', currencyPairs.length, 'pairs');
			} else {
				throw new Error('FCS API returned no data');
			}
		} catch (err) {
			console.error('Error loading real forex data:', err);
			// Comprehensive fallback data with all major pairs
			currencyPairs = [
				// Major USD pairs
				{ symbol: 'EUR/USD', bias: 'BULLISH', score: 2.5, change: 0.42, price: 1.0845 },
				{ symbol: 'GBP/USD', bias: 'BEARISH', score: -1.8, change: -0.25, price: 1.2654 },
				{ symbol: 'USD/JPY', bias: 'BULLISH', score: 3.2, change: 0.45, price: 149.45 },
				{ symbol: 'AUD/USD', bias: 'NEUTRAL', score: 0.8, change: 0.18, price: 0.6523 },
				{ symbol: 'USD/CAD', bias: 'BEARISH', score: -1.2, change: -0.17, price: 1.3654 },
				{ symbol: 'USD/CHF', bias: 'BULLISH', score: 2.1, change: 0.38, price: 0.8945 },
				{ symbol: 'NZD/USD', bias: 'NEUTRAL', score: 0.3, change: 0.12, price: 0.5987 },

				// Cross pairs
				{ symbol: 'EUR/GBP', bias: 'BULLISH', score: 1.5, change: 0.28, price: 0.8567 },
				{ symbol: 'EUR/JPY', bias: 'BULLISH', score: 4.2, change: 0.67, price: 162.15 },
				{ symbol: 'GBP/JPY', bias: 'NEUTRAL', score: 0.5, change: 0.15, price: 189.23 },
				{ symbol: 'AUD/JPY', bias: 'BEARISH', score: -2.1, change: -0.42, price: 97.45 },
				{ symbol: 'CAD/JPY', bias: 'BULLISH', score: 1.2, change: 0.23, price: 109.56 },
				{ symbol: 'CHF/JPY', bias: 'BEARISH', score: -0.8, change: -0.18, price: 167.89 },

				// Additional cross pairs
				{ symbol: 'EUR/AUD', bias: 'BULLISH', score: 2.8, change: 0.52, price: 1.6623 },
				{ symbol: 'GBP/AUD', bias: 'BEARISH', score: -1.5, change: -0.31, price: 1.9401 },
				{ symbol: 'EUR/CAD', bias: 'NEUTRAL', score: 0.6, change: 0.14, price: 1.4812 },
				{ symbol: 'GBP/CAD', bias: 'BEARISH', score: -0.9, change: -0.19, price: 1.7289 },
				{ symbol: 'AUD/CAD', bias: 'BULLISH', score: 1.7, change: 0.35, price: 0.8901 }
			];
			assetScores = currencyPairs;
			lastUpdate = new Date().toLocaleTimeString();
			error = 'Using fallback data - API connection failed';
		} finally {
			isLoading = false;
		}
	}

	function getBiasColor(bias: string): string {
		switch (bias) {
			case 'BULLISH': return 'text-green-600 bg-green-50';
			case 'BEARISH': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getScoreColor(score: number): string {
		if (score > 5) return 'text-green-600';
		if (score < -5) return 'text-red-600';
		return 'text-gray-600';
	}
</script>

{#if showHeader}
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Activity class="w-6 h-6 text-blue-600" />
					<div>
						<h2 class="text-xl font-bold text-navy">{title}</h2>
						<p class="text-sm text-gray-600">Real-time currency pair analysis</p>
					</div>
				</div>
				
				<button
					on:click={loadData}
					disabled={isLoading}
					class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					<Activity class="w-4 h-4" />
					{isLoading ? 'Loading...' : 'Refresh'}
				</button>
			</div>
		</div>

		<div class="p-6">
			{#if error}
				<div class="text-center py-8">
					<div class="text-red-600 mb-2">⚠️ {error}</div>
					<button
						on:click={loadData}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			{:else if isLoading}
				<div class="text-center py-8">
					<div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<div class="text-gray-600">Loading currency data...</div>
				</div>
			{:else}
				<div class="space-y-4">
					<!-- Currency Pairs Grid -->
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
						{#each currencyPairs as pair}
							<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
								<div class="flex items-center justify-between mb-2">
									<div class="font-semibold text-gray-900">{pair.symbol}</div>
									<div class="px-2 py-1 rounded text-xs font-medium {getBiasColor(pair.bias)}">
										{pair.bias}
									</div>
								</div>
								
								<div class="flex items-center justify-between mb-2">
									<div class="text-lg font-bold text-gray-900">{pair.price.toFixed(4)}</div>
									<div class="flex items-center gap-1 {pair.change >= 0 ? 'text-green-600' : 'text-red-600'}">
										{#if pair.change >= 0}
											<TrendingUp class="w-4 h-4" />
										{:else}
											<TrendingDown class="w-4 h-4" />
										{/if}
										<span class="text-sm font-medium">{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%</span>
									</div>
								</div>
								
								<div class="flex items-center justify-between">
									<div class="text-sm text-gray-600">Score</div>
									<div class="font-semibold {getScoreColor(pair.score)}">{pair.score.toFixed(1)}</div>
								</div>
							</div>
						{/each}
					</div>

					{#if lastUpdate}
						<div class="text-center pt-4 border-t border-gray-200">
							<p class="text-sm text-gray-500">Last updated: {lastUpdate}</p>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{:else}
	<!-- Simplified version without header -->
	<div class="space-y-4">
		{#if error}
			<div class="text-center py-4">
				<div class="text-red-600 text-sm">⚠️ {error}</div>
			</div>
		{:else if isLoading}
			<div class="text-center py-4">
				<div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
				<div class="text-gray-600 text-sm">Loading...</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				{#each currencyPairs.slice(0, 4) as pair}
					<div class="border border-gray-200 rounded-lg p-3">
						<div class="flex items-center justify-between mb-1">
							<div class="font-medium text-gray-900 text-sm">{pair.symbol}</div>
							<div class="px-2 py-1 rounded text-xs {getBiasColor(pair.bias)}">
								{pair.bias}
							</div>
						</div>
						
						<div class="flex items-center justify-between">
							<div class="font-bold text-gray-900">{pair.price.toFixed(4)}</div>
							<div class="flex items-center gap-1 {pair.change >= 0 ? 'text-green-600' : 'text-red-600'}">
								{#if pair.change >= 0}
									<TrendingUp class="w-3 h-3" />
								{:else}
									<TrendingDown class="w-3 h-3" />
								{/if}
								<span class="text-xs">{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<style>
	.animate-spin {
		animation: spin 1s linear infinite;
	}
	
	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { TrendingUp, TrendingDown, Activity, Users, AlertTriangle } from '@lucide/svelte';
	import { getSentimentAggregator } from '$lib/services/data-collection/sentiment-aggregator';

	// Props
	export let selectedCurrency: string = 'USD';
	export let showHeader: boolean = true;

	// State
	let sentimentData: any = null;
	let isLoading = false;
	let error: string | null = null;
	let lastUpdated: string = '';

	onMount(() => {
		loadSentimentData();
		
		// Auto-refresh every 2 minutes
		const interval = setInterval(loadSentimentData, 2 * 60 * 1000);
		return () => clearInterval(interval);
	});

	/**
	 * Load retail sentiment data
	 */
	async function loadSentimentData() {
		isLoading = true;
		error = null;
		
		try {
			console.log(`[SENTIMENT_DISPLAY] Loading sentiment data for ${selectedCurrency}...`);
			
			const sentimentAggregator = getSentimentAggregator();
			const aggregatedSentiment = await sentimentAggregator.getAggregatedSentiment(selectedCurrency);
			
			if (aggregatedSentiment) {
				sentimentData = {
					currency: selectedCurrency,
					overall_sentiment: aggregatedSentiment.overall_sentiment,
					bullish_percentage: aggregatedSentiment.bullish_percentage,
					bearish_percentage: aggregatedSentiment.bearish_percentage,
					confidence_level: aggregatedSentiment.confidence_level,
					data_quality: aggregatedSentiment.data_quality,
					sources: aggregatedSentiment.sources,
					contrarian_signal: aggregatedSentiment.contrarian_signal,
					last_updated: aggregatedSentiment.last_updated
				};
				
				lastUpdated = new Date().toLocaleTimeString();
				console.log(`[SENTIMENT_DISPLAY] ✅ Sentiment data loaded for ${selectedCurrency}`);
				console.log(`[SENTIMENT_DISPLAY] Overall sentiment: ${sentimentData.overall_sentiment}`);
				console.log(`[SENTIMENT_DISPLAY] Bullish: ${sentimentData.bullish_percentage}%, Bearish: ${sentimentData.bearish_percentage}%`);
				
			} else {
				throw new Error('No sentiment data received');
			}
			
		} catch (err: any) {
			console.error(`[SENTIMENT_DISPLAY] Failed to load sentiment data:`, err);
			error = err.message;
			
			// Use fallback data
			sentimentData = {
				currency: selectedCurrency,
				overall_sentiment: 'NEUTRAL',
				bullish_percentage: 52,
				bearish_percentage: 48,
				confidence_level: 65,
				data_quality: 'FAIR',
				sources: ['Fallback'],
				contrarian_signal: null,
				last_updated: new Date().toISOString()
			};
			
			lastUpdated = new Date().toLocaleTimeString();
			
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Get sentiment color based on overall sentiment
	 */
	function getSentimentColor(sentiment: string): string {
		switch (sentiment) {
			case 'BULLISH': return 'text-green-600 bg-green-50 border-green-200';
			case 'BEARISH': return 'text-red-600 bg-red-50 border-red-200';
			case 'NEUTRAL': return 'text-gray-600 bg-gray-50 border-gray-200';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}

	/**
	 * Get contrarian signal color
	 */
	function getContrarianColor(signal: string | null): string {
		if (!signal) return 'text-gray-600 bg-gray-50';
		switch (signal) {
			case 'BUY': return 'text-green-600 bg-green-50';
			case 'SELL': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	/**
	 * Get data quality color
	 */
	function getQualityColor(quality: string): string {
		switch (quality) {
			case 'EXCELLENT': return 'text-green-600';
			case 'GOOD': return 'text-blue-600';
			case 'FAIR': return 'text-yellow-600';
			case 'POOR': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	// Reactive statement to reload data when currency changes
	$: if (selectedCurrency) {
		loadSentimentData();
	}
</script>

{#if showHeader}
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Users class="w-6 h-6 text-purple-600" />
					<div>
						<h2 class="text-xl font-bold text-navy">Retail Sentiment Analysis</h2>
						<p class="text-sm text-gray-600">Multi-source sentiment aggregation for {selectedCurrency}</p>
					</div>
				</div>
				
				<button
					on:click={loadSentimentData}
					disabled={isLoading}
					class="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
				>
					<Activity class="w-4 h-4" />
					{isLoading ? 'Loading...' : 'Refresh'}
				</button>
			</div>
		</div>

		<div class="p-6">
			{#if error}
				<div class="text-center py-8">
					<AlertTriangle class="w-12 h-12 text-red-500 mx-auto mb-4" />
					<div class="text-red-600 mb-2">⚠️ {error}</div>
					<button
						on:click={loadSentimentData}
						class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			{:else if isLoading}
				<div class="text-center py-8">
					<div class="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<div class="text-gray-600">Loading sentiment data...</div>
				</div>
			{:else if sentimentData}
				<div class="space-y-6">
					<!-- Overall Sentiment -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="border rounded-lg p-4 {getSentimentColor(sentimentData.overall_sentiment)}">
							<div class="flex items-center gap-2 mb-2">
								<Activity class="w-5 h-5" />
								<h3 class="font-semibold">Overall Sentiment</h3>
							</div>
							<div class="text-2xl font-bold">{sentimentData.overall_sentiment}</div>
							<div class="text-sm opacity-75">Confidence: {sentimentData.confidence_level}%</div>
						</div>

						<div class="border border-green-200 rounded-lg p-4 bg-green-50">
							<div class="flex items-center gap-2 mb-2">
								<TrendingUp class="w-5 h-5 text-green-600" />
								<h3 class="font-semibold text-green-800">Bullish</h3>
							</div>
							<div class="text-2xl font-bold text-green-700">{sentimentData.bullish_percentage}%</div>
							<div class="text-sm text-green-600">Retail traders long</div>
						</div>

						<div class="border border-red-200 rounded-lg p-4 bg-red-50">
							<div class="flex items-center gap-2 mb-2">
								<TrendingDown class="w-5 h-5 text-red-600" />
								<h3 class="font-semibold text-red-800">Bearish</h3>
							</div>
							<div class="text-2xl font-bold text-red-700">{sentimentData.bearish_percentage}%</div>
							<div class="text-sm text-red-600">Retail traders short</div>
						</div>
					</div>

					<!-- Contrarian Signal -->
					{#if sentimentData.contrarian_signal}
						<div class="border-2 border-dashed border-yellow-300 rounded-lg p-4 bg-yellow-50">
							<div class="flex items-center gap-2 mb-2">
								<AlertTriangle class="w-5 h-5 text-yellow-600" />
								<h3 class="font-semibold text-yellow-800">Contrarian Signal</h3>
							</div>
							<div class="flex items-center gap-3">
								<div class="px-3 py-1 rounded-full text-sm font-medium {getContrarianColor(sentimentData.contrarian_signal)}">
									{sentimentData.contrarian_signal}
								</div>
								<div class="text-sm text-yellow-700">
									Extreme sentiment detected - consider contrarian position
								</div>
							</div>
						</div>
					{/if}

					<!-- Data Sources -->
					<div class="border border-gray-200 rounded-lg p-4">
						<h3 class="font-semibold text-gray-800 mb-3">Data Sources</h3>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
							{#each sentimentData.sources as source}
								<div class="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm text-center">
									{source}
								</div>
							{/each}
						</div>
						<div class="mt-3 flex items-center justify-between text-sm text-gray-600">
							<div>
								Data Quality: <span class="{getQualityColor(sentimentData.data_quality)} font-medium">{sentimentData.data_quality}</span>
							</div>
							<div>Last updated: {lastUpdated}</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<!-- Compact version -->
	<div class="space-y-3">
		{#if sentimentData && !isLoading}
			<div class="grid grid-cols-2 gap-3">
				<div class="border rounded-lg p-3 {getSentimentColor(sentimentData.overall_sentiment)}">
					<div class="text-sm font-medium">{sentimentData.overall_sentiment}</div>
					<div class="text-xs opacity-75">{sentimentData.confidence_level}% confidence</div>
				</div>
				<div class="border border-gray-200 rounded-lg p-3">
					<div class="text-sm font-medium text-gray-800">
						{sentimentData.bullish_percentage}% / {sentimentData.bearish_percentage}%
					</div>
					<div class="text-xs text-gray-600">Bull / Bear</div>
				</div>
			</div>
			{#if sentimentData.contrarian_signal}
				<div class="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
					<div class="text-sm font-medium text-yellow-800">
						Contrarian: {sentimentData.contrarian_signal}
					</div>
				</div>
			{/if}
		{:else if isLoading}
			<div class="text-center py-4">
				<div class="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
				<div class="text-gray-600 text-sm">Loading...</div>
			</div>
		{:else if error}
			<div class="text-center py-4">
				<div class="text-red-600 text-sm">⚠️ {error}</div>
			</div>
		{/if}
	</div>
{/if}

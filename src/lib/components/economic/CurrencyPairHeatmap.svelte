<script lang="ts">
	import { TrendingUp, TrendingDown, Activity } from '@lucide/svelte';
	import { getRealForexRatesEnhanced, fetchMyFXBookSentiment, batchFetchCOTData } from '$lib/services/economicDataService';
	import { onMount } from 'svelte';

	// Props
	export let title: string = 'Currency Pair Performance';
	export let showHeader: boolean = true;
	export let selectedCurrency: string = 'USD';

	// Currency pair interface
	interface CurrencyPair {
		symbol: string;
		bias: string;
		score: number;
		change: number;
		price: number;
		strength: number;
		sentiment: number;
		technical: number;
		economic: number;
		trend: number;
	}

	// State for real forex data
	let realForexData: Record<string, any> = {};
	let isLoadingForex = false;
	let lastForexUpdate = '';

	// State for sentiment data
	let sentimentData: Record<string, any> = {};
	let isLoadingSentiment = false;
	let lastSentimentUpdate = '';

	// State for COT data
	let cotData: Record<string, any> = {};
	let isLoadingCOT = false;
	let lastCOTUpdate = '';

	// State for FCS-specific data
	let showBidAsk = false;
	let dataSource = 'Unknown';
	let apiCreditsUsed = 0;

	// Fetch real forex data
	async function fetchRealForexData() {
		isLoadingForex = true;
		try {
			console.log('Fetching real forex rates...');
			// Force fresh data by using the enhanced function
			realForexData = await getRealForexRatesEnhanced();
			lastForexUpdate = new Date().toLocaleTimeString();

			// Check data source and FCS-specific features
			const firstPair = Object.values(realForexData)[0] as any;
			if (firstPair) {
				dataSource = firstPair.source || 'Unknown';
				showBidAsk = !!(firstPair.bid && firstPair.ask);
				console.log(`Data source: ${dataSource}, Bid/Ask available: ${showBidAsk}`);
				console.log('Sample pair data:', firstPair);
			}

			console.log(`Real forex data loaded: ${Object.keys(realForexData).length} pairs`);
			console.log('All forex data:', realForexData);
		} catch (error) {
			console.error('Failed to fetch real forex data:', error);
			dataSource = 'Fallback';
			showBidAsk = false;
			// Keep using mock data as fallback
		} finally {
			isLoadingForex = false;
		}
	}

	// Manual refresh function for testing
	async function forceRefresh() {
		console.log('🔄 Force refreshing forex data...');
		await fetchRealForexData();
	}

	// Fetch MyFXBook sentiment data
	async function fetchSentimentData() {
		isLoadingSentiment = true;
		try {
			console.log('Fetching MyFXBook sentiment data...');
			sentimentData = await fetchMyFXBookSentiment();
			lastSentimentUpdate = new Date().toLocaleTimeString();
			console.log('Sentiment data loaded:', sentimentData);
		} catch (error) {
			console.error('Failed to fetch sentiment data:', error);
			// Keep using mock data as fallback
		} finally {
			isLoadingSentiment = false;
		}
	}

	// Fetch COT data
	async function fetchCOTDataAsync() {
		isLoadingCOT = true;
		try {
			console.log('Fetching COT data...');
			cotData = await batchFetchCOTData();
			lastCOTUpdate = new Date().toLocaleTimeString();
			console.log('COT data loaded:', cotData);
		} catch (error) {
			console.error('Failed to fetch COT data:', error);
			// Keep using mock data as fallback
		} finally {
			isLoadingCOT = false;
		}
	}

	// Initialize real data on component mount
	onMount(() => {
		// Only fetch data in browser environment
		if (typeof window !== 'undefined') {
			console.log('🚀 Component mounted, fetching real data...');
			fetchRealForexData();
			fetchSentimentData();
			fetchCOTDataAsync();
		}

		// Refresh forex data every 30 seconds
		const forexInterval = setInterval(fetchRealForexData, 30000);

		// Refresh sentiment data every 15 minutes (900 seconds)
		const sentimentInterval = setInterval(fetchSentimentData, 900000);

		// Refresh COT data every Friday after 15:30 (weekly data)
		// For demo purposes, refresh every hour
		const cotInterval = setInterval(fetchCOTDataAsync, 3600000);

		return () => {
			clearInterval(forexInterval);
			clearInterval(sentimentInterval);
			clearInterval(cotInterval);
		};
	});

	// Helper function to get real price and change data
	function getRealPairData(symbol: string) {
		// Convert symbol format for lookup (e.g., EURUSD -> EUR/USD)
		const forexSymbol = symbol.length === 6 ?
			`${symbol.slice(0, 3)}/${symbol.slice(3)}` :
			symbol.replace(/([A-Z]{3})([A-Z]{3})/, '$1/$2');

		const realData = realForexData[forexSymbol];

		if (realData && realData.current_price) {
			return {
				price: realData.current_price,
				change: realData.change_percent || 0,
				bid: realData.bid || null,
				ask: realData.ask || null,
				spread: realData.spread || null,
				source: realData.source || 'FCS',
				isReal: true
			};
		}

		// Return fallback indicating no real data
		return {
			price: 0,
			change: 0,
			bid: null,
			ask: null,
			spread: null,
			source: 'Mock',
			isReal: false
		};
	}

	// Helper function to get real sentiment data
	function getRealSentimentData(symbol: string) {
		// Try different symbol formats for MyFXBook lookup
		const possibleSymbols = [
			symbol,
			symbol.replace('/', ''),
			symbol.replace('/', '_'),
			symbol.toUpperCase(),
			symbol.toUpperCase().replace('/', ''),
			symbol.toUpperCase().replace('/', '_')
		];

		for (const testSymbol of possibleSymbols) {
			if (sentimentData[testSymbol]) {
				const data = sentimentData[testSymbol];
				return {
					sentiment: data.sentimentScore || 0,
					bias: data.bias || 'Neutral',
					longPercentage: data.longPercentage || 50,
					shortPercentage: data.shortPercentage || 50,
					isReal: true
				};
			}
		}

		// Return neutral sentiment if no real data available
		return {
			sentiment: 0,
			bias: 'Neutral',
			longPercentage: 50,
			shortPercentage: 50,
			isReal: false
		};
	}

	// Helper function to get COT-based currency strength
	function getCOTStrength(currency: string) {
		if (cotData[currency]) {
			const data = cotData[currency];
			return {
				strength: data.strength || 0,
				sentiment: data.sentiment || 'Neutral',
				isReal: true
			};
		}

		return {
			strength: 0,
			sentiment: 'Neutral',
			isReal: false
		};
	}

	// Dynamic currency pair data based on selected currency with real forex integration
	function generateCurrencyPairs(baseCurrency: string): CurrencyPair[] {
		// Helper function to create pair with real data integration
		function createPair(symbol: string, mockData: any) {
			const realData = getRealPairData(symbol);
			const sentimentInfo = getRealSentimentData(symbol);

			// Extract currencies from symbol for COT data
			const baseCurrency = symbol.slice(0, 3);
			const quoteCurrency = symbol.slice(3, 6) || symbol.slice(4, 7);
			const baseCOT = getCOTStrength(baseCurrency);
			const quoteCOT = getCOTStrength(quoteCurrency);

			// Calculate combined strength from COT data
			const combinedStrength = baseCOT.isReal && quoteCOT.isReal ?
				(baseCOT.strength - quoteCOT.strength + 100) / 2 :
				mockData.strength;

			return {
				...mockData,
				symbol,
				price: realData.isReal ? realData.price : mockData.price,
				change: realData.isReal ? realData.change : mockData.change,
				// Use real sentiment data if available
				sentiment: sentimentInfo.isReal ? sentimentInfo.sentiment : mockData.sentiment,
				// Use COT-based strength if available
				strength: baseCOT.isReal || quoteCOT.isReal ? combinedStrength : mockData.strength,
				// Adjust bias based on real data priority: sentiment > price change > mock
				bias: sentimentInfo.isReal ? sentimentInfo.bias :
					realData.isReal ?
						(realData.change > 1 ? 'Bullish' : realData.change < -1 ? 'Bearish' : 'Neutral') :
						mockData.bias,
				// Calculate score based on multiple real data sources
				score: (() => {
					let score = 5; // Base neutral score

					// Add sentiment component
					if (sentimentInfo.isReal) {
						score += sentimentInfo.sentiment / 20; // Scale sentiment to score
					}

					// Add price change component
					if (realData.isReal) {
						score += realData.change / 2; // Scale change to score
					}

					// Add COT strength component
					if (baseCOT.isReal || quoteCOT.isReal) {
						score += (combinedStrength - 50) / 10; // Scale strength to score
					}

					// If no real data, use mock score
					if (!sentimentInfo.isReal && !realData.isReal && !baseCOT.isReal && !quoteCOT.isReal) {
						score = mockData.score;
					}

					return Math.max(1, Math.min(10, score));
				})()
			};
		}

		const allPairs = {
			USD: [
				createPair('EURUSD', { bias: 'Bullish', score: 8.5, change: 1.8, price: 1.0892, strength: 85, sentiment: 2, technical: 2, economic: 2, trend: 2 }),
				createPair('GBPUSD', { bias: 'Bullish', score: 7.2, change: 1.2, price: 1.2734, strength: 72, sentiment: 1, technical: 2, economic: 1, trend: 2 }),
				createPair('AUDUSD', { bias: 'Bullish', score: 6.8, change: 0.9, price: 0.6543, strength: 68, sentiment: 1, technical: 1, economic: 2, trend: 1 }),
				createPair('NZDUSD', { bias: 'Neutral', score: 5.5, change: 0.3, price: 0.6123, strength: 55, sentiment: 0, technical: 1, economic: 1, trend: 1 }),
				createPair('USDCAD', { bias: 'Neutral', score: 4.8, change: -0.1, price: 1.3456, strength: 48, sentiment: 0, technical: 0, economic: 1, trend: 0 }),
				createPair('USDCHF', { bias: 'Bearish', score: 3.2, change: -0.8, price: 0.8923, strength: 32, sentiment: -1, technical: -1, economic: 0, trend: -1 }),
				createPair('USDJPY', { bias: 'Bearish', score: 2.1, change: -1.5, price: 149.23, strength: 21, sentiment: -2, technical: -1, economic: -1, trend: -1 })
			],
			EUR: [
				createPair('EURUSD', { bias: 'Bullish', score: 8.2, change: 1.5, price: 1.0892, strength: 82, sentiment: 2, technical: 2, economic: 1, trend: 2 }),
				createPair('EURGBP', { bias: 'Bullish', score: 7.8, change: 1.1, price: 0.8567, strength: 78, sentiment: 1, technical: 2, economic: 2, trend: 2 }),
				createPair('EURAUD', { bias: 'Bullish', score: 6.9, change: 0.7, price: 1.6654, strength: 69, sentiment: 1, technical: 1, economic: 2, trend: 1 }),
				createPair('EURNZD', { bias: 'Neutral', score: 5.2, change: 0.2, price: 1.7823, strength: 52, sentiment: 0, technical: 1, economic: 1, trend: 1 }),
				createPair('EURCHF', { bias: 'Neutral', score: 4.5, change: -0.3, price: 0.9734, strength: 45, sentiment: 0, technical: 0, economic: 1, trend: 0 }),
				createPair('EURCAD', { bias: 'Bearish', score: 3.8, change: -0.9, price: 1.4567, strength: 38, sentiment: -1, technical: -1, economic: 0, trend: -1 }),
				createPair('EURJPY', { bias: 'Bearish', score: 2.3, change: -1.8, price: 162.45, strength: 23, sentiment: -2, technical: -1, economic: -1, trend: -1 })
			],
			GBP: [
				createPair('GBPUSD', { bias: 'Bullish', score: 8.0, change: 1.3, price: 1.2734, strength: 80, sentiment: 2, technical: 1, economic: 2, trend: 2 }),
				createPair('EURGBP', { bias: 'Bearish', score: 2.2, change: -1.1, price: 0.8567, strength: 22, sentiment: -2, technical: -2, economic: -1, trend: -2 }),
				createPair('GBPAUD', { bias: 'Bullish', score: 7.1, change: 0.8, price: 1.9234, strength: 71, sentiment: 1, technical: 2, economic: 1, trend: 1 }),
				createPair('GBPNZD', { bias: 'Neutral', score: 5.8, change: 0.4, price: 2.0789, strength: 58, sentiment: 0, technical: 1, economic: 1, trend: 1 }),
				createPair('GBPCHF', { bias: 'Neutral', score: 4.2, change: -0.2, price: 1.1345, strength: 42, sentiment: 0, technical: 0, economic: 1, trend: 0 }),
				createPair('GBPCAD', { bias: 'Bearish', score: 3.5, change: -0.7, price: 1.7123, strength: 35, sentiment: -1, technical: -1, economic: 0, trend: -1 }),
				createPair('GBPJPY', { bias: 'Bearish', score: 1.8, change: -2.1, price: 190.12, strength: 18, sentiment: -2, technical: -2, economic: -1, trend: -2 })
			],
			JPY: [
				{ symbol: 'USDJPY', bias: 'Bullish', score: 7.9, change: 1.5, price: 149.23, strength: 79, sentiment: 2, technical: 1, economic: 2, trend: 2 },
				{ symbol: 'EURJPY', bias: 'Bullish', score: 7.7, change: 1.8, price: 162.45, strength: 77, sentiment: 1, technical: 2, economic: 2, trend: 2 },
				{ symbol: 'GBPJPY', bias: 'Bullish', score: 8.2, change: 2.1, price: 190.12, strength: 82, sentiment: 2, technical: 2, economic: 1, trend: 2 },
				{ symbol: 'AUDJPY', bias: 'Neutral', score: 5.3, change: 0.3, price: 97.65, strength: 53, sentiment: 0, technical: 1, economic: 1, trend: 1 },
				{ symbol: 'NZDJPY', bias: 'Neutral', score: 4.8, change: 0.0, price: 91.34, strength: 48, sentiment: 0, technical: 0, economic: 1, trend: 0 },
				{ symbol: 'CADJPY', bias: 'Bearish', score: 3.1, change: -0.8, price: 111.23, strength: 31, sentiment: -1, technical: -1, economic: 0, trend: -1 },
				{ symbol: 'CHFJPY', bias: 'Bearish', score: 2.5, change: -1.2, price: 167.89, strength: 25, sentiment: -1, technical: -2, economic: -1, trend: -1 }
			],
			AUD: [
				{ symbol: 'AUDUSD', bias: 'Bearish', score: 3.2, change: -0.9, price: 0.6543, strength: 32, sentiment: -1, technical: -1, economic: 0, trend: -1 },
				{ symbol: 'EURAUD', bias: 'Bearish', score: 3.1, change: -0.7, price: 1.6654, strength: 31, sentiment: -1, technical: -2, economic: 0, trend: -1 },
				{ symbol: 'GBPAUD', bias: 'Bearish', score: 2.9, change: -0.8, price: 1.9234, strength: 29, sentiment: -2, technical: -1, economic: -1, trend: -1 },
				{ symbol: 'AUDNZD', bias: 'Neutral', score: 5.1, change: 0.2, price: 1.0687, strength: 51, sentiment: 0, technical: 1, economic: 0, trend: 1 },
				{ symbol: 'AUDCAD', bias: 'Neutral', score: 4.7, change: -0.2, price: 0.8801, strength: 47, sentiment: 0, technical: 0, economic: 1, trend: 0 },
				{ symbol: 'AUDCHF', bias: 'Bearish', score: 3.8, change: -0.6, price: 0.5834, strength: 38, sentiment: -1, technical: -1, economic: 0, trend: -1 },
				{ symbol: 'AUDJPY', bias: 'Bearish', score: 4.7, change: -0.3, price: 97.65, strength: 47, sentiment: 0, technical: -1, economic: 0, trend: 0 }
			]
		};

		return allPairs[baseCurrency as keyof typeof allPairs] || allPairs.USD;
	}

	// Reactive currency pairs based on selected currency
	$: currencyPairs = generateCurrencyPairs(selectedCurrency);

	// Sort pairs by score (bullish at top, bearish at bottom)
	$: sortedPairs = [...currencyPairs].sort((a, b) => b.score - a.score);

	// Get color based on score (improved visual hierarchy)
	function getBiasColor(score: number): string {
		if (score >= 8) return 'bg-emerald-500';
		if (score >= 6) return 'bg-green-400';
		if (score >= 4) return 'bg-yellow-400';
		if (score >= 2) return 'bg-orange-400';
		return 'bg-red-500';
	}

	function getBiasTextColor(score: number): string {
		if (score >= 8) return 'text-emerald-700';
		if (score >= 6) return 'text-green-600';
		if (score >= 4) return 'text-yellow-700';
		if (score >= 2) return 'text-orange-600';
		return 'text-red-600';
	}

	// Get strength bar color based on strength percentage
	function getStrengthColor(strength: number): string {
		if (strength >= 80) return 'bg-emerald-500';
		if (strength >= 60) return 'bg-green-400';
		if (strength >= 40) return 'bg-yellow-400';
		if (strength >= 20) return 'bg-orange-400';
		return 'bg-red-500';
	}

	function getChangeColor(change: number): string {
		if (change > 0) return 'text-green-600';
		if (change < 0) return 'text-red-600';
		return 'text-gray-600';
	}

	function getIndicatorColor(value: number): string {
		if (value >= 2) return 'bg-green-500';
		if (value >= 1) return 'bg-green-400';
		if (value === 0) return 'bg-gray-400';
		if (value >= -1) return 'bg-red-400';
		return 'bg-red-500';
	}

	function formatPrice(price: number, symbol: string): string {
		if (symbol.includes('JPY')) {
			return price.toFixed(2);
		}
		return price.toFixed(4);
	}

	function getTrendIcon(change: number) {
		if (change > 0.5) return TrendingUp;
		if (change < -0.5) return TrendingDown;
		return Activity;
	}
</script>

{#if showHeader}
	<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-200">
		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-xl font-bold text-navy">{title} - {selectedCurrency} Focus</h2>
				<p class="text-sm text-gray-600 mt-1">
					Real-time currency pair analysis with strength indicators
					{#if lastForexUpdate}
						• Last updated: {lastForexUpdate}
					{/if}
				</p>
			</div>

			<!-- Refresh Button and Status -->
			<div class="flex items-center gap-4">
				<button
					on:click={fetchRealForexData}
					disabled={isLoadingForex}
					class="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
				>
					{#if isLoadingForex}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Updating...
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						Refresh Forex
					{/if}
				</button>

				<!-- Debug Button -->
				<button
					on:click={forceRefresh}
					class="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
				>
					🔍 Debug ({Object.keys(realForexData).length} pairs)
				</button>

				<!-- Enhanced Data Status Indicator -->
				<div class="flex items-center gap-4 text-sm">
					{#if Object.keys(realForexData).length > 0}
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span class="text-green-600 font-medium">Live Data</span>
							<span class="text-gray-500">({dataSource})</span>
						</div>
						{#if showBidAsk}
							<div class="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-md">
								<svg class="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								<span class="text-blue-600 text-xs font-medium">Bid/Ask</span>
							</div>
						{/if}
					{:else}
						<div class="flex items-center gap-2">
							<div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
							<span class="text-yellow-600 font-medium">Mock Data</span>
						</div>
					{/if}
					{#if lastForexUpdate}
						<span class="text-gray-400 text-xs">Updated: {lastForexUpdate}</span>
					{/if}
				</div>
			</div>
			<div class="flex items-center gap-6 text-sm">
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-emerald-500 rounded-full"></div>
					<span class="font-medium text-gray-700">Strong Bullish</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-yellow-400 rounded-full"></div>
					<span class="font-medium text-gray-700">Neutral</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-4 h-4 bg-red-500 rounded-full"></div>
					<span class="font-medium text-gray-700">Strong Bearish</span>
				</div>
			</div>
		</div>
	</div>
{/if}

<div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
	<!-- Header Row - Hidden on mobile, shown on larger screens -->
	<div class="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 border-b border-gray-200">
		{#if showBidAsk}
			<div class="grid grid-cols-14 gap-3 text-sm font-bold text-gray-700 uppercase tracking-wide">
				<div class="col-span-3">Currency Pair & Strength</div>
				<div class="col-span-2">Market Bias</div>
				<div class="col-span-1">Bid</div>
				<div class="col-span-1">Ask</div>
				<div class="col-span-1">Spread</div>
				<div class="col-span-3 text-center">Analysis Indicators</div>
				<div class="col-span-3 text-right">24h Performance</div>
			</div>
		{:else}
			<div class="grid grid-cols-12 gap-3 text-sm font-bold text-gray-700 uppercase tracking-wide">
				<div class="col-span-3">Currency Pair & Strength</div>
				<div class="col-span-2">Market Bias</div>
				<div class="col-span-2">Current Price</div>
				<div class="col-span-3 text-center">Analysis Indicators</div>
				<div class="col-span-2 text-right">24h Performance</div>
			</div>
		{/if}
	</div>

	<!-- Currency Pairs -->
	<div class="divide-y divide-gray-100">
		{#each sortedPairs as pair}
			{@const TrendIcon = getTrendIcon(pair.change)}
			<div class="px-3 lg:px-4 py-3 lg:py-4 hover:bg-gray-50 transition-all duration-200 border-l-4 {getBiasColor(pair.score)} border-opacity-60">
				<!-- Desktop Layout -->
				<div class="hidden lg:grid {showBidAsk ? 'lg:grid-cols-14' : 'lg:grid-cols-12'} gap-3 items-center">
					<!-- Asset with Strength Bar -->
					<div class="col-span-3">
						<div class="flex items-center gap-3">
							<div>
								<div class="font-bold text-navy text-lg">{pair.symbol}</div>
								<div class="text-xs text-gray-500">Strength: {pair.strength}%</div>
							</div>
							<!-- Strength Bar -->
							<div class="flex-1 bg-gray-200 rounded-full h-2 min-w-[60px]">
								<div class="h-2 rounded-full {getStrengthColor(pair.strength)} transition-all duration-300"
									 style="width: {pair.strength}%"></div>
							</div>
						</div>
					</div>

					<!-- Bias Badge -->
					<div class="col-span-2">
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold {getBiasTextColor(pair.score)} bg-opacity-20 {getBiasColor(pair.score)}">
							{pair.bias}
						</span>
					</div>

					{#if showBidAsk}
						<!-- Bid Price -->
						<div class="col-span-1">
							<div class="font-mono text-sm font-bold text-blue-600">
								{getRealPairData(pair.symbol).bid ? formatPrice(getRealPairData(pair.symbol).bid, pair.symbol) : '-'}
							</div>
							<div class="text-xs text-gray-500">Bid</div>
						</div>

						<!-- Ask Price -->
						<div class="col-span-1">
							<div class="font-mono text-sm font-bold text-red-600">
								{getRealPairData(pair.symbol).ask ? formatPrice(getRealPairData(pair.symbol).ask, pair.symbol) : '-'}
							</div>
							<div class="text-xs text-gray-500">Ask</div>
						</div>

						<!-- Spread -->
						<div class="col-span-1">
							<div class="font-mono text-sm font-bold text-gray-700">
								{getRealPairData(pair.symbol).spread ? getRealPairData(pair.symbol).spread.toFixed(1) : '-'}
							</div>
							<div class="text-xs text-gray-500">Spread</div>
						</div>
					{:else}
						<!-- Price -->
						<div class="col-span-2">
							<div class="font-mono text-lg font-bold text-navy">
								{formatPrice(pair.price, pair.symbol)}
							</div>
							<div class="text-xs text-gray-500">Current Price</div>
						</div>
					{/if}

					<!-- Analysis Indicators -->
					<div class="col-span-3">
						<div class="flex items-center gap-2">
							<div class="text-center">
								<div class="w-8 h-8 rounded-full mx-auto {getIndicatorColor(pair.sentiment)} flex items-center justify-center">
									<span class="text-white text-xs font-bold">{pair.sentiment > 0 ? '+' : ''}{pair.sentiment}</span>
								</div>
								<div class="text-xs text-gray-500 mt-1">Sentiment</div>
							</div>
							<div class="text-center">
								<div class="w-8 h-8 rounded-full mx-auto {getIndicatorColor(pair.technical)} flex items-center justify-center">
									<span class="text-white text-xs font-bold">{pair.technical > 0 ? '+' : ''}{pair.technical}</span>
								</div>
								<div class="text-xs text-gray-500 mt-1">Technical</div>
							</div>
							<div class="text-center">
								<div class="w-8 h-8 rounded-full mx-auto {getIndicatorColor(pair.economic)} flex items-center justify-center">
									<span class="text-white text-xs font-bold">{pair.economic > 0 ? '+' : ''}{pair.economic}</span>
								</div>
								<div class="text-xs text-gray-500 mt-1">Economic</div>
							</div>
						</div>
					</div>

					<!-- Change with Trend -->
					<div class="col-span-2 text-right">
						<div class="flex items-center justify-end gap-2">
							<div class="text-right">
								<div class="text-xl font-bold {getChangeColor(pair.change)}">
									{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(1)}%
								</div>
								<div class="text-xs text-gray-500">24h Change</div>
							</div>
							<TrendIcon class="w-6 h-6 {getChangeColor(pair.change)}" />
						</div>
					</div>
				</div>

				<!-- Mobile Layout -->
				<div class="lg:hidden space-y-3">
					<!-- Top Row: Symbol, Bias, Change -->
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<div class="font-bold text-navy text-lg">{pair.symbol}</div>
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold {getBiasTextColor(pair.score)} bg-opacity-20 {getBiasColor(pair.score)}">
								{pair.bias}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="text-right">
								<div class="text-lg font-bold {getChangeColor(pair.change)}">
									{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(1)}%
								</div>
							</div>
							<TrendIcon class="w-5 h-5 {getChangeColor(pair.change)}" />
						</div>
					</div>

					<!-- Second Row: Price and Strength -->
					<div class="flex items-center justify-between">
						<div class="font-mono text-base font-bold text-navy">
							{formatPrice(pair.price, pair.symbol)}
						</div>
						<div class="flex items-center gap-2">
							<span class="text-xs text-gray-500">Strength:</span>
							<div class="w-16 bg-gray-200 rounded-full h-2">
								<div class="h-2 rounded-full {getStrengthColor(pair.strength)} transition-all duration-300"
									 style="width: {pair.strength}%"></div>
							</div>
							<span class="text-xs font-medium">{pair.strength}%</span>
						</div>
					</div>

					<!-- Third Row: Analysis Indicators -->
					<div class="flex items-center justify-center gap-4">
						<div class="text-center">
							<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.sentiment)} flex items-center justify-center">
								<span class="text-white text-xs font-bold">{pair.sentiment > 0 ? '+' : ''}{pair.sentiment}</span>
							</div>
							<div class="text-xs text-gray-500 mt-1">Sentiment</div>
						</div>
						<div class="text-center">
							<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.technical)} flex items-center justify-center">
								<span class="text-white text-xs font-bold">{pair.technical > 0 ? '+' : ''}{pair.technical}</span>
							</div>
							<div class="text-xs text-gray-500 mt-1">Technical</div>
						</div>
						<div class="text-center">
							<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.economic)} flex items-center justify-center">
								<span class="text-white text-xs font-bold">{pair.economic > 0 ? '+' : ''}{pair.economic}</span>
							</div>
							<div class="text-xs text-gray-500 mt-1">Economic</div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Simplified Legend -->
<div class="mt-4 lg:mt-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 lg:p-6">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
		<!-- Analysis Indicators -->
		<div>
			<h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm lg:text-base">
				<Activity class="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
				Analysis Indicators
			</h4>
			<div class="space-y-2 text-xs lg:text-sm text-gray-700">
				<div><span class="font-semibold">Sentiment:</span> Market mood and trader positioning</div>
				<div><span class="font-semibold">Technical:</span> Chart patterns and price action signals</div>
				<div><span class="font-semibold">Economic:</span> Fundamental data and economic strength</div>
			</div>
		</div>

		<!-- Scoring System -->
		<div>
			<h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-sm lg:text-base">
				<TrendingUp class="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
				Scoring System
			</h4>
			<div class="grid grid-cols-3 gap-2 lg:gap-3 text-xs">
				<div class="text-center">
					<div class="w-5 h-5 lg:w-6 lg:h-6 bg-emerald-500 rounded-full mx-auto mb-1 flex items-center justify-center">
						<span class="text-white font-bold text-xs">+2</span>
					</div>
					<span class="text-gray-600">Very Strong</span>
				</div>
				<div class="text-center">
					<div class="w-5 h-5 lg:w-6 lg:h-6 bg-gray-400 rounded-full mx-auto mb-1 flex items-center justify-center">
						<span class="text-white font-bold text-xs">0</span>
					</div>
					<span class="text-gray-600">Neutral</span>
				</div>
				<div class="text-center">
					<div class="w-5 h-5 lg:w-6 lg:h-6 bg-red-500 rounded-full mx-auto mb-1 flex items-center justify-center">
						<span class="text-white font-bold text-xs">-2</span>
					</div>
					<span class="text-gray-600">Very Weak</span>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-200 text-center">
		<p class="text-xs lg:text-sm text-gray-600">
			<span class="font-semibold">Strength Bar:</span> Overall currency pair momentum (0-100%) •
			<span class="font-semibold">Updated:</span> Real-time market data
		</p>
	</div>
</div>

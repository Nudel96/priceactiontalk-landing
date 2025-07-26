<script lang="ts">
	import { TrendingUp, TrendingDown, Activity } from '@lucide/svelte';

	// Props
	export let title: string = 'Currency Pair Performance';
	export let showHeader: boolean = true;

	// Mock currency pair data with realistic values
	const currencyPairs = [
		// Major pairs - more bullish (top section)
		{ symbol: 'EURUSD', bias: 'Very Bullish', score: 9, change: 2.3, price: 1.0892, sentiment: 2, technical: 2, economic: 3, trend: 2 },
		{ symbol: 'GBPUSD', bias: 'Very Bullish', score: 8, change: 1.8, price: 1.2734, sentiment: 1, technical: 2, economic: 2, trend: 3 },
		{ symbol: 'NZDUSD', bias: 'Bullish', score: 7, change: 1.4, price: 0.6123, sentiment: 1, technical: 2, economic: 2, trend: 2 },
		{ symbol: 'AUDUSD', bias: 'Bullish', score: 7, change: 1.2, price: 0.6543, sentiment: 1, technical: 1, economic: 2, trend: 3 },
		{ symbol: 'USDCAD', bias: 'Bullish', score: 6, change: 0.6, price: 1.3456, sentiment: 1, technical: 2, economic: 1, trend: 2 },

		// Neutral pairs (middle section)
		{ symbol: 'EURGBP', bias: 'Neutral', score: 4, change: 0.1, price: 0.8567, sentiment: 0, technical: 1, economic: 1, trend: 2 },
		{ symbol: 'NZDJPY', bias: 'Neutral', score: 4, change: 0.0, price: 91.34, sentiment: 0, technical: 1, economic: 1, trend: 1 },
		{ symbol: 'USDCHF', bias: 'Neutral', score: 4, change: -0.1, price: 0.8923, sentiment: 0, technical: 1, economic: 1, trend: 2 },
		{ symbol: 'AUDCAD', bias: 'Neutral', score: 3, change: -0.2, price: 0.8801, sentiment: -1, technical: 1, economic: 1, trend: 2 },
		{ symbol: 'AUDNZD', bias: 'Neutral', score: 3, change: -0.3, price: 1.0687, sentiment: -1, technical: 0, economic: 1, trend: 1 },

		// Bearish pairs (bottom section)
		{ symbol: 'USDJPY', bias: 'Bearish', score: 2, change: -0.9, price: 149.23, sentiment: -1, technical: -1, economic: 0, trend: 2 },
		{ symbol: 'EURJPY', bias: 'Bearish', score: 1, change: -1.2, price: 162.45, sentiment: -1, technical: -2, economic: 1, trend: 1 },
		{ symbol: 'GBPJPY', bias: 'Very Bearish', score: 0, change: -1.8, price: 190.12, sentiment: -2, technical: -2, economic: 0, trend: 0 },
		{ symbol: 'AUDJPY', bias: 'Very Bearish', score: 0, change: -2.1, price: 97.65, sentiment: -2, technical: -2, economic: 1, trend: -1 }
	];

	// Sort pairs by score (bullish at top, bearish at bottom)
	$: sortedPairs = [...currencyPairs].sort((a, b) => b.score - a.score);

	// Get color based on bias/score
	function getBiasColor(bias: string, score: number): string {
		if (score >= 8) return 'bg-green-500';
		if (score >= 6) return 'bg-green-400';
		if (score >= 4) return 'bg-yellow-400';
		if (score >= 2) return 'bg-orange-400';
		return 'bg-red-500';
	}

	function getBiasTextColor(bias: string, score: number): string {
		if (score >= 8) return 'text-green-700';
		if (score >= 6) return 'text-green-600';
		if (score >= 4) return 'text-yellow-700';
		if (score >= 2) return 'text-orange-600';
		return 'text-red-600';
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
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-semibold text-navy">{title}</h2>
		<div class="flex items-center gap-4 text-sm text-gray-500">
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-green-500 rounded"></div>
				<span>Bullish</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-yellow-400 rounded"></div>
				<span>Neutral</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="w-3 h-3 bg-red-500 rounded"></div>
				<span>Bearish</span>
			</div>
		</div>
	</div>
{/if}

<div class="bg-white rounded-xl shadow-md overflow-hidden">
	<!-- Header Row -->
	<div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
		<div class="grid grid-cols-12 gap-2 text-xs font-medium text-gray-600 uppercase tracking-wide">
			<div class="col-span-2">Asset</div>
			<div class="col-span-2">Bias</div>
			<div class="col-span-2">Price</div>
			<div class="col-span-1 text-center">Sentiment</div>
			<div class="col-span-1 text-center">Technical</div>
			<div class="col-span-1 text-center">Economic</div>
			<div class="col-span-1 text-center">Trend</div>
			<div class="col-span-2 text-right">Change</div>
		</div>
	</div>

	<!-- Currency Pairs -->
	<div class="divide-y divide-gray-100">
		{#each sortedPairs as pair, index}
			{@const TrendIcon = getTrendIcon(pair.change)}
			<div class="px-4 py-3 hover:bg-gray-50 transition-colors">
				<div class="grid grid-cols-12 gap-2 items-center">
					<!-- Asset -->
					<div class="col-span-2">
						<div class="font-semibold text-navy">{pair.symbol}</div>
						<div class="text-xs text-gray-500">Score: {pair.score}/10</div>
					</div>

					<!-- Bias -->
					<div class="col-span-2">
						<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getBiasTextColor(pair.bias, pair.score)} bg-opacity-20 {getBiasColor(pair.bias, pair.score)}">
							{pair.bias}
						</span>
					</div>

					<!-- Price -->
					<div class="col-span-2">
						<div class="font-mono text-sm font-semibold text-navy">
							{formatPrice(pair.price, pair.symbol)}
						</div>
					</div>

					<!-- Sentiment -->
					<div class="col-span-1 text-center">
						<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.sentiment)}"></div>
					</div>

					<!-- Technical -->
					<div class="col-span-1 text-center">
						<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.technical)}"></div>
					</div>

					<!-- Economic -->
					<div class="col-span-1 text-center">
						<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.economic)}"></div>
					</div>

					<!-- Trend -->
					<div class="col-span-1 text-center">
						<div class="w-6 h-6 rounded-full mx-auto {getIndicatorColor(pair.trend)}"></div>
					</div>

					<!-- Change -->
					<div class="col-span-2 text-right">
						<div class="flex items-center justify-end gap-1">
							<span class="font-semibold {getChangeColor(pair.change)}">
								{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(1)}%
							</span>
							<TrendIcon class="w-4 h-4 {getChangeColor(pair.change)}" />
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Legend -->
<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
	<h4 class="font-medium text-blue-900 mb-2">Indicator Legend</h4>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-blue-800">
		<div>
			<span class="font-medium">Sentiment:</span> Market sentiment analysis
		</div>
		<div>
			<span class="font-medium">Technical:</span> Chart pattern analysis
		</div>
		<div>
			<span class="font-medium">Economic:</span> Fundamental data strength
		</div>
		<div>
			<span class="font-medium">Trend:</span> Overall trend direction
		</div>
	</div>
	<div class="mt-2 flex items-center gap-4 text-xs text-blue-700">
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 bg-green-500 rounded-full"></div>
			<span>Strong Positive</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 bg-green-400 rounded-full"></div>
			<span>Positive</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 bg-gray-400 rounded-full"></div>
			<span>Neutral</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 bg-red-400 rounded-full"></div>
			<span>Negative</span>
		</div>
		<div class="flex items-center gap-1">
			<div class="w-3 h-3 bg-red-500 rounded-full"></div>
			<span>Strong Negative</span>
		</div>
	</div>
</div>

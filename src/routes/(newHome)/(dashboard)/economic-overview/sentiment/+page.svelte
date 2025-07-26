<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Gauge, TrendingUp, TrendingDown, Users,
		Activity, ArrowLeft, RefreshCw, AlertTriangle,
		Info, Building2, Target
	} from '@lucide/svelte';

	// Sentiment data interfaces
	interface SentimentData {
		asset: string;
		name: string;
		long_percentage: number;
		short_percentage: number;
		timestamp: string;
		change_24h: number;
		signal: 'bullish' | 'bearish' | 'neutral';
		strength: 'strong' | 'moderate' | 'weak';
	}

	interface BrokerData {
		broker: string;
		assets_covered: number;
		last_updated: string;
		reliability: number;
	}

	// Major forex pairs and commodities
	const sentimentAssets = [
		{ symbol: 'EURUSD', name: 'Euro / US Dollar' },
		{ symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
		{ symbol: 'USDJPY', name: 'US Dollar / Japanese Yen' },
		{ symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' },
		{ symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar' },
		{ symbol: 'USDCHF', name: 'US Dollar / Swiss Franc' },
		{ symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar' },
		{ symbol: 'EURGBP', name: 'Euro / British Pound' },
		{ symbol: 'GOLD', name: 'Gold' },
		{ symbol: 'SILVER', name: 'Silver' },
		{ symbol: 'OIL', name: 'Crude Oil' },
		{ symbol: 'BTC', name: 'Bitcoin' }
	];

	let selectedAsset = 'EURUSD';
	let sentimentData: SentimentData[] = [];
	let historicalSentiment: any[] = [];
	let brokerSources: BrokerData[] = [];
	let isLoading = false;

	// Overall market sentiment
	let marketSentiment = {
		overall_bullish: 58,
		risk_on: 62,
		fear_greed: 45,
		volatility_index: 23.5
	};

	onMount(() => {
		generateMockSentimentData();
		generateHistoricalData();
		generateBrokerData();
	});

	function generateMockSentimentData() {
		sentimentData = sentimentAssets.map(asset => {
			const long_percentage = Math.floor(Math.random() * 40) + 30; // 30-70%
			const short_percentage = 100 - long_percentage;
			const change_24h = (Math.random() - 0.5) * 20; // -10% to +10%
			
			// Determine signal based on positioning (contrarian approach)
			let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
			let strength: 'strong' | 'moderate' | 'weak' = 'weak';
			
			if (long_percentage > 70) {
				signal = 'bearish'; // Contrarian
				strength = 'strong';
			} else if (long_percentage < 30) {
				signal = 'bullish'; // Contrarian
				strength = 'strong';
			} else if (long_percentage > 60) {
				signal = 'bearish';
				strength = 'moderate';
			} else if (long_percentage < 40) {
				signal = 'bullish';
				strength = 'moderate';
			}

			return {
				asset: asset.symbol,
				name: asset.name,
				long_percentage,
				short_percentage,
				timestamp: new Date().toISOString(),
				change_24h,
				signal,
				strength
			};
		});
	}

	function generateHistoricalData() {
		historicalSentiment = [];
		const days = 30;
		
		for (let i = days; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			
			historicalSentiment.push({
				date: date.toISOString().split('T')[0],
				long_percentage: Math.floor(Math.random() * 40) + 30,
				volume: Math.floor(Math.random() * 100000) + 50000
			});
		}
	}

	function generateBrokerData() {
		brokerSources = [
			{
				broker: 'OANDA',
				assets_covered: 68,
				last_updated: '2 minutes ago',
				reliability: 95
			},
			{
				broker: 'IG Group',
				assets_covered: 45,
				last_updated: '5 minutes ago',
				reliability: 92
			},
			{
				broker: 'FXCM',
				assets_covered: 52,
				last_updated: '3 minutes ago',
				reliability: 88
			},
			{
				broker: 'Plus500',
				assets_covered: 38,
				last_updated: '7 minutes ago',
				reliability: 85
			}
		];
	}

	function getSentimentColor(percentage: number): string {
		if (percentage >= 70) return 'text-red-600';
		if (percentage >= 60) return 'text-orange-600';
		if (percentage >= 40) return 'text-gray-600';
		if (percentage >= 30) return 'text-green-600';
		return 'text-green-700';
	}

	function getSignalColor(signal: string): string {
		switch (signal) {
			case 'bullish': return 'text-green-600 bg-green-50';
			case 'bearish': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getStrengthColor(strength: string): string {
		switch (strength) {
			case 'strong': return 'text-purple-600 bg-purple-50';
			case 'moderate': return 'text-blue-600 bg-blue-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function selectAsset(asset: string) {
		selectedAsset = asset;
		// In a real app, this would fetch historical data for the selected asset
		generateHistoricalData();
	}

	function refreshData() {
		isLoading = true;
		setTimeout(() => {
			generateMockSentimentData();
			generateHistoricalData();
			generateBrokerData();
			isLoading = false;
		}, 1000);
	}

	// Get selected asset data
	$: selectedAssetData = sentimentData.find(data => data.asset === selectedAsset);
</script>

<svelte:head>
	<title>Retail Sentiment Tracker - Economic Overview</title>
	<meta name="description" content="Track retail trader sentiment and positioning across major forex pairs and commodities." />
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
		<div>
			<div class="flex items-center gap-4 mb-2">
				<a href="/economic-overview" class="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
					<ArrowLeft size={20} />
					<span>Back to Overview</span>
				</a>
			</div>
			<h1 class="text-3xl font-bold text-navy">Retail Sentiment Tracker</h1>
			<p class="text-gray-600 mt-2">Monitor retail trader positioning and sentiment across major markets</p>
		</div>
		
		<div class="flex items-center gap-3">
			<button
				on:click={refreshData}
				disabled={isLoading}
				class="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
			>
				<RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
				Refresh Data
			</button>
		</div>
	</div>

	<!-- Overall Market Sentiment -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
		<div class="bg-white rounded-xl shadow-md p-6 text-center">
			<div class="flex items-center justify-center gap-2 mb-3">
				<Gauge class="w-5 h-5 text-blue-600" />
				<h3 class="font-semibold text-navy">Overall Bullish</h3>
			</div>
			<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.overall_bullish}%</div>
			<div class="text-sm text-gray-600">Market sentiment</div>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6 text-center">
			<div class="flex items-center justify-center gap-2 mb-3">
				<TrendingUp class="w-5 h-5 text-green-600" />
				<h3 class="font-semibold text-navy">Risk On</h3>
			</div>
			<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.risk_on}%</div>
			<div class="text-sm text-gray-600">Risk appetite</div>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6 text-center">
			<div class="flex items-center justify-center gap-2 mb-3">
				<AlertTriangle class="w-5 h-5 text-orange-600" />
				<h3 class="font-semibold text-navy">Fear & Greed</h3>
			</div>
			<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.fear_greed}</div>
			<div class="text-sm text-gray-600">Index level</div>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6 text-center">
			<div class="flex items-center justify-center gap-2 mb-3">
				<Activity class="w-5 h-5 text-purple-600" />
				<h3 class="font-semibold text-navy">VIX</h3>
			</div>
			<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.volatility_index}</div>
			<div class="text-sm text-gray-600">Volatility index</div>
		</div>
	</div>

	<!-- Asset Sentiment Grid -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Users class="w-5 h-5 text-blue-600" />
			Asset Sentiment Overview
		</h2>
		
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200">
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Asset</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Long %</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Short %</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">24h Change</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Signal</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Strength</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each sentimentData as sentiment}
						<tr class="border-b border-gray-100 hover:bg-gray-50">
							<td class="py-3 px-4">
								<div class="font-semibold text-navy">{sentiment.asset}</div>
								<div class="text-sm text-gray-600">{sentiment.name}</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="font-semibold {getSentimentColor(sentiment.long_percentage)}">
									{sentiment.long_percentage}%
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="font-semibold {getSentimentColor(sentiment.short_percentage)}">
									{sentiment.short_percentage}%
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="flex items-center justify-center gap-1">
									{#if sentiment.change_24h >= 0}
										<TrendingUp class="w-4 h-4 text-green-600" />
									{:else}
										<TrendingDown class="w-4 h-4 text-red-600" />
									{/if}
									<span class="font-medium {sentiment.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}">
										{sentiment.change_24h >= 0 ? '+' : ''}{sentiment.change_24h.toFixed(1)}%
									</span>
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<span class="px-2 py-1 rounded-full text-xs font-medium {getSignalColor(sentiment.signal)}">
									{sentiment.signal.toUpperCase()}
								</span>
							</td>
							<td class="text-center py-3 px-4">
								<span class="px-2 py-1 rounded-full text-xs font-medium {getStrengthColor(sentiment.strength)}">
									{sentiment.strength.toUpperCase()}
								</span>
							</td>
							<td class="text-center py-3 px-4">
								<button
									on:click={() => selectAsset(sentiment.asset)}
									class="text-teal-600 hover:text-teal-700 font-medium text-sm"
								>
									View Details
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Selected Asset Detailed View -->
	{#if selectedAssetData}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Sentiment Gauge -->
			<div class="bg-white rounded-xl shadow-md p-6">
				<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
					<Gauge class="w-5 h-5 text-blue-600" />
					{selectedAsset} Sentiment Gauge
				</h3>

				<div class="text-center">
					<!-- Circular Progress Gauge -->
					<div class="relative w-48 h-48 mx-auto mb-4">
						<svg class="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
							<!-- Background circle -->
							<circle cx="50" cy="50" r="40" stroke="#e5e7eb" stroke-width="8" fill="none" />
							<!-- Long percentage arc -->
							<circle
								cx="50" cy="50" r="40"
								stroke="#10b981"
								stroke-width="8"
								fill="none"
								stroke-dasharray="{selectedAssetData.long_percentage * 2.51} 251"
								stroke-linecap="round"
							/>
						</svg>
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="text-center">
								<div class="text-2xl font-bold text-navy">{selectedAssetData.long_percentage}%</div>
								<div class="text-sm text-gray-600">Long Positions</div>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4 text-sm">
						<div class="p-3 bg-green-50 rounded-lg">
							<div class="font-semibold text-green-700">Long</div>
							<div class="text-2xl font-bold text-green-700">{selectedAssetData.long_percentage}%</div>
						</div>
						<div class="p-3 bg-red-50 rounded-lg">
							<div class="font-semibold text-red-700">Short</div>
							<div class="text-2xl font-bold text-red-700">{selectedAssetData.short_percentage}%</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Historical Sentiment Chart -->
			<div class="bg-white rounded-xl shadow-md p-6">
				<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
					<Activity class="w-5 h-5 text-teal-600" />
					30-Day Sentiment Trend
				</h3>

				<!-- Chart Placeholder -->
				<div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
					<div class="text-center text-gray-500">
						<Activity size={48} class="mx-auto mb-4 opacity-50" />
						<p class="text-lg font-medium">Sentiment History Chart</p>
						<p class="text-sm">Long/Short percentage over time</p>
						<p class="text-xs mt-2">Asset: {selectedAsset}</p>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Sentiment Signals -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Target class="w-5 h-5 text-orange-600" />
			Sentiment-Based Signals
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each sentimentData.filter(s => s.signal !== 'neutral').slice(0, 6) as signal}
				<div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
					<div class="flex items-center justify-between mb-2">
						<div class="font-semibold text-navy">{signal.asset}</div>
						<span class="px-2 py-1 rounded-full text-xs font-medium {getSignalColor(signal.signal)}">
							{signal.signal.toUpperCase()}
						</span>
					</div>
					<div class="text-sm text-gray-600 mb-2">
						{signal.long_percentage}% Long / {signal.short_percentage}% Short
					</div>
					<div class="text-xs text-gray-500">
						{signal.signal === 'bullish'
							? 'Retail heavily short - potential reversal up'
							: 'Retail heavily long - potential reversal down'}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Broker Data Sources -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Building2 class="w-5 h-5 text-indigo-600" />
			Data Sources
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each brokerSources as broker}
				<div class="p-4 border border-gray-200 rounded-lg">
					<div class="flex items-center justify-between mb-2">
						<div class="font-semibold text-navy">{broker.broker}</div>
						<div class="flex items-center gap-1">
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
							<span class="text-xs text-gray-600">Live</span>
						</div>
					</div>
					<div class="space-y-1 text-sm text-gray-600">
						<div>Assets: {broker.assets_covered}</div>
						<div>Updated: {broker.last_updated}</div>
						<div class="flex items-center gap-2">
							<span>Reliability:</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div
									class="bg-green-500 h-2 rounded-full"
									style="width: {broker.reliability}%"
								></div>
							</div>
							<span class="text-xs">{broker.reliability}%</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Information Panel -->
	<div class="bg-gray-50 rounded-xl p-6">
		<div class="flex items-start gap-3">
			<Info class="w-5 h-5 text-gray-600 mt-1" />
			<div>
				<h3 class="font-semibold text-gray-700 mb-2">About Retail Sentiment</h3>
				<div class="text-sm text-gray-600 space-y-1">
					<p>• Retail sentiment data shows the percentage of retail traders holding long vs short positions.</p>
					<p>• This data is often used as a contrarian indicator - when retail is heavily positioned one way, the market may move the opposite direction.</p>
					<p>• Extreme readings (&gt;70% or &lt;30% long) often signal potential reversals.</p>
					<p>• Data is aggregated from major retail brokers and updated in real-time.</p>
					<p>• Combine with technical and fundamental analysis for best results.</p>
				</div>
			</div>
		</div>
	</div>
</div>

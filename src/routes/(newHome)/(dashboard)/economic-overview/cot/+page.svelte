<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		BarChart3, TrendingUp, TrendingDown, Users, 
		Building, Briefcase, ArrowLeft, RefreshCw,
		AlertTriangle, Info, Calendar
	} from '@lucide/svelte';

	// COT Data interfaces
	interface COTData {
		date: string;
		commercial_long: number;
		commercial_short: number;
		non_commercial_long: number;
		non_commercial_short: number;
		retail_long: number;
		retail_short: number;
	}

	interface COTSummary {
		asset: string;
		name: string;
		commercial_net: number;
		non_commercial_net: number;
		retail_net: number;
		commercial_change: number;
		non_commercial_change: number;
		retail_change: number;
		signal: 'bullish' | 'bearish' | 'neutral';
	}

	// Available assets for COT analysis
	const cotAssets = [
		{ symbol: 'EUR', name: 'Euro' },
		{ symbol: 'GBP', name: 'British Pound' },
		{ symbol: 'JPY', name: 'Japanese Yen' },
		{ symbol: 'CHF', name: 'Swiss Franc' },
		{ symbol: 'AUD', name: 'Australian Dollar' },
		{ symbol: 'CAD', name: 'Canadian Dollar' },
		{ symbol: 'NZD', name: 'New Zealand Dollar' },
		{ symbol: 'GOLD', name: 'Gold' },
		{ symbol: 'SILVER', name: 'Silver' },
		{ symbol: 'OIL', name: 'Crude Oil' }
	];

	let selectedAsset = 'EUR';
	let selectedTimeframe = '3M';
	const timeframes = ['1M', '3M', '6M', '1Y'];

	// Mock COT data
	let cotData: COTData[] = [];
	let cotSummary: COTSummary[] = [];
	let isLoading = false;

	onMount(() => {
		generateMockCOTData();
		generateCOTSummary();
	});

	function generateMockCOTData() {
		cotData = [];
		const weeks = 52; // 1 year of data
		const baseDate = new Date();
		
		for (let i = weeks; i >= 0; i--) {
			const date = new Date(baseDate);
			date.setDate(date.getDate() - (i * 7));
			
			// Generate realistic COT data with trends
			const commercial_long = 50000 + Math.random() * 20000;
			const commercial_short = 45000 + Math.random() * 15000;
			const non_commercial_long = 30000 + Math.random() * 25000;
			const non_commercial_short = 35000 + Math.random() * 20000;
			const retail_long = 15000 + Math.random() * 10000;
			const retail_short = 18000 + Math.random() * 8000;
			
			cotData.push({
				date: date.toISOString().split('T')[0],
				commercial_long,
				commercial_short,
				non_commercial_long,
				non_commercial_short,
				retail_long,
				retail_short
			});
		}
	}

	function generateCOTSummary() {
		cotSummary = cotAssets.map(asset => {
			const commercial_net = Math.floor((Math.random() - 0.5) * 50000);
			const non_commercial_net = Math.floor((Math.random() - 0.5) * 40000);
			const retail_net = Math.floor((Math.random() - 0.5) * 20000);
			
			const commercial_change = Math.floor((Math.random() - 0.5) * 10000);
			const non_commercial_change = Math.floor((Math.random() - 0.5) * 8000);
			const retail_change = Math.floor((Math.random() - 0.5) * 5000);
			
			// Determine signal based on positioning
			let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
			if (commercial_net > 20000 && non_commercial_net < -15000) signal = 'bullish';
			else if (commercial_net < -20000 && non_commercial_net > 15000) signal = 'bearish';
			
			return {
				asset: asset.symbol,
				name: asset.name,
				commercial_net,
				non_commercial_net,
				retail_net,
				commercial_change,
				non_commercial_change,
				retail_change,
				signal
			};
		});
	}

	function formatNumber(num: number): string {
		if (Math.abs(num) >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}

	function getSignalColor(signal: string): string {
		switch (signal) {
			case 'bullish': return 'text-green-600 bg-green-50';
			case 'bearish': return 'text-red-600 bg-red-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getChangeColor(change: number): string {
		if (change > 0) return 'text-green-600';
		if (change < 0) return 'text-red-600';
		return 'text-gray-600';
	}

	function selectAsset(asset: string) {
		selectedAsset = asset;
		// In a real app, this would fetch new data
		generateMockCOTData();
	}

	function refreshData() {
		isLoading = true;
		setTimeout(() => {
			generateMockCOTData();
			generateCOTSummary();
			isLoading = false;
		}, 1000);
	}

	// Get current week's data for selected asset
	$: currentWeekData = cotData[cotData.length - 1];
	$: previousWeekData = cotData[cotData.length - 2];
</script>

<svelte:head>
	<title>COT Report Analysis - Economic Overview</title>
	<meta name="description" content="Commitment of Traders (COT) report analysis showing positioning data for major currencies and commodities." />
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
			<h1 class="text-3xl font-bold text-navy">COT Report Analysis</h1>
			<p class="text-gray-600 mt-2">Commitment of Traders positioning data and analysis</p>
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

	<!-- Asset Selector -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4">Select Asset</h2>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
			{#each cotAssets as asset}
				<button
					on:click={() => selectAsset(asset.symbol)}
					class="p-3 rounded-lg border-2 transition-all text-center
						{selectedAsset === asset.symbol 
							? 'border-teal-600 bg-teal-50 text-teal-700' 
							: 'border-gray-200 hover:border-gray-300 text-gray-700'}"
				>
					<div class="font-semibold">{asset.symbol}</div>
					<div class="text-xs text-gray-600">{asset.name}</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Current Positioning Summary -->
	{#if currentWeekData}
		<div class="bg-white rounded-xl shadow-md p-6">
			<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
				<Users class="w-5 h-5 text-blue-600" />
				Current Positioning - {selectedAsset}
			</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Commercial Traders -->
				<div class="text-center p-4 bg-blue-50 rounded-lg">
					<div class="flex items-center justify-center gap-2 mb-3">
						<Building class="w-5 h-5 text-blue-600" />
						<h3 class="font-semibold text-blue-700">Commercial</h3>
					</div>
					<div class="space-y-2">
						<div>
							<div class="text-sm text-gray-600">Net Position</div>
							<div class="text-xl font-bold text-blue-700">
								{formatNumber(currentWeekData.commercial_long - currentWeekData.commercial_short)}
							</div>
						</div>
						<div class="grid grid-cols-2 gap-2 text-sm">
							<div>
								<div class="text-gray-600">Long</div>
								<div class="font-semibold">{formatNumber(currentWeekData.commercial_long)}</div>
							</div>
							<div>
								<div class="text-gray-600">Short</div>
								<div class="font-semibold">{formatNumber(currentWeekData.commercial_short)}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Non-Commercial Traders -->
				<div class="text-center p-4 bg-green-50 rounded-lg">
					<div class="flex items-center justify-center gap-2 mb-3">
						<Briefcase class="w-5 h-5 text-green-600" />
						<h3 class="font-semibold text-green-700">Non-Commercial</h3>
					</div>
					<div class="space-y-2">
						<div>
							<div class="text-sm text-gray-600">Net Position</div>
							<div class="text-xl font-bold text-green-700">
								{formatNumber(currentWeekData.non_commercial_long - currentWeekData.non_commercial_short)}
							</div>
						</div>
						<div class="grid grid-cols-2 gap-2 text-sm">
							<div>
								<div class="text-gray-600">Long</div>
								<div class="font-semibold">{formatNumber(currentWeekData.non_commercial_long)}</div>
							</div>
							<div>
								<div class="text-gray-600">Short</div>
								<div class="font-semibold">{formatNumber(currentWeekData.non_commercial_short)}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Retail Traders -->
				<div class="text-center p-4 bg-purple-50 rounded-lg">
					<div class="flex items-center justify-center gap-2 mb-3">
						<Users class="w-5 h-5 text-purple-600" />
						<h3 class="font-semibold text-purple-700">Retail</h3>
					</div>
					<div class="space-y-2">
						<div>
							<div class="text-sm text-gray-600">Net Position</div>
							<div class="text-xl font-bold text-purple-700">
								{formatNumber(currentWeekData.retail_long - currentWeekData.retail_short)}
							</div>
						</div>
						<div class="grid grid-cols-2 gap-2 text-sm">
							<div>
								<div class="text-gray-600">Long</div>
								<div class="font-semibold">{formatNumber(currentWeekData.retail_long)}</div>
							</div>
							<div>
								<div class="text-gray-600">Short</div>
								<div class="font-semibold">{formatNumber(currentWeekData.retail_short)}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- COT Chart -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-navy flex items-center gap-2">
				<BarChart3 class="w-5 h-5 text-teal-600" />
				COT Positioning Chart - {selectedAsset}
			</h2>
			
			<!-- Timeframe Selector -->
			<div class="flex items-center gap-2">
				{#each timeframes as timeframe}
					<button
						on:click={() => selectedTimeframe = timeframe}
						class="px-3 py-1 rounded-lg text-sm font-medium transition-colors
							{selectedTimeframe === timeframe 
								? 'bg-teal-600 text-white' 
								: 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
					>
						{timeframe}
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Chart Placeholder -->
		<div class="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
			<div class="text-center text-gray-500">
				<BarChart3 size={48} class="mx-auto mb-4 opacity-50" />
				<p class="text-lg font-medium">COT Positioning Chart</p>
				<p class="text-sm">Multi-series chart showing Commercial, Non-Commercial, and Retail positions</p>
				<p class="text-xs mt-2">Asset: {selectedAsset} | Timeframe: {selectedTimeframe}</p>
			</div>
		</div>
	</div>

	<!-- All Assets Summary -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Info class="w-5 h-5 text-indigo-600" />
			All Assets COT Summary
		</h2>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200">
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Asset</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Commercial Net</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Non-Commercial Net</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Retail Net</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Weekly Change</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Signal</th>
					</tr>
				</thead>
				<tbody>
					{#each cotSummary as summary}
						<tr class="border-b border-gray-100 hover:bg-gray-50">
							<td class="py-3 px-4">
								<button
									on:click={() => selectAsset(summary.asset)}
									class="font-semibold text-navy hover:text-teal-600 transition-colors"
								>
									{summary.asset}
								</button>
								<div class="text-sm text-gray-600">{summary.name}</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="font-semibold {getChangeColor(summary.commercial_net)}">
									{formatNumber(summary.commercial_net)}
								</div>
								<div class="text-xs {getChangeColor(summary.commercial_change)}">
									{summary.commercial_change >= 0 ? '+' : ''}{formatNumber(summary.commercial_change)}
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="font-semibold {getChangeColor(summary.non_commercial_net)}">
									{formatNumber(summary.non_commercial_net)}
								</div>
								<div class="text-xs {getChangeColor(summary.non_commercial_change)}">
									{summary.non_commercial_change >= 0 ? '+' : ''}{formatNumber(summary.non_commercial_change)}
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="font-semibold {getChangeColor(summary.retail_net)}">
									{formatNumber(summary.retail_net)}
								</div>
								<div class="text-xs {getChangeColor(summary.retail_change)}">
									{summary.retail_change >= 0 ? '+' : ''}{formatNumber(summary.retail_change)}
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="flex items-center justify-center gap-1">
									{#if summary.commercial_change >= 0}
										<TrendingUp class="w-4 h-4 text-green-600" />
									{:else}
										<TrendingDown class="w-4 h-4 text-red-600" />
									{/if}
									<span class="text-sm {getChangeColor(summary.commercial_change)}">
										{Math.abs(summary.commercial_change) > Math.abs(summary.non_commercial_change) ? 'Strong' : 'Weak'}
									</span>
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<span class="px-2 py-1 rounded-full text-xs font-medium {getSignalColor(summary.signal)}">
									{summary.signal.toUpperCase()}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- COT Signals & Interpretation -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<AlertTriangle class="w-5 h-5 text-orange-600" />
			COT Signals & Interpretation
		</h2>

		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Interpretation Guide -->
			<div class="space-y-4">
				<h3 class="font-semibold text-gray-700">How to Read COT Data</h3>
				<div class="space-y-3 text-sm">
					<div class="p-3 bg-blue-50 rounded-lg">
						<div class="font-medium text-blue-700 mb-1">Commercial Traders</div>
						<div class="text-gray-600">Large institutions and hedgers. Often contrarian indicators - when they're heavily long, price may decline.</div>
					</div>
					<div class="p-3 bg-green-50 rounded-lg">
						<div class="font-medium text-green-700 mb-1">Non-Commercial Traders</div>
						<div class="text-gray-600">Large speculators and hedge funds. Their positioning often aligns with trends.</div>
					</div>
					<div class="p-3 bg-purple-50 rounded-lg">
						<div class="font-medium text-purple-700 mb-1">Retail Traders</div>
						<div class="text-gray-600">Small speculators. Often used as contrarian indicators.</div>
					</div>
				</div>
			</div>

			<!-- Current Market Signals -->
			<div class="space-y-4">
				<h3 class="font-semibold text-gray-700">Current Market Signals</h3>
				<div class="space-y-3">
					{#each cotSummary.slice(0, 5) as summary}
						<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
							<div>
								<div class="font-medium text-navy">{summary.asset}</div>
								<div class="text-sm text-gray-600">
									{summary.signal === 'bullish' ? 'Commercial buying, Non-commercial selling' :
									 summary.signal === 'bearish' ? 'Commercial selling, Non-commercial buying' :
									 'Mixed signals, watch for breakout'}
								</div>
							</div>
							<span class="px-2 py-1 rounded-full text-xs font-medium {getSignalColor(summary.signal)}">
								{summary.signal.toUpperCase()}
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Data Information -->
	<div class="bg-gray-50 rounded-xl p-6">
		<div class="flex items-start gap-3">
			<Calendar class="w-5 h-5 text-gray-600 mt-1" />
			<div>
				<h3 class="font-semibold text-gray-700 mb-2">About COT Data</h3>
				<div class="text-sm text-gray-600 space-y-1">
					<p>• COT reports are published every Friday by the CFTC, showing positions as of Tuesday.</p>
					<p>• Data represents futures contracts and is updated weekly.</p>
					<p>• Commercial traders are typically hedgers, while non-commercial are speculators.</p>
					<p>• Extreme positioning often signals potential reversals.</p>
					<p>• This data should be used in conjunction with technical and fundamental analysis.</p>
				</div>
			</div>
		</div>
	</div>
</div>

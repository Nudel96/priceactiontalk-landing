<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		TrendingUp, TrendingDown, BarChart3, Globe,
		Calendar, DollarSign, Activity, ArrowLeft,
		RefreshCw, Eye, AlertTriangle, Info
	} from '@lucide/svelte';

	// Import enhanced components and data
	import FundamentalFactors from '$lib/components/economic/FundamentalFactors.svelte';
	import { generateUSDMacroeconomicData, generateIndicatorCategories } from '$lib/data/usd-macroeconomic';
	import { generateEURMacroeconomicData, generateEURIndicatorCategories } from '$lib/data/eur-macroeconomic';
	import { generateGBPMacroeconomicData, generateGBPIndicatorCategories } from '$lib/data/gbp-macroeconomic';
	import type { MacroeconomicIndicator, IndicatorCategoryConfig, MacroeconomicCategory } from '$lib/types/economic';

	// Get symbol from URL params
	$: symbol = $page.params.symbol?.toUpperCase() || 'EURUSD';

	// Mock asset data - will be replaced with API calls
	let assetData = {
		symbol: 'EURUSD',
		name: 'Euro / US Dollar',
		price: 1.0845,
		change: -0.0012,
		changePercent: -0.11,
		bid: 1.0843,
		ask: 1.0847,
		spread: 0.0004,
		volume: 1250000,
		high24h: 1.0867,
		low24h: 1.0821,
		open24h: 1.0856
	};

	// Mock technical indicators
	let technicalIndicators = {
		rsi: 45.2,
		macd: -0.0008,
		sma20: 1.0851,
		sma50: 1.0863,
		sma200: 1.0789,
		bollinger: {
			upper: 1.0891,
			middle: 1.0851,
			lower: 1.0811
		}
	};

	// Mock fundamental factors
	let fundamentalFactors = [
		{
			factor: 'ECB Interest Rate',
			value: '4.50%',
			impact: 'high',
			trend: 'neutral'
		},
		{
			factor: 'Fed Interest Rate',
			value: '5.25%',
			impact: 'high',
			trend: 'neutral'
		},
		{
			factor: 'EUR Inflation Rate',
			value: '2.4%',
			impact: 'medium',
			trend: 'down'
		},
		{
			factor: 'USD Employment',
			value: '3.7%',
			impact: 'medium',
			trend: 'stable'
		}
	];

	// Mock related assets
	let relatedAssets = [
		{ symbol: 'GBPUSD', correlation: 0.72, change: 0.15 },
		{ symbol: 'AUDUSD', correlation: 0.68, change: -0.23 },
		{ symbol: 'USDJPY', correlation: -0.45, change: 0.31 },
		{ symbol: 'USDCHF', correlation: -0.78, change: 0.08 }
	];

	// Mock news data
	let assetNews = [
		{
			id: 1,
			headline: 'ECB Maintains Rates at 4.50% as Expected',
			time: '2 hours ago',
			impact: 'medium',
			source: 'Reuters'
		},
		{
			id: 2,
			headline: 'EUR/USD Technical Analysis: Support at 1.0820',
			time: '4 hours ago',
			impact: 'low',
			source: 'FXStreet'
		},
		{
			id: 3,
			headline: 'US Dollar Strengthens on Strong Employment Data',
			time: '6 hours ago',
			impact: 'high',
			source: 'Bloomberg'
		}
	];

	// Chart timeframes
	let selectedTimeframe = '1D';
	const timeframes = ['1H', '4H', '1D', '1W', '1M'];

	// Mock price history for chart
	let priceHistory = [];

	// Enhanced macroeconomic data
	let macroeconomicIndicators: MacroeconomicIndicator[] = [];
	let indicatorCategories: IndicatorCategoryConfig[] = [];
	let selectedCategory: MacroeconomicCategory | 'all' = 'all';
	let language: 'en' | 'de' = 'en';

	onMount(() => {
		// Generate mock price data
		generateMockPriceData();

		// Update asset data based on symbol
		updateAssetData();

		// Load macroeconomic data
		loadMacroeconomicData();
	});

	function generateMockPriceData() {
		const basePrice = assetData.price;
		const points = 100;
		priceHistory = [];
		
		for (let i = 0; i < points; i++) {
			const variation = (Math.random() - 0.5) * 0.01;
			const price = basePrice + variation;
			priceHistory.push({
				time: new Date(Date.now() - (points - i) * 60000).toISOString(),
				price: price,
				volume: Math.floor(Math.random() * 50000) + 10000
			});
		}
	}

	function updateAssetData() {
		// This would fetch real data based on the symbol
		// For now, just update the symbol in the data
		assetData.symbol = symbol;
		
		// Mock different data for different symbols
		if (symbol === 'GBPUSD') {
			assetData.name = 'British Pound / US Dollar';
			assetData.price = 1.2654;
			assetData.change = 0.0023;
			assetData.changePercent = 0.18;
		} else if (symbol === 'USDJPY') {
			assetData.name = 'US Dollar / Japanese Yen';
			assetData.price = 149.45;
			assetData.change = 0.67;
			assetData.changePercent = 0.45;
		}
		// Add more symbols as needed
	}

	function loadMacroeconomicData() {
		// Determine which currency data to load based on asset symbol
		let currency = 'USD'; // default

		if (symbol.includes('EUR') || symbol.startsWith('EUR')) {
			currency = 'EUR';
		} else if (symbol.includes('GBP') || symbol.startsWith('GBP')) {
			currency = 'GBP';
		}

		if (currency === 'EUR') {
			// Load comprehensive EUR macroeconomic data
			const eurData = generateEURMacroeconomicData();
			macroeconomicIndicators = Object.values(eurData);
			indicatorCategories = generateEURIndicatorCategories();
		} else if (currency === 'GBP') {
			// Load comprehensive GBP macroeconomic data
			const gbpData = generateGBPMacroeconomicData();
			macroeconomicIndicators = Object.values(gbpData);
			indicatorCategories = generateGBPIndicatorCategories();
		} else {
			// Load comprehensive USD macroeconomic data
			const usdData = generateUSDMacroeconomicData();
			macroeconomicIndicators = Object.values(usdData);
			indicatorCategories = generateIndicatorCategories();
		}

		// Filter indicators based on asset relevance
		if (symbol.includes('USD') || symbol === 'USD' || symbol.includes('EUR') || symbol.startsWith('EUR') || symbol.includes('GBP') || symbol.startsWith('GBP')) {
			// For major currency pairs, show all relevant indicators
			// Already loaded all indicators
		} else if (symbol === 'GOLD' || symbol === 'SILVER') {
			// For precious metals, focus on inflation and monetary policy
			macroeconomicIndicators = macroeconomicIndicators.filter(
				indicator => ['inflation', 'monetary_policy', 'sentiment'].includes(indicator.category)
			);
		} else {
			// For other assets, show key indicators
			macroeconomicIndicators = macroeconomicIndicators.filter(
				indicator => ['growth', 'inflation', 'labor', 'monetary_policy'].includes(indicator.category)
			);
		}
	}

	function handleCategorySelect(event: CustomEvent<MacroeconomicCategory>) {
		selectedCategory = event.detail;
	}

	function handleIndicatorSelect(event: CustomEvent<string>) {
		console.log('Selected indicator:', event.detail);
	}

	function handleLearnMore(event: CustomEvent<{ indicatorId: string; url: string }>) {
		window.open(event.detail.url, '_blank');
	}

	function getImpactColor(impact: string) {
		switch (impact) {
			case 'high': return 'text-red-600 bg-red-50';
			case 'medium': return 'text-yellow-600 bg-yellow-50';
			case 'low': return 'text-green-600 bg-green-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getTrendIcon(trend: string) {
		switch (trend) {
			case 'up': return TrendingUp;
			case 'down': return TrendingDown;
			default: return Activity;
		}
	}

	function formatPrice(price: number) {
		return price.toFixed(symbol.includes('JPY') ? 2 : 4);
	}

	function formatChange(change: number) {
		const sign = change >= 0 ? '+' : '';
		return `${sign}${change.toFixed(4)}`;
	}

	function formatPercent(percent: number) {
		const sign = percent >= 0 ? '+' : '';
		return `${sign}${percent.toFixed(2)}%`;
	}
</script>

<svelte:head>
	<title>{symbol} Analysis - Economic Overview</title>
	<meta name="description" content="Detailed analysis for {symbol} including technical indicators, fundamental factors, and market sentiment." />
</svelte:head>

<div class="space-y-6">
	<!-- Back Navigation -->
	<div class="flex items-center gap-4">
		<a href="/economic-overview" class="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
			<ArrowLeft size={20} />
			<span>Back to Overview</span>
		</a>
	</div>

	<!-- Asset Header -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold text-navy">{assetData.symbol}</h1>
				<p class="text-gray-600 text-lg">{assetData.name}</p>
			</div>
			
			<div class="flex flex-col lg:items-end gap-2">
				<div class="text-3xl font-bold text-navy">{formatPrice(assetData.price)}</div>
				<div class="flex items-center gap-2">
					<span class="text-lg {assetData.change >= 0 ? 'text-green-600' : 'text-red-600'}">
						{formatChange(assetData.change)}
					</span>
					<span class="text-lg {assetData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}">
						({formatPercent(assetData.changePercent)})
					</span>
					{#if assetData.change >= 0}
						<TrendingUp class="w-5 h-5 text-green-600" />
					{:else}
						<TrendingDown class="w-5 h-5 text-red-600" />
					{/if}
				</div>
			</div>
		</div>

		<!-- Key Stats -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
			<div class="text-center">
				<div class="text-sm text-gray-600">Bid</div>
				<div class="font-semibold text-navy">{formatPrice(assetData.bid)}</div>
			</div>
			<div class="text-center">
				<div class="text-sm text-gray-600">Ask</div>
				<div class="font-semibold text-navy">{formatPrice(assetData.ask)}</div>
			</div>
			<div class="text-center">
				<div class="text-sm text-gray-600">Spread</div>
				<div class="font-semibold text-navy">{formatPrice(assetData.spread)}</div>
			</div>
			<div class="text-center">
				<div class="text-sm text-gray-600">Volume</div>
				<div class="font-semibold text-navy">{(assetData.volume / 1000000).toFixed(1)}M</div>
			</div>
		</div>
	</div>

	<!-- Price Chart -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center justify-between mb-6">
			<h2 class="text-xl font-semibold text-navy flex items-center gap-2">
				<BarChart3 class="w-5 h-5 text-teal-600" />
				Price Chart
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
				<p class="text-lg font-medium">Interactive Chart</p>
				<p class="text-sm">TradingView integration placeholder</p>
				<p class="text-xs mt-2">Timeframe: {selectedTimeframe}</p>
			</div>
		</div>
	</div>

	<!-- Technical Indicators & Fundamental Factors -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Technical Indicators -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
				<Activity class="w-5 h-5 text-blue-600" />
				Technical Indicators
			</h3>
			
			<div class="space-y-4">
				<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<span class="font-medium text-gray-700">RSI (14)</span>
					<span class="font-semibold text-navy">{technicalIndicators.rsi}</span>
				</div>
				
				<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<span class="font-medium text-gray-700">MACD</span>
					<span class="font-semibold text-navy">{technicalIndicators.macd}</span>
				</div>
				
				<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<span class="font-medium text-gray-700">SMA 20</span>
					<span class="font-semibold text-navy">{formatPrice(technicalIndicators.sma20)}</span>
				</div>
				
				<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<span class="font-medium text-gray-700">SMA 50</span>
					<span class="font-semibold text-navy">{formatPrice(technicalIndicators.sma50)}</span>
				</div>
				
				<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
					<span class="font-medium text-gray-700">SMA 200</span>
					<span class="font-semibold text-navy">{formatPrice(technicalIndicators.sma200)}</span>
				</div>
			</div>
		</div>

		<!-- Enhanced Macroeconomic Indicators -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
				<Globe class="w-5 h-5 text-green-600" />
				{symbol.includes('EUR') || symbol.startsWith('EUR') ? 'EUR' :
				 symbol.includes('GBP') || symbol.startsWith('GBP') ? 'GBP' : 'USD'} Macroeconomic Factors
			</h3>

			<FundamentalFactors
				indicators={macroeconomicIndicators}
				categories={indicatorCategories}
				selectedCategory={selectedCategory}
				{language}
				showTooltips={true}
				collapsible={true}
				maxItemsPerCategory={3}
				on:categorySelect={handleCategorySelect}
				on:indicatorSelect={handleIndicatorSelect}
				on:learnMore={handleLearnMore}
			/>
		</div>
	</div>

	<!-- Related Assets & Recent News -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Related Assets -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
				<DollarSign class="w-5 h-5 text-purple-600" />
				Related Assets
			</h3>

			<div class="space-y-3">
				{#each relatedAssets as asset}
					<a href="/economic-overview/asset/{asset.symbol}"
					   class="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
						<div class="flex items-center gap-3">
							<span class="font-semibold text-navy">{asset.symbol}</span>
							<span class="text-sm text-gray-600">
								Correlation: {asset.correlation > 0 ? '+' : ''}{asset.correlation.toFixed(2)}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-medium {asset.change >= 0 ? 'text-green-600' : 'text-red-600'}">
								{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
							</span>
							{#if asset.change >= 0}
								<TrendingUp class="w-4 h-4 text-green-600" />
							{:else}
								<TrendingDown class="w-4 h-4 text-red-600" />
							{/if}
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- Recent News -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
				<AlertTriangle class="w-5 h-5 text-orange-600" />
				Recent News
			</h3>

			<div class="space-y-4">
				{#each assetNews as news}
					<div class="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
						<div class="flex justify-between items-start gap-3">
							<div class="flex-1">
								<h4 class="font-medium text-navy mb-1">{news.headline}</h4>
								<div class="flex items-center gap-2 text-sm text-gray-600">
									<span>{news.source}</span>
									<span>•</span>
									<span>{news.time}</span>
								</div>
							</div>
							<span class="px-2 py-1 rounded-full text-xs font-medium {getImpactColor(news.impact)}">
								{news.impact}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Market Data Summary -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h3 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Info class="w-5 h-5 text-indigo-600" />
			24H Market Summary
		</h3>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<div class="text-center p-4 bg-gray-50 rounded-lg">
				<div class="text-sm text-gray-600 mb-1">Open</div>
				<div class="font-semibold text-navy">{formatPrice(assetData.open24h)}</div>
			</div>
			<div class="text-center p-4 bg-gray-50 rounded-lg">
				<div class="text-sm text-gray-600 mb-1">High</div>
				<div class="font-semibold text-green-600">{formatPrice(assetData.high24h)}</div>
			</div>
			<div class="text-center p-4 bg-gray-50 rounded-lg">
				<div class="text-sm text-gray-600 mb-1">Low</div>
				<div class="font-semibold text-red-600">{formatPrice(assetData.low24h)}</div>
			</div>
			<div class="text-center p-4 bg-gray-50 rounded-lg">
				<div class="text-sm text-gray-600 mb-1">Volume</div>
				<div class="font-semibold text-navy">{(assetData.volume / 1000000).toFixed(1)}M</div>
			</div>
		</div>
	</div>
</div>

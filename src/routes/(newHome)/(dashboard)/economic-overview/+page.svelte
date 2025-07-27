<script lang="ts">
	import { onMount } from 'svelte';
	import {
		TrendingUp, TrendingDown, Activity, Calendar,
		DollarSign, Globe, Users, AlertTriangle,
		RefreshCw, ArrowRight, Eye, Gauge,
		Building, Percent
	} from '@lucide/svelte';

	// Import reusable components
	import DataCard from '$lib/components/economic/DataCard.svelte';
	import AssetSelector from '$lib/components/economic/AssetSelector.svelte';
	import CurrencyPairHeatmap from '$lib/components/economic/CurrencyPairHeatmap.svelte';
	import TradingViewChart from '$lib/components/charts/TradingViewChart.svelte';

	import FundamentalFactors from '$lib/components/economic/FundamentalFactors.svelte';

	// Import types and data
	import type { AssetData, MarketSentiment, MacroeconomicIndicator, IndicatorCategoryConfig } from '$lib/types/economic';
	import { generateUSDMacroeconomicData, generateIndicatorCategories } from '$lib/data/usd-macroeconomic';
	import { language, t } from '$lib/stores/language';
	import { generateEURMacroeconomicData, generateEURIndicatorCategories } from '$lib/data/eur-macroeconomic';
	import { generateGBPMacroeconomicData, generateGBPIndicatorCategories } from '$lib/data/gbp-macroeconomic';
	import { generateJPYMacroeconomicData, generateJPYIndicatorCategories } from '$lib/data/jpy-macroeconomic';
	import { generateNZDMacroeconomicData, generateNZDIndicatorCategories } from '$lib/data/nzd-macroeconomic';

	// Import page data
	import type { PageData } from './$types';
	export const data: PageData = {} as PageData; // External reference only

	// State
	let isLoading = false;
	let error: string | undefined = undefined;
	let selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AUD' | 'CAD' | 'CHF' | 'CNY' | 'NZD' | 'XAU' | 'XAG' = 'USD';

	// Tab management for reduced scrolling
	let activeTab: 'market' | 'currency' | 'assets' = 'market';

	// Chart state
	let selectedQuickAsset = 'EURUSD';
	let chartType: 'candlestick' | 'line' | 'area' = 'line';

	// Macroeconomic data
	let macroeconomicIndicators: MacroeconomicIndicator[] = [];
	let indicatorCategories: IndicatorCategoryConfig[] = [];

	// Market Summary Data
	let marketSummary = {
		sp500: { value: 4567.89, change: 1.23, changePercent: 0.027 },
		nasdaq: { value: 14234.56, change: -23.45, changePercent: -0.164 },
		dow: { value: 34567.12, change: 45.67, changePercent: 0.132 },
		vix: { value: 18.45, change: -0.67, changePercent: -3.51 },
		dxy: { value: 103.45, change: 0.23, changePercent: 0.22 },
		gold: { value: 1985.50, change: 12.50, changePercent: 0.63 }
	};

	// Top Movers
	let topMovers: AssetData[] = [
		{ symbol: 'EURUSD', name: 'Euro/USD', price: 1.0845, change: 0.0045, changePercent: 0.42 },
		{ symbol: 'GBPUSD', name: 'Pound/USD', price: 1.2654, change: -0.0032, changePercent: -0.25 },
		{ symbol: 'USDJPY', name: 'USD/Yen', price: 149.45, change: 0.67, changePercent: 0.45 },
		{ symbol: 'GOLD', name: 'Gold', price: 1985.50, change: 12.50, changePercent: 0.63 },
		{ symbol: 'OIL', name: 'Crude Oil', price: 73.25, change: -2.15, changePercent: -2.84 },
		{ symbol: 'BTC', name: 'Bitcoin', price: 43250.00, change: 1250.00, changePercent: 2.98 }
	];



	// Market Sentiment
	let sentimentOverview: MarketSentiment = {
		overall: 'bullish',
		overall_percentage: 58,
		risk_on: 62,
		fear_greed: 45,
		vix: 18.45,
		dxy: 103.45
	};

	// Quick Asset Selection
	let quickAssets: AssetData[] = [
		{ symbol: 'EURUSD', name: 'Euro/USD', price: 1.0845, change: 0.0045, changePercent: 0.42 },
		{ symbol: 'GBPUSD', name: 'Pound/USD', price: 1.2654, change: -0.0032, changePercent: -0.25 },
		{ symbol: 'USDJPY', name: 'USD/Yen', price: 149.45, change: 0.67, changePercent: 0.45 },
		{ symbol: 'AUDUSD', name: 'AUD/USD', price: 0.6523, change: 0.0012, changePercent: 0.18 },
		{ symbol: 'USDCAD', name: 'USD/CAD', price: 1.3654, change: -0.0023, changePercent: -0.17 },
		{ symbol: 'GOLD', name: 'Gold', price: 1985.50, change: 12.50, changePercent: 0.63 },
		{ symbol: 'SILVER', name: 'Silver', price: 24.85, change: 0.45, changePercent: 1.84 },
		{ symbol: 'OIL', name: 'Crude Oil', price: 73.25, change: -2.15, changePercent: -2.84 }
	];

	// Asset Strength (Currencies + Precious Metals)
	let assetStrength = [
		{ asset: 'USD', name: 'US Dollar', strength: 7.2, change: 0.3, rank: 1, type: 'currency', emoji: '🇺🇸' },
		{ asset: 'XAU', name: 'Gold', strength: 7.0, change: 0.8, rank: 2, type: 'precious_metal', emoji: '🥇' },
		{ asset: 'EUR', name: 'Euro', strength: 6.8, change: -0.1, rank: 3, type: 'currency', emoji: '🇪🇺' },
		{ asset: 'GBP', name: 'British Pound', strength: 6.5, change: 0.2, rank: 4, type: 'currency', emoji: '🇬🇧' },
		{ asset: 'XAG', name: 'Silver', strength: 6.2, change: 1.2, rank: 5, type: 'precious_metal', emoji: '🥈' },
		{ asset: 'JPY', name: 'Japanese Yen', strength: 5.9, change: -0.4, rank: 6, type: 'currency', emoji: '🇯🇵' },
		{ asset: 'CHF', name: 'Swiss Franc', strength: 5.7, change: 0.1, rank: 7, type: 'currency', emoji: '🇨🇭' },
		{ asset: 'AUD', name: 'Australian Dollar', strength: 5.3, change: 0.2, rank: 8, type: 'currency', emoji: '🇦🇺' },
		{ asset: 'CAD', name: 'Canadian Dollar', strength: 5.1, change: -0.2, rank: 9, type: 'currency', emoji: '🇨🇦' },
		{ asset: 'CNY', name: 'Chinese Yuan', strength: 4.9, change: -0.3, rank: 10, type: 'currency', emoji: '🇨🇳' },
		{ asset: 'NZD', name: 'New Zealand Dollar', strength: 4.8, change: 0.1, rank: 11, type: 'currency', emoji: '🇳🇿' }
	];



	function getStrengthColor(strength: number) {
		if (strength >= 7) return 'bg-green-500';
		if (strength >= 6) return 'bg-yellow-500';
		if (strength >= 5) return 'bg-orange-500';
		return 'bg-red-500';
	}

	async function loadMacroeconomicData() {
		if (selectedCurrency === 'USD') {
			// Load comprehensive USD macroeconomic data
			const usdData = generateUSDMacroeconomicData();
			macroeconomicIndicators = Object.values(usdData);
			indicatorCategories = generateIndicatorCategories();
		} else if (selectedCurrency === 'EUR') {
			// Load comprehensive EUR macroeconomic data
			const eurData = generateEURMacroeconomicData();
			macroeconomicIndicators = Object.values(eurData);
			indicatorCategories = generateEURIndicatorCategories();
		} else if (selectedCurrency === 'GBP') {
			// Load comprehensive GBP macroeconomic data
			const gbpData = generateGBPMacroeconomicData();
			macroeconomicIndicators = Object.values(gbpData);
			indicatorCategories = generateGBPIndicatorCategories();
		} else if (selectedCurrency === 'JPY') {
			// Load comprehensive JPY macroeconomic data (async)
			try {
				const jpyData = await generateJPYMacroeconomicData();
				macroeconomicIndicators = Object.values(jpyData);
				indicatorCategories = generateJPYIndicatorCategories();
			} catch (error) {
				console.error('Error loading JPY data:', error);
				// Fallback to empty data
				macroeconomicIndicators = [];
				indicatorCategories = generateJPYIndicatorCategories();
			}
		} else if (selectedCurrency === 'NZD') {
			// Load comprehensive NZD macroeconomic data
			const nzdData = generateNZDMacroeconomicData();
			macroeconomicIndicators = Object.values(nzdData);
			indicatorCategories = generateNZDIndicatorCategories();
		}
	}

	function refreshData() {
		isLoading = true;
		error = undefined;

		// Simulate API call
		setTimeout(() => {
			// Simulate random data updates
			marketSummary.sp500.change = (Math.random() - 0.5) * 50;
			marketSummary.sp500.changePercent = (marketSummary.sp500.change / marketSummary.sp500.value) * 100;

			topMovers = topMovers.map(asset => ({
				...asset,
				change: (Math.random() - 0.5) * 0.01,
				changePercent: (Math.random() - 0.5) * 2
			}));

			// Refresh macroeconomic data
			loadMacroeconomicData().catch(console.error);

			isLoading = false;
		}, 1000);
	}

	// Refresh API data function
	async function refreshAPIData() {
		try {
			const response = await fetch('/api/fetchEconomicData');
			const result = await response.json();

			if (result.success) {
				// Reload the page to get fresh data
				window.location.reload();
			} else {
				console.error('API refresh failed:', result.error);
				alert('Failed to refresh API data: ' + (result.error || 'Unknown error'));
			}
		} catch (error) {
			console.error('Error refreshing API data:', error);
			alert('Error refreshing API data. Please try again.');
		}
	}

	function handleAssetChange(asset: string) {
		selectedQuickAsset = asset;
		// Navigate to asset detail page
		window.location.href = `/economic-overview/asset/${asset}`;
	}

	function handleCurrencyChange(currency: string) {
		// Type guard to ensure valid currency
		const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'];
		if (validCurrencies.includes(currency)) {
			selectedCurrency = currency as typeof selectedCurrency;
			loadMacroeconomicData().catch(console.error);
			// Optionally save to localStorage
			localStorage.setItem('economic-dashboard-currency', currency);
		}
	}

	onMount(() => {
		// Load saved currency preference
		const savedCurrency = localStorage.getItem('economic-dashboard-currency') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD';
		if (savedCurrency) {
			selectedCurrency = savedCurrency;
		}

		// Load initial data
		loadMacroeconomicData().catch(console.error);
		refreshData();

		// Set up auto-refresh every 30 seconds
		const interval = setInterval(refreshData, 30000);

		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Economic Overview - Market Analysis Dashboard</title>
	<meta name="description" content="Comprehensive economic analysis dashboard with market sentiment, events, and asset analysis." />
</svelte:head>

<div class="space-y-6">
	<!-- Redesigned Header with Unified Controls -->
	<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 lg:p-6">
		<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
			<div class="text-center lg:text-left">
				<h1 class="text-2xl lg:text-3xl font-bold text-navy">{t('economic.overview', $language)}</h1>
				<p class="text-sm lg:text-base text-gray-600 mt-1">Real-time economic analysis for {selectedCurrency} • Last updated: {new Date().toLocaleTimeString()}</p>
			</div>

			<!-- Unified Currency Selector with Visual Feedback -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
					<span class="text-sm font-medium text-gray-700">Select Currency:</span>
					<div class="grid grid-cols-3 sm:flex sm:items-center gap-1 bg-white border border-gray-300 rounded-lg p-1 shadow-sm w-full sm:w-auto">
						{#each ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'NZD', 'XAU', 'XAG'] as currency}
							<button
								on:click={() => handleCurrencyChange(currency)}
								class="px-2 sm:px-3 py-2 rounded text-xs sm:text-sm font-medium transition-all duration-200 text-center
									{selectedCurrency === currency
										? 'bg-blue-600 text-white shadow-md transform scale-105'
										: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}"
							>
								{currency}
							</button>
						{/each}
					</div>
				</div>

				<!-- Single Refresh Button with Status -->
				<div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
					<button
						on:click={refreshAPIData}
						disabled={isLoading}
						class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm w-full sm:w-auto"
					>
						<RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
						<span class="text-sm lg:text-base">{isLoading ? 'Updating...' : 'Refresh All Data'}</span>
					</button>

					<div class="flex items-center gap-2 text-sm text-gray-600">
						<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
						<span>Live</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Tab Navigation for Reduced Scrolling -->
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
		<div class="border-b border-gray-200">
			<nav class="flex space-x-8 px-6" aria-label="Tabs">
				<button
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'market' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					on:click={() => activeTab = 'market'}
				>
					📊 Market Overview
				</button>
				<button
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'currency' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					on:click={() => activeTab = 'currency'}
				>
					💱 Currency Analysis
				</button>
				<button
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'assets' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
					on:click={() => activeTab = 'assets'}
				>
					🎯 Asset Analysis
				</button>
			</nav>
		</div>
	</div>

<!-- Tab Content -->
{#if activeTab === 'market'}
	<!-- Market Overview Tab -->
	<div class="space-y-6">
		<!-- Key Economic Indicators for Selected Currency -->
		<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
			<div class="p-6 border-b border-gray-200">
				<div class="flex items-center gap-3">
					<Activity class="w-6 h-6 text-blue-600" />
					<h2 class="text-xl font-bold text-navy">Key {selectedCurrency} Economic Indicators</h2>
					<div class="ml-auto flex items-center gap-2 text-sm text-gray-500">
						<Globe class="w-4 h-4" />
						<span>Real-time data from official sources</span>
					</div>
				</div>
			</div>

	<!-- Key Indicators Grid -->
	<div class="p-6">
		<div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
			<!-- GDP Growth -->
			<div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
				<div class="flex items-center gap-2 mb-2">
					<TrendingUp class="w-5 h-5 text-green-600" />
					<h3 class="font-semibold text-gray-800">GDP Growth</h3>
				</div>
				<div class="space-y-1">
					<div class="text-2xl font-bold text-green-700">
						{#if macroeconomicIndicators.find(i => i.id.includes('gdp_growth'))}
							{macroeconomicIndicators.find(i => i.id.includes('gdp_growth'))?.current_value || '2.4'}%
						{:else}
							2.4%
						{/if}
					</div>
					<div class="text-sm text-gray-600">Quarterly, annualized</div>
					<div class="text-xs text-green-600">↗ Economic expansion</div>
				</div>
			</div>

			<!-- Inflation Rate -->
			<div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
				<div class="flex items-center gap-2 mb-2">
					<Percent class="w-5 h-5 text-orange-600" />
					<h3 class="font-semibold text-gray-800">Inflation (CPI)</h3>
				</div>
				<div class="space-y-1">
					<div class="text-2xl font-bold text-orange-700">
						{#if macroeconomicIndicators.find(i => i.id.includes('cpi'))}
							{macroeconomicIndicators.find(i => i.id.includes('cpi'))?.current_value || '3.2'}%
						{:else}
							3.2%
						{/if}
					</div>
					<div class="text-sm text-gray-600">Year-over-year</div>
					<div class="text-xs text-orange-600">↘ Moderating pressure</div>
				</div>
			</div>

			<!-- Unemployment -->
			<div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
				<div class="flex items-center gap-2 mb-2">
					<Users class="w-5 h-5 text-blue-600" />
					<h3 class="font-semibold text-gray-800">Unemployment</h3>
				</div>
				<div class="space-y-1">
					<div class="text-2xl font-bold text-blue-700">
						{#if macroeconomicIndicators.find(i => i.id.includes('unemployment'))}
							{macroeconomicIndicators.find(i => i.id.includes('unemployment'))?.current_value || '3.7'}%
						{:else}
							3.7%
						{/if}
					</div>
					<div class="text-sm text-gray-600">Labor force</div>
					<div class="text-xs text-blue-600">→ Stable levels</div>
				</div>
			</div>

			<!-- Interest Rate -->
			<div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
				<div class="flex items-center gap-2 mb-2">
					<DollarSign class="w-5 h-5 text-purple-600" />
					<h3 class="font-semibold text-gray-800">Interest Rate</h3>
				</div>
				<div class="space-y-1">
					<div class="text-2xl font-bold text-purple-700">
						{#if macroeconomicIndicators.find(i => i.id.includes('fed_funds') || i.id.includes('interest'))}
							{macroeconomicIndicators.find(i => i.id.includes('fed_funds') || i.id.includes('interest'))?.current_value || '4.75'}%
						{:else}
							4.75%
						{/if}
					</div>
					<div class="text-sm text-gray-600">Central bank rate</div>
					<div class="text-xs text-purple-600">↗ Restrictive policy</div>
				</div>
			</div>
		</div>
	</div>
</div>

	<!-- Consolidated Market Dashboard -->
	<div class="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
		<!-- Left Column: Market Overview -->
		<div class="xl:col-span-2 space-y-4 lg:space-y-6">
			<!-- Major Indices -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<TrendingUp class="w-6 h-6 text-blue-600" />
						<h2 class="text-xl font-bold text-navy">Major Market Indices</h2>
						<div class="ml-auto text-sm text-gray-500">Live Prices</div>
					</div>
				</div>
				<div class="p-4 lg:p-6">
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
						<DataCard
							title="S&P 500"
							value={marketSummary.sp500.value}
							change={marketSummary.sp500.change}
							changePercent={marketSummary.sp500.changePercent}
							icon={TrendingUp}
							color="blue"
							loading={isLoading}
						/>
						<DataCard
							title="NASDAQ"
							value={marketSummary.nasdaq.value}
							change={marketSummary.nasdaq.change}
							changePercent={marketSummary.nasdaq.changePercent}
							icon={Activity}
							color="purple"
							loading={isLoading}
						/>
						<DataCard
							title="Dow Jones"
							value={marketSummary.dow.value}
							change={marketSummary.dow.change}
							changePercent={marketSummary.dow.changePercent}
							icon={TrendingUp}
							color="green"
							loading={isLoading}
						/>
					</div>
				</div>
			</div>

			<!-- Key Market Indicators -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Gauge class="w-6 h-6 text-purple-600" />
						<h2 class="text-xl font-bold text-navy">Key Market Indicators</h2>
					</div>
				</div>
				<div class="p-4 lg:p-6">
					<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
						<DataCard
							title="VIX (Fear Index)"
							value={marketSummary.vix.value}
							change={marketSummary.vix.change}
							changePercent={marketSummary.vix.changePercent}
							icon={AlertTriangle}
							color="red"
							loading={isLoading}
						/>
						<DataCard
							title="DXY (Dollar Index)"
							value={marketSummary.dxy.value}
							change={marketSummary.dxy.change}
							changePercent={marketSummary.dxy.changePercent}
							icon={DollarSign}
							color="yellow"
							loading={isLoading}
						/>
						<DataCard
							title="Gold"
							value={marketSummary.gold.value}
							change={marketSummary.gold.change}
							changePercent={marketSummary.gold.changePercent}
							icon={Globe}
							color="teal"
							loading={isLoading}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Column: Market Sentiment & Quick Info -->
		<div class="space-y-4 lg:space-y-6">
			<!-- Market Sentiment -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Eye class="w-6 h-6 text-indigo-600" />
						<h2 class="text-xl font-bold text-navy">Market Sentiment</h2>
					</div>
				</div>
				<div class="p-6 space-y-4">
					<DataCard
						title="Overall Sentiment"
						value={sentimentOverview.overall}
						subtitle="Market mood"
						icon={Gauge}
						color="blue"
						loading={isLoading}
					/>
					<DataCard
						title="Risk Appetite"
						value="{sentimentOverview.risk_on}%"
						subtitle="Risk-on sentiment"
						icon={TrendingUp}
						color="green"
						loading={isLoading}
					/>
					<DataCard
						title="Fear & Greed"
						value={sentimentOverview.fear_greed}
						subtitle="Sentiment index"
						icon={Eye}
						color="purple"
						loading={isLoading}
					/>
				</div>
			</div>

			<!-- Asset Strength Meter -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Globe class="w-6 h-6 text-indigo-600" />
						<h2 class="text-xl font-bold text-navy">Currency Strength</h2>
					</div>
				</div>
				<div class="p-4 lg:p-6">
					<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 lg:gap-3">
						{#each assetStrength.slice(0, 8) as asset}
							<div class="text-center p-3 border border-gray-200 rounded-lg">
								<div class="flex items-center justify-center gap-1 mb-2">
									<span class="text-sm">{asset.emoji}</span>
									<div class="font-bold text-sm text-navy">{asset.asset}</div>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2 mb-2">
									<div
										class="h-2 rounded-full transition-all duration-500 {getStrengthColor(asset.strength)}"
										style="width: {(asset.strength / 10) * 100}%">
									</div>
								</div>
								<div class="text-xs text-gray-600">{asset.strength.toFixed(1)}/10</div>
								<div class="text-xs {asset.change >= 0 ? 'text-green-600' : 'text-red-600'} mt-1">
									{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	</div>
{/if}

{#if activeTab === 'currency'}
	<!-- Currency Analysis Tab -->
	<div class="space-y-6">
		<!-- Macroeconomic Overview -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<FundamentalFactors
				indicators={macroeconomicIndicators}
				categories={indicatorCategories}
			/>
		</div>

		<!-- Currency Pair Heatmap -->
		<CurrencyPairHeatmap
			title="Real-Time Currency Pair Analysis"
		/>
	</div>
{/if}

{#if activeTab === 'assets'}
	<!-- Asset Analysis Tab -->
	<div class="space-y-6">
		<!-- Top Movers & Quick Analysis -->
		<div class="space-y-4 lg:space-y-6">
			<!-- Top Movers -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<Activity class="w-6 h-6 text-orange-600" />
						<h2 class="text-xl font-bold text-navy">Top Movers</h2>
					</div>
				</div>
				<div class="p-4 lg:p-6">
					<div class="space-y-2 lg:space-y-3">
						{#each topMovers as asset}
							<a
								href="/economic-overview/asset/{asset.symbol}"
								class="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-blue-300 hover:bg-blue-50"
							>
								<div class="min-w-0 flex-1">
									<div class="font-bold text-navy text-base lg:text-lg truncate">{asset.symbol}</div>
									<div class="text-xs lg:text-sm text-gray-600 truncate">{asset.name}</div>
								</div>
								<div class="text-right ml-3">
									<div class="font-bold text-navy text-sm lg:text-lg">{asset.price.toFixed(asset.symbol.includes('JPY') ? 2 : 4)}</div>
									<div class="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm {asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}">
										{#if asset.changePercent >= 0}
											<TrendingUp class="w-3 h-3 lg:w-4 lg:h-4" />
										{:else}
											<TrendingDown class="w-3 h-3 lg:w-4 lg:h-4" />
										{/if}
										<span class="font-bold">{asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</div>

			<!-- Quick Asset Analysis -->
			<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
				<div class="p-6 border-b border-gray-200">
					<div class="flex items-center gap-3">
						<DollarSign class="w-6 h-6 text-green-600" />
						<h2 class="text-xl font-bold text-navy">Quick Asset Analysis</h2>
					</div>
				</div>
				<div class="p-6">
					<div class="mb-4">
						<AssetSelector
							assets={quickAssets}
							selectedAsset={selectedQuickAsset}
							on:change={(e) => selectedQuickAsset = e.detail}
							placeholder="Select an asset to analyze..."
							showSearch={true}
						/>
					</div>

					<!-- Chart Type Selector -->
					<div class="mb-4 flex gap-2">
						<button
							class="px-3 py-1 text-sm rounded {chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
							on:click={() => chartType = 'line'}
						>
							Line
						</button>
						<button
							class="px-3 py-1 text-sm rounded {chartType === 'area' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
							on:click={() => chartType = 'area'}
						>
							Area
						</button>
						<button
							class="px-3 py-1 text-sm rounded {chartType === 'candlestick' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}"
							on:click={() => chartType = 'candlestick'}
						>
							Candlestick
						</button>
					</div>

					<!-- TradingView Chart -->
					{#if selectedQuickAsset}
						<TradingViewChart
							symbol={selectedQuickAsset}
							{chartType}
							height={400}
							title="{selectedQuickAsset} Price Chart"
						/>
					{:else}
						<div class="text-center text-gray-500 bg-gray-50 rounded-lg p-4">
							<p class="text-sm">Select an asset above to view detailed analysis</p>
							<p class="text-xs text-gray-400 mt-1">Real-time data and technical indicators</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

</div>


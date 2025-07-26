<script lang="ts">
	import { onMount } from 'svelte';
	import {
		TrendingUp, TrendingDown, Activity, Calendar,
		DollarSign, Globe, Users, AlertTriangle,
		RefreshCw, ArrowRight, Eye, Gauge,
		Building, Percent, Clock
	} from '@lucide/svelte';

	// Import reusable components
	import DataCard from '$lib/components/economic/DataCard.svelte';
	import AssetSelector from '$lib/components/economic/AssetSelector.svelte';
	import LoadingSpinner from '$lib/components/economic/LoadingSpinner.svelte';
	import CurrencyPairHeatmap from '$lib/components/economic/CurrencyPairHeatmap.svelte';

	import FundamentalFactors from '$lib/components/economic/FundamentalFactors.svelte';

	// Import types and data
	import type { AssetData, EconomicEvent, MarketSentiment, MacroeconomicIndicator, IndicatorCategoryConfig } from '$lib/types/economic';
	import { generateUSDMacroeconomicData, generateIndicatorCategories } from '$lib/data/usd-macroeconomic';
	import { language, t } from '$lib/stores/language';
	import { generateEURMacroeconomicData, generateEURIndicatorCategories } from '$lib/data/eur-macroeconomic';
	import { generateGBPMacroeconomicData, generateGBPIndicatorCategories } from '$lib/data/gbp-macroeconomic';
	import { generateJPYMacroeconomicData, generateJPYIndicatorCategories } from '$lib/data/jpy-macroeconomic';
	import { generateNZDMacroeconomicData, generateNZDIndicatorCategories } from '$lib/data/nzd-macroeconomic';

	// State
	let isLoading = false;
	let error: string | undefined = undefined;
	let selectedCurrency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD' = 'USD';

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

	// Upcoming Economic Events
	let upcomingEvents: EconomicEvent[] = [
		{
			id: 1,
			time: '08:30',
			currency: 'USD',
			event: 'Non-Farm Payrolls',
			impact: 'high',
			forecast: '185K',
			previous: '175K',
			country: 'US'
		},
		{
			id: 2,
			time: '10:00',
			currency: 'EUR',
			event: 'ECB Interest Rate Decision',
			impact: 'high',
			forecast: '4.50%',
			previous: '4.50%',
			country: 'EU'
		},
		{
			id: 3,
			time: '14:00',
			currency: 'GBP',
			event: 'GDP Growth Rate',
			impact: 'medium',
			forecast: '0.2%',
			previous: '0.1%',
			country: 'UK'
		},
		{
			id: 4,
			time: '15:30',
			currency: 'USD',
			event: 'Federal Reserve Speech',
			impact: 'medium',
			forecast: '-',
			previous: '-',
			country: 'US'
		},
		{
			id: 5,
			time: '22:00',
			currency: 'JPY',
			event: 'Bank of Japan Meeting Minutes',
			impact: 'low',
			forecast: '-',
			previous: '-',
			country: 'JP'
		}
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

	let selectedQuickAsset = 'EURUSD';

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

	function getImpactColor(impact: string) {
		switch (impact) {
			case 'high': return 'text-red-600 bg-red-50';
			case 'medium': return 'text-yellow-600 bg-yellow-50';
			case 'low': return 'text-green-600 bg-green-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getStrengthColor(strength: number) {
		if (strength >= 7) return 'bg-green-500';
		if (strength >= 6) return 'bg-yellow-500';
		if (strength >= 5) return 'bg-orange-500';
		return 'bg-red-500';
	}

	function loadMacroeconomicData() {
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
			// Load comprehensive JPY macroeconomic data
			const jpyData = generateJPYMacroeconomicData();
			macroeconomicIndicators = Object.values(jpyData);
			indicatorCategories = generateJPYIndicatorCategories();
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
			loadMacroeconomicData();

			isLoading = false;
		}, 1000);
	}

	function handleAssetChange(asset: string) {
		selectedQuickAsset = asset;
		// Navigate to asset detail page
		window.location.href = `/economic-overview/asset/${asset}`;
	}

	function handleCurrencyChange(currency: 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD') {
		selectedCurrency = currency;
		loadMacroeconomicData();
		// Optionally save to localStorage
		localStorage.setItem('economic-dashboard-currency', currency);
	}

	onMount(() => {
		// Load saved currency preference
		const savedCurrency = localStorage.getItem('economic-dashboard-currency') as 'USD' | 'EUR' | 'GBP' | 'JPY' | 'NZD';
		if (savedCurrency) {
			selectedCurrency = savedCurrency;
		}

		// Load initial data
		loadMacroeconomicData();
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

<div class="space-y-4">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
		<div>
			<h1 class="text-2xl font-bold text-navy">{t('economic.overview', $language)}</h1>
			<p class="text-gray-600 text-sm">Market analysis and economic indicators</p>
		</div>
		<div class="flex items-center gap-3">
			<!-- Currency Selector -->
			<div class="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
				<button
					on:click={() => handleCurrencyChange('USD')}
					class="px-3 py-1 rounded text-sm font-medium transition-colors
						{selectedCurrency === 'USD'
							? 'bg-teal-600 text-white'
							: 'text-gray-600 hover:text-gray-800'}"
				>
					USD
				</button>
				<button
					on:click={() => handleCurrencyChange('EUR')}
					class="px-3 py-1 rounded text-sm font-medium transition-colors
						{selectedCurrency === 'EUR'
							? 'bg-teal-600 text-white'
							: 'text-gray-600 hover:text-gray-800'}"
				>
					EUR
				</button>
				<button
					on:click={() => handleCurrencyChange('GBP')}
					class="px-3 py-1 rounded text-sm font-medium transition-colors
						{selectedCurrency === 'GBP'
							? 'bg-teal-600 text-white'
							: 'text-gray-600 hover:text-gray-800'}"
				>
					GBP
				</button>
				<button
					on:click={() => handleCurrencyChange('JPY')}
					class="px-3 py-1 rounded text-sm font-medium transition-colors
						{selectedCurrency === 'JPY'
							? 'bg-teal-600 text-white'
							: 'text-gray-600 hover:text-gray-800'}"
				>
					JPY
				</button>
				<button
					on:click={() => handleCurrencyChange('NZD')}
					class="px-3 py-1 rounded text-sm font-medium transition-colors
						{selectedCurrency === 'NZD'
							? 'bg-teal-600 text-white'
							: 'text-gray-600 hover:text-gray-800'}"
				>
					NZD
				</button>
			</div>

			<button
				on:click={refreshData}
				disabled={isLoading}
				class="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
			>
				<RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
				Refresh Data
			</button>

			<div class="flex items-center gap-2 text-sm text-gray-600">
				<div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
				<span>Live Data</span>
			</div>
		</div>
	</div>

	<!-- Market Summary Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

		<DataCard
			title="VIX"
			value={marketSummary.vix.value}
			change={marketSummary.vix.change}
			changePercent={marketSummary.vix.changePercent}
			icon={AlertTriangle}
			color="red"
			loading={isLoading}
		/>

		<DataCard
			title="DXY"
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

	<!-- Market Sentiment Overview -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
		<DataCard
			title="Market Sentiment"
			value={sentimentOverview.overall}
			subtitle="Overall market mood"
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
			subtitle="Market sentiment index"
			icon={Eye}
			color="purple"
			loading={isLoading}
		/>

		<DataCard
			title="Overall Bullish"
			value="{sentimentOverview.overall_percentage}%"
			subtitle="Bullish sentiment"
			icon={TrendingUp}
			color="teal"
			loading={isLoading}
		/>
	</div>

	<!-- Today's Major Events -->
	<div class="bg-white rounded-xl shadow-md p-4">
		<div class="flex items-center gap-2 mb-4">
			<Calendar class="w-4 h-4 text-teal-600" />
			<h2 class="text-lg font-semibold text-navy">{t('events.todays-major-events', $language)}</h2>
		</div>
		<div class="space-y-3">
			{#each upcomingEvents as event}
				<div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
					<div class="flex items-center gap-3">
						<div class="text-center">
							<div class="font-semibold text-navy text-sm">{event.time}</div>
							<div class="text-xs text-gray-500">{event.currency}</div>
						</div>
						<div class="flex-1">
							<h3 class="font-medium text-navy text-sm">{event.event}</h3>
							<div class="flex items-center gap-3 mt-1 text-xs text-gray-600">
								<span>Fcst: {event.forecast}</span>
								<span>Prev: {event.previous}</span>
								{#if event.actual}
									<span class="font-medium">Act: {event.actual}</span>
								{/if}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span class="px-2 py-1 rounded-full text-xs font-medium border {getImpactColor(event.impact)}">
							{event.impact.toUpperCase()}
						</span>
						{#if event.actual}
							<div class="w-2 h-2 bg-green-500 rounded-full"></div>
						{:else}
							<div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Asset Strength Meter -->
	<div class="bg-white rounded-xl shadow-md p-4">
		<div class="flex items-center gap-2 mb-4">
			<Globe class="w-4 h-4 text-indigo-600" />
			<h2 class="text-lg font-semibold text-navy">{t('asset.strength-meter', $language)}</h2>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-5 gap-3">
			{#each assetStrength as asset}
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

	<!-- Top Movers -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<Activity class="w-5 h-5 text-orange-600" />
			<h2 class="text-xl font-semibold text-navy">Top Movers</h2>
		</div>
		<div class="space-y-3">
			{#each topMovers as asset}
				<a
					href="/economic-overview/asset/{asset.symbol}"
					class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-md transition-all hover:border-teal-300"
				>
					<div>
						<div class="font-semibold text-navy">{asset.symbol}</div>
						<div class="text-sm text-gray-600">{asset.name}</div>
					</div>
					<div class="text-right">
						<div class="font-semibold text-navy">{asset.price.toFixed(asset.symbol.includes('JPY') ? 2 : 4)}</div>
						<div class="flex items-center gap-1 text-sm {asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}">
							{#if asset.changePercent >= 0}
								<TrendingUp class="w-3 h-3" />
							{:else}
								<TrendingDown class="w-3 h-3" />
							{/if}
							<span>{asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- Quick Asset Selector -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<DollarSign class="w-5 h-5 text-green-600" />
			<h2 class="text-xl font-semibold text-navy">Quick Asset Analysis</h2>
		</div>

		<div class="mb-4">
			<AssetSelector
				assets={quickAssets}
				selectedAsset={selectedQuickAsset}
				on:change={(e) => handleAssetChange(e.detail)}
				placeholder="Select an asset to analyze..."
				showSearch={true}
			/>
		</div>

		<div class="text-center text-gray-500">
			<p class="text-sm">Select an asset above to view detailed analysis</p>
		</div>
	</div>

	<!-- Macroeconomic Overview -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<Globe class="w-5 h-5 text-blue-600" />
			<h2 class="text-xl font-semibold text-navy">
				{selectedCurrency} Macroeconomic Indicators
			</h2>
		</div>

		<FundamentalFactors
			indicators={macroeconomicIndicators.slice(0, 8)}
			categories={indicatorCategories}
			selectedCategory="all"
			language="en"
			showTooltips={true}
			collapsible={true}
			maxItemsPerCategory={2}
		/>

		<div class="mt-4 text-center">
			<a
				href="/economic-overview/cot"
				class="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
			>
				<span class="text-sm font-medium">
					View all indicators
				</span>
				<ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>

	<!-- Currency Pair Heatmap -->
	<CurrencyPairHeatmap title="Currency Pair Performance Heatmap" />

	<!-- Navigation to Other Sections -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<a
			href="/economic-overview/cot"
			class="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
		>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
					<Users class="w-6 h-6 text-blue-600" />
				</div>
				<div>
					<h3 class="font-semibold text-navy">
						COT Reports
					</h3>
					<p class="text-sm text-gray-600">
						Commitment of Traders analysis
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-500">
					View positioning data
				</span>
				<ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
			</div>
		</a>

		<a
			href="/economic-overview/sentiment"
			class="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
		>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
					<Gauge class="w-6 h-6 text-purple-600" />
				</div>
				<div>
					<h3 class="font-semibold text-navy">
						Sentiment Tracker
					</h3>
					<p class="text-sm text-gray-600">
						Retail trader positioning
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-500">
					View sentiment data
				</span>
				<ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
			</div>
		</a>

		<a
			href="/economic-overview/rates"
			class="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
		>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
					<Percent class="w-6 h-6 text-green-600" />
				</div>
				<div>
					<h3 class="font-semibold text-navy">
						Interest Rates
					</h3>
					<p class="text-sm text-gray-600">
						Central bank meetings & rates
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-500">
					View rates dashboard
				</span>
				<ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
			</div>
		</a>

		<a
			href="/traderhub"
			class="group bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
		>
			<div class="flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
					<Building class="w-6 h-6 text-teal-600" />
				</div>
				<div>
					<h3 class="font-semibold text-navy">
						Trading Hub
					</h3>
					<p class="text-sm text-gray-600">
						Execute trades & manage positions
					</p>
				</div>
			</div>
			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-500">
					Start trading
				</span>
				<ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
			</div>
		</a>
	</div>
</div>

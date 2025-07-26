<script lang="ts">
	import { onMount } from 'svelte';
	import {
		Globe, Calendar,
		AlertCircle, Info, RefreshCw, TrendingUp
	} from '@lucide/svelte';

	// Import economic components
	import FundamentalFactors from '$lib/components/economic/FundamentalFactors.svelte';
	import EconomicAssetSelector from '$lib/components/economic/EconomicAssetSelector.svelte';
	import LoadingSpinner from '$lib/components/economic/LoadingSpinner.svelte';
	import { language as currentLanguage, t } from '$lib/stores/language';

	// Import data generators
	import { generateUSDMacroeconomicData, generateIndicatorCategories } from '$lib/data/usd-macroeconomic';
	import { generateEURMacroeconomicData, generateEURIndicatorCategories } from '$lib/data/eur-macroeconomic';
	import { generateGBPMacroeconomicData, generateGBPIndicatorCategories } from '$lib/data/gbp-macroeconomic';
	import { generateJPYMacroeconomicData, generateJPYIndicatorCategories } from '$lib/data/jpy-macroeconomic';
	import { generateAUDMacroeconomicData, generateAUDIndicatorCategories } from '$lib/data/aud-macroeconomic';
	import { generateCADMacroeconomicData, generateCADIndicatorCategories } from '$lib/data/cad-macroeconomic';
	import { generateCHFMacroeconomicData, generateCHFIndicatorCategories } from '$lib/data/chf-macroeconomic';
	import { generateCNYMacroeconomicData, generateCNYIndicatorCategories } from '$lib/data/cny-macroeconomic';
	import { generateNZDMacroeconomicData, generateNZDIndicatorCategories } from '$lib/data/nzd-macroeconomic';
	import { generateXAUMacroeconomicData, generateXAUIndicatorCategories } from '$lib/data/xau-macroeconomic';
	import { generateXAGMacroeconomicData, generateXAGIndicatorCategories } from '$lib/data/xag-macroeconomic';

	// Import types
	import type {
		MacroeconomicIndicator,
		IndicatorCategoryConfig,
		MacroeconomicCategory
	} from '$lib/types/economic';

	import { calculateEconomicHealthScore } from '$lib/utils/economic-formatting';

	// State
	let selectedAsset: string = 'USD';
	let selectedCategory: MacroeconomicCategory | 'all' = 'all';
	let language: 'en' | 'de' = 'en';
	let isLoading = false;
	let lastUpdated = new Date();

	// Data
	let indicators: MacroeconomicIndicator[] = [];
	let categories: IndicatorCategoryConfig[] = [];
	let economicHealthScore = 50;

	// Available assets (currencies + precious metals)
	const availableAssets: Array<{
		code: string;
		name: string;
		type: 'currency' | 'precious_metal';
		emoji: string;
	}> = [
		{ code: 'USD', name: 'US Dollar', type: 'currency', emoji: '🇺🇸' },
		{ code: 'EUR', name: 'Euro', type: 'currency', emoji: '🇪🇺' },
		{ code: 'GBP', name: 'British Pound', type: 'currency', emoji: '🇬🇧' },
		{ code: 'JPY', name: 'Japanese Yen', type: 'currency', emoji: '🇯🇵' },
		{ code: 'AUD', name: 'Australian Dollar', type: 'currency', emoji: '🇦🇺' },
		{ code: 'CAD', name: 'Canadian Dollar', type: 'currency', emoji: '🇨🇦' },
		{ code: 'CHF', name: 'Swiss Franc', type: 'currency', emoji: '🇨🇭' },
		{ code: 'CNY', name: 'Chinese Yuan', type: 'currency', emoji: '🇨🇳' },
		{ code: 'NZD', name: 'New Zealand Dollar', type: 'currency', emoji: '🇳🇿' },
		{ code: 'XAU', name: 'Gold', type: 'precious_metal', emoji: '🥇' },
		{ code: 'XAG', name: 'Silver', type: 'precious_metal', emoji: '🥈' }
	];

	// Load data based on selected asset
	function loadAssetData(asset: string) {
		isLoading = true;

		// Simulate loading delay for better UX
		setTimeout(() => {
			switch (asset) {
				case 'USD':
					const usdData = generateUSDMacroeconomicData();
					indicators = Object.values(usdData);
					categories = generateIndicatorCategories();
					break;
				case 'EUR':
					const eurData = generateEURMacroeconomicData();
					indicators = Object.values(eurData);
					categories = generateEURIndicatorCategories();
					break;
				case 'GBP':
					const gbpData = generateGBPMacroeconomicData();
					indicators = Object.values(gbpData);
					categories = generateGBPIndicatorCategories();
					break;
				case 'JPY':
					const jpyData = generateJPYMacroeconomicData();
					indicators = Object.values(jpyData);
					categories = generateJPYIndicatorCategories();
					break;
				case 'AUD':
					const audData = generateAUDMacroeconomicData();
					indicators = Object.values(audData);
					categories = generateAUDIndicatorCategories();
					break;
				case 'CAD':
					const cadData = generateCADMacroeconomicData();
					indicators = Object.values(cadData);
					categories = generateCADIndicatorCategories();
					break;
				case 'CHF':
					const chfData = generateCHFMacroeconomicData();
					indicators = Object.values(chfData);
					categories = generateCHFIndicatorCategories();
					break;
				case 'CNY':
					const cnyData = generateCNYMacroeconomicData();
					indicators = Object.values(cnyData);
					categories = generateCNYIndicatorCategories();
					break;
				case 'NZD':
					const nzdData = generateNZDMacroeconomicData();
					indicators = Object.values(nzdData);
					categories = generateNZDIndicatorCategories();
					break;
				case 'XAU':
					const xauData = generateXAUMacroeconomicData();
					indicators = Object.values(xauData);
					categories = generateXAUIndicatorCategories();
					break;
				case 'XAG':
					const xagData = generateXAGMacroeconomicData();
					indicators = Object.values(xagData);
					categories = generateXAGIndicatorCategories();
					break;
				default:
					indicators = [];
					categories = [];
			}

			economicHealthScore = calculateEconomicHealthScore(indicators);
			lastUpdated = new Date();
			isLoading = false;
		}, 500);
	}

	// Handle asset change
	function handleAssetChange(event: CustomEvent<string>) {
		selectedAsset = event.detail;
		loadAssetData(selectedAsset);
	}

	// Handle category selection
	function handleCategorySelect(event: CustomEvent<MacroeconomicCategory>) {
		selectedCategory = event.detail;
	}

	// Handle indicator selection
	function handleIndicatorSelect(event: CustomEvent<string>) {
		console.log('Selected indicator:', event.detail);
	}

	// Handle learn more
	function handleLearnMore(event: CustomEvent<{ indicatorId: string; url: string }>) {
		// In a real app, this would navigate to the educational content
		console.log('Learn more:', event.detail);
		window.open(event.detail.url, '_blank');
	}

	// Refresh data
	function refreshData() {
		loadAssetData(selectedAsset);
	}

	// Get health score color
	function getHealthScoreColor(score: number): string {
		if (score >= 70) return 'text-green-600';
		if (score >= 50) return 'text-yellow-600';
		return 'text-red-600';
	}

	// Get health score description
	function getHealthScoreDescription(score: number): string {
		if (score >= 80) return 'Very Strong';
		if (score >= 70) return 'Strong';
		if (score >= 60) return 'Moderate';
		if (score >= 50) return 'Neutral';
		if (score >= 40) return 'Weak';
		return 'Very Weak';
	}

	// Get asset description
	function getAssetDescription(asset: string): string {
		const descriptionKey = `asset.${asset.toLowerCase()}-description`;
		return t(descriptionKey, $currentLanguage) || '';
	}

	// Initialize data on mount
	onMount(() => {
		loadAssetData(selectedAsset);
	});

	// Reactive updates for summary statistics

	// Get summary statistics
	$: summaryStats = {
		total: indicators.length,
		positive: indicators.filter(i => i.change_absolute > 0).length,
		negative: indicators.filter(i => i.change_absolute < 0).length,
		neutral: indicators.filter(i => i.change_absolute === 0).length,
		highImpact: indicators.filter(i => i.impact === 'high').length
	};
</script>

<div class="space-y-4">
	<!-- Compact Header with Asset Selector -->
	<div class="bg-white rounded-xl shadow-md p-4">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h1 class="text-2xl font-bold text-navy">{t('economic.fundamental-analysis', $currentLanguage)}</h1>
				<p class="text-gray-600 text-sm">{t('economic.overview', $currentLanguage)}</p>
			</div>
			<div class="flex items-center gap-3">
				<div class="text-xs text-gray-500">
					Updated: {lastUpdated.toLocaleTimeString()}
				</div>
				<button
					on:click={refreshData}
					class="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
					title={t('economic.refresh-data', $currentLanguage)}
				>
					<RefreshCw class="w-4 h-4" />
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
			<!-- Asset Selection -->
			<div class="lg:col-span-1">
				<div class="flex items-center gap-2 mb-2">
					<Globe class="w-4 h-4 text-teal-600" />
					<h3 class="font-semibold text-navy text-sm">{t('economic.asset-selection', $currentLanguage)}</h3>
				</div>
				<EconomicAssetSelector
					bind:selectedAsset
					{availableAssets}
					on:change={handleAssetChange}
				/>
				<div class="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
					{getAssetDescription(selectedAsset)}
				</div>
			</div>

			<!-- Economic Health Score -->
			<div class="lg:col-span-1">
				<div class="flex items-center gap-2 mb-2">
					<TrendingUp class="w-4 h-4 text-blue-600" />
					<h3 class="font-semibold text-navy text-sm">{t('economic.health-score', $currentLanguage)}</h3>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold {getHealthScoreColor(economicHealthScore)} mb-1">
						{economicHealthScore}
					</div>
					<div class="text-sm font-medium text-gray-700">
						{getHealthScoreDescription(economicHealthScore)}
					</div>
				</div>
			</div>

			<!-- Summary Stats -->
			<div class="lg:col-span-2">
				<div class="flex items-center gap-2 mb-2">
					<AlertCircle class="w-4 h-4 text-purple-600" />
					<h3 class="font-semibold text-navy text-sm">{t('economic.indicator-summary', $currentLanguage)}</h3>
				</div>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div class="flex justify-between">
						<span class="text-gray-600">{t('economic.positive', $currentLanguage)}</span>
						<span class="font-semibold text-green-600">{summaryStats.positive}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">{t('economic.negative', $currentLanguage)}</span>
						<span class="font-semibold text-red-600">{summaryStats.negative}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">{t('economic.high-impact', $currentLanguage)}</span>
						<span class="font-semibold text-orange-600">{summaryStats.highImpact}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-gray-600">{t('economic.total', $currentLanguage)}</span>
						<span class="font-semibold text-navy">{summaryStats.total}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

<!-- Loading State -->
{#if isLoading}
	<div class="bg-white rounded-xl shadow-md p-8">
		<div class="text-center">
			<LoadingSpinner size="large" />
			<p class="mt-4 text-gray-600">{t('economic.loading', $currentLanguage)} {selectedAsset} {t('economic.economic-data', $currentLanguage)}...</p>
		</div>
	</div>
{:else}
	<!-- Macroeconomic Indicators -->
	<div class="bg-white rounded-xl shadow-md p-4">
		<div class="flex items-center justify-between mb-4">
			<div class="flex items-center gap-2">
				<Calendar class="w-4 h-4 text-purple-600" />
				<h2 class="text-lg font-semibold text-navy">
					{selectedAsset} {t('economic.macroeconomic-indicators', $currentLanguage)}
				</h2>
			</div>

			<div class="flex items-center gap-2 text-xs text-gray-500">
				<Info class="w-3 h-3" />
				<span>{t('economic.click-for-details', $currentLanguage)}</span>
			</div>
		</div>

		<FundamentalFactors
			{indicators}
			{categories}
			{selectedCategory}
			{language}
			showTooltips={true}
			collapsible={true}
			maxItemsPerCategory={8}
			on:categorySelect={handleCategorySelect}
			on:indicatorSelect={handleIndicatorSelect}
			on:learnMore={handleLearnMore}
		/>
	</div>
{/if}

	<!-- Additional Information -->
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
		<div class="flex items-start gap-2">
			<AlertCircle class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
			<div>
				<h3 class="font-semibold text-blue-900 mb-1 text-sm">{t('economic.important-notes', $currentLanguage)}</h3>
				<ul class="text-xs text-blue-800 space-y-0.5">
					<li>• Economic indicators are updated regularly based on official releases</li>
					<li>• High impact indicators have the most significant effect on asset movements</li>
					<li>• Consider multiple indicators together for comprehensive analysis</li>
					<li>• Market reactions may vary based on expectations and current conditions</li>
				</ul>
			</div>
		</div>
	</div>
</div>

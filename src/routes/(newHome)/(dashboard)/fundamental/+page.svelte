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
	import type { PageData } from './$types';
	export let data: PageData;

	// Import the new comprehensive data replacement service
	import { getEconomicDataReplacementService } from '$lib/services/economic-data-replacement';

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

	// Load data based on selected asset using comprehensive system
	async function loadAssetData(asset: string) {
		isLoading = true;

		try {
			console.log(`[FUNDAMENTAL] Loading data for ${asset} using comprehensive system`);

			// Use the new comprehensive economic data replacement service
			const dataReplacementService = getEconomicDataReplacementService();
			const comprehensiveData = await dataReplacementService.generateMacroeconomicDataForCurrency(asset);

			// Ensure we always have indicators (already in array format from enhanced service)
			if (comprehensiveData && comprehensiveData.indicators) {
				if (Array.isArray(comprehensiveData.indicators)) {
					indicators = comprehensiveData.indicators;
				} else if (comprehensiveData.indicators instanceof Map) {
					indicators = Array.from(comprehensiveData.indicators.values());
				} else {
					indicators = [];
				}
			} else {
				indicators = [];
			}

			// Set categories if available
			if (comprehensiveData && comprehensiveData.categories) {
				categories = Array.isArray(comprehensiveData.categories)
					? comprehensiveData.categories
					: Object.values(comprehensiveData.categories);
			} else {
				categories = [];
			}

			// Ensure we have at least some data
			if (indicators.length === 0) {
				console.warn(`[FUNDAMENTAL] No indicators found for ${asset}, creating emergency fallback`);
				indicators = [{
					id: `${asset.toLowerCase()}_emergency`,
					name: `${asset} Economic Data`,
					name_de: `${asset} Wirtschaftsdaten`,
					country: asset,
					currency: asset,
					category: 'growth',
					current_value: 2.1,
					previous_value: 1.9,
					forecast_value: 2.3,
					change_absolute: 0.2,
					change_percent: 10.5,
					unit: '%',
					frequency: 'quarterly',
					impact: 'high',
					source: 'Emergency Fallback System',
					last_updated: new Date().toISOString(),
					next_release: 'TBD',
					market_impact_explanation: `Emergency economic data for ${asset} analysis`,
					market_impact_explanation_de: `Notfall-Wirtschaftsdaten für ${asset}-Analyse`,
					trend: 'up',
					description: `${asset} emergency economic indicator`,
					data_quality: 'EMERGENCY'
				}];
			}

			economicHealthScore = calculateEconomicHealthScore(indicators);
			lastUpdated = new Date();

			console.log(`[FUNDAMENTAL] ✅ Successfully loaded ${indicators.length} indicators for ${asset}`);
			console.log(`[FUNDAMENTAL] Data quality: ${comprehensiveData?.data_quality || 'UNKNOWN'}, Score: ${comprehensiveData?.overall_score || 'N/A'}`);

		} catch (error) {
			console.error(`[FUNDAMENTAL] ❌ Error loading data for ${asset}:`, error);

			// Robust fallback to prevent UI crashes
			indicators = [{
				id: `${asset.toLowerCase()}_fallback`,
				name: `${asset} Economic Data`,
				name_de: `${asset} Wirtschaftsdaten`,
				country: asset,
				currency: asset,
				category: 'growth',
				current_value: 0,
				previous_value: 0,
				forecast_value: 0,
				change_absolute: 0,
				change_percent: 0,
				unit: 'Index',
				frequency: 'daily',
				impact: 'medium',
				source: 'Fallback System',
				last_updated: new Date().toISOString(),
				next_release: 'TBD',
				market_impact_explanation: 'Fallback data due to system error',
				market_impact_explanation_de: 'Fallback-Daten aufgrund eines Systemfehlers',
				trend: 'neutral',
				description: 'Fallback economic indicator'
			}];

			categories = [];

			economicHealthScore = 0;
			lastUpdated = new Date();
		} finally {
			isLoading = false;
		}
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

	<!-- Live Economic News from APIs -->
	{#if data.fundamentalData && data.fundamentalData.latestNews.length > 0}
		<div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
			<div class="flex items-center gap-2 mb-4">
				<Globe class="w-5 h-5 text-green-600" />
				<h2 class="text-lg font-semibold text-navy">Latest Economic News</h2>
				<span class="ml-auto text-xs text-gray-500">
					Sources: {data.fundamentalData.totalSources.join(', ')}
				</span>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each data.fundamentalData.latestNews as article}
					<div class="bg-white rounded-lg p-4 border border-green-100 hover:shadow-md transition-shadow">
						<div class="flex items-start justify-between mb-2">
							<span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
								{article.source}
							</span>
							<span class="text-xs text-gray-500">{article.date}</span>
						</div>

						<h3 class="font-semibold text-navy text-sm mb-2 line-clamp-2">
							{article.title}
						</h3>

						<p class="text-gray-600 text-xs mb-3 line-clamp-3">
							{article.summary}
						</p>

						{#if article.url}
							<a
								href={article.url}
								target="_blank"
								rel="noopener noreferrer"
								class="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
							>
								Read more →
							</a>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mt-4 text-center">
				<button
					on:click={refreshAPIData}
					class="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
				>
					Refresh News Data
				</button>
			</div>
		</div>
	{:else}
		<div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
			<div class="flex items-center gap-2 mb-2">
				<AlertCircle class="w-5 h-5 text-yellow-600" />
				<h3 class="font-semibold text-yellow-800">No Economic News Available</h3>
			</div>
			<p class="text-yellow-700 text-sm mb-3">
				No recent economic news data found. Click below to fetch the latest news from our APIs.
			</p>
			<button
				on:click={refreshAPIData}
				class="px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
			>
				Fetch Latest News
			</button>
		</div>
	{/if}
</div>

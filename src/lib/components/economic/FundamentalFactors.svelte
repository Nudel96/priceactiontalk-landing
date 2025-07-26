<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { 
		Info, TrendingUp, TrendingDown, Activity, 
		ChevronDown, ChevronRight, HelpCircle,
		Calendar, ExternalLink
	} from '@lucide/svelte';
	
	import type { 
		MacroeconomicIndicator, 
		IndicatorCategoryConfig,
		MacroeconomicCategory 
	} from '$lib/types/economic';
	
	import { 
		formatIndicatorValue, 
		formatChange, 
		getImpactColor, 
		getTrendColor,
		getCategoryColor 
	} from '$lib/utils/economic-formatting';
	
	import { getEducationalTooltip } from '$lib/data/educational-tooltips';

	// Props
	export let indicators: MacroeconomicIndicator[] = [];
	export let categories: IndicatorCategoryConfig[] = [];
	export let selectedCategory: MacroeconomicCategory | 'all' = 'all';
	export let language: 'en' | 'de' = 'en';
	export let showTooltips: boolean = true;
	export let collapsible: boolean = true;
	export let maxItemsPerCategory: number = 5;

	// Internal state
	let expandedCategories: Set<string> = new Set(['growth', 'inflation', 'labor']);
	let selectedIndicator: string | null = null;
	let showTooltip: string | null = null;

	const dispatch = createEventDispatcher<{
		categorySelect: MacroeconomicCategory;
		indicatorSelect: string;
		learnMore: { indicatorId: string; url: string };
	}>();

	// Filter indicators by selected category
	$: filteredIndicators = selectedCategory === 'all' 
		? indicators 
		: indicators.filter(indicator => indicator.category === selectedCategory);

	// Group indicators by category
	$: groupedIndicators = categories.reduce((acc, category) => {
		const categoryIndicators = filteredIndicators.filter(
			indicator => indicator.category === category.category
		);
		if (categoryIndicators.length > 0) {
			acc[category.category] = {
				config: category,
				indicators: categoryIndicators.slice(0, maxItemsPerCategory)
			};
		}
		return acc;
	}, {} as Record<string, { config: IndicatorCategoryConfig; indicators: MacroeconomicIndicator[] }>);

	function toggleCategory(categoryId: string) {
		if (expandedCategories.has(categoryId)) {
			expandedCategories.delete(categoryId);
		} else {
			expandedCategories.add(categoryId);
		}
		expandedCategories = expandedCategories;
	}

	function selectIndicator(indicatorId: string) {
		selectedIndicator = selectedIndicator === indicatorId ? null : indicatorId;
		dispatch('indicatorSelect', indicatorId);
	}

	function handleTooltipToggle(indicatorId: string) {
		showTooltip = showTooltip === indicatorId ? null : indicatorId;
	}

	function handleLearnMore(indicatorId: string) {
		const tooltip = getEducationalTooltip(indicatorId);
		if (tooltip?.learn_more_url) {
			dispatch('learnMore', { indicatorId, url: tooltip.learn_more_url });
		}
	}

	function getIndicatorName(indicator: MacroeconomicIndicator): string {
		return language === 'de' ? (indicator.name_de || indicator.name) : indicator.name;
	}

	function getCategoryName(category: IndicatorCategoryConfig): string {
		return language === 'de' ? category.name_de : category.name;
	}

	function getCategoryDescription(category: IndicatorCategoryConfig): string {
		return language === 'de' ? category.description_de : category.description;
	}

	function formatTimeUntilRelease(nextRelease: string | undefined): string {
		if (!nextRelease || nextRelease === 'Continuous') return '';
		
		const now = new Date();
		const releaseDate = new Date(nextRelease);
		const diffTime = releaseDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays < 0) return 'Overdue';
		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Tomorrow';
		if (diffDays < 7) return `${diffDays} days`;
		return `${Math.ceil(diffDays / 7)} weeks`;
	}
</script>

<div class="space-y-4">
	<!-- Category Filter -->
	{#if categories.length > 1}
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				on:click={() => dispatch('categorySelect', 'all')}
				class="px-3 py-1 rounded-lg text-sm font-medium transition-colors
					{selectedCategory === 'all' 
						? 'bg-teal-600 text-white' 
						: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
			>
				All Categories
			</button>
			{#each categories as category}
				<button
					on:click={() => dispatch('categorySelect', category.category)}
					class="px-3 py-1 rounded-lg text-sm font-medium transition-colors
						{selectedCategory === category.category 
							? 'bg-teal-600 text-white' 
							: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
				>
					{getCategoryName(category)}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Indicators by Category -->
	{#each Object.entries(groupedIndicators) as [categoryId, { config, indicators: categoryIndicators }]}
		{@const isExpanded = expandedCategories.has(categoryId)}
		{@const categoryColors = getCategoryColor(categoryId)}
		
		<div class="border border-gray-200 rounded-lg overflow-hidden">
			<!-- Category Header -->
			<div class="p-4 {categoryColors.bg} border-b border-gray-200">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						{#if collapsible}
							<button
								on:click={() => toggleCategory(categoryId)}
								class="text-gray-600 hover:text-gray-800 transition-colors"
							>
								{#if isExpanded}
									<ChevronDown class="w-5 h-5" />
								{:else}
									<ChevronRight class="w-5 h-5" />
								{/if}
							</button>
						{/if}
						
						<div>
							<h3 class="font-semibold {categoryColors.text}">
								{getCategoryName(config)}
							</h3>
							<p class="text-sm text-gray-600 mt-1">
								{getCategoryDescription(config)}
							</p>
						</div>
					</div>
					
					<div class="text-sm text-gray-600">
						{categoryIndicators.length} indicator{categoryIndicators.length !== 1 ? 's' : ''}
					</div>
				</div>
			</div>

			<!-- Category Indicators -->
			{#if isExpanded || !collapsible}
				<div class="divide-y divide-gray-100">
					{#each categoryIndicators as indicator}
						{@const changeData = formatChange(indicator.change_absolute, indicator.change_percent, indicator.unit)}
						{@const tooltip = getEducationalTooltip(indicator.id)}
						{@const isSelected = selectedIndicator === indicator.id}
						{@const showIndicatorTooltip = showTooltip === indicator.id}
						
						<div class="p-4 hover:bg-gray-50 transition-colors">
							<div class="flex items-center justify-between">
								<!-- Indicator Info -->
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-2">
										<button
											on:click={() => selectIndicator(indicator.id)}
											class="font-medium text-navy hover:text-teal-600 transition-colors text-left"
										>
											{getIndicatorName(indicator)}
										</button>
										
										{#if showTooltips && tooltip}
											<button
												on:click={() => handleTooltipToggle(indicator.id)}
												class="text-gray-400 hover:text-gray-600 transition-colors"
												title="Learn more"
											>
												<HelpCircle class="w-4 h-4" />
											</button>
										{/if}
										
										<span class="px-2 py-1 rounded-full text-xs font-medium {getImpactColor(indicator.impact)}">
											{indicator.impact.toUpperCase()}
										</span>
									</div>
									
									<div class="flex items-center gap-4 text-sm text-gray-600">
										<span>Current: <span class="font-medium text-navy">{formatIndicatorValue(indicator.current_value, indicator)}</span></span>
										<span>Previous: <span class="font-medium">{formatIndicatorValue(indicator.previous_value, indicator)}</span></span>
										{#if indicator.forecast_value !== undefined}
											<span>Forecast: <span class="font-medium">{formatIndicatorValue(indicator.forecast_value, indicator)}</span></span>
										{/if}
									</div>
								</div>

								<!-- Change and Trend -->
								<div class="text-right">
									<div class="flex items-center gap-2 mb-1">
										<span class="font-semibold {changeData.color}">
											{changeData.absolute}
										</span>
										<span class="text-sm {changeData.color}">
											({changeData.percent})
										</span>
										{#if changeData.trend === 'up'}
											<TrendingUp class="w-4 h-4 {changeData.color}" />
										{:else if changeData.trend === 'down'}
											<TrendingDown class="w-4 h-4 {changeData.color}" />
										{:else}
											<Activity class="w-4 h-4 {changeData.color}" />
										{/if}
									</div>
									
									{#if indicator.next_release}
										<div class="flex items-center gap-1 text-xs text-gray-500">
											<Calendar class="w-3 h-3" />
											<span>Next: {formatTimeUntilRelease(indicator.next_release)}</span>
										</div>
									{/if}
								</div>
							</div>

							<!-- Educational Tooltip -->
							{#if showIndicatorTooltip && tooltip}
								<div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
									<div class="flex items-start justify-between gap-3">
										<div class="flex-1">
											<h4 class="font-medium text-blue-900 mb-2">
												{language === 'de' ? (tooltip.title_de || tooltip.title) : tooltip.title}
											</h4>
											<p class="text-sm text-blue-800 mb-3">
												{language === 'de' ? (tooltip.content_de || tooltip.content) : tooltip.content}
											</p>
											
											{#if tooltip.learn_more_url}
												<button
													on:click={() => handleLearnMore(indicator.id)}
													class="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
												>
													<span>Learn more</span>
													<ExternalLink class="w-3 h-3" />
												</button>
											{/if}
										</div>
										
										<button
											on:click={() => handleTooltipToggle(indicator.id)}
											class="text-blue-400 hover:text-blue-600 transition-colors"
										>
											<ChevronDown class="w-4 h-4" />
										</button>
									</div>
								</div>
							{/if}

							<!-- Detailed View -->
							{#if isSelected}
								<div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
									<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div>
											<div class="font-medium text-gray-700 mb-2">Details</div>
											<div class="space-y-1">
												<div>Frequency: <span class="font-medium">{indicator.frequency}</span></div>
												<div>Source: <span class="font-medium">{indicator.source}</span></div>
												<div>Last Updated: <span class="font-medium">{new Date(indicator.last_updated).toLocaleDateString()}</span></div>
											</div>
										</div>
										
										<div>
											<div class="font-medium text-gray-700 mb-2">Market Impact</div>
											<p class="text-gray-600">
												{language === 'de' 
													? (indicator.market_impact_explanation_de || indicator.market_impact_explanation)
													: indicator.market_impact_explanation}
											</p>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/each}

	<!-- No Data Message -->
	{#if Object.keys(groupedIndicators).length === 0}
		<div class="text-center py-8 text-gray-500">
			<Info class="w-12 h-12 mx-auto mb-4 opacity-50" />
			<p class="text-lg font-medium mb-2">No indicators available</p>
			<p class="text-sm">No macroeconomic indicators found for the selected category.</p>
		</div>
	{/if}
</div>

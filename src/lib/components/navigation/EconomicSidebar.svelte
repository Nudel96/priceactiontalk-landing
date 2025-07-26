<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { 
		TrendingUp, Globe, BarChart3, Calendar, 
		Users, Building, Percent, Activity,
		ChevronDown, ChevronRight
	} from '@lucide/svelte';

	const dispatch = createEventDispatcher<{
		navigate: string;
	}>();

	export let currentPage: string = 'economic-overview';

	let expandedSections: Record<string, boolean> = {
		'economic': true,
		'analysis': false,
		'tools': false
	};

	const navigationItems = [
		{
			id: 'economic',
			title: 'Economic Data',
			icon: TrendingUp,
			expanded: true,
			items: [
				{ id: 'economic-overview', title: 'Economic Overview', icon: Globe },
				{ id: 'fundamental', title: 'Fundamental Analysis', icon: BarChart3 },
				{ id: 'economic-calendar', title: 'Economic Calendar', icon: Calendar },
				{ id: 'currency-strength', title: 'Currency Strength', icon: Activity }
			]
		},
		{
			id: 'analysis',
			title: 'Market Analysis',
			icon: BarChart3,
			expanded: false,
			items: [
				{ id: 'retail-cot', title: 'Retail COT', icon: Users },
				{ id: 'institutional-flow', title: 'Institutional Flow', icon: Building },
				{ id: 'sentiment-analysis', title: 'Sentiment Analysis', icon: Percent },
				{ id: 'correlation-matrix', title: 'Correlation Matrix', icon: Activity }
			]
		},
		{
			id: 'tools',
			title: 'Trading Tools',
			icon: Activity,
			expanded: false,
			items: [
				{ id: 'position-calculator', title: 'Position Calculator', icon: BarChart3 },
				{ id: 'risk-management', title: 'Risk Management', icon: TrendingUp },
				{ id: 'market-scanner', title: 'Market Scanner', icon: Globe },
				{ id: 'alerts', title: 'Price Alerts', icon: Calendar }
			]
		}
	];

	function toggleSection(sectionId: string) {
		expandedSections[sectionId] = !expandedSections[sectionId];
	}

	function navigateTo(pageId: string) {
		dispatch('navigate', pageId);
	}
</script>

<div class="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
	<div class="p-4">
		<h2 class="text-lg font-semibold text-navy mb-4">Navigation</h2>
		
		<nav class="space-y-2">
			{#each navigationItems as section}
				<div class="space-y-1">
					<!-- Section Header -->
					<button
						type="button"
						on:click={() => toggleSection(section.id)}
						class="w-full flex items-center justify-between p-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
					>
						<div class="flex items-center gap-2">
							<svelte:component this={section.icon} class="w-4 h-4" />
							<span>{section.title}</span>
						</div>
						{#if expandedSections[section.id]}
							<ChevronDown class="w-4 h-4" />
						{:else}
							<ChevronRight class="w-4 h-4" />
						{/if}
					</button>

					<!-- Section Items -->
					{#if expandedSections[section.id]}
						<div class="ml-4 space-y-1">
							{#each section.items as item}
								<button
									type="button"
									on:click={() => navigateTo(item.id)}
									class="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors {currentPage === item.id ? 'bg-teal-50 text-teal-700 border-l-2 border-teal-500' : ''}"
								>
									<svelte:component this={item.icon} class="w-4 h-4" />
									<span>{item.title}</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</nav>

		<!-- Quick Actions -->
		<div class="mt-6 pt-4 border-t border-gray-200">
			<h3 class="text-sm font-medium text-gray-700 mb-2">Quick Actions</h3>
			<div class="space-y-1">
				<button
					type="button"
					on:click={() => navigateTo('market-overview')}
					class="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
				>
					<Globe class="w-4 h-4" />
					<span>Market Overview</span>
				</button>
				<button
					type="button"
					on:click={() => navigateTo('watchlist')}
					class="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
				>
					<TrendingUp class="w-4 h-4" />
					<span>My Watchlist</span>
				</button>
				<button
					type="button"
					on:click={() => navigateTo('portfolio')}
					class="w-full flex items-center gap-2 p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
				>
					<BarChart3 class="w-4 h-4" />
					<span>Portfolio</span>
				</button>
			</div>
		</div>
	</div>
</div>

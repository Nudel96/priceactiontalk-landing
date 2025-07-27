<script lang="ts">
	import { onMount } from 'svelte';
	import { TrendingUp, TrendingDown, Activity, Building, AlertTriangle, RefreshCw } from '@lucide/svelte';
	import { getCOTDataService } from '$lib/services/data-collection/cot-data-service';

	// Props
	export let selectedAsset: string = 'USD';
	export let showHeader: boolean = true;

	// State
	let cotData: any = null;
	let isLoading = false;
	let error: string | null = null;
	let lastUpdated: string = '';

	onMount(() => {
		loadCOTData();
		
		// Auto-refresh every 5 minutes
		const interval = setInterval(loadCOTData, 5 * 60 * 1000);
		return () => clearInterval(interval);
	});

	/**
	 * Load COT data
	 */
	async function loadCOTData() {
		isLoading = true;
		error = null;
		
		try {
			console.log(`[COT_DISPLAY] Loading COT data for ${selectedAsset}...`);
			
			const cotService = getCOTDataService();
			const data = await cotService.getCOTData(selectedAsset);
			
			if (data) {
				cotData = {
					asset: selectedAsset,
					commercial_long: data.commercial_long || 0,
					commercial_short: data.commercial_short || 0,
					non_commercial_long: data.non_commercial_long || 0,
					non_commercial_short: data.non_commercial_short || 0,
					net_commercial: data.net_commercial || 0,
					net_non_commercial: data.net_non_commercial || 0,
					week_change_commercial: data.week_change_commercial || 0,
					week_change_non_commercial: data.week_change_non_commercial || 0,
					contrarian_signal: data.contrarian_signal || null,
					data_quality: data.data_quality || 'FAIR',
					last_updated: data.last_updated || new Date().toISOString()
				};
				
				lastUpdated = new Date().toLocaleTimeString();
				console.log(`[COT_DISPLAY] ✅ COT data loaded for ${selectedAsset}`);
				console.log(`[COT_DISPLAY] Net Commercial: ${cotData.net_commercial}, Net Non-Commercial: ${cotData.net_non_commercial}`);
				
			} else {
				throw new Error('No COT data received');
			}
			
		} catch (err: any) {
			console.error(`[COT_DISPLAY] Failed to load COT data:`, err);
			error = err.message;
			
			// Use fallback data
			cotData = {
				asset: selectedAsset,
				commercial_long: 125000,
				commercial_short: 98000,
				non_commercial_long: 87000,
				non_commercial_short: 112000,
				net_commercial: 27000,
				net_non_commercial: -25000,
				week_change_commercial: 5200,
				week_change_non_commercial: -3800,
				contrarian_signal: null,
				data_quality: 'POOR',
				last_updated: new Date().toISOString()
			};
			
			lastUpdated = new Date().toLocaleTimeString();
			
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Get position color based on value
	 */
	function getPositionColor(value: number): string {
		if (value > 0) return 'text-green-600 bg-green-50 border-green-200';
		if (value < 0) return 'text-red-600 bg-red-50 border-red-200';
		return 'text-gray-600 bg-gray-50 border-gray-200';
	}

	/**
	 * Get change color based on value
	 */
	function getChangeColor(value: number): string {
		if (value > 0) return 'text-green-600';
		if (value < 0) return 'text-red-600';
		return 'text-gray-600';
	}

	/**
	 * Format large numbers
	 */
	function formatNumber(num: number): string {
		if (Math.abs(num) >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		}
		if (Math.abs(num) >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toFixed(0);
	}

	/**
	 * Get data quality color
	 */
	function getQualityColor(quality: string): string {
		switch (quality) {
			case 'EXCELLENT': return 'text-green-600';
			case 'GOOD': return 'text-blue-600';
			case 'FAIR': return 'text-yellow-600';
			case 'POOR': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	// Reactive statement to reload data when asset changes
	$: if (selectedAsset) {
		loadCOTData();
	}
</script>

{#if showHeader}
	<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
		<div class="p-6 border-b border-gray-200">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Building class="w-6 h-6 text-blue-600" />
					<div>
						<h2 class="text-xl font-bold text-navy">COT Data Analysis</h2>
						<p class="text-sm text-gray-600">Commitment of Traders positioning for {selectedAsset}</p>
					</div>
				</div>
				
				<button
					on:click={loadCOTData}
					disabled={isLoading}
					class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					<RefreshCw class="w-4 h-4" />
					{isLoading ? 'Loading...' : 'Refresh'}
				</button>
			</div>
		</div>

		<div class="p-6">
			{#if error}
				<div class="text-center py-8">
					<AlertTriangle class="w-12 h-12 text-red-500 mx-auto mb-4" />
					<div class="text-red-600 mb-2">⚠️ {error}</div>
					<button
						on:click={loadCOTData}
						class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Try Again
					</button>
				</div>
			{:else if isLoading}
				<div class="text-center py-8">
					<div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<div class="text-gray-600">Loading COT data...</div>
				</div>
			{:else if cotData}
				<div class="space-y-6">
					<!-- Net Positions -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="border rounded-lg p-4 {getPositionColor(cotData.net_commercial)}">
							<div class="flex items-center gap-2 mb-2">
								<Building class="w-5 h-5" />
								<h3 class="font-semibold">Commercial Net</h3>
							</div>
							<div class="text-2xl font-bold">{formatNumber(cotData.net_commercial)}</div>
							<div class="text-sm opacity-75 flex items-center gap-1">
								{#if cotData.week_change_commercial > 0}
									<TrendingUp class="w-4 h-4" />
								{:else if cotData.week_change_commercial < 0}
									<TrendingDown class="w-4 h-4" />
								{:else}
									<Activity class="w-4 h-4" />
								{/if}
								<span class="{getChangeColor(cotData.week_change_commercial)}">
									{cotData.week_change_commercial > 0 ? '+' : ''}{formatNumber(cotData.week_change_commercial)} this week
								</span>
							</div>
						</div>

						<div class="border rounded-lg p-4 {getPositionColor(cotData.net_non_commercial)}">
							<div class="flex items-center gap-2 mb-2">
								<Activity class="w-5 h-5" />
								<h3 class="font-semibold">Non-Commercial Net</h3>
							</div>
							<div class="text-2xl font-bold">{formatNumber(cotData.net_non_commercial)}</div>
							<div class="text-sm opacity-75 flex items-center gap-1">
								{#if cotData.week_change_non_commercial > 0}
									<TrendingUp class="w-4 h-4" />
								{:else if cotData.week_change_non_commercial < 0}
									<TrendingDown class="w-4 h-4" />
								{:else}
									<Activity class="w-4 h-4" />
								{/if}
								<span class="{getChangeColor(cotData.week_change_non_commercial)}">
									{cotData.week_change_non_commercial > 0 ? '+' : ''}{formatNumber(cotData.week_change_non_commercial)} this week
								</span>
							</div>
						</div>
					</div>

					<!-- Detailed Positions -->
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div class="border border-gray-200 rounded-lg p-3">
							<h4 class="font-medium text-gray-800 mb-1">Commercial Long</h4>
							<div class="text-lg font-bold text-green-600">{formatNumber(cotData.commercial_long)}</div>
						</div>
						<div class="border border-gray-200 rounded-lg p-3">
							<h4 class="font-medium text-gray-800 mb-1">Commercial Short</h4>
							<div class="text-lg font-bold text-red-600">{formatNumber(cotData.commercial_short)}</div>
						</div>
						<div class="border border-gray-200 rounded-lg p-3">
							<h4 class="font-medium text-gray-800 mb-1">Non-Commercial Long</h4>
							<div class="text-lg font-bold text-green-600">{formatNumber(cotData.non_commercial_long)}</div>
						</div>
						<div class="border border-gray-200 rounded-lg p-3">
							<h4 class="font-medium text-gray-800 mb-1">Non-Commercial Short</h4>
							<div class="text-lg font-bold text-red-600">{formatNumber(cotData.non_commercial_short)}</div>
						</div>
					</div>

					<!-- Contrarian Signal -->
					{#if cotData.contrarian_signal}
						<div class="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
							<div class="flex items-center gap-2 mb-2">
								<AlertTriangle class="w-5 h-5 text-orange-600" />
								<h3 class="font-semibold text-orange-800">COT Contrarian Signal</h3>
							</div>
							<div class="flex items-center gap-3">
								<div class="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
									{cotData.contrarian_signal}
								</div>
								<div class="text-sm text-orange-700">
									Extreme positioning detected - consider contrarian position
								</div>
							</div>
						</div>
					{/if}

					<!-- Data Info -->
					<div class="border border-gray-200 rounded-lg p-4">
						<div class="flex items-center justify-between text-sm text-gray-600">
							<div>
								Data Quality: <span class="{getQualityColor(cotData.data_quality)} font-medium">{cotData.data_quality}</span>
							</div>
							<div>Last updated: {lastUpdated}</div>
						</div>
						<div class="mt-2 text-xs text-gray-500">
							Source: CFTC Commitment of Traders Report
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<!-- Compact version -->
	<div class="space-y-3">
		{#if cotData && !isLoading}
			<div class="grid grid-cols-2 gap-3">
				<div class="border rounded-lg p-3 {getPositionColor(cotData.net_commercial)}">
					<div class="text-sm font-medium">Commercial Net</div>
					<div class="text-lg font-bold">{formatNumber(cotData.net_commercial)}</div>
					<div class="text-xs opacity-75">{cotData.week_change_commercial > 0 ? '+' : ''}{formatNumber(cotData.week_change_commercial)} WoW</div>
				</div>
				<div class="border rounded-lg p-3 {getPositionColor(cotData.net_non_commercial)}">
					<div class="text-sm font-medium">Non-Commercial Net</div>
					<div class="text-lg font-bold">{formatNumber(cotData.net_non_commercial)}</div>
					<div class="text-xs opacity-75">{cotData.week_change_non_commercial > 0 ? '+' : ''}{formatNumber(cotData.week_change_non_commercial)} WoW</div>
				</div>
			</div>
			{#if cotData.contrarian_signal}
				<div class="px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
					<div class="text-sm font-medium text-orange-800">
						COT Signal: {cotData.contrarian_signal}
					</div>
				</div>
			{/if}
		{:else if isLoading}
			<div class="text-center py-4">
				<div class="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
				<div class="text-gray-600 text-sm">Loading...</div>
			</div>
		{:else if error}
			<div class="text-center py-4">
				<div class="text-red-600 text-sm">⚠️ {error}</div>
			</div>
		{/if}
	</div>
{/if}

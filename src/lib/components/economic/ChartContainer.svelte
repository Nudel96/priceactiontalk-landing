<script lang="ts">
	import { onMount } from 'svelte';
	import { Activity, AlertTriangle, RefreshCw } from '@lucide/svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import type { ChartConfig } from '$lib/types/economic';

	// Props
	export let data: any[] = [];
	export let config: ChartConfig;
	export let loading: boolean = false;
	export let error: string | undefined = undefined;
	export let height: number = 400;
	export let title: string | undefined = undefined;
	export let subtitle: string | undefined = undefined;
	export let showControls: boolean = true;
	export let onRefresh: (() => void) | undefined = undefined;

	// Chart container element
	let chartContainer: HTMLDivElement;
	let chartInstance: any = null;

	// Available timeframes
	const timeframes = ['1H', '4H', '1D', '1W', '1M'];
	let selectedTimeframe = config.timeframe || '1D';

	// Chart types
	const chartTypes = [
		{ value: 'line', label: 'Line' },
		{ value: 'candlestick', label: 'Candlestick' },
		{ value: 'bar', label: 'Bar' },
		{ value: 'area', label: 'Area' }
	];
	let selectedChartType = config.type || 'line';

	onMount(() => {
		// Initialize chart when component mounts
		initializeChart();
		
		return () => {
			// Cleanup chart instance
			if (chartInstance) {
				chartInstance.destroy?.();
			}
		};
	});

	// Reinitialize chart when data or config changes
	$: if (data && chartContainer) {
		updateChart();
	}

	function initializeChart() {
		if (!chartContainer) return;

		// This is a placeholder for chart initialization
		// In a real implementation, you would initialize your chart library here
		// For example, with Chart.js, TradingView, or D3.js
		
		console.log('Initializing chart with config:', config);
		console.log('Chart data:', data);
	}

	function updateChart() {
		if (!chartContainer || loading || error) return;

		// Update chart with new data
		// This would be replaced with actual chart library update calls
		console.log('Updating chart with new data:', data);
	}

	function handleTimeframeChange(timeframe: string) {
		selectedTimeframe = timeframe;
		config.timeframe = timeframe;
		// Emit event or call callback to fetch new data
		updateChart();
	}

	function handleChartTypeChange(chartType: string) {
		selectedChartType = chartType;
		config.type = chartType as any;
		updateChart();
	}

	function handleRefresh() {
		if (onRefresh) {
			onRefresh();
		}
	}

	// Generate mock chart placeholder based on type
	function getChartPlaceholder() {
		switch (selectedChartType) {
			case 'candlestick':
				return 'Candlestick Chart - OHLC data visualization';
			case 'bar':
				return 'Bar Chart - Volume and price data';
			case 'area':
				return 'Area Chart - Filled line chart';
			default:
				return 'Line Chart - Price movement over time';
		}
	}
</script>

<div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
	<!-- Chart Header -->
	{#if title || showControls}
		<div class="p-4 border-b border-gray-200 bg-gray-50">
			<div class="flex items-center justify-between">
				<div>
					{#if title}
						<h3 class="text-lg font-semibold text-navy">{title}</h3>
					{/if}
					{#if subtitle}
						<p class="text-sm text-gray-600 mt-1">{subtitle}</p>
					{/if}
				</div>
				
				{#if showControls}
					<div class="flex items-center gap-4">
						<!-- Chart Type Selector -->
						<div class="flex items-center gap-2">
							<label class="text-sm font-medium text-gray-700">Type:</label>
							<select
								bind:value={selectedChartType}
								on:change={() => handleChartTypeChange(selectedChartType)}
								class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
							>
								{#each chartTypes as type}
									<option value={type.value}>{type.label}</option>
								{/each}
							</select>
						</div>

						<!-- Timeframe Selector -->
						<div class="flex items-center gap-1">
							{#each timeframes as timeframe}
								<button
									on:click={() => handleTimeframeChange(timeframe)}
									class="px-2 py-1 rounded text-sm font-medium transition-colors
										{selectedTimeframe === timeframe 
											? 'bg-teal-600 text-white' 
											: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
								>
									{timeframe}
								</button>
							{/each}
						</div>

						<!-- Refresh Button -->
						{#if onRefresh}
							<button
								on:click={handleRefresh}
								class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
								title="Refresh chart data"
							>
								<RefreshCw class="w-4 h-4" />
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Chart Content -->
	<div class="relative" style="height: {height}px;">
		{#if loading}
			<!-- Loading State -->
			<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
				<LoadingSpinner size="large" text="Loading chart data..." />
			</div>
		
		{:else if error}
			<!-- Error State -->
			<div class="absolute inset-0 flex items-center justify-center bg-red-50">
				<div class="text-center">
					<AlertTriangle class="w-12 h-12 text-red-500 mx-auto mb-4" />
					<h4 class="text-lg font-semibold text-red-700 mb-2">Chart Error</h4>
					<p class="text-red-600 text-sm mb-4">{error}</p>
					{#if onRefresh}
						<button
							on:click={handleRefresh}
							class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
						>
							Try Again
						</button>
					{/if}
				</div>
			</div>
		
		{:else if data.length === 0}
			<!-- No Data State -->
			<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
				<div class="text-center text-gray-500">
					<Activity class="w-12 h-12 mx-auto mb-4 opacity-50" />
					<h4 class="text-lg font-medium mb-2">No Data Available</h4>
					<p class="text-sm">No chart data to display</p>
				</div>
			</div>
		
		{:else}
			<!-- Chart Placeholder -->
			<div class="absolute inset-0 flex items-center justify-center bg-gray-50">
				<div class="text-center text-gray-500">
					<Activity class="w-16 h-16 mx-auto mb-4 opacity-50" />
					<h4 class="text-xl font-medium mb-2">{getChartPlaceholder()}</h4>
					<p class="text-sm mb-2">Chart library integration placeholder</p>
					<div class="text-xs text-gray-400">
						<p>Type: {selectedChartType} | Timeframe: {selectedTimeframe}</p>
						<p>Data points: {data.length}</p>
					</div>
				</div>
			</div>
			
			<!-- Actual Chart Container -->
			<div 
				bind:this={chartContainer}
				class="absolute inset-0 opacity-0"
				style="height: {height}px;"
			>
				<!-- Chart will be rendered here by the chart library -->
			</div>
		{/if}
	</div>

	<!-- Chart Footer/Legend -->
	{#if !loading && !error && data.length > 0}
		<div class="p-3 border-t border-gray-200 bg-gray-50">
			<div class="flex items-center justify-between text-xs text-gray-600">
				<div>
					Last updated: {new Date().toLocaleTimeString()}
				</div>
				<div>
					{data.length} data points
				</div>
			</div>
		</div>
	{/if}
</div>

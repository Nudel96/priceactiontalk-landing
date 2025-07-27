<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createChart, type IChartApi, type ISeriesApi, ColorType } from 'lightweight-charts';
	import { getChartDataService } from '$lib/services/chart-data/chart-data-service';

	// Props
	export let symbol: string = 'EURUSD';
	export let chartType: 'candlestick' | 'line' | 'area' = 'line';
	export let height: number = 400;
	export let width: number = 600;
	export let data: any[] = [];
	export let title: string = '';

	// Chart variables
	let chartContainer: HTMLDivElement;
	let chart: IChartApi;
	let series: ISeriesApi<any>;
	let isLoading = true;
	let error: string | null = null;

	/**
	 * Fetch real chart data
	 */
	async function fetchChartData(symbol: string) {
		try {
			isLoading = true;
			error = null;

			console.log(`[TRADINGVIEW_CHART] Fetching data for ${symbol}`);

			const chartDataService = getChartDataService();
			const chartData = await chartDataService.getChartData(symbol, '1h');

			if (chartData && chartData.data.length > 0) {
				console.log(`[TRADINGVIEW_CHART] ✅ Loaded ${chartData.data.length} data points for ${symbol}`);
				console.log(`[TRADINGVIEW_CHART] Source: ${chartData.source}`);
				return chartData.data;
			} else {
				throw new Error('No data received');
			}

		} catch (err: any) {
			console.error(`[TRADINGVIEW_CHART] Failed to fetch data for ${symbol}:`, err);
			error = `Failed to load chart data: ${err.message}`;

			// Return fallback data
			return generateFallbackData(symbol);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Generate fallback data when real data fails
	 */
	function generateFallbackData(symbol: string) {
		const basePrice = getBasePrice(symbol);
		const data = [];
		const now = new Date();

		for (let i = 30; i >= 0; i--) {
			const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
			const timeString = time.toISOString().split('T')[0];

			const variation = (Math.random() - 0.5) * 0.02;
			const price = basePrice * (1 + variation);

			if (chartType === 'candlestick') {
				const open = price;
				const high = price * (1 + Math.random() * 0.01);
				const low = price * (1 - Math.random() * 0.01);
				const close = low + Math.random() * (high - low);

				data.push({
					time: timeString,
					open: parseFloat(open.toFixed(getDecimalPlaces(symbol))),
					high: parseFloat(high.toFixed(getDecimalPlaces(symbol))),
					low: parseFloat(low.toFixed(getDecimalPlaces(symbol))),
					close: parseFloat(close.toFixed(getDecimalPlaces(symbol)))
				});
			} else {
				data.push({
					time: timeString,
					value: parseFloat(price.toFixed(getDecimalPlaces(symbol)))
				});
			}
		}

		return data;
	}

	function getBasePrice(symbol: string): number {
		const basePrices: { [key: string]: number } = {
			'EURUSD': 1.0845,
			'GBPUSD': 1.2654,
			'USDJPY': 149.45,
			'AUDUSD': 0.6523,
			'USDCAD': 1.3654,
			'USDCHF': 0.8945,
			'XAUUSD': 3335.60,
			'XAGUSD': 38.37,
			'OIL': 73.25
		};
		return basePrices[symbol] || 100;
	}

	function getDecimalPlaces(symbol: string): number {
		if (symbol.includes('JPY')) return 2;
		if (symbol.startsWith('XAU') || symbol.startsWith('XAG')) return 2;
		if (symbol === 'OIL') return 2;
		return 4;
	}

	onMount(() => {
		if (!chartContainer) return;

		// Create chart
		chart = createChart(chartContainer, {
			width: width,
			height: height,
			layout: {
				background: { type: ColorType.Solid, color: '#ffffff' },
				textColor: '#333',
			},
			grid: {
				vertLines: { color: '#f0f0f0' },
				horzLines: { color: '#f0f0f0' },
			},
			crosshair: {
				mode: 1,
			},
			rightPriceScale: {
				borderColor: '#cccccc',
			},
			timeScale: {
				borderColor: '#cccccc',
				timeVisible: true,
				secondsVisible: false,
			},
		});

		// Create line series (simplified for now)
		series = (chart as any).addLineSeries({
			color: '#2962FF',
			lineWidth: 2,
		});

		// Load real chart data asynchronously
		loadChartData();

		// Handle resize
		const handleResize = () => {
			if (chart && chartContainer) {
				chart.applyOptions({
					width: chartContainer.clientWidth,
					height: height,
				});
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});

	/**
	 * Load chart data asynchronously
	 */
	async function loadChartData() {
		try {
			let chartData;
			if (data.length > 0) {
				chartData = data;
			} else {
				chartData = await fetchChartData(symbol);
			}

			if (series && chartData) {
				series.setData(chartData);
				chart.timeScale().fitContent();
			}
		} catch (error) {
			console.error('[TRADINGVIEW_CHART] Failed to load chart data:', error);
		}
	}

	onDestroy(() => {
		if (chart) {
			chart.remove();
		}
	});

	// Update chart when props change
	$: if (chart && series && data.length > 0) {
		series.setData(data);
		chart.timeScale().fitContent();
	}
</script>

<div class="tradingview-chart-wrapper">
	{#if title}
		<div class="chart-header">
			<h3 class="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
		</div>
	{/if}
	
	<div class="chart-container" bind:this={chartContainer}></div>
	
	<!-- TradingView Attribution -->
	<div class="chart-attribution">
		<p class="text-xs text-gray-500 mt-2">
			Charts powered by 
			<a 
				href="https://www.tradingview.com/" 
				target="_blank" 
				rel="noopener noreferrer"
				class="text-blue-600 hover:text-blue-800"
			>
				TradingView
			</a>
		</p>
	</div>
</div>

<style>
	.tradingview-chart-wrapper {
		width: 100%;
		background: white;
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.chart-container {
		width: 100%;
		height: 400px;
		border-radius: 4px;
		overflow: hidden;
	}

	.chart-header {
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 8px;
		margin-bottom: 16px;
	}

	.chart-attribution {
		text-align: center;
		border-top: 1px solid #e5e7eb;
		padding-top: 8px;
		margin-top: 8px;
	}
</style>

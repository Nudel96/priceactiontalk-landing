<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createChart, type IChartApi, type ISeriesApi, ColorType } from 'lightweight-charts';

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

	// Generate sample data for demonstration
	function generateSampleData(symbol: string) {
		const basePrice = symbol.includes('JPY') ? 150 : 1.0850;
		const data = [];
		const now = new Date();
		
		for (let i = 100; i >= 0; i--) {
			const time = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
			const timeString = time.toISOString().split('T')[0];
			
			// Generate realistic price movement
			const randomChange = (Math.random() - 0.5) * 0.02;
			const price = basePrice * (1 + randomChange * (i / 100));
			
			if (chartType === 'candlestick') {
				const open = price;
				const high = price * (1 + Math.random() * 0.01);
				const low = price * (1 - Math.random() * 0.01);
				const close = low + Math.random() * (high - low);
				
				data.push({
					time: timeString,
					open: parseFloat(open.toFixed(symbol.includes('JPY') ? 2 : 4)),
					high: parseFloat(high.toFixed(symbol.includes('JPY') ? 2 : 4)),
					low: parseFloat(low.toFixed(symbol.includes('JPY') ? 2 : 4)),
					close: parseFloat(close.toFixed(symbol.includes('JPY') ? 2 : 4))
				});
			} else {
				data.push({
					time: timeString,
					value: parseFloat(price.toFixed(symbol.includes('JPY') ? 2 : 4))
				});
			}
		}
		
		return data;
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

		// Create series based on chart type
		if (chartType === 'candlestick') {
			series = chart.addCandlestickSeries({
				upColor: '#26a69a',
				downColor: '#ef5350',
				borderVisible: false,
				wickUpColor: '#26a69a',
				wickDownColor: '#ef5350',
			});
		} else if (chartType === 'area') {
			series = chart.addAreaSeries({
				lineColor: '#2962FF',
				topColor: '#2962FF',
				bottomColor: 'rgba(41, 98, 255, 0.28)',
			});
		} else {
			series = chart.addLineSeries({
				color: '#2962FF',
				lineWidth: 2,
			});
		}

		// Use provided data or generate sample data
		const chartData = data.length > 0 ? data : generateSampleData(symbol);
		series.setData(chartData);

		// Fit content
		chart.timeScale().fitContent();

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

	onDestroy(() => {
		if (chart) {
			chart.remove();
		}
	});

	// Update chart when props change
	$: if (chart && series) {
		const chartData = data.length > 0 ? data : generateSampleData(symbol);
		series.setData(chartData);
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

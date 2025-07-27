<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchFCSForexRates, getRealForexRatesEnhanced } from '$lib/services/economicDataService';

	let fcsData = {};
	let enhancedData = {};
	let isLoading = false;
	let error = '';
	let logs: string[] = [];

	function addLog(message: string) {
		logs = [...logs, `${new Date().toLocaleTimeString()}: ${message}`];
		console.log(message);
	}

	async function testFCSAPI() {
		isLoading = true;
		error = '';
		logs = [];
		
		try {
			addLog('🚀 Starting FCS API test...');
			
			// Test direct FCS API call
			addLog('📡 Testing direct FCS API call...');
			fcsData = await fetchFCSForexRates();
			addLog(`✅ FCS API returned ${Object.keys(fcsData).length} pairs`);
			
			// Test enhanced function
			addLog('🔄 Testing enhanced forex rates function...');
			enhancedData = await getRealForexRatesEnhanced();
			addLog(`✅ Enhanced function returned ${Object.keys(enhancedData).length} pairs`);
			
			// Compare prices with expected values
			const expectedPrices = {
				'EUR/USD': 1.17408,
				'GBP/USD': 1.34364,
				'USD/JPY': 147.650
			};
			
			addLog('📊 Comparing prices with TradingView...');
			Object.entries(expectedPrices).forEach(([pair, expectedPrice]) => {
				const fcsPrice = fcsData[pair]?.current_price;
				const enhancedPrice = enhancedData[pair]?.current_price;
				
				if (fcsPrice) {
					const diff = Math.abs(fcsPrice - expectedPrice);
					addLog(`${pair}: FCS=${fcsPrice}, Expected=${expectedPrice}, Diff=${diff.toFixed(5)}`);
				}
				
				if (enhancedPrice) {
					const diff = Math.abs(enhancedPrice - expectedPrice);
					addLog(`${pair}: Enhanced=${enhancedPrice}, Expected=${expectedPrice}, Diff=${diff.toFixed(5)}`);
				}
			});
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			addLog(`❌ Error: ${error}`);
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		testFCSAPI();
	});
</script>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-6">FCS API Test Page</h1>
	
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Controls -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="text-xl font-semibold mb-4">Test Controls</h2>
			
			<button 
				on:click={testFCSAPI}
				disabled={isLoading}
				class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
			>
				{#if isLoading}
					🔄 Testing...
				{:else}
					🚀 Run FCS API Test
				{/if}
			</button>
			
			{#if error}
				<div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
					<h3 class="text-red-800 font-semibold">Error:</h3>
					<p class="text-red-700">{error}</p>
				</div>
			{/if}
			
			<!-- Logs -->
			<div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
				<h3 class="font-semibold mb-2">Test Logs:</h3>
				{#each logs as log}
					<div class="text-sm font-mono text-gray-700 mb-1">{log}</div>
				{/each}
			</div>
		</div>
		
		<!-- FCS Data -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="text-xl font-semibold mb-4">FCS API Data ({Object.keys(fcsData).length} pairs)</h2>
			
			{#if Object.keys(fcsData).length > 0}
				<div class="space-y-3">
					{#each Object.entries(fcsData).slice(0, 5) as [symbol, data]}
						<div class="border border-gray-200 rounded-lg p-3">
							<div class="flex justify-between items-center">
								<span class="font-semibold">{symbol}</span>
								<span class="text-lg font-mono">{data.current_price}</span>
							</div>
							<div class="text-sm text-gray-600 mt-1">
								Change: {data.change_percent}% | Source: {data.source}
								{#if data.bid && data.ask}
									| Bid: {data.bid} | Ask: {data.ask}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">No FCS data available</p>
			{/if}
		</div>
		
		<!-- Enhanced Data -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="text-xl font-semibold mb-4">Enhanced Data ({Object.keys(enhancedData).length} pairs)</h2>
			
			{#if Object.keys(enhancedData).length > 0}
				<div class="space-y-3">
					{#each Object.entries(enhancedData).slice(0, 5) as [symbol, data]}
						<div class="border border-gray-200 rounded-lg p-3">
							<div class="flex justify-between items-center">
								<span class="font-semibold">{symbol}</span>
								<span class="text-lg font-mono">{data.current_price}</span>
							</div>
							<div class="text-sm text-gray-600 mt-1">
								Change: {data.change_percent}% | Source: {data.source}
								{#if data.bid && data.ask}
									| Bid: {data.bid} | Ask: {data.ask}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">No enhanced data available</p>
			{/if}
		</div>
		
		<!-- Raw Data -->
		<div class="bg-white rounded-lg shadow-lg p-6">
			<h2 class="text-xl font-semibold mb-4">Raw Data Comparison</h2>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<h3 class="font-semibold mb-2">FCS Raw:</h3>
					<pre class="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">{JSON.stringify(fcsData, null, 2)}</pre>
				</div>
				<div>
					<h3 class="font-semibold mb-2">Enhanced Raw:</h3>
					<pre class="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">{JSON.stringify(enhancedData, null, 2)}</pre>
				</div>
			</div>
		</div>
	</div>
</div>

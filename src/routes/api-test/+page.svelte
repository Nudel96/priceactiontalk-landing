<script lang="ts">
	import { onMount } from 'svelte';
	
	let apiStatus = 'Not tested';
	let apiResult = null;
	let isLoading = false;

	async function testAPIFetch() {
		isLoading = true;
		apiStatus = 'Testing...';
		
		try {
			const response = await fetch('/api/fetchEconomicData');
			const result = await response.json();
			
			apiResult = result;
			
			if (result.success) {
				apiStatus = '✅ Success';
			} else {
				apiStatus = '❌ Failed';
			}
		} catch (error) {
			apiStatus = '❌ Error';
			apiResult = { error: error.message };
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="min-h-screen bg-gray-50 p-8">
	<div class="max-w-4xl mx-auto">
		<h1 class="text-3xl font-bold text-gray-900 mb-8">API Integration Test</h1>
		
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Economic Data API Test</h2>
			
			<div class="flex items-center gap-4 mb-4">
				<button
					on:click={testAPIFetch}
					disabled={isLoading}
					class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isLoading ? 'Testing...' : 'Test API Fetch'}
				</button>
				
				<span class="text-lg font-medium">Status: {apiStatus}</span>
			</div>
			
			<div class="text-sm text-gray-600 mb-4">
				<p>This will test the following APIs:</p>
				<ul class="list-disc list-inside mt-2">
					<li>Finnhub - General economic news</li>
					<li>FRED - US CPI inflation data</li>
					<li>MarketAux - Currency and central bank news</li>
				</ul>
			</div>
		</div>
		
		{#if apiResult}
			<div class="bg-white rounded-lg shadow-md p-6">
				<h3 class="text-lg font-semibold mb-4">API Response</h3>
				<pre class="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">{JSON.stringify(apiResult, null, 2)}</pre>
			</div>
		{/if}
		
		<div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
			<h3 class="text-lg font-semibold text-yellow-800 mb-2">Setup Instructions</h3>
			<div class="text-yellow-700 text-sm space-y-2">
				<p><strong>1. Create .env file:</strong> Copy .env.example to .env and add your API keys</p>
				<p><strong>2. API Keys needed:</strong></p>
				<ul class="list-disc list-inside ml-4">
					<li>FINNHUB_API_KEY - Get from <a href="https://finnhub.io/register" target="_blank" class="text-blue-600 hover:underline">finnhub.io</a></li>
					<li>FRED_API_KEY - Get from <a href="https://fred.stlouisfed.org/docs/api/api_key.html" target="_blank" class="text-blue-600 hover:underline">FRED</a></li>
					<li>MARKETAUX_API_KEY - Get from <a href="https://www.marketaux.com/account/dashboard" target="_blank" class="text-blue-600 hover:underline">MarketAux</a></li>
				</ul>
				<p><strong>3. Rate Limiting:</strong> APIs can only be called every 30 minutes to prevent excessive usage</p>
			</div>
		</div>
		
		<div class="mt-4 text-center">
			<a href="/" class="text-blue-600 hover:text-blue-800 hover:underline">← Back to Dashboard</a>
		</div>
	</div>
</div>

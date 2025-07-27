<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Play } from '@lucide/svelte';
	import { DataAccuracyValidator } from '$lib/services/testing/data-accuracy-validator';
	import { AdvancedEconomicService } from '$lib/services/advanced-economic-service';

	let validator: DataAccuracyValidator;
	let economicService: AdvancedEconomicService;
	let isRunning = false;
	let validationReport: any = null;
	let lastValidation: string | null = null;

	onMount(async () => {
		validator = new DataAccuracyValidator();
		economicService = AdvancedEconomicService.getInstance();
		
		// Lade letzten Validierungsbericht
		const saved = localStorage.getItem('last_validation_report');
		if (saved) {
			try {
				validationReport = JSON.parse(saved);
				lastValidation = validationReport.timestamp;
			} catch (error) {
				console.error('Error loading saved validation report:', error);
			}
		}
	});

	async function runValidation() {
		if (isRunning) return;
		
		isRunning = true;
		try {
			console.log('🔍 Starting data validation...');
			
			// Stelle sicher, dass der Service läuft
			if (!economicService.isReady()) {
				await economicService.initialize();
			}

			// Führe Validierung durch
			validationReport = await validator.validateAllAssets();
			lastValidation = validationReport.timestamp;
			
			// Speichere Bericht
			localStorage.setItem('last_validation_report', JSON.stringify(validationReport));
			
			console.log('✅ Validation completed');
		} catch (error) {
			console.error('❌ Validation failed:', error);
		} finally {
			isRunning = false;
		}
	}

	function getStatusIcon(isAccurate: boolean) {
		return isAccurate ? CheckCircle : XCircle;
	}

	function getStatusColor(isAccurate: boolean) {
		return isAccurate ? 'text-green-600' : 'text-red-600';
	}

	function formatTimestamp(timestamp: string) {
		return new Date(timestamp).toLocaleString();
	}

	function getAssetDisplayName(asset: string) {
		const names: Record<string, string> = {
			'USD': 'US Dollar',
			'EUR': 'Euro',
			'GBP': 'British Pound',
			'JPY': 'Japanese Yen',
			'AUD': 'Australian Dollar',
			'CAD': 'Canadian Dollar',
			'CHF': 'Swiss Franc',
			'CNY': 'Chinese Yuan',
			'NZD': 'New Zealand Dollar',
			'XAU': 'Gold',
			'XAG': 'Silver'
		};
		return names[asset] || asset;
	}

	function getIndicatorDisplayName(indicator: string) {
		const names: Record<string, string> = {
			'UNEMPLOYMENT': 'Unemployment Rate',
			'INFLATION_CPI': 'Inflation (CPI)',
			'GDP_GROWTH': 'GDP Growth',
			'INTEREST_RATE': 'Interest Rate',
			'PRECIOUS_METAL_PRICE': 'Market Price',
			'ASSET_SCORE': 'Asset Score'
		};
		return names[indicator] || indicator.replace(/_/g, ' ');
	}
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
	<!-- Header -->
	<div class="p-6 border-b border-gray-200">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<AlertTriangle class="w-6 h-6 text-orange-600" />
				<div>
					<h2 class="text-xl font-bold text-navy">Data Validation</h2>
					<p class="text-sm text-gray-600">Überprüfung der Datenqualität und -genauigkeit</p>
				</div>
			</div>
			
			<button
				on:click={runValidation}
				disabled={isRunning}
				class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
			>
				{#if isRunning}
					<RefreshCw class="w-4 h-4 animate-spin" />
					<span>Validating...</span>
				{:else}
					<Play class="w-4 h-4" />
					<span>Run Validation</span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="p-6">
		{#if validationReport}
			<!-- Summary -->
			<div class="mb-6">
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div class="bg-gray-50 rounded-lg p-4">
						<div class="text-2xl font-bold text-gray-900">{validationReport.totalAssets}</div>
						<div class="text-sm text-gray-600">Total Assets</div>
					</div>
					
					<div class="bg-green-50 rounded-lg p-4">
						<div class="text-2xl font-bold text-green-600">{validationReport.accurateAssets}</div>
						<div class="text-sm text-gray-600">Accurate</div>
					</div>
					
					<div class="bg-blue-50 rounded-lg p-4">
						<div class="text-2xl font-bold text-blue-600">{(validationReport.accuracyRate * 100).toFixed(1)}%</div>
						<div class="text-sm text-gray-600">Accuracy Rate</div>
					</div>
					
					<div class="bg-purple-50 rounded-lg p-4">
						<div class="text-2xl font-bold text-purple-600">{validationReport.criticalIssues.length}</div>
						<div class="text-sm text-gray-600">Critical Issues</div>
					</div>
				</div>
			</div>

			<!-- Critical Issues -->
			{#if validationReport.criticalIssues.length > 0}
				<div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<h3 class="font-semibold text-red-800 mb-2">🚨 Critical Issues</h3>
					<ul class="space-y-1">
						{#each validationReport.criticalIssues as issue}
							<li class="text-sm text-red-700">• {issue}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Recommendations -->
			{#if validationReport.recommendations.length > 0}
				<div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
					<h3 class="font-semibold text-yellow-800 mb-2">💡 Recommendations</h3>
					<ul class="space-y-1">
						{#each validationReport.recommendations as recommendation}
							<li class="text-sm text-yellow-700">• {recommendation}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Detailed Results -->
			<div class="space-y-4">
				<h3 class="text-lg font-semibold text-gray-900">Detailed Results</h3>
				
				<!-- Group by asset -->
				{#each Object.entries(validationReport.results.reduce((acc, result) => {
					if (!acc[result.asset]) acc[result.asset] = [];
					acc[result.asset].push(result);
					return acc;
				}, {})) as [asset, results]}
					<div class="border border-gray-200 rounded-lg overflow-hidden">
						<div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
							<h4 class="font-semibold text-gray-900">{getAssetDisplayName(asset)}</h4>
						</div>
						
						<div class="divide-y divide-gray-200">
							{#each results as result}
								<div class="p-4 flex items-center justify-between">
									<div class="flex items-center gap-3">
										<svelte:component 
											this={getStatusIcon(result.isAccurate)} 
											class="w-5 h-5 {getStatusColor(result.isAccurate)}" 
										/>
										<div>
											<div class="font-medium text-gray-900">
												{getIndicatorDisplayName(result.dataType)}
											</div>
											<div class="text-sm text-gray-600">
												Source: {result.source}
											</div>
										</div>
									</div>
									
									<div class="text-right">
										<div class="font-medium text-gray-900">
											{result.currentValue !== null ? result.currentValue.toFixed(2) : 'N/A'}
										</div>
										<div class="text-sm text-gray-600">
											Updated: {formatTimestamp(result.lastUpdated)}
										</div>
									</div>
								</div>
								
								{#if result.issues.length > 0}
									<div class="px-4 pb-4">
										<div class="bg-red-50 border border-red-200 rounded p-3">
											<div class="text-sm text-red-700">
												<strong>Issues:</strong> {result.issues.join(', ')}
											</div>
										</div>
									</div>
								{/if}
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<!-- Last Updated -->
			<div class="mt-6 pt-4 border-t border-gray-200 text-center">
				<p class="text-sm text-gray-500">
					Last validation: {formatTimestamp(validationReport.timestamp)}
				</p>
			</div>
		{:else}
			<!-- No validation data -->
			<div class="text-center py-12">
				<AlertTriangle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<h3 class="text-lg font-medium text-gray-900 mb-2">No Validation Data</h3>
				<p class="text-gray-600 mb-4">Run a validation to check data accuracy and quality.</p>
				<button
					on:click={runValidation}
					disabled={isRunning}
					class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
				>
					{#if isRunning}
						<RefreshCw class="w-4 h-4 animate-spin" />
						<span>Running Validation...</span>
					{:else}
						<Play class="w-4 h-4" />
						<span>Start Validation</span>
					{/if}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Custom animations */
	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}
	
	.animate-pulse {
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
</style>

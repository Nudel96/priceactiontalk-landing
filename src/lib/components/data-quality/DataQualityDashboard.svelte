<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp } from '@lucide/svelte';
	import { getDataFreshnessMonitor } from '$lib/services/data-validation/data-freshness-monitor';
	import type { DataFreshnessCheck } from '$lib/services/data-validation/data-freshness-monitor';

	// Props
	export let showHeader: boolean = true;
	export let compact: boolean = false;

	// State
	let monitor = getDataFreshnessMonitor();
	let validationStatus: any = null;
	let alerts: any[] = [];
	let isLoading = true;
	let updateInterval: NodeJS.Timeout | null = null;

	onMount(() => {
		updateStatus();
		// Update every 30 seconds
		updateInterval = setInterval(updateStatus, 30000);
	});

	onDestroy(() => {
		if (updateInterval) {
			clearInterval(updateInterval);
		}
	});

	function updateStatus() {
		try {
			validationStatus = monitor.getValidationStatus();
			alerts = monitor.generateAlerts();
			isLoading = false;
		} catch (error) {
			console.error('Error updating data quality status:', error);
			isLoading = false;
		}
	}

	function getHealthColor(health: string): string {
		switch (health) {
			case 'HEALTHY': return 'text-green-600';
			case 'WARNING': return 'text-yellow-600';
			case 'CRITICAL': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	function getHealthIcon(health: string) {
		switch (health) {
			case 'HEALTHY': return CheckCircle;
			case 'WARNING': return AlertTriangle;
			case 'CRITICAL': return XCircle;
			default: return Clock;
		}
	}

	function getAlertColor(level: string): string {
		switch (level) {
			case 'INFO': return 'bg-blue-50 border-blue-200 text-blue-800';
			case 'WARNING': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'CRITICAL': return 'bg-red-50 border-red-200 text-red-800';
			default: return 'bg-gray-50 border-gray-200 text-gray-800';
		}
	}

	function formatTimestamp(timestamp: string): string {
		return new Date(timestamp).toLocaleTimeString();
	}
</script>

{#if showHeader}
	<div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
		<div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
			<div class="flex items-center gap-3">
				<TrendingUp class="w-6 h-6 text-white" />
				<h3 class="text-xl font-bold text-white">Data Quality Monitor</h3>
			</div>
		</div>

		<div class="p-6">
			{#if isLoading}
				<div class="text-center py-8">
					<div class="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
					<div class="text-gray-600">Loading data quality status...</div>
				</div>
			{:else if validationStatus}
				<!-- Overall Health Status -->
				<div class="mb-6">
					<div class="flex items-center gap-3 mb-4">
						{@const HealthIcon = getHealthIcon(validationStatus.overallHealth)}
						<HealthIcon class="w-8 h-8 {getHealthColor(validationStatus.overallHealth)}" />
						<div>
							<h4 class="text-lg font-semibold {getHealthColor(validationStatus.overallHealth)}">
								System Health: {validationStatus.overallHealth}
							</h4>
							<p class="text-sm text-gray-600">
								{validationStatus.freshAssets}/{validationStatus.totalAssets} assets fresh, 
								{validationStatus.accurateAssets}/{validationStatus.totalAssets} accurate
							</p>
						</div>
					</div>

					<!-- Health Metrics -->
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div class="bg-gray-50 rounded-lg p-4">
							<div class="text-2xl font-bold text-gray-900">{validationStatus.totalAssets}</div>
							<div class="text-sm text-gray-600">Total Assets Monitored</div>
						</div>
						<div class="bg-green-50 rounded-lg p-4">
							<div class="text-2xl font-bold text-green-600">{validationStatus.freshAssets}</div>
							<div class="text-sm text-gray-600">Fresh Data Sources</div>
						</div>
						<div class="bg-blue-50 rounded-lg p-4">
							<div class="text-2xl font-bold text-blue-600">{validationStatus.accurateAssets}</div>
							<div class="text-sm text-gray-600">Accurate Prices</div>
						</div>
					</div>
				</div>

				<!-- Critical Issues -->
				{#if validationStatus.criticalIssues.length > 0}
					<div class="mb-6">
						<h5 class="text-lg font-semibold text-red-600 mb-3">Critical Issues</h5>
						<div class="space-y-2">
							{#each validationStatus.criticalIssues as issue}
								<div class="bg-red-50 border border-red-200 rounded-lg p-3">
									<div class="flex items-center gap-2 mb-1">
										<XCircle class="w-4 h-4 text-red-600" />
										<span class="font-medium text-red-800">{issue.asset}</span>
									</div>
									<div class="text-sm text-red-700">
										{issue.validationErrors.join(', ')}
									</div>
									<div class="text-xs text-red-600 mt-1">
										Last updated: {formatTimestamp(issue.lastUpdated)}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Recent Alerts -->
				{#if alerts.length > 0}
					<div class="mb-6">
						<h5 class="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h5>
						<div class="space-y-2">
							{#each alerts.slice(0, 5) as alert}
								<div class="border rounded-lg p-3 {getAlertColor(alert.level)}">
									<div class="flex items-center gap-2 mb-1">
										{#if alert.level === 'CRITICAL'}
											<XCircle class="w-4 h-4" />
										{:else if alert.level === 'WARNING'}
											<AlertTriangle class="w-4 h-4" />
										{:else}
											<CheckCircle class="w-4 h-4" />
										{/if}
										<span class="font-medium">{alert.level}</span>
									</div>
									<div class="text-sm">{alert.message}</div>
									<div class="text-xs mt-1 opacity-75">
										{formatTimestamp(alert.timestamp)}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Last Update -->
				<div class="text-center pt-4 border-t border-gray-200">
					<p class="text-sm text-gray-500">
						Last updated: {formatTimestamp(new Date().toISOString())}
					</p>
				</div>
			{:else}
				<div class="text-center py-8">
					<div class="text-gray-600">No validation data available</div>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<!-- Compact version -->
	<div class="bg-white rounded-lg border border-gray-200 p-4">
		{#if isLoading}
			<div class="text-center">
				<div class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
				<div class="text-xs text-gray-600">Loading...</div>
			</div>
		{:else if validationStatus}
			<div class="flex items-center gap-2 mb-2">
				{@const HealthIcon = getHealthIcon(validationStatus.overallHealth)}
				<HealthIcon class="w-4 h-4 {getHealthColor(validationStatus.overallHealth)}" />
				<span class="text-sm font-medium {getHealthColor(validationStatus.overallHealth)}">
					{validationStatus.overallHealth}
				</span>
			</div>
			<div class="text-xs text-gray-600">
				{validationStatus.freshAssets}/{validationStatus.totalAssets} fresh, 
				{validationStatus.accurateAssets}/{validationStatus.totalAssets} accurate
			</div>
			{#if validationStatus.criticalIssues.length > 0}
				<div class="mt-2 text-xs text-red-600">
					{validationStatus.criticalIssues.length} critical issue(s)
				</div>
			{/if}
		{:else}
			<div class="text-xs text-gray-600">No data</div>
		{/if}
	</div>
{/if}

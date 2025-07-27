<script lang="ts">
	import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from '@lucide/svelte';
	import type { AssetScore } from '$lib/types/advanced-economic';

	export let score: AssetScore;
	export let showDetails: boolean = false;
	export let compact: boolean = false;

	$: signalColor = getSignalColor(score.signal);
	$: signalIcon = getSignalIcon(score.signal);
	$: confidenceLevel = getConfidenceLevel(score.confidence);

	function getSignalColor(signal: string): string {
		switch (signal) {
			case 'STRONG_BUY': return 'text-green-600 bg-green-50 border-green-200';
			case 'BUY': return 'text-green-500 bg-green-50 border-green-100';
			case 'HOLD': return 'text-gray-600 bg-gray-50 border-gray-200';
			case 'SELL': return 'text-red-500 bg-red-50 border-red-100';
			case 'STRONG_SELL': return 'text-red-600 bg-red-50 border-red-200';
			default: return 'text-gray-600 bg-gray-50 border-gray-200';
		}
	}

	function getSignalIcon(signal: string) {
		switch (signal) {
			case 'STRONG_BUY':
			case 'BUY':
				return TrendingUp;
			case 'STRONG_SELL':
			case 'SELL':
				return TrendingDown;
			default:
				return Minus;
		}
	}

	function getConfidenceLevel(confidence: number): { level: string; color: string } {
		if (confidence >= 0.8) return { level: 'High', color: 'text-green-600' };
		if (confidence >= 0.6) return { level: 'Medium', color: 'text-yellow-600' };
		return { level: 'Low', color: 'text-red-600' };
	}

	function formatScore(value: number): string {
		return value >= 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
	}

	function getScoreColor(value: number): string {
		if (value > 2) return 'text-green-600';
		if (value > 0) return 'text-green-500';
		if (value < -2) return 'text-red-600';
		if (value < 0) return 'text-red-500';
		return 'text-gray-600';
	}
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
	<!-- Header -->
	<div class="p-4 border-b border-gray-100">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
					{score.asset}
				</div>
				<div>
					<h3 class="font-semibold text-gray-900">{score.asset}</h3>
					<p class="text-xs text-gray-500">Last updated: {new Date(score.last_updated).toLocaleTimeString()}</p>
				</div>
			</div>
			
			<!-- Signal Badge -->
			<div class="flex items-center gap-2">
				<div class="px-3 py-1 rounded-full border {signalColor} flex items-center gap-1">
					<svelte:component this={signalIcon} class="w-3 h-3" />
					<span class="text-xs font-medium">{score.signal.replace('_', ' ')}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Score Overview -->
	<div class="p-4">
		<div class="grid grid-cols-2 gap-4 mb-4">
			<!-- Total Score -->
			<div class="text-center">
				<div class="text-2xl font-bold {getScoreColor(score.total_score)}">
					{formatScore(score.total_score)}
				</div>
				<div class="text-xs text-gray-500">Total Score</div>
			</div>
			
			<!-- Confidence -->
			<div class="text-center">
				<div class="text-2xl font-bold {confidenceLevel.color}">
					{Math.round(score.confidence * 100)}%
				</div>
				<div class="text-xs text-gray-500">Confidence</div>
			</div>
		</div>

		<!-- Component Scores -->
		{#if !compact}
			<div class="space-y-2 mb-4">
				<div class="flex justify-between items-center">
					<span class="text-sm text-gray-600">Economic Data</span>
					<span class="text-sm font-medium {getScoreColor(score.economic_score)}">
						{formatScore(score.economic_score)}/5
					</span>
				</div>
				
				<div class="flex justify-between items-center">
					<span class="text-sm text-gray-600">Sentiment</span>
					<span class="text-sm font-medium {getScoreColor(score.sentiment_score)}">
						{formatScore(score.sentiment_score)}/3
					</span>
				</div>
				
				<div class="flex justify-between items-center">
					<span class="text-sm text-gray-600">COT Positioning</span>
					<span class="text-sm font-medium {getScoreColor(score.cot_score)}">
						{formatScore(score.cot_score)}/3
					</span>
				</div>
				
				<div class="flex justify-between items-center">
					<span class="text-sm text-gray-600">Central Bank</span>
					<span class="text-sm font-medium {getScoreColor(score.central_bank_score)}">
						{formatScore(score.central_bank_score)}/3
					</span>
				</div>
			</div>
		{/if}

		<!-- Progress Bar -->
		<div class="w-full bg-gray-200 rounded-full h-2 mb-4">
			<div 
				class="h-2 rounded-full transition-all duration-500 {score.normalized_score > 0 ? 'bg-green-500' : 'bg-red-500'}"
				style="width: {Math.abs(score.normalized_score) * 100}%"
			></div>
		</div>

		<!-- Key Factors -->
		{#if showDetails}
			<div class="space-y-3">
				{#if score.bullish_factors.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-2">
							<CheckCircle class="w-4 h-4 text-green-600" />
							<span class="text-sm font-medium text-green-700">Bullish Factors</span>
						</div>
						<ul class="space-y-1">
							{#each score.bullish_factors.slice(0, 3) as factor}
								<li class="text-xs text-gray-600 pl-6">• {factor}</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if score.bearish_factors.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-2">
							<AlertTriangle class="w-4 h-4 text-red-600" />
							<span class="text-sm font-medium text-red-700">Bearish Factors</span>
						</div>
						<ul class="space-y-1">
							{#each score.bearish_factors.slice(0, 3) as factor}
								<li class="text-xs text-gray-600 pl-6">• {factor}</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Toggle Details Button -->
		{#if !compact}
			<button 
				class="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
				on:click={() => showDetails = !showDetails}
			>
				{showDetails ? 'Hide Details' : 'Show Details'}
			</button>
		{/if}
	</div>
</div>

<style>
	/* Custom animations */
	@keyframes scoreUpdate {
		0% { transform: scale(1); }
		50% { transform: scale(1.05); }
		100% { transform: scale(1); }
	}

	.score-updated {
		animation: scoreUpdate 0.3s ease-in-out;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.grid-cols-2 {
			grid-template-columns: 1fr;
		}
	}
</style>

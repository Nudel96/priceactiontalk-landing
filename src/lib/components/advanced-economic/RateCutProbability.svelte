<script lang="ts">
	import { Calendar, TrendingDown, TrendingUp, Minus, Info } from '@lucide/svelte';
	import type { AssetCode } from '$lib/types/advanced-economic';

	interface RateCutProbability {
		asset: AssetCode;
		current_rate: number;
		next_meeting_date: string;
		cut_probability: number;
		hold_probability: number;
		hike_probability: number;
		expected_change: number;
		confidence: number;
		key_factors: string[];
		last_updated: string;
	}

	export let probabilities: RateCutProbability[] = [];
	export let showDetails: boolean = false;
	export let selectedAsset: AssetCode | null = null;

	$: sortedProbabilities = probabilities.sort((a, b) => b.cut_probability - a.cut_probability);
	$: selectedProbability = selectedAsset ? probabilities.find(p => p.asset === selectedAsset) : null;

	function formatRate(rate: number): string {
		return `${rate.toFixed(2)}%`;
	}

	function formatProbability(prob: number): string {
		return `${Math.round(prob * 100)}%`;
	}

	function formatExpectedChange(change: number): string {
		const bps = Math.round(change * 10000);
		return bps >= 0 ? `+${bps}bps` : `${bps}bps`;
	}

	function getProbabilityColor(prob: number): string {
		if (prob > 0.6) return 'text-red-600 bg-red-50';
		if (prob > 0.4) return 'text-yellow-600 bg-yellow-50';
		return 'text-green-600 bg-green-50';
	}

	function getConfidenceColor(confidence: number): string {
		if (confidence >= 0.8) return 'text-green-600';
		if (confidence >= 0.6) return 'text-yellow-600';
		return 'text-red-600';
	}

	function getCentralBankName(asset: AssetCode): string {
		const banks: Record<AssetCode, string> = {
			USD: 'Federal Reserve',
			EUR: 'European Central Bank',
			GBP: 'Bank of England',
			JPY: 'Bank of Japan',
			AUD: 'Reserve Bank of Australia',
			CAD: 'Bank of Canada',
			CHF: 'Swiss National Bank',
			CNY: 'People\'s Bank of China',
			NZD: 'Reserve Bank of New Zealand',
			XAU: 'N/A',
			XAG: 'N/A'
		};
		return banks[asset] || 'Unknown';
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="bg-white rounded-xl border border-gray-200 shadow-sm">
	<!-- Header -->
	<div class="p-6 border-b border-gray-200">
		<div class="flex items-center gap-3">
			<Calendar class="w-6 h-6 text-purple-600" />
			<div>
				<h2 class="text-xl font-bold text-navy">Rate Cut Probabilities</h2>
				<p class="text-sm text-gray-600">Central bank policy expectations</p>
			</div>
		</div>
	</div>

	<!-- Asset Selector (if multiple assets) -->
	{#if probabilities.length > 1}
		<div class="p-4 border-b border-gray-100">
			<div class="flex flex-wrap gap-2">
				<button
					class="px-3 py-1 text-sm rounded-lg transition-colors {selectedAsset === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
					on:click={() => selectedAsset = null}
				>
					All Assets
				</button>
				{#each sortedProbabilities as prob}
					<button
						class="px-3 py-1 text-sm rounded-lg transition-colors {selectedAsset === prob.asset ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						on:click={() => selectedAsset = prob.asset}
					>
						{prob.asset}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Content -->
	<div class="p-6">
		{#if selectedProbability}
			<!-- Single Asset Detail View -->
			<div class="space-y-6">
				<!-- Asset Header -->
				<div class="flex items-center justify-between">
					<div>
						<h3 class="text-lg font-semibold text-gray-900">{selectedProbability.asset}</h3>
						<p class="text-sm text-gray-600">{getCentralBankName(selectedProbability.asset)}</p>
					</div>
					<div class="text-right">
						<div class="text-2xl font-bold text-gray-900">
							{formatRate(selectedProbability.current_rate)}
						</div>
						<div class="text-sm text-gray-500">Current Rate</div>
					</div>
				</div>

				<!-- Probability Bars -->
				<div class="space-y-3">
					<!-- Rate Cut -->
					<div>
						<div class="flex justify-between items-center mb-1">
							<span class="text-sm font-medium text-gray-700">Rate Cut</span>
							<span class="text-sm font-bold text-red-600">
								{formatProbability(selectedProbability.cut_probability)}
							</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div 
								class="bg-red-500 h-2 rounded-full transition-all duration-500"
								style="width: {selectedProbability.cut_probability * 100}%"
							></div>
						</div>
					</div>

					<!-- Hold -->
					<div>
						<div class="flex justify-between items-center mb-1">
							<span class="text-sm font-medium text-gray-700">Hold</span>
							<span class="text-sm font-bold text-gray-600">
								{formatProbability(selectedProbability.hold_probability)}
							</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div 
								class="bg-gray-500 h-2 rounded-full transition-all duration-500"
								style="width: {selectedProbability.hold_probability * 100}%"
							></div>
						</div>
					</div>

					<!-- Rate Hike -->
					<div>
						<div class="flex justify-between items-center mb-1">
							<span class="text-sm font-medium text-gray-700">Rate Hike</span>
							<span class="text-sm font-bold text-green-600">
								{formatProbability(selectedProbability.hike_probability)}
							</span>
						</div>
						<div class="w-full bg-gray-200 rounded-full h-2">
							<div 
								class="bg-green-500 h-2 rounded-full transition-all duration-500"
								style="width: {selectedProbability.hike_probability * 100}%"
							></div>
						</div>
					</div>
				</div>

				<!-- Meeting Info -->
				<div class="bg-gray-50 rounded-lg p-4">
					<div class="grid grid-cols-2 gap-4">
						<div>
							<div class="text-sm text-gray-600">Next Meeting</div>
							<div class="font-semibold text-gray-900">
								{formatDate(selectedProbability.next_meeting_date)}
							</div>
						</div>
						<div>
							<div class="text-sm text-gray-600">Expected Change</div>
							<div class="font-semibold {selectedProbability.expected_change >= 0 ? 'text-green-600' : 'text-red-600'}">
								{formatExpectedChange(selectedProbability.expected_change)}
							</div>
						</div>
					</div>
				</div>

				<!-- Confidence -->
				<div class="flex items-center justify-between">
					<span class="text-sm text-gray-600">Analysis Confidence</span>
					<span class="text-sm font-bold {getConfidenceColor(selectedProbability.confidence)}">
						{Math.round(selectedProbability.confidence * 100)}%
					</span>
				</div>

				<!-- Key Factors -->
				{#if selectedProbability.key_factors.length > 0}
					<div>
						<div class="flex items-center gap-2 mb-3">
							<Info class="w-4 h-4 text-blue-600" />
							<span class="text-sm font-medium text-gray-700">Key Factors</span>
						</div>
						<ul class="space-y-2">
							{#each selectedProbability.key_factors as factor}
								<li class="text-sm text-gray-600 flex items-start gap-2">
									<span class="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
									{factor}
								</li>
							{/each}
						</ul>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Overview Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each sortedProbabilities as prob}
					<div 
						class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
						on:click={() => selectedAsset = prob.asset}
						role="button"
						tabindex="0"
						on:keydown={(e) => e.key === 'Enter' && (selectedAsset = prob.asset)}
					>
						<!-- Asset Header -->
						<div class="flex items-center justify-between mb-3">
							<div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
								{prob.asset}
							</div>
							<div class="text-right">
								<div class="text-lg font-bold text-gray-900">
									{formatRate(prob.current_rate)}
								</div>
								<div class="text-xs text-gray-500">Current</div>
							</div>
						</div>

						<!-- Most Likely Action -->
						<div class="mb-3">
							{#if prob.cut_probability > prob.hold_probability && prob.cut_probability > prob.hike_probability}
								<div class="flex items-center gap-2 text-red-600">
									<TrendingDown class="w-4 h-4" />
									<span class="text-sm font-medium">Cut Likely</span>
									<span class="text-sm">({formatProbability(prob.cut_probability)})</span>
								</div>
							{:else if prob.hike_probability > prob.hold_probability}
								<div class="flex items-center gap-2 text-green-600">
									<TrendingUp class="w-4 h-4" />
									<span class="text-sm font-medium">Hike Likely</span>
									<span class="text-sm">({formatProbability(prob.hike_probability)})</span>
								</div>
							{:else}
								<div class="flex items-center gap-2 text-gray-600">
									<Minus class="w-4 h-4" />
									<span class="text-sm font-medium">Hold Likely</span>
									<span class="text-sm">({formatProbability(prob.hold_probability)})</span>
								</div>
							{/if}
						</div>

						<!-- Next Meeting -->
						<div class="text-xs text-gray-500">
							Next: {formatDate(prob.next_meeting_date)}
						</div>

						<!-- Confidence Indicator -->
						<div class="mt-2 flex items-center gap-2">
							<div class="flex-1 bg-gray-200 rounded-full h-1">
								<div 
									class="h-1 rounded-full {getConfidenceColor(prob.confidence).includes('green') ? 'bg-green-500' : getConfidenceColor(prob.confidence).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}"
									style="width: {prob.confidence * 100}%"
								></div>
							</div>
							<span class="text-xs {getConfidenceColor(prob.confidence)}">
								{Math.round(prob.confidence * 100)}%
							</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Last Updated -->
		<div class="mt-6 pt-4 border-t border-gray-100 text-center">
			<p class="text-xs text-gray-500">
				Last updated: {probabilities.length > 0 ? new Date(probabilities[0].last_updated).toLocaleString() : 'Never'}
			</p>
		</div>
	</div>
</div>

<style>
	/* Smooth transitions for probability bars */
	.transition-all {
		transition: all 0.3s ease-in-out;
	}

	/* Hover effects */
	[role="button"]:hover {
		transform: translateY(-1px);
	}

	/* Responsive grid adjustments */
	@media (max-width: 768px) {
		.grid-cols-2 {
			grid-template-columns: 1fr;
		}
	}
</style>

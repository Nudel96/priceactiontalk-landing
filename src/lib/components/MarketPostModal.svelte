<script lang="ts">
	import { X } from '@lucide/svelte';

	export let showModal = false;
	export let newPost = {
		title: '',
		pair: '',
		bias: 'long',
		description: '',
		tradingViewLink: ''
	};
	export let onCreatePost: () => void;

	const tradingPairs = [
		'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
		'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'GBPCHF', 'AUDCAD', 'AUDJPY',
		'XAUUSD', 'XAGUSD', 'BTCUSD', 'ETHUSD'
	];

	const handleCancel = () => {
		newPost = { title: '', pair: '', bias: 'long', description: '', tradingViewLink: '' };
		showModal = false;
	};
</script>

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Share Market Analysis</h3>
				<button on:click={handleCancel} class="text-gray-400 hover:text-gray-600">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<!-- Title -->
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 mb-2">Analysis Title</label>
					<input
						id="title"
						type="text"
						bind:value={newPost.title}
						placeholder="e.g., EURUSD Long Setup - Bullish Breakout Expected"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Trading Pair and Bias -->
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label for="pair" class="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
						<select
							id="pair"
							bind:value={newPost.pair}
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
							<option value="">Select pair</option>
							{#each tradingPairs as pair}
								<option value={pair}>{pair}</option>
							{/each}
						</select>
					</div>

					<div>
						<label for="bias" class="block text-sm font-medium text-gray-700 mb-2">Market Bias</label>
						<select
							id="bias"
							bind:value={newPost.bias}
							class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
							<option value="long">Long / Bullish</option>
							<option value="short">Short / Bearish</option>
							<option value="consolidation">Consolidation / Neutral</option>
						</select>
					</div>
				</div>

				<!-- Description -->
				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 mb-2">Analysis Description</label>
					<textarea
						id="description"
						bind:value={newPost.description}
						rows="4"
						placeholder="Describe your technical analysis, key levels, reasoning..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none">
					</textarea>
				</div>

				<!-- TradingView Link -->
				<div>
					<label for="tradingview-link" class="block text-sm font-medium text-gray-700 mb-2">TradingView Chart Link (Optional)</label>
					<input
						id="tradingview-link"
						type="url"
						bind:value={newPost.tradingViewLink}
						placeholder="https://www.tradingview.com/x/..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
					<p class="text-xs text-gray-500 mt-1">Share your TradingView chart for visual analysis</p>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3 mt-6">
				<button
					on:click={handleCancel}
					class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
				<button
					on:click={onCreatePost}
					disabled={!newPost.title || !newPost.pair || !newPost.description}
					class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					Share Analysis
				</button>
			</div>
		</div>
	</div>
{/if}

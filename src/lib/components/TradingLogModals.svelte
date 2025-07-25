<script lang="ts">
	import { X, Upload } from '@lucide/svelte';

	export let showNewAccountModal = false;
	export let showNewTradeModal = false;
	export let newAccount = { name: '', startingCapital: 0 };
	export let newTrade = {
		pair: '',
		type: 'buy',
		lotSize: 0,
		entryDate: '',
		entryTime: '',
		stopLoss: 0,
		takeProfit: 0,
		whyEnter: '',
		howFeel: '',
		beforeScreenshot: null
	};
	export let onCreateAccount: () => void;
	export let onCreateTrade: () => void;

	const tradingPairs = [
		'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
		'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'GBPCHF', 'AUDCAD', 'AUDJPY',
		'XAUUSD', 'XAGUSD', 'BTCUSD', 'ETHUSD'
	];
</script>

<!-- New Account Modal -->
{#if showNewAccountModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-md">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Create New Trading Account</h3>
				<button on:click={() => showNewAccountModal = false} class="text-gray-400 hover:text-gray-600">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<div>
					<label for="account-name" class="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
					<input
						id="account-name"
						type="text"
						bind:value={newAccount.name}
						placeholder="e.g., Main Account, Demo Account"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<div>
					<label for="starting-capital" class="block text-sm font-medium text-gray-700 mb-2">Starting Capital ($)</label>
					<input
						id="starting-capital"
						type="number"
						bind:value={newAccount.startingCapital}
						placeholder="10000"
						min="1"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>
			</div>

			<div class="flex gap-3 mt-6">
				<button
					on:click={() => showNewAccountModal = false}
					class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
				<button
					on:click={onCreateAccount}
					disabled={!newAccount.name || newAccount.startingCapital <= 0}
					class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					Create Account
				</button>
			</div>
		</div>
	</div>
{/if}

<!-- New Trade Modal -->
{#if showNewTradeModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Plan New Trade</h3>
				<button on:click={() => showNewTradeModal = false} class="text-gray-400 hover:text-gray-600">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Trading Pair -->
				<div>
					<label for="pair" class="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
					<select
						id="pair"
						bind:value={newTrade.pair}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
						<option value="">Select pair</option>
						{#each tradingPairs as pair}
							<option value={pair}>{pair}</option>
						{/each}
					</select>
				</div>

				<!-- Trade Type -->
				<div>
					<label for="type" class="block text-sm font-medium text-gray-700 mb-2">Trade Type</label>
					<select
						id="type"
						bind:value={newTrade.type}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
						<option value="buy">Buy / Long</option>
						<option value="sell">Sell / Short</option>
					</select>
				</div>

				<!-- Lot Size -->
				<div>
					<label for="lot-size" class="block text-sm font-medium text-gray-700 mb-2">Lot Size</label>
					<input
						id="lot-size"
						type="number"
						step="0.01"
						bind:value={newTrade.lotSize}
						placeholder="0.5"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Entry Date -->
				<div>
					<label for="entry-date" class="block text-sm font-medium text-gray-700 mb-2">Entry Date</label>
					<input
						id="entry-date"
						type="date"
						bind:value={newTrade.entryDate}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Entry Time -->
				<div>
					<label for="entry-time" class="block text-sm font-medium text-gray-700 mb-2">Entry Time</label>
					<input
						id="entry-time"
						type="time"
						bind:value={newTrade.entryTime}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Stop Loss -->
				<div>
					<label for="stop-loss" class="block text-sm font-medium text-gray-700 mb-2">Stop Loss</label>
					<input
						id="stop-loss"
						type="number"
						step="0.00001"
						bind:value={newTrade.stopLoss}
						placeholder="1.0850"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Take Profit -->
				<div>
					<label for="take-profit" class="block text-sm font-medium text-gray-700 mb-2">Take Profit</label>
					<input
						id="take-profit"
						type="number"
						step="0.00001"
						bind:value={newTrade.takeProfit}
						placeholder="1.0920"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>
			</div>

			<!-- Analysis Questions -->
			<div class="mt-6 space-y-4">
				<div>
					<label for="why-enter" class="block text-sm font-medium text-gray-700 mb-2">Why did I enter?</label>
					<textarea
						id="why-enter"
						bind:value={newTrade.whyEnter}
						rows="3"
						placeholder="Describe your analysis and reasoning..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none">
					</textarea>
				</div>

				<div>
					<label for="how-feel" class="block text-sm font-medium text-gray-700 mb-2">How do I feel?</label>
					<textarea
						id="how-feel"
						bind:value={newTrade.howFeel}
						rows="2"
						placeholder="Describe your emotional state and confidence..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none">
					</textarea>
				</div>

				<!-- Screenshot Upload -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">Chart Screenshot (Before)</label>
					<div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
						<Upload class="w-8 h-8 text-gray-400 mx-auto mb-2" />
						<p class="text-sm text-gray-600">Click to upload or drag and drop</p>
						<p class="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
						<input type="file" accept="image/*" class="hidden" />
					</div>
				</div>
			</div>

			<div class="flex gap-3 mt-6">
				<button
					on:click={() => showNewTradeModal = false}
					class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
				<button
					on:click={onCreateTrade}
					disabled={!newTrade.pair || newTrade.lotSize <= 0}
					class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					Create Trade
				</button>
			</div>
		</div>
	</div>
{/if}

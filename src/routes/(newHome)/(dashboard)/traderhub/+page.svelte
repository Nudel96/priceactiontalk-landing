<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { TrendingUp, TrendingDown, RefreshCw, DollarSign, Activity } from '@lucide/svelte';

	// Types
	interface PriceData {
		symbol: string;
		price: number;
		bid: number;
		ask: number;
		change: number;
	}

	interface Trade {
		id: number;
		symbol: string;
		direction: 'buy' | 'sell';
		entry: number;
		size: number;
		timestamp: string;
		exit?: number;
		pnl?: number;
	}

	// State
	let selectedSymbol = 'EURUSD';
	let lotSize = 1.0;
	let direction: 'buy' | 'sell' = 'buy';
	let priceData: PriceData | null = null;
	let openTrades: Trade[] = [];
	let isLoading = false;
	let error = '';
	let priceInterval: number;

	// Available symbols (matching backend)
	const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD', 'EURGBP'];
	const API_BASE = 'http://localhost:3001';
	const USER_ID = 'testuser';

	// Fetch current price for a symbol
	async function fetchPrice(symbol: string): Promise<PriceData | null> {
		try {
			const response = await fetch(`${API_BASE}/api/price/${symbol}`);
			if (!response.ok) throw new Error('Failed to fetch price');
			return await response.json();
		} catch (err) {
			console.error('Price fetch error:', err);
			return null;
		}
	}

	// Fetch open trades
	async function fetchOpenTrades() {
		try {
			const response = await fetch(`${API_BASE}/api/trades/${USER_ID}`);
			if (!response.ok) throw new Error('Failed to fetch trades');
			openTrades = await response.json();
		} catch (err) {
			console.error('Trades fetch error:', err);
			error = 'Failed to load trades';
		}
	}

	// Execute a new trade
	async function executeTrade() {
		if (!priceData) return;

		isLoading = true;
		error = '';

		try {
			const tradeData = {
				user: USER_ID,
				symbol: selectedSymbol,
				direction,
				entry: direction === 'buy' ? priceData.ask : priceData.bid,
				size: lotSize
			};

			const response = await fetch(`${API_BASE}/api/trade`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(tradeData)
			});

			if (!response.ok) throw new Error('Failed to execute trade');

			// Refresh trades list
			await fetchOpenTrades();
		} catch (err) {
			console.error('Trade execution error:', err);
			error = 'Failed to execute trade';
		} finally {
			isLoading = false;
		}
	}

	// Close a trade
	async function closeTrade(trade: Trade) {
		if (!priceData) return;

		try {
			const closePrice = trade.direction === 'buy' ? priceData.bid : priceData.ask;

			const response = await fetch(`${API_BASE}/api/close`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tradeId: trade.id,
					price: closePrice
				})
			});

			if (!response.ok) throw new Error('Failed to close trade');

			// Refresh trades list
			await fetchOpenTrades();
		} catch (err) {
			console.error('Trade close error:', err);
			error = 'Failed to close trade';
		}
	}

	// Update prices periodically
	async function updatePrices() {
		const data = await fetchPrice(selectedSymbol);
		if (data) {
			priceData = data;
		}
	}

	// Start price updates
	function startPriceUpdates() {
		updatePrices();
		priceInterval = setInterval(updatePrices, 3000); // Every 3 seconds
	}

	// Stop price updates
	function stopPriceUpdates() {
		if (priceInterval) {
			clearInterval(priceInterval);
		}
	}

	// Lifecycle
	onMount(() => {
		startPriceUpdates();
		fetchOpenTrades();
	});

	onDestroy(() => {
		stopPriceUpdates();
	});

	// Reactive updates when symbol changes
	$: if (selectedSymbol) {
		stopPriceUpdates();
		startPriceUpdates();
	}

	// Format currency
	function formatCurrency(value: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'decimal',
			minimumFractionDigits: 2,
			maximumFractionDigits: 5
		}).format(value);
	}

	// Format PnL
	function formatPnL(pnl: number): string {
		const sign = pnl >= 0 ? '+' : '';
		return `${sign}$${pnl.toFixed(2)}`;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<h1 class="text-navy text-3xl font-bold">Trading Hub</h1>
		<div class="flex items-center gap-2 text-sm text-gray-500">
			<Activity size={16} />
			<span>Live Trading Panel</span>
		</div>
	</div>

	<!-- Error Display -->
	{#if error}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}

	<!-- Main Trading Grid -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Price Display -->
		<div class="lg:col-span-1">
			<div class="rounded-xl border bg-white p-6 shadow-md">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-navy text-lg font-semibold">Live Prices</h2>
					<div class="flex items-center gap-2">
						<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
						<span class="text-xs text-gray-500">Live</span>
					</div>
				</div>

				<!-- Symbol Selector -->
				<div class="mb-4">
					<label for="symbol-select" class="mb-2 block text-sm font-medium text-gray-700">Symbol</label>
					<select
						id="symbol-select"
						bind:value={selectedSymbol}
						class="w-full rounded-lg border border-gray-300 p-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20">
						{#each symbols as symbol}
							<option value={symbol}>{symbol}</option>
						{/each}
					</select>
				</div>

				<!-- Price Data -->
				{#if priceData}
					<div class="space-y-3">
						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">Current Price</span>
							<span class="text-lg font-bold text-navy">{formatCurrency(priceData.price)}</span>
						</div>

						<div class="grid grid-cols-2 gap-3">
							<div class="rounded-lg bg-red-50 p-3">
								<div class="text-xs text-red-600">BID</div>
								<div class="font-semibold text-red-700">{formatCurrency(priceData.bid)}</div>
							</div>
							<div class="rounded-lg bg-green-50 p-3">
								<div class="text-xs text-green-600">ASK</div>
								<div class="font-semibold text-green-700">{formatCurrency(priceData.ask)}</div>
							</div>
						</div>

						<div class="flex items-center justify-between">
							<span class="text-sm text-gray-600">24h Change</span>
							<span class="flex items-center gap-1 font-semibold"
								  class:text-green-600={priceData.change >= 0}
								  class:text-red-600={priceData.change < 0}>
								{#if priceData.change >= 0}
									<TrendingUp size={16} />
									+{priceData.change.toFixed(2)}%
								{:else}
									<TrendingDown size={16} />
									{priceData.change.toFixed(2)}%
								{/if}
							</span>
						</div>
					</div>
				{:else}
					<div class="flex items-center justify-center py-8">
						<div class="flex items-center gap-2 text-gray-500">
							<RefreshCw size={16} class="animate-spin" />
							<span>Loading price data...</span>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Order Form -->
		<div class="lg:col-span-1">
			<div class="rounded-xl border bg-white p-6 shadow-md">
				<h2 class="text-navy mb-4 text-lg font-semibold">Place Order</h2>

				<form on:submit|preventDefault={executeTrade} class="space-y-4">
					<!-- Direction Selector -->
					<div>
						<fieldset>
							<legend class="mb-2 block text-sm font-medium text-gray-700">Direction</legend>
						<div class="grid grid-cols-2 gap-2">
							<button
								type="button"
								on:click={() => direction = 'buy'}
								class="rounded-lg border p-3 text-center font-medium transition-colors"
								class:bg-green-500={direction === 'buy'}
								class:text-white={direction === 'buy'}
								class:border-green-500={direction === 'buy'}
								class:bg-white={direction !== 'buy'}
								class:text-green-600={direction !== 'buy'}
								class:border-green-200={direction !== 'buy'}
								class:hover:bg-green-50={direction !== 'buy'}>
								BUY
							</button>
							<button
								type="button"
								on:click={() => direction = 'sell'}
								class="rounded-lg border p-3 text-center font-medium transition-colors"
								class:bg-red-500={direction === 'sell'}
								class:text-white={direction === 'sell'}
								class:border-red-500={direction === 'sell'}
								class:bg-white={direction !== 'sell'}
								class:text-red-600={direction !== 'sell'}
								class:border-red-200={direction !== 'sell'}
								class:hover:bg-red-50={direction !== 'sell'}>
								SELL
							</button>
						</div>
						</fieldset>
					</div>

					<!-- Lot Size -->
					<div>
						<label for="lot-size" class="mb-2 block text-sm font-medium text-gray-700">Lot Size</label>
						<input
							id="lot-size"
							type="number"
							bind:value={lotSize}
							min="0.01"
							max="100"
							step="0.01"
							class="w-full rounded-lg border border-gray-300 p-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
							placeholder="1.00" />
					</div>

					<!-- Entry Price Display -->
					{#if priceData}
						<div class="rounded-lg bg-gray-50 p-3">
							<div class="text-sm text-gray-600">Entry Price</div>
							<div class="font-semibold text-navy">
								{formatCurrency(direction === 'buy' ? priceData.ask : priceData.bid)}
							</div>
						</div>
					{/if}

					<!-- Submit Button -->
					<button
						type="submit"
						disabled={isLoading || !priceData}
						class="w-full rounded-lg px-4 py-3 font-semibold text-white transition-colors disabled:opacity-50"
						class:bg-green-600={direction === 'buy'}
						class:hover:bg-green-700={direction === 'buy' && !isLoading}
						class:bg-red-600={direction === 'sell'}
						class:hover:bg-red-700={direction === 'sell' && !isLoading}>
						{#if isLoading}
							<div class="flex items-center justify-center gap-2">
								<RefreshCw size={16} class="animate-spin" />
								Executing...
							</div>
						{:else}
							Execute {direction.toUpperCase()} Order
						{/if}
					</button>
				</form>
			</div>
		</div>

		<!-- Open Positions -->
		<div class="lg:col-span-1">
			<div class="rounded-xl border bg-white p-6 shadow-md">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-navy text-lg font-semibold">Open Positions</h2>
					<button
						on:click={fetchOpenTrades}
						class="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
						<RefreshCw size={16} />
					</button>
				</div>

				{#if openTrades.length === 0}
					<div class="py-8 text-center text-gray-500">
						<DollarSign size={32} class="mx-auto mb-2 opacity-50" />
						<p>No open positions</p>
					</div>
				{:else}
					<div class="space-y-3">
						{#each openTrades as trade}
							<div class="rounded-lg border p-4">
								<div class="mb-2 flex items-center justify-between">
									<div class="flex items-center gap-2">
										<span class="font-semibold text-navy">{trade.symbol}</span>
										<span class="rounded px-2 py-1 text-xs font-medium"
											  class:bg-green-100={trade.direction === 'buy'}
											  class:text-green-700={trade.direction === 'buy'}
											  class:bg-red-100={trade.direction === 'sell'}
											  class:text-red-700={trade.direction === 'sell'}>
											{trade.direction.toUpperCase()}
										</span>
									</div>
									<span class="text-sm text-gray-500">
										{trade.size} lots
									</span>
								</div>

								<div class="mb-3 grid grid-cols-2 gap-2 text-sm">
									<div>
										<span class="text-gray-600">Entry:</span>
										<span class="font-medium">{formatCurrency(trade.entry)}</span>
									</div>
									{#if priceData && priceData.symbol === trade.symbol}
										<div>
											<span class="text-gray-600">Current:</span>
											<span class="font-medium">{formatCurrency(priceData.price)}</span>
										</div>
									{/if}
								</div>

								{#if trade.exit && trade.pnl !== undefined}
									<div class="mb-3 rounded bg-gray-50 p-2 text-sm">
										<div class="flex justify-between">
											<span>Exit: {formatCurrency(trade.exit)}</span>
											<span class="font-semibold"
												  class:text-green-600={trade.pnl >= 0}
												  class:text-red-600={trade.pnl < 0}>
												{formatPnL(trade.pnl)}
											</span>
										</div>
									</div>
								{:else}
									<button
										on:click={() => closeTrade(trade)}
										class="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
										Close Position
									</button>
								{/if}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Trading Statistics -->
	<div class="rounded-xl border bg-white p-6 shadow-md">
		<h2 class="text-navy mb-4 text-lg font-semibold">Trading Statistics</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-4">
			<div class="text-center">
				<div class="text-2xl font-bold text-navy">{openTrades.length}</div>
				<div class="text-sm text-gray-600">Open Positions</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-teal-600">
					{openTrades.reduce((sum, trade) => sum + trade.size, 0).toFixed(2)}
				</div>
				<div class="text-sm text-gray-600">Total Volume</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-navy">
					{new Set(openTrades.map(t => t.symbol)).size}
				</div>
				<div class="text-sm text-gray-600">Symbols Traded</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-signal">Live</div>
				<div class="text-sm text-gray-600">Market Status</div>
			</div>
		</div>
	</div>
</div>

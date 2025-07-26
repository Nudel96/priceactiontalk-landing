<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		TrendingUp, TrendingDown, RefreshCw, DollarSign,
		Settings, Eye, EyeOff, Maximize2,
		AlertTriangle, Bell, Search, SlidersHorizontal,
		ChevronDown, ChevronUp, X, Activity
	} from '@lucide/svelte';

	// Enhanced Types
	interface PriceData {
		symbol: string;
		price: number;
		bid: number;
		ask: number;
		change: number;
		volume?: number;
		high?: number;
		low?: number;
		open?: number;
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
		stopLoss?: number;
		takeProfit?: number;
		trailingStop?: number;
		status: 'open' | 'closed' | 'pending';
	}

	interface Order {
		id: number;
		symbol: string;
		type: 'market' | 'limit' | 'stop' | 'stop-limit' | 'trailing-stop';
		direction: 'buy' | 'sell';
		size: number;
		price?: number;
		stopPrice?: number;
		status: 'pending' | 'filled' | 'cancelled';
		timestamp: string;
		validUntil?: string;
	}

	interface WatchlistItem {
		symbol: string;
		name: string;
		price: number;
		change: number;
		changePercent: number;
		volume: number;
		isFavorite: boolean;
	}

	// Enhanced State
	let selectedSymbol = 'EURUSD';
	let lotSize = 1.0;
	let direction: 'buy' | 'sell' = 'buy';
	let orderType: 'market' | 'limit' | 'stop' | 'stop-limit' = 'market';
	let limitPrice = 0;
	let stopPrice = 0;
	let stopLoss = 0;
	let takeProfit = 0;
	let trailingStop = 0;
	let validUntil = 'GTC'; // Good Till Cancelled

	let priceData: PriceData | null = null;
	let openTrades: Trade[] = [];
	let pendingOrders: Order[] = [];
	let closedTrades: Trade[] = [];
	let watchlist: WatchlistItem[] = [];

	let isLoading = false;
	let error = '';
	let priceInterval: number;

	// UI State
	let isDarkMode = true;
	let activeTab = 'positions'; // positions, orders, history, watchlist
	let showAdvancedOrder = false;
	let isChartMaximized = false;
	let showOrderConfirmation = false;
	let oneClickTrading = false;

	// Available symbols with full names
	const symbolsData = [
		{ symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'Major' },
		{ symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'Major' },
		{ symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'Major' },
		{ symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'Major' },
		{ symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'Major' },
		{ symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'Major' },
		{ symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'Major' },
		{ symbol: 'EURGBP', name: 'Euro / British Pound', category: 'Cross' }
	];

	const API_BASE = 'http://localhost:3001';
	const USER_ID = 'testuser';

	// Enhanced API Functions
	async function fetchPrice(symbol: string): Promise<PriceData | null> {
		try {
			const response = await fetch(`${API_BASE}/api/price/${symbol}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			// Validate data structure
			if (!data || typeof data.price !== 'number') {
				throw new Error('Invalid price data received');
			}

			// Enhance with mock OHLC data for demo
			return {
				...data,
				volume: data.volume || Math.floor(Math.random() * 1000000),
				high: data.high || data.price * (1 + Math.random() * 0.01),
				low: data.low || data.price * (1 - Math.random() * 0.01),
				open: data.open || data.price * (1 + (Math.random() - 0.5) * 0.005)
			};
		} catch (err) {
			console.error('Price fetch error:', err);
			error = `Failed to fetch price for ${symbol}`;
			return null;
		}
	}

	async function fetchOpenTrades() {
		try {
			const response = await fetch(`${API_BASE}/api/trades/${USER_ID}`, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const trades = await response.json();

			// Validate trades array
			if (!Array.isArray(trades)) {
				throw new Error('Invalid trades data received');
			}

			openTrades = trades.map((trade: any) => ({
				...trade,
				status: 'open',
				stopLoss: trade.stopLoss || 0,
				takeProfit: trade.takeProfit || 0,
				trailingStop: trade.trailingStop || 0
			}));
		} catch (err) {
			console.error('Trades fetch error:', err);
			error = 'Failed to load open trades. Please check your connection.';
		}
	}

	async function fetchPendingOrders() {
		// Mock pending orders for demo
		pendingOrders = [
			{
				id: 1001,
				symbol: 'EURUSD',
				type: 'limit',
				direction: 'buy',
				size: 0.5,
				price: 1.0800,
				status: 'pending',
				timestamp: new Date().toISOString(),
				validUntil: 'GTC'
			}
		];
	}

	async function fetchClosedTrades() {
		// Mock closed trades for demo
		closedTrades = [
			{
				id: 2001,
				symbol: 'GBPUSD',
				direction: 'sell',
				entry: 1.2650,
				exit: 1.2620,
				size: 1.0,
				timestamp: new Date(Date.now() - 86400000).toISOString(),
				pnl: 30.0,
				status: 'closed'
			}
		];
	}

	async function initializeWatchlist() {
		watchlist = await Promise.all(
			symbolsData.map(async (item) => {
				const price = await fetchPrice(item.symbol);
				return {
					symbol: item.symbol,
					name: item.name,
					price: price?.price || 0,
					change: price?.change || 0,
					changePercent: price ? (price.change / price.price) * 100 : 0,
					volume: price?.volume || 0,
					isFavorite: ['EURUSD', 'GBPUSD'].includes(item.symbol)
				};
			})
		);
	}

	// Enhanced Trading Functions
	async function executeTrade() {
		if (!priceData) {
			error = 'No price data available. Please wait for market data to load.';
			return;
		}

		// Validation
		if (lotSize <= 0) {
			error = 'Position size must be greater than 0';
			return;
		}

		if (orderType !== 'market' && limitPrice <= 0 && stopPrice <= 0) {
			error = 'Please enter a valid price for limit/stop orders';
			return;
		}

		if (!oneClickTrading && !showOrderConfirmation) {
			showOrderConfirmation = true;
			return;
		}

		isLoading = true;
		error = '';

		try {
			let tradeData: any = {
				user: USER_ID,
				symbol: selectedSymbol,
				direction,
				size: lotSize,
				type: orderType
			};

			// Set price based on order type
			if (orderType === 'market') {
				tradeData.entry = direction === 'buy' ? priceData.ask : priceData.bid;
			} else if (orderType === 'limit') {
				if (limitPrice <= 0) {
					throw new Error('Invalid limit price');
				}
				tradeData.entry = limitPrice;
			} else if (orderType === 'stop') {
				if (stopPrice <= 0) {
					throw new Error('Invalid stop price');
				}
				tradeData.entry = stopPrice;
			}

			// Add risk management
			if (stopLoss > 0) tradeData.stopLoss = stopLoss;
			if (takeProfit > 0) tradeData.takeProfit = takeProfit;
			if (trailingStop > 0) tradeData.trailingStop = trailingStop;

			const response = await fetch(`${API_BASE}/api/trade`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify(tradeData)
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(`Trade execution failed: ${response.status} - ${errorData}`);
			}

			const result = await response.json();
			console.log('Trade executed successfully:', result);

			// Reset form and refresh data
			resetOrderForm();
			await fetchOpenTrades();
			await fetchPendingOrders();
			showOrderConfirmation = false;

			// Success message could be added here
		} catch (err) {
			console.error('Trade execution error:', err);
			error = err instanceof Error ? err.message : 'Failed to execute trade. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function resetOrderForm() {
		lotSize = 1.0;
		limitPrice = 0;
		stopPrice = 0;
		stopLoss = 0;
		takeProfit = 0;
		trailingStop = 0;
		orderType = 'market';
		showAdvancedOrder = false;
	}

	async function cancelOrder(orderId: number) {
		try {
			// Mock cancel order
			pendingOrders = pendingOrders.filter(order => order.id !== orderId);
		} catch (err) {
			console.error('Cancel order error:', err);
			error = 'Failed to cancel order';
		}
	}

	async function modifyTrade(tradeId: number, modifications: Partial<Trade>) {
		try {
			// Mock modify trade
			const tradeIndex = openTrades.findIndex(trade => trade.id === tradeId);
			if (tradeIndex !== -1) {
				openTrades[tradeIndex] = { ...openTrades[tradeIndex], ...modifications };
			}
		} catch (err) {
			console.error('Modify trade error:', err);
			error = 'Failed to modify trade';
		}
	}

	function calculatePnL(trade: Trade, currentPrice: number): number {
		if (trade.direction === 'buy') {
			return (currentPrice - trade.entry) * trade.size;
		} else {
			return (trade.entry - currentPrice) * trade.size;
		}
	}

	function calculatePositionSize(riskPercent: number, stopLossDistance: number): number {
		const accountBalance = 10000; // Mock account balance
		const riskAmount = accountBalance * (riskPercent / 100);
		return riskAmount / stopLossDistance;
	}

	// Close a trade
	async function closeTrade(trade: Trade) {
		if (!priceData || priceData.symbol !== trade.symbol) {
			error = 'Cannot close trade: No current price data available for this symbol';
			return;
		}

		try {
			const closePrice = trade.direction === 'buy' ? priceData.bid : priceData.ask;

			if (closePrice <= 0) {
				throw new Error('Invalid close price');
			}

			const response = await fetch(`${API_BASE}/api/close`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					tradeId: trade.id,
					price: closePrice
				})
			});

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(`Failed to close trade: ${response.status} - ${errorData}`);
			}

			const result = await response.json();
			console.log('Trade closed successfully:', result);

			// Refresh trades list
			await fetchOpenTrades();
			await fetchClosedTrades();
		} catch (err) {
			console.error('Trade close error:', err);
			error = err instanceof Error ? err.message : 'Failed to close trade. Please try again.';
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

	// Test backend connection
	async function testBackendConnection(): Promise<boolean> {
		try {
			const response = await fetch(`${API_BASE}/api/price/EURUSD`, {
				method: 'GET',
				headers: { 'Accept': 'application/json' }
			});
			return response.ok;
		} catch (err) {
			console.error('Backend connection test failed:', err);
			return false;
		}
	}

	// Enhanced Lifecycle
	onMount(async () => {
		// Test backend connection first
		const isBackendAvailable = await testBackendConnection();
		if (!isBackendAvailable) {
			error = 'Cannot connect to trading backend. Please ensure the server is running on port 3001.';
			return;
		}

		startPriceUpdates();
		await fetchOpenTrades();
		await fetchPendingOrders();
		await fetchClosedTrades();
		await initializeWatchlist();
	});

	onDestroy(() => {
		stopPriceUpdates();
	});

	// Reactive updates when symbol changes
	$: if (selectedSymbol) {
		stopPriceUpdates();
		startPriceUpdates();
		// Update limit price to current market price
		if (priceData) {
			limitPrice = priceData.price;
			stopPrice = priceData.price;
		}
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

<!-- Professional Trading Hub Interface -->
<div class="min-h-screen" class:bg-gray-900={isDarkMode} class:bg-gray-50={!isDarkMode}>
	<!-- Top Navigation Bar -->
	<div class="border-b" class:bg-gray-800={isDarkMode} class:border-gray-700={isDarkMode} class:bg-white={!isDarkMode} class:border-gray-200={!isDarkMode}>
		<div class="flex items-center justify-between px-6 py-4">
			<!-- Left: Title and Status -->
			<div class="flex items-center gap-4">
				<h1 class="text-2xl font-bold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
					Trading Hub Pro
				</h1>
				<div class="flex items-center gap-2 text-sm" class:text-green-400={isDarkMode} class:text-green-600={!isDarkMode}>
					<div class="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
					<span>Live Market Data</span>
				</div>
			</div>

			<!-- Right: Controls -->
			<div class="flex items-center gap-3">
				<!-- Dark Mode Toggle -->
				<button
					on:click={() => isDarkMode = !isDarkMode}
					class="rounded-lg p-2 transition-colors"
					class:bg-gray-700={isDarkMode} class:hover:bg-gray-600={isDarkMode}
					class:bg-gray-100={!isDarkMode} class:hover:bg-gray-200={!isDarkMode}>
					{#if isDarkMode}
						<Eye size={18} class="text-yellow-400" />
					{:else}
						<EyeOff size={18} class="text-gray-600" />
					{/if}
				</button>

				<!-- Chart Maximize -->
				<button
					on:click={() => isChartMaximized = !isChartMaximized}
					class="rounded-lg p-2 transition-colors"
					class:bg-gray-700={isDarkMode} class:hover:bg-gray-600={isDarkMode}
					class:bg-gray-100={!isDarkMode} class:hover:bg-gray-200={!isDarkMode}>
					<Maximize2 size={18} class={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
				</button>

				<!-- Settings -->
				<button
					class="rounded-lg p-2 transition-colors"
					class:bg-gray-700={isDarkMode} class:hover:bg-gray-600={isDarkMode}
					class:bg-gray-100={!isDarkMode} class:hover:bg-gray-200={!isDarkMode}>
					<Settings size={18} class={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
				</button>

				<!-- One-Click Trading Toggle -->
				<div class="flex items-center gap-2">
					<span class="text-sm" class:text-gray-300={isDarkMode} class:text-gray-600={!isDarkMode}>
						1-Click
					</span>
					<button
						on:click={() => oneClickTrading = !oneClickTrading}
						aria-label="Toggle one-click trading"
						class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
						class:bg-teal-600={oneClickTrading}
						class:bg-gray-600={!oneClickTrading && isDarkMode}
						class:bg-gray-300={!oneClickTrading && !isDarkMode}>
						<span
							class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
							class:translate-x-6={oneClickTrading}
							class:translate-x-1={!oneClickTrading}>
						</span>
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Error Display -->
	{#if error}
		<div class="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
			<div class="flex items-center gap-2">
				<AlertTriangle size={16} />
				<span>{error}</span>
				<button on:click={() => error = ''} class="ml-auto" aria-label="Close error">
					<X size={16} />
				</button>
			</div>
		</div>
	{/if}

	<!-- Main Trading Layout -->
	<div class="flex h-[calc(100vh-120px)]">
		<!-- Left Sidebar: Watchlist & Market Data -->
		<div class="w-80 border-r" class:bg-gray-800={isDarkMode} class:border-gray-700={isDarkMode} class:bg-white={!isDarkMode} class:border-gray-200={!isDarkMode}>
			<!-- Watchlist Header -->
			<div class="border-b p-4" class:border-gray-700={isDarkMode} class:border-gray-200={!isDarkMode}>
				<div class="flex items-center justify-between">
					<h2 class="font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
						Market Watch
					</h2>
					<div class="flex items-center gap-2">
						<button class="rounded p-1 hover:bg-gray-700" aria-label="Search markets">
							<Search size={16} class={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
						</button>
						<button class="rounded p-1 hover:bg-gray-700" aria-label="Filter markets">
							<SlidersHorizontal size={16} class={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
						</button>
					</div>
				</div>
			</div>

			<!-- Watchlist Items -->
			<div class="overflow-y-auto">
				{#each watchlist as item}
					<button
						on:click={() => selectedSymbol = item.symbol}
						class="w-full border-b p-3 text-left transition-colors hover:bg-gray-700"
						class:border-gray-700={isDarkMode} class:border-gray-200={!isDarkMode}
						class:bg-gray-700={selectedSymbol === item.symbol && isDarkMode}
						class:bg-gray-100={selectedSymbol === item.symbol && !isDarkMode}>
						<div class="flex items-center justify-between">
							<div>
								<div class="font-medium" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
									{item.symbol}
								</div>
								<div class="text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									{item.name}
								</div>
							</div>
							<div class="text-right">
								<div class="font-mono text-sm" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
									{formatCurrency(item.price)}
								</div>
								<div class="text-xs font-medium"
									 class:text-green-400={item.change >= 0}
									 class:text-red-400={item.change < 0}>
									{item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<!-- Center: Chart Area -->
		<div class="flex-1 flex flex-col" class:hidden={isChartMaximized}>
			<!-- Chart Header -->
			<div class="border-b p-4" class:bg-gray-800={isDarkMode} class:border-gray-700={isDarkMode} class:bg-white={!isDarkMode} class:border-gray-200={!isDarkMode}>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-4">
						<h3 class="text-lg font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
							{selectedSymbol}
						</h3>
						{#if priceData}
							<div class="flex items-center gap-4 text-sm">
								<span class="font-mono" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
									{formatCurrency(priceData.price)}
								</span>
								<span class="flex items-center gap-1"
									  class:text-green-400={priceData.change >= 0}
									  class:text-red-400={priceData.change < 0}>
									{#if priceData.change >= 0}
										<TrendingUp size={14} />
										+{priceData.change.toFixed(2)}%
									{:else}
										<TrendingDown size={14} />
										{priceData.change.toFixed(2)}%
									{/if}
								</span>
							</div>
						{/if}
					</div>
					<div class="flex items-center gap-2">
						<button class="rounded p-2 hover:bg-gray-700" aria-label="Chart settings">
							<Activity size={16} class={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
						</button>
					</div>
				</div>
			</div>

			<!-- Chart Container -->
			<div class="flex-1" class:bg-gray-900={isDarkMode} class:bg-gray-50={!isDarkMode}>
				<!-- TradingView Chart Integration -->
				<div class="h-full w-full flex items-center justify-center">
					<div class="text-center" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
						<Activity size={48} class="mx-auto mb-4 opacity-50" />
						<p class="text-lg font-medium">Professional Chart</p>
						<p class="text-sm">TradingView Integration</p>
						<p class="text-xs mt-2">Symbol: {selectedSymbol}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Sidebar: Trading Panel -->
		<div class="w-96 border-l" class:bg-gray-800={isDarkMode} class:border-gray-700={isDarkMode} class:bg-white={!isDarkMode} class:border-gray-200={!isDarkMode}>
			<!-- Order Entry Panel -->
			<div class="border-b p-4" class:border-gray-700={isDarkMode} class:border-gray-200={!isDarkMode}>
				<h3 class="mb-4 font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
					Order Entry
				</h3>

				<!-- Symbol Selection -->
				<div class="mb-4">
					<label for="symbol-select" class="mb-2 block text-sm font-medium" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
						Symbol
					</label>
					<select
						id="symbol-select"
						bind:value={selectedSymbol}
						class="w-full rounded-lg border p-3 focus:ring-2 focus:ring-teal-500"
						class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
						class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}>
						{#each symbolsData as symbolItem}
							<option value={symbolItem.symbol}>{symbolItem.symbol} - {symbolItem.name}</option>
						{/each}
					</select>
				</div>

				<!-- Order Type Selection -->
				<div class="mb-4">
					<fieldset>
						<legend class="mb-2 block text-sm font-medium" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
							Order Type
						</legend>
					<div class="grid grid-cols-2 gap-2">
						{#each ['market', 'limit', 'stop', 'stop-limit'] as type}
							<button
								on:click={() => orderType = type as typeof orderType}
								class="rounded-lg border p-2 text-sm font-medium transition-colors"
								class:bg-teal-600={orderType === type}
								class:text-white={orderType === type}
								class:border-teal-600={orderType === type}
								class:bg-gray-700={orderType !== type && isDarkMode}
								class:text-gray-300={orderType !== type && isDarkMode}
								class:border-gray-600={orderType !== type && isDarkMode}
								class:bg-white={orderType !== type && !isDarkMode}
								class:text-gray-700={orderType !== type && !isDarkMode}
								class:border-gray-300={orderType !== type && !isDarkMode}
								class:hover:bg-gray-600={orderType !== type && isDarkMode}
								class:hover:bg-gray-50={orderType !== type && !isDarkMode}>
								{type.charAt(0).toUpperCase() + type.slice(1)}
							</button>
						{/each}
					</div>
					</fieldset>
				</div>

				<!-- Direction Selection -->
				<div class="mb-4">
					<fieldset>
						<legend class="mb-2 block text-sm font-medium" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
							Direction
						</legend>
						<div class="grid grid-cols-2 gap-2">
							<button
								type="button"
								on:click={() => direction = 'buy'}
								class="rounded-lg border p-3 text-center font-medium transition-colors"
								class:bg-green-600={direction === 'buy'}
								class:text-white={direction === 'buy'}
								class:border-green-600={direction === 'buy'}
								class:bg-gray-700={direction !== 'buy' && isDarkMode}
								class:text-green-400={direction !== 'buy' && isDarkMode}
								class:border-gray-600={direction !== 'buy' && isDarkMode}
								class:bg-white={direction !== 'buy' && !isDarkMode}
								class:text-green-600={direction !== 'buy' && !isDarkMode}
								class:border-green-200={direction !== 'buy' && !isDarkMode}
								class:hover:bg-green-700={direction !== 'buy' && isDarkMode}
								class:hover:bg-green-50={direction !== 'buy' && !isDarkMode}>
								BUY
							</button>
							<button
								type="button"
								on:click={() => direction = 'sell'}
								class="rounded-lg border p-3 text-center font-medium transition-colors"
								class:bg-red-600={direction === 'sell'}
								class:text-white={direction === 'sell'}
								class:border-red-600={direction === 'sell'}
								class:bg-gray-700={direction !== 'sell' && isDarkMode}
								class:text-red-400={direction !== 'sell' && isDarkMode}
								class:border-gray-600={direction !== 'sell' && isDarkMode}
								class:bg-white={direction !== 'sell' && !isDarkMode}
								class:text-red-600={direction !== 'sell' && !isDarkMode}
								class:border-red-200={direction !== 'sell' && !isDarkMode}
								class:hover:bg-red-700={direction !== 'sell' && isDarkMode}
								class:hover:bg-red-50={direction !== 'sell' && !isDarkMode}>
								SELL
							</button>
						</div>
					</fieldset>
				</div>

				<!-- Price Fields -->
				{#if orderType !== 'market'}
					<div class="mb-4 space-y-3">
						{#if orderType === 'limit' || orderType === 'stop-limit'}
							<div>
								<label for="limit-price" class="mb-1 block text-sm" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
									Limit Price
								</label>
								<input
									id="limit-price"
									type="number"
									bind:value={limitPrice}
									step="0.00001"
									class="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
									placeholder="0.00000" />
							</div>
						{/if}
						{#if orderType === 'stop' || orderType === 'stop-limit'}
							<div>
								<label for="stop-price" class="mb-1 block text-sm" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
									Stop Price
								</label>
								<input
									id="stop-price"
									type="number"
									bind:value={stopPrice}
									step="0.00001"
									class="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
									placeholder="0.00000" />
							</div>
						{/if}
					</div>
				{/if}

				<!-- Lot Size -->
				<div class="mb-4">
					<label for="lot-size" class="mb-2 block text-sm font-medium" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
						Position Size
					</label>
					<div class="flex items-center gap-2">
						<input
							id="lot-size"
							type="number"
							bind:value={lotSize}
							min="0.01"
							max="100"
							step="0.01"
							class="flex-1 rounded-lg border p-3 focus:ring-2 focus:ring-teal-500"
							class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
							class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
							placeholder="1.00" />
						<span class="text-sm" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							lots
						</span>
					</div>
				</div>

				<!-- Advanced Risk Management -->
				<div class="mb-4">
					<button
						on:click={() => showAdvancedOrder = !showAdvancedOrder}
						class="flex w-full items-center justify-between rounded-lg border p-2 text-sm transition-colors"
						class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-gray-300={isDarkMode}
						class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-700={!isDarkMode}
						class:hover:bg-gray-600={isDarkMode} class:hover:bg-gray-100={!isDarkMode}>
						<span>Risk Management</span>
						{#if showAdvancedOrder}
							<ChevronUp size={16} />
						{:else}
							<ChevronDown size={16} />
						{/if}
					</button>

					{#if showAdvancedOrder}
						<div class="mt-3 space-y-3">
							<!-- Stop Loss -->
							<div>
								<label for="stop-loss" class="mb-1 block text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									Stop Loss
								</label>
								<input
									id="stop-loss"
									type="number"
									bind:value={stopLoss}
									step="0.00001"
									class="w-full rounded border p-2 text-sm focus:ring-1 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
									placeholder="0.00000" />
							</div>

							<!-- Take Profit -->
							<div>
								<label for="take-profit" class="mb-1 block text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									Take Profit
								</label>
								<input
									id="take-profit"
									type="number"
									bind:value={takeProfit}
									step="0.00001"
									class="w-full rounded border p-2 text-sm focus:ring-1 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
									placeholder="0.00000" />
							</div>

							<!-- Trailing Stop -->
							<div>
								<label for="trailing-stop" class="mb-1 block text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									Trailing Stop (pips)
								</label>
								<input
									id="trailing-stop"
									type="number"
									bind:value={trailingStop}
									min="0"
									step="1"
									class="w-full rounded border p-2 text-sm focus:ring-1 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}
									placeholder="0" />
							</div>

							<!-- Validity -->
							<div>
								<label for="valid-until" class="mb-1 block text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									Valid Until
								</label>
								<select
									id="valid-until"
									bind:value={validUntil}
									class="w-full rounded border p-2 text-sm focus:ring-1 focus:ring-teal-500"
									class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:text-white={isDarkMode}
									class:bg-white={!isDarkMode} class:border-gray-300={!isDarkMode} class:text-gray-900={!isDarkMode}>
									<option value="GTC">Good Till Cancelled</option>
									<option value="DAY">Day Order</option>
									<option value="IOC">Immediate or Cancel</option>
									<option value="FOK">Fill or Kill</option>
								</select>
							</div>
						</div>
					{/if}
				</div>

				<!-- Current Price Display -->
				{#if priceData}
					<div class="mb-4 rounded-lg border p-3" class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode}>
						<div class="text-xs mb-2" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							Current Market
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div class="text-center">
								<div class="text-xs" class:text-red-400={isDarkMode} class:text-red-600={!isDarkMode}>BID</div>
								<div class="font-mono text-sm font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
									{formatCurrency(priceData.bid)}
								</div>
							</div>
							<div class="text-center">
								<div class="text-xs" class:text-green-400={isDarkMode} class:text-green-600={!isDarkMode}>ASK</div>
								<div class="font-mono text-sm font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
									{formatCurrency(priceData.ask)}
								</div>
							</div>
						</div>
						<div class="mt-2 text-center text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							Spread: {formatCurrency(priceData.ask - priceData.bid)}
						</div>
					</div>
				{/if}

				<!-- Execute Button -->
				<button
					on:click={executeTrade}
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
						{orderType === 'market' ? 'Execute' : 'Place'} {direction.toUpperCase()} Order
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Bottom Panel: Positions, Orders, History -->
	<div class="border-t" class:bg-gray-800={isDarkMode} class:border-gray-700={isDarkMode} class:bg-white={!isDarkMode} class:border-gray-200={!isDarkMode}>
		<!-- Tab Navigation -->
		<div class="border-b" class:border-gray-700={isDarkMode} class:border-gray-200={!isDarkMode}>
			<div class="flex">
				{#each [
					{ id: 'positions', label: 'Open Positions', count: openTrades.length },
					{ id: 'orders', label: 'Pending Orders', count: pendingOrders.length },
					{ id: 'history', label: 'Trade History', count: closedTrades.length },
					{ id: 'watchlist', label: 'Watchlist', count: watchlist.length }
				] as tab}
					<button
						on:click={() => activeTab = tab.id}
						class="flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-medium transition-colors"
						class:border-teal-500={activeTab === tab.id}
						class:text-teal-400={activeTab === tab.id && isDarkMode}
						class:text-teal-600={activeTab === tab.id && !isDarkMode}
						class:border-transparent={activeTab !== tab.id}
						class:text-gray-400={activeTab !== tab.id && isDarkMode}
						class:text-gray-600={activeTab !== tab.id && !isDarkMode}
						class:hover:text-gray-300={activeTab !== tab.id && isDarkMode}
						class:hover:text-gray-800={activeTab !== tab.id && !isDarkMode}>
						<span>{tab.label}</span>
						{#if tab.count > 0}
							<span class="rounded-full px-2 py-0.5 text-xs"
								  class:bg-teal-600={activeTab === tab.id}
								  class:text-white={activeTab === tab.id}
								  class:bg-gray-600={activeTab !== tab.id && isDarkMode}
								  class:text-gray-300={activeTab !== tab.id && isDarkMode}
								  class:bg-gray-200={activeTab !== tab.id && !isDarkMode}
								  class:text-gray-700={activeTab !== tab.id && !isDarkMode}>
								{tab.count}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Tab Content -->
		<div class="h-64 overflow-y-auto p-4">
			{#if activeTab === 'positions'}
				<!-- Open Positions -->
				{#if openTrades.length === 0}
					<div class="flex h-full items-center justify-center text-center">
						<div class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							<DollarSign size={32} class="mx-auto mb-2 opacity-50" />
							<p>No open positions</p>
							<p class="text-xs">Execute a trade to see positions here</p>
						</div>
					</div>
				{:else}
					<div class="space-y-2">
						{#each openTrades as trade}
							<div class="rounded-lg border p-3" class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode}>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<span class="font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
											{trade.symbol}
										</span>
										<span class="rounded px-2 py-1 text-xs font-medium text-white"
											  class:bg-green-600={trade.direction === 'buy'}
											  class:bg-red-600={trade.direction === 'sell'}>
											{trade.direction.toUpperCase()}
										</span>
										<span class="text-sm" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
											{trade.size} lots
										</span>
									</div>
									<div class="flex items-center gap-3">
										{#if priceData && priceData.symbol === trade.symbol}
											{@const currentPnL = calculatePnL(trade, priceData.price)}
											<span class="font-mono text-sm font-semibold"
												  class:text-green-400={currentPnL >= 0}
												  class:text-red-400={currentPnL < 0}>
												{formatPnL(currentPnL)}
											</span>
										{/if}
										<button
											on:click={() => closeTrade(trade)}
											class="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700">
											Close
										</button>
									</div>
								</div>
								<div class="mt-2 grid grid-cols-3 gap-4 text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
									<div>
										<span>Entry:</span>
										<span class="font-mono">{formatCurrency(trade.entry)}</span>
									</div>
									{#if priceData && priceData.symbol === trade.symbol}
										<div>
											<span>Current:</span>
											<span class="font-mono">{formatCurrency(priceData.price)}</span>
										</div>
									{/if}
									<div>
										<span>Time:</span>
										<span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'orders'}
				<!-- Pending Orders -->
				{#if pendingOrders.length === 0}
					<div class="flex h-full items-center justify-center text-center">
						<div class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							<Bell size={32} class="mx-auto mb-2 opacity-50" />
							<p>No pending orders</p>
							<p class="text-xs">Place limit or stop orders to see them here</p>
						</div>
					</div>
				{:else}
					<div class="space-y-2">
						{#each pendingOrders as order}
							<div class="rounded-lg border p-3" class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode}>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<span class="font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
											{order.symbol}
										</span>
										<span class="rounded px-2 py-1 text-xs font-medium"
											  class:bg-blue-600={order.type === 'limit'}
											  class:bg-orange-600={order.type === 'stop'}
											  class:text-white={true}>
											{order.type.toUpperCase()}
										</span>
										<span class="text-sm" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
											{order.size} lots
										</span>
									</div>
									<button
										on:click={() => cancelOrder(order.id)}
										class="rounded bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700">
										Cancel
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'history'}
				<!-- Trade History -->
				{#if closedTrades.length === 0}
					<div class="flex h-full items-center justify-center text-center">
						<div class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
							<Activity size={32} class="mx-auto mb-2 opacity-50" />
							<p>No trade history</p>
							<p class="text-xs">Closed trades will appear here</p>
						</div>
					</div>
				{:else}
					<div class="space-y-2">
						{#each closedTrades as trade}
							<div class="rounded-lg border p-3" class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode}>
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										<span class="font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
											{trade.symbol}
										</span>
										<span class="rounded px-2 py-1 text-xs font-medium text-white"
											  class:bg-green-600={trade.direction === 'buy'}
											  class:bg-red-600={trade.direction === 'sell'}>
											{trade.direction.toUpperCase()}
										</span>
									</div>
									{#if trade.pnl !== undefined}
										<span class="font-mono text-sm font-semibold"
											  class:text-green-400={trade.pnl >= 0}
											  class:text-red-400={trade.pnl < 0}>
											{formatPnL(trade.pnl)}
										</span>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}

			{:else if activeTab === 'watchlist'}
				<!-- Extended Watchlist -->
				<div class="space-y-2">
					{#each watchlist as item}
						<div class="rounded-lg border p-3" class:bg-gray-700={isDarkMode} class:border-gray-600={isDarkMode} class:bg-gray-50={!isDarkMode} class:border-gray-300={!isDarkMode}>
							<div class="flex items-center justify-between">
								<div>
									<div class="font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
										{item.symbol}
									</div>
									<div class="text-xs" class:text-gray-400={isDarkMode} class:text-gray-600={!isDarkMode}>
										{item.name}
									</div>
								</div>
								<div class="text-right">
									<div class="font-mono text-sm" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
										{formatCurrency(item.price)}
									</div>
									<div class="text-xs font-medium"
										 class:text-green-400={item.change >= 0}
										 class:text-red-400={item.change < 0}>
										{item.change >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Order Confirmation Modal -->
	{#if showOrderConfirmation}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div class="rounded-lg p-6 shadow-xl" class:bg-gray-800={isDarkMode} class:bg-white={!isDarkMode}>
				<h3 class="mb-4 text-lg font-semibold" class:text-white={isDarkMode} class:text-navy={!isDarkMode}>
					Confirm Order
				</h3>
				<div class="mb-4 space-y-2 text-sm" class:text-gray-300={isDarkMode} class:text-gray-700={!isDarkMode}>
					<div>Symbol: <span class="font-semibold">{selectedSymbol}</span></div>
					<div>Direction: <span class="font-semibold">{direction.toUpperCase()}</span></div>
					<div>Size: <span class="font-semibold">{lotSize} lots</span></div>
					<div>Type: <span class="font-semibold">{orderType}</span></div>
					{#if priceData}
						<div>Price: <span class="font-semibold">{formatCurrency(direction === 'buy' ? priceData.ask : priceData.bid)}</span></div>
					{/if}
				</div>
				<div class="flex gap-3">
					<button
						on:click={() => showOrderConfirmation = false}
						class="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
						class:border-gray-600={isDarkMode} class:text-gray-300={isDarkMode} class:hover:bg-gray-700={isDarkMode}
						class:border-gray-300={!isDarkMode} class:text-gray-700={!isDarkMode} class:hover:bg-gray-50={!isDarkMode}>
						Cancel
					</button>
					<button
						on:click={executeTrade}
						class="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
						class:bg-green-600={direction === 'buy'}
						class:hover:bg-green-700={direction === 'buy'}
						class:bg-red-600={direction === 'sell'}
						class:hover:bg-red-700={direction === 'sell'}>
						Confirm
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

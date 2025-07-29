<script lang="ts">
	import { Plus, Calendar, Activity, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle } from '@lucide/svelte';
	import TradingLogModals from '$lib/components/TradingLogModals.svelte';
	import TradingCalendar from '$lib/components/TradingCalendar.svelte';

	// Mock trading accounts
	let accounts = [
		{
			id: 1,
			name: 'Main Account',
			startingCapital: 10000,
			currentBalance: 12500,
			totalTrades: 45,
			winRate: 68,
			createdAt: '2024-01-15'
		},
		{
			id: 2,
			name: 'Demo Account',
			startingCapital: 5000,
			currentBalance: 4750,
			totalTrades: 23,
			winRate: 52,
			createdAt: '2024-02-01'
		}
	];

	let selectedAccount = accounts[0];
	let showNewAccountModal = false;
	let showNewTradeModal = false;
	let activeTab = 'trades'; // 'trades' or 'calendar'

	// Mock trades for selected account
	let trades = [
		{
			id: 1,
			accountId: 1,
			pair: 'EURUSD',
			type: 'buy',
			lotSize: 0.5,
			entryDate: '2024-03-15',
			entryTime: '14:30',
			entryPrice: 1.0890,
			stopLoss: 1.0850,
			takeProfit: 1.0920,
			status: 'completed',
			result: 150,
			whyEnter: 'Strong support at 1.0850 with bullish divergence',
			howFeel: 'Confident about the setup',
			whatDifferent: '',
			beforeScreenshot: null,
			afterScreenshot: null
		},
		{
			id: 2,
			accountId: 1,
			pair: 'GBPJPY',
			type: 'sell',
			lotSize: 0.3,
			entryDate: '2024-03-16',
			entryTime: '09:15',
			entryPrice: 187.50,
			stopLoss: 188.20,
			takeProfit: 185.50,
			status: 'pending',
			result: null,
			whyEnter: 'Bearish flag pattern after strong downtrend',
			howFeel: 'Cautious but optimistic',
			whatDifferent: '',
			beforeScreenshot: null,
			afterScreenshot: null
		}
	];

	// New account form
	let newAccount = {
		name: '',
		startingCapital: 0
	};

	// New trade form
	let newTrade = {
		pair: '',
		type: 'buy',
		lotSize: 0,
		entryDate: '',
		entryTime: '',
		entryPrice: 0,
		stopLoss: 0,
		takeProfit: 0,
		whyEnter: '',
		howFeel: '',
		beforeScreenshot: null
	};

	const handleNewAccount = () => {
		showNewAccountModal = true;
	};

	const handleCreateAccount = () => {
		if (newAccount.name && newAccount.startingCapital > 0) {
			const account = {
				id: accounts.length + 1,
				name: newAccount.name,
				startingCapital: newAccount.startingCapital,
				currentBalance: newAccount.startingCapital,
				totalTrades: 0,
				winRate: 0,
				createdAt: new Date().toISOString().split('T')[0]
			};
			accounts = [...accounts, account];
			newAccount = { name: '', startingCapital: 0 };
			showNewAccountModal = false;
		}
	};

	const handleNewTrade = () => {
		showNewTradeModal = true;
	};

	const handleCreateTrade = () => {
		if (newTrade.pair && newTrade.lotSize > 0) {
			const trade = {
				id: trades.length + 1,
				accountId: selectedAccount.id,
				...newTrade,
				status: 'pending',
				result: null,
				whatDifferent: '',
				afterScreenshot: null
			};
			trades = [...trades, trade];
			newTrade = {
				pair: '',
				type: 'buy',
				lotSize: 0,
				entryDate: '',
				entryTime: '',
				entryPrice: 0,
				stopLoss: 0,
				takeProfit: 0,
				whyEnter: '',
				howFeel: '',
				beforeScreenshot: null
			};
			showNewTradeModal = false;
		}
	};

	const getAccountTrades = (accountId: number) => {
		return trades.filter(trade => trade.accountId === accountId);
	};

	const getAccountStats = (accountId: number) => {
		const accountTrades = getAccountTrades(accountId);
		const completedTrades = accountTrades.filter(trade => trade.status === 'completed');
		const winningTrades = completedTrades.filter(trade => trade.result && trade.result > 0);

		return {
			total: accountTrades.length,
			completed: completedTrades.length,
			pending: accountTrades.filter(trade => trade.status === 'pending').length,
			winRate: completedTrades.length > 0 ? Math.round((winningTrades.length / completedTrades.length) * 100) : 0,
			totalPnL: completedTrades.reduce((sum, trade) => sum + (trade.result || 0), 0)
		};
	};

	$: accountStats = getAccountStats(selectedAccount.id);
	$: accountTrades = getAccountTrades(selectedAccount.id);
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Trading Log</h1>
			<p class="text-gray-600 dark:text-gray-300 mt-2">Track and analyze your trading performance</p>
		</div>
		<div class="flex gap-3">
			<a
				href="/tradinglog/metrics"
				class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
				<Activity class="w-4 h-4" />
				View Metrics
			</a>
			<button
				on:click={handleNewAccount}
				class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
				<Plus class="w-4 h-4" />
				New Account
			</button>
			<button
				on:click={handleNewTrade}
				class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
				<Plus class="w-4 h-4" />
				New Trade
			</button>
		</div>
	</div>

	<!-- Account Selection -->
	<div class="bg-gray-800 rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-gray-100 mb-4">Select Trading Account</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each accounts as account}
				<button
					class="p-4 rounded-lg border-2 transition-all duration-200 text-left {selectedAccount.id === account.id
						? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
						: 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}"
					on:click={() => selectedAccount = account}>
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-semibold text-gray-900 dark:text-gray-100">{account.name}</h3>
						<span class="text-sm text-gray-600 dark:text-gray-400">#{account.id}</span>
					</div>
					<div class="space-y-1 text-sm">
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Starting:</span>
							<span class="font-medium text-gray-900 dark:text-gray-100">${account.startingCapital.toLocaleString()}</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">Current:</span>
							<span class="font-medium {account.currentBalance >= account.startingCapital ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
								${account.currentBalance.toLocaleString()}
							</span>
						</div>
						<div class="flex justify-between">
							<span class="text-gray-600 dark:text-gray-400">P&L:</span>
							<span class="font-medium {account.currentBalance >= account.startingCapital ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
								{account.currentBalance >= account.startingCapital ? '+' : ''}${(account.currentBalance - account.startingCapital).toLocaleString()}
							</span>
						</div>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Account Statistics -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
					<Activity class="w-5 h-5 text-blue-400" />
				</div>
				<h3 class="font-semibold text-gray-100">Total Trades</h3>
			</div>
			<p class="text-2xl font-bold text-gray-100">{accountStats.total}</p>
			<p class="text-sm text-gray-400">{accountStats.pending} pending</p>
		</div>

		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-5 h-5 text-green-400" />
				</div>
				<h3 class="font-semibold text-gray-100">Win Rate</h3>
			</div>
			<p class="text-2xl font-bold text-gray-100">{accountStats.winRate}%</p>
			<p class="text-sm text-gray-400">{accountStats.completed} completed</p>
		</div>

		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center">
					<DollarSign class="w-5 h-5 text-purple-400" />
				</div>
				<h3 class="font-semibold text-gray-100">Total P&L</h3>
			</div>
			<p class="text-2xl font-bold {accountStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}">
				{accountStats.totalPnL >= 0 ? '+' : ''}${accountStats.totalPnL.toLocaleString()}
			</p>
			<p class="text-sm text-gray-400">From completed trades</p>
		</div>

		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-teal-900/30 rounded-lg flex items-center justify-center">
					<Calendar class="w-5 h-5 text-teal-400" />
				</div>
				<h3 class="font-semibold text-gray-100">Account Age</h3>
			</div>
			<p class="text-2xl font-bold text-gray-100">
				{Math.floor((new Date().getTime() - new Date(selectedAccount.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
			</p>
			<p class="text-sm text-gray-400">days active</p>
		</div>
	</div>

	<!-- Tab Navigation -->
	<div class="bg-gray-800 rounded-xl shadow-md">
		<div class="border-b border-gray-600">
			<nav class="flex space-x-8 px-6">
				<button
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'trades'
						? 'border-teal-500 text-teal-400'
						: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}"
					on:click={() => activeTab = 'trades'}>
					Trades List
				</button>
				<button
					class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab === 'calendar'
						? 'border-teal-500 text-teal-400'
						: 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'}"
					on:click={() => activeTab = 'calendar'}>
					<div class="flex items-center gap-2">
						<Calendar class="w-4 h-4" />
						Calendar View
					</div>
				</button>
			</nav>
		</div>

		<!-- Tab Content -->
		<div class="p-6">
			{#if activeTab === 'trades'}
				<!-- Trades List -->
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-xl font-semibold text-gray-100">Trades for {selectedAccount.name}</h2>
			<div class="flex gap-2">
				<button class="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
					All
				</button>
				<button class="px-3 py-1 text-sm bg-yellow-900/30 text-yellow-400 rounded-lg hover:bg-yellow-900/40 transition-colors">
					Pending
				</button>
				<button class="px-3 py-1 text-sm bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/40 transition-colors">
					Completed
				</button>
			</div>
		</div>

		<div class="space-y-4">
			{#each accountTrades as trade}
				<div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
					<div class="flex items-start justify-between mb-3">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-{trade.type === 'buy' ? 'green' : 'red'}-100 dark:bg-{trade.type === 'buy' ? 'green' : 'red'}-900/30 rounded-lg flex items-center justify-center">
								{#if trade.type === 'buy'}
									<TrendingUp class="w-5 h-5 text-green-600 dark:text-green-400" />
								{:else}
									<TrendingDown class="w-5 h-5 text-red-600 dark:text-red-400" />
								{/if}
							</div>
							<div>
								<h3 class="font-semibold text-gray-900 dark:text-gray-100">{trade.pair}</h3>
								<p class="text-sm text-gray-600 dark:text-gray-400">
									{trade.type.toUpperCase()} • {trade.lotSize} lots • {trade.entryDate} {trade.entryTime}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							{#if trade.status === 'pending'}
								<span class="flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
									<Clock class="w-3 h-3" />
									Pending
								</span>
							{:else}
								<span class="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs">
									<CheckCircle class="w-3 h-3" />
									Completed
								</span>
							{/if}
						</div>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
						<div>
							<span class="text-gray-600 dark:text-gray-400">Entry:</span>
							<span class="font-medium ml-1 text-gray-900 dark:text-gray-100">{trade.entryPrice || 'N/A'}</span>
						</div>
						<div>
							<span class="text-gray-600 dark:text-gray-400">Stop Loss:</span>
							<span class="font-medium ml-1 text-gray-900 dark:text-gray-100">{trade.stopLoss}</span>
						</div>
						<div>
							<span class="text-gray-600 dark:text-gray-400">Take Profit:</span>
							<span class="font-medium ml-1 text-gray-900 dark:text-gray-100">{trade.takeProfit}</span>
						</div>
						{#if trade.result !== null}
							<div>
								<span class="text-gray-600 dark:text-gray-400">Result:</span>
								<span class="font-medium ml-1 {trade.result >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">
									{trade.result >= 0 ? '+' : ''}${trade.result}
								</span>
							</div>
						{/if}
					</div>

					{#if trade.whyEnter}
						<div class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
							<p class="text-sm text-gray-700 dark:text-gray-300"><strong class="text-gray-900 dark:text-gray-100">Why I entered:</strong> {trade.whyEnter}</p>
							{#if trade.howFeel}
								<p class="text-sm text-gray-700 dark:text-gray-300 mt-1"><strong class="text-gray-900 dark:text-gray-100">How I felt:</strong> {trade.howFeel}</p>
							{/if}
						</div>
					{/if}

					{#if trade.status === 'pending'}
						<div class="mt-4 flex gap-2">
							<button class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm">
								End Trade
							</button>
							<button class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm">
								Edit
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<div class="text-center py-12">
					<Clock class="w-12 h-12 text-gray-400 mx-auto mb-4" />
					<h3 class="text-lg font-medium text-gray-100 mb-2">No trades yet</h3>
					<p class="text-gray-600 dark:text-gray-400 mb-4">Start tracking your trades by creating your first trade entry.</p>
					<button
						on:click={handleNewTrade}
						class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors">
						<Plus class="w-4 h-4" />
						Create First Trade
					</button>
				</div>
			{/each}
		</div>
		{:else if activeTab === 'calendar'}
			<!-- Calendar View -->
			<TradingCalendar {trades} {selectedAccount} />
		{/if}
	</div>
</div>
</div>

<!-- Modals -->
<TradingLogModals
	bind:showNewAccountModal
	bind:showNewTradeModal
	bind:newAccount
	bind:newTrade
	onCreateAccount={handleCreateAccount}
	onCreateTrade={handleCreateTrade}
/>

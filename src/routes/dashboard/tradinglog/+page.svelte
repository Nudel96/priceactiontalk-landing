<script lang="ts">
	import { Plus, TrendingUp, TrendingDown, Calendar, DollarSign, Target, Filter } from '@lucide/svelte';
	import { language, t } from '$lib/stores/language';

	// Mock trading data
	let trades = [
		{
			id: 1,
			symbol: 'EURUSD',
			direction: 'long',
			entry: 1.0850,
			exit: 1.0920,
			size: 1.0,
			pnl: 70.00,
			status: 'closed',
			date: '2024-01-15',
			time: '09:30',
			notes: 'Breakout above resistance, good momentum'
		},
		{
			id: 2,
			symbol: 'GBPUSD',
			direction: 'short',
			entry: 1.2650,
			exit: 1.2580,
			size: 0.5,
			pnl: 35.00,
			status: 'closed',
			date: '2024-01-15',
			time: '14:15',
			notes: 'Rejection at key resistance level'
		},
		{
			id: 3,
			symbol: 'USDJPY',
			direction: 'long',
			entry: 148.50,
			exit: null,
			size: 0.8,
			pnl: -25.00,
			status: 'open',
			date: '2024-01-16',
			time: '08:45',
			notes: 'Currently in drawdown, watching for reversal'
		},
		{
			id: 4,
			symbol: 'XAUUSD',
			direction: 'short',
			entry: 2025.50,
			exit: 2010.25,
			size: 0.1,
			pnl: 152.50,
			status: 'closed',
			date: '2024-01-14',
			time: '16:20',
			notes: 'Perfect rejection at daily resistance'
		}
	];

	// Statistics
	$: totalTrades = trades.length;
	$: closedTrades = trades.filter(t => t.status === 'closed');
	$: winningTrades = closedTrades.filter(t => t.pnl > 0);
	$: winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length * 100).toFixed(1) : '0.0';
	$: totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
	$: averageWin = winningTrades.length > 0 ? (winningTrades.reduce((sum, trade) => sum + trade.pnl, 0) / winningTrades.length).toFixed(2) : '0.00';
	$: losingTrades = closedTrades.filter(t => t.pnl < 0);
	$: averageLoss = losingTrades.length > 0 ? Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0) / losingTrades.length).toFixed(2) : '0.00';

	let showAddTradeModal = false;
	let filterStatus = 'all';

	const filteredTrades = filterStatus === 'all' 
		? trades 
		: trades.filter(trade => trade.status === filterStatus);

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	};

	const getDirectionColor = (direction: string) => {
		return direction === 'long' ? 'text-green-400' : 'text-red-400';
	};

	const getDirectionIcon = (direction: string) => {
		return direction === 'long' ? TrendingUp : TrendingDown;
	};

	const getPnLColor = (pnl: number) => {
		if (pnl > 0) return 'text-green-400';
		if (pnl < 0) return 'text-red-400';
		return 'text-gray-400';
	};

	const getStatusColor = (status: string) => {
		return status === 'open' ? 'bg-blue-600' : 'bg-gray-600';
	};
</script>

<svelte:head>
	<title>{t('tradinglog.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<div class="bg-gray-800 border-b border-gray-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">{t('tradinglog.title', $language)}</h1>
				<p class="text-gray-400 mt-1">{t('tradinglog.subtitle', $language)}</p>
			</div>
			<button 
				on:click={() => showAddTradeModal = true}
				class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
			>
				<Plus size="20" />
				{t('tradinglog.add-trade', $language)}
			</button>
		</div>
	</div>

	<div class="max-w-7xl mx-auto p-6">
		<!-- Statistics Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-400 text-sm">{t('tradinglog.total-trades', $language)}</p>
						<p class="text-2xl font-bold text-white">{totalTrades}</p>
					</div>
					<div class="p-3 bg-blue-600 rounded-lg">
						<Target size="24" class="text-white" />
					</div>
				</div>
			</div>

			<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-400 text-sm">{t('tradinglog.win-rate', $language)}</p>
						<p class="text-2xl font-bold text-green-400">{winRate}%</p>
					</div>
					<div class="p-3 bg-green-600 rounded-lg">
						<TrendingUp size="24" class="text-white" />
					</div>
				</div>
			</div>

			<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-400 text-sm">{t('tradinglog.total-pnl', $language)}</p>
						<p class="text-2xl font-bold {getPnLColor(totalPnL)}">{formatCurrency(totalPnL)}</p>
					</div>
					<div class="p-3 bg-purple-600 rounded-lg">
						<DollarSign size="24" class="text-white" />
					</div>
				</div>
			</div>

			<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-gray-400 text-sm">{t('tradinglog.avg-win', $language)}</p>
						<p class="text-2xl font-bold text-green-400">{formatCurrency(parseFloat(averageWin))}</p>
					</div>
					<div class="p-3 bg-orange-600 rounded-lg">
						<Calendar size="24" class="text-white" />
					</div>
				</div>
			</div>
		</div>

		<!-- Filters -->
		<div class="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
			<div class="flex items-center justify-between">
				<h2 class="text-lg font-semibold text-white">{t('tradinglog.trade-history', $language)}</h2>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<Filter size="16" class="text-gray-400" />
						<select 
							bind:value={filterStatus}
							class="bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-1 text-sm"
						>
							<option value="all">{t('tradinglog.all-trades', $language)}</option>
							<option value="open">{t('tradinglog.open-trades', $language)}</option>
							<option value="closed">{t('tradinglog.closed-trades', $language)}</option>
						</select>
					</div>
				</div>
			</div>
		</div>

		<!-- Trades Table -->
		<div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead class="bg-gray-700">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.symbol', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.direction', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.entry', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.exit', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.size', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.pnl', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.status', $language)}
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
								{t('tradinglog.date', $language)}
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-700">
						{#each filteredTrades as trade}
							{@const DirectionIcon = getDirectionIcon(trade.direction)}
							<tr class="hover:bg-gray-700/50">
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm font-medium text-white">{trade.symbol}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="flex items-center gap-2">
										<DirectionIcon size="16" class={getDirectionColor(trade.direction)} />
										<span class="text-sm {getDirectionColor(trade.direction)} capitalize">
											{trade.direction}
										</span>
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{trade.entry}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{trade.exit || '-'}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{trade.size}
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="text-sm font-medium {getPnLColor(trade.pnl)}">
										{formatCurrency(trade.pnl)}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="px-2 py-1 text-xs font-medium text-white rounded-full {getStatusColor(trade.status)}">
										{trade.status}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									{trade.date}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

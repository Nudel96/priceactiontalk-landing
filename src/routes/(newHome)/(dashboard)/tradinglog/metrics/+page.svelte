<script lang="ts">
	import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Target, Calendar, Activity, PieChart } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	// Mock data - in real app this would come from the tradinglog
	const accountData = {
		name: 'Main Account',
		startingCapital: 10000,
		currentBalance: 12500,
		totalTrades: 45,
		winningTrades: 31,
		losingTrades: 14,
		totalPnL: 2500,
		avgWin: 120,
		avgLoss: -85,
		largestWin: 450,
		largestLoss: -280,
		winRate: 68.9,
		profitFactor: 2.1,
		sharpeRatio: 1.4,
		maxDrawdown: -8.5,
		avgHoldTime: '2.3 hours',
		tradingDays: 32
	};

	// Mock chart data
	const balanceCurveData = [
		{ date: '2024-01-01', balance: 10000 },
		{ date: '2024-01-15', balance: 10250 },
		{ date: '2024-02-01', balance: 10100 },
		{ date: '2024-02-15', balance: 10800 },
		{ date: '2024-03-01', balance: 11200 },
		{ date: '2024-03-15', balance: 12500 }
	];

	const pairPerformance = [
		{ pair: 'EURUSD', trades: 12, pnl: 680, winRate: 75 },
		{ pair: 'GBPJPY', trades: 8, pnl: 420, winRate: 62.5 },
		{ pair: 'XAUUSD', trades: 10, pnl: 850, winRate: 80 },
		{ pair: 'USDJPY', trades: 6, pnl: -120, winRate: 33.3 },
		{ pair: 'AUDUSD', trades: 9, pnl: 670, winRate: 66.7 }
	];

	const monthlyPerformance = [
		{ month: 'Jan', pnl: 250, trades: 15 },
		{ month: 'Feb', pnl: -100, trades: 12 },
		{ month: 'Mar', pnl: 2350, trades: 18 }
	];

	const timeOfDayPerformance = [
		{ hour: '08:00', pnl: 320, trades: 8 },
		{ hour: '10:00', pnl: 180, trades: 6 },
		{ hour: '12:00', pnl: -50, trades: 4 },
		{ hour: '14:00', pnl: 450, trades: 10 },
		{ hour: '16:00', pnl: 280, trades: 7 },
		{ hour: '18:00', pnl: 120, trades: 5 }
	];

	const goBack = () => {
		goto('/tradinglog');
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<button
			on:click={goBack}
			class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
			<ArrowLeft class="w-5 h-5 text-gray-600" />
		</button>
		<div>
			<h1 class="text-3xl font-bold text-navy">Trading Metrics</h1>
			<p class="text-gray-600 mt-2">Detailed performance analysis for {accountData.name}</p>
		</div>
	</div>

	<!-- Key Performance Indicators -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
					<DollarSign class="w-5 h-5 text-green-600" />
				</div>
				<h3 class="font-semibold text-navy">Total P&L</h3>
			</div>
			<p class="text-2xl font-bold text-green-600">+${accountData.totalPnL.toLocaleString()}</p>
			<p class="text-sm text-gray-500">{((accountData.totalPnL / accountData.startingCapital) * 100).toFixed(1)}% return</p>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<Target class="w-5 h-5 text-blue-600" />
				</div>
				<h3 class="font-semibold text-navy">Win Rate</h3>
			</div>
			<p class="text-2xl font-bold text-navy">{accountData.winRate}%</p>
			<p class="text-sm text-gray-500">{accountData.winningTrades}/{accountData.totalTrades} trades</p>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-5 h-5 text-purple-600" />
				</div>
				<h3 class="font-semibold text-navy">Profit Factor</h3>
			</div>
			<p class="text-2xl font-bold text-navy">{accountData.profitFactor}</p>
			<p class="text-sm text-gray-500">Gross profit / Gross loss</p>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-2">
				<div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
					<TrendingDown class="w-5 h-5 text-red-600" />
				</div>
				<h3 class="font-semibold text-navy">Max Drawdown</h3>
			</div>
			<p class="text-2xl font-bold text-red-600">{accountData.maxDrawdown}%</p>
			<p class="text-sm text-gray-500">Largest peak-to-trough decline</p>
		</div>
	</div>

	<!-- Charts Row 1 -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Balance Curve -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<Activity class="w-5 h-5 text-teal-600" />
				<h3 class="text-lg font-semibold text-navy">Balance Curve</h3>
			</div>
			<div class="h-64 flex items-end justify-between gap-2">
				{#each balanceCurveData as point, i}
					{@const height = ((point.balance - 10000) / 2500) * 100}
					<div class="flex flex-col items-center flex-1">
						<div 
							class="w-full bg-teal-500 rounded-t-sm transition-all duration-500"
							style="height: {Math.max(height, 5)}%">
						</div>
						<span class="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
							{new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
						</span>
					</div>
				{/each}
			</div>
			<div class="mt-4 text-center">
				<p class="text-sm text-gray-600">Account balance over time</p>
			</div>
		</div>

		<!-- Win/Loss Distribution -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<PieChart class="w-5 h-5 text-blue-600" />
				<h3 class="text-lg font-semibold text-navy">Win/Loss Distribution</h3>
			</div>
			<div class="flex items-center justify-center h-64">
				<div class="relative w-48 h-48">
					<!-- Simple pie chart representation -->
					<div class="w-full h-full rounded-full bg-gradient-to-r from-green-400 to-red-400" 
						 style="background: conic-gradient(#10b981 0deg {accountData.winRate * 3.6}deg, #ef4444 {accountData.winRate * 3.6}deg 360deg)">
					</div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg">
							<div class="text-center">
								<div class="text-lg font-bold text-navy">{accountData.winRate}%</div>
								<div class="text-xs text-gray-500">Win Rate</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex justify-center gap-6 mt-4">
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-green-500 rounded-full"></div>
					<span class="text-sm text-gray-600">Wins ({accountData.winningTrades})</span>
				</div>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 bg-red-500 rounded-full"></div>
					<span class="text-sm text-gray-600">Losses ({accountData.losingTrades})</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Charts Row 2 -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Pair Performance -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<Activity class="w-5 h-5 text-purple-600" />
				<h3 class="text-lg font-semibold text-navy">Performance by Pair</h3>
			</div>
			<div class="space-y-4">
				{#each pairPerformance as pair}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-3">
							<span class="font-medium text-navy w-16">{pair.pair}</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
								<div
									class="h-2 rounded-full {pair.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}"
									style="width: {Math.abs(pair.pnl) / 10}%">
								</div>
							</div>
						</div>
						<div class="text-right">
							<div class="font-semibold {pair.pnl >= 0 ? 'text-green-600' : 'text-red-600'}">
								{pair.pnl >= 0 ? '+' : ''}${pair.pnl}
							</div>
							<div class="text-xs text-gray-500">{pair.winRate}% WR</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Monthly Performance -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<Calendar class="w-5 h-5 text-orange-600" />
				<h3 class="text-lg font-semibold text-navy">Monthly Performance</h3>
			</div>
			<div class="h-64 flex items-end justify-between gap-4">
				{#each monthlyPerformance as month}
					{@const height = Math.abs(month.pnl) / 25}
					<div class="flex flex-col items-center flex-1">
						<div class="text-xs text-gray-600 mb-2">{month.pnl >= 0 ? '+' : ''}${month.pnl}</div>
						<div
							class="w-full rounded-t-sm transition-all duration-500 {month.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}"
							style="height: {Math.max(height, 10)}px">
						</div>
						<span class="text-sm text-gray-700 mt-2 font-medium">{month.month}</span>
						<span class="text-xs text-gray-500">{month.trades} trades</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Charts Row 3 -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Time of Day Performance -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<Activity class="w-5 h-5 text-indigo-600" />
				<h3 class="text-lg font-semibold text-navy">Performance by Time of Day</h3>
			</div>
			<div class="space-y-3">
				{#each timeOfDayPerformance as timeSlot}
					<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
						<div class="flex items-center gap-3">
							<span class="font-medium text-navy w-12">{timeSlot.hour}</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
								<div
									class="h-2 rounded-full {timeSlot.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'}"
									style="width: {(Math.abs(timeSlot.pnl) / 500) * 100}%">
								</div>
							</div>
						</div>
						<div class="text-right">
							<div class="font-semibold {timeSlot.pnl >= 0 ? 'text-green-600' : 'text-red-600'}">
								{timeSlot.pnl >= 0 ? '+' : ''}${timeSlot.pnl}
							</div>
							<div class="text-xs text-gray-500">{timeSlot.trades} trades</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Advanced Statistics -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-6">
				<Target class="w-5 h-5 text-cyan-600" />
				<h3 class="text-lg font-semibold text-navy">Advanced Statistics</h3>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-navy">${accountData.avgWin}</div>
					<div class="text-sm text-gray-600">Avg Win</div>
				</div>
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-navy">${Math.abs(accountData.avgLoss)}</div>
					<div class="text-sm text-gray-600">Avg Loss</div>
				</div>
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-green-600">${accountData.largestWin}</div>
					<div class="text-sm text-gray-600">Largest Win</div>
				</div>
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-red-600">${Math.abs(accountData.largestLoss)}</div>
					<div class="text-sm text-gray-600">Largest Loss</div>
				</div>
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-navy">{accountData.sharpeRatio}</div>
					<div class="text-sm text-gray-600">Sharpe Ratio</div>
				</div>
				<div class="text-center p-4 bg-gray-50 rounded-lg">
					<div class="text-2xl font-bold text-navy">{accountData.avgHoldTime}</div>
					<div class="text-sm text-gray-600">Avg Hold Time</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Summary Statistics -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h3 class="text-lg font-semibold text-navy mb-6">Trading Summary</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<div class="text-center">
				<div class="text-3xl font-bold text-navy mb-2">{accountData.totalTrades}</div>
				<div class="text-sm text-gray-600">Total Trades</div>
				<div class="text-xs text-gray-500 mt-1">Over {accountData.tradingDays} days</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-green-600 mb-2">{accountData.winningTrades}</div>
				<div class="text-sm text-gray-600">Winning Trades</div>
				<div class="text-xs text-gray-500 mt-1">{accountData.winRate}% success rate</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-red-600 mb-2">{accountData.losingTrades}</div>
				<div class="text-sm text-gray-600">Losing Trades</div>
				<div class="text-xs text-gray-500 mt-1">{(100 - accountData.winRate).toFixed(1)}% of total</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-navy mb-2">{(accountData.totalTrades / accountData.tradingDays).toFixed(1)}</div>
				<div class="text-sm text-gray-600">Trades per Day</div>
				<div class="text-xs text-gray-500 mt-1">Average frequency</div>
			</div>
		</div>
	</div>
</div>

<script lang="ts">
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	export let trades: any[] = [];
	export let selectedAccount: any = null;

	let currentDate = new Date();
	let currentMonth = currentDate.getMonth();
	let currentYear = currentDate.getFullYear();

	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December'
	];

	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

	// Get trades for a specific date
	const getTradesForDate = (date: Date) => {
		const dateStr = date.toISOString().split('T')[0];
		return trades.filter(trade => 
			trade.accountId === selectedAccount?.id && 
			trade.entryDate === dateStr &&
			trade.status === 'completed'
		);
	};

	// Get daily P&L for a specific date
	const getDailyPnL = (date: Date) => {
		const dayTrades = getTradesForDate(date);
		return dayTrades.reduce((sum, trade) => sum + (trade.result || 0), 0);
	};

	// Generate calendar days
	const getCalendarDays = (month: number, year: number) => {
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDayOfWeek = firstDay.getDay();

		const days = [];

		// Add empty cells for days before the first day of the month
		for (let i = 0; i < startingDayOfWeek; i++) {
			days.push(null);
		}

		// Add days of the month
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(year, month, day));
		}

		return days;
	};

	const previousMonth = () => {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
	};

	const nextMonth = () => {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};

	$: calendarDays = getCalendarDays(currentMonth, currentYear);
</script>

<div class="bg-white rounded-xl shadow-md p-6">
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-semibold text-navy">Trading Calendar - {selectedAccount?.name || 'No Account'}</h2>
		<div class="flex items-center gap-4">
			<button
				on:click={previousMonth}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
				<ChevronLeft class="w-5 h-5 text-gray-600" />
			</button>
			<h3 class="text-lg font-medium text-navy min-w-[200px] text-center">
				{months[currentMonth]} {currentYear}
			</h3>
			<button
				on:click={nextMonth}
				class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
				<ChevronRight class="w-5 h-5 text-gray-600" />
			</button>
		</div>
	</div>

	<!-- Calendar Grid -->
	<div class="grid grid-cols-7 gap-1">
		<!-- Weekday Headers -->
		{#each weekdays as weekday}
			<div class="p-3 text-center text-sm font-medium text-gray-500 border-b border-gray-200">
				{weekday}
			</div>
		{/each}

		<!-- Calendar Days -->
		{#each calendarDays as day}
			{#if day}
				{@const dayTrades = getTradesForDate(day)}
				{@const dailyPnL = getDailyPnL(day)}
				{@const hasActivity = dayTrades.length > 0}
				
				<div class="relative min-h-[80px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors {isToday(day) ? 'bg-blue-50 border-blue-200' : ''}">
					<div class="text-sm font-medium text-gray-900 mb-1">
						{day.getDate()}
					</div>
					
					{#if hasActivity}
						<div class="space-y-1">
							<!-- P&L Indicator -->
							<div class="text-xs px-2 py-1 rounded-full text-center {dailyPnL >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
								{dailyPnL >= 0 ? '+' : ''}${dailyPnL.toFixed(0)}
							</div>
							
							<!-- Trade Count -->
							<div class="text-xs text-gray-500 text-center">
								{dayTrades.length} trade{dayTrades.length !== 1 ? 's' : ''}
							</div>
						</div>
					{/if}
					
					{#if isToday(day)}
						<div class="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
					{/if}
				</div>
			{:else}
				<div class="min-h-[80px] p-2"></div>
			{/if}
		{/each}
	</div>

	<!-- Calendar Legend -->
	<div class="mt-6 flex items-center justify-center gap-6 text-sm">
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 bg-green-100 rounded border border-green-200"></div>
			<span class="text-gray-600">Profitable Day</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 bg-red-100 rounded border border-red-200"></div>
			<span class="text-gray-600">Loss Day</span>
		</div>
		<div class="flex items-center gap-2">
			<div class="w-4 h-4 bg-blue-50 rounded border border-blue-200"></div>
			<span class="text-gray-600">Today</span>
		</div>
	</div>

	<!-- Monthly Summary -->
	{#if selectedAccount}
		{@const monthlyTrades = trades.filter(trade => {
			const tradeDate = new Date(trade.entryDate);
			return trade.accountId === selectedAccount.id && 
				   trade.status === 'completed' &&
				   tradeDate.getMonth() === currentMonth && 
				   tradeDate.getFullYear() === currentYear;
		})}
		{@const monthlyPnL = monthlyTrades.reduce((sum, trade) => sum + (trade.result || 0), 0)}
		{@const winningTrades = monthlyTrades.filter(trade => trade.result > 0)}
		{@const monthlyWinRate = monthlyTrades.length > 0 ? Math.round((winningTrades.length / monthlyTrades.length) * 100) : 0}
		
		<div class="mt-6 pt-6 border-t border-gray-200">
			<h4 class="text-lg font-semibold text-navy mb-4">Monthly Summary</h4>
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div class="text-center">
					<div class="text-2xl font-bold text-navy">{monthlyTrades.length}</div>
					<div class="text-sm text-gray-600">Total Trades</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold {monthlyPnL >= 0 ? 'text-green-600' : 'text-red-600'}">
						{monthlyPnL >= 0 ? '+' : ''}${monthlyPnL.toFixed(0)}
					</div>
					<div class="text-sm text-gray-600">Monthly P&L</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-navy">{monthlyWinRate}%</div>
					<div class="text-sm text-gray-600">Win Rate</div>
				</div>
				<div class="text-center">
					<div class="text-2xl font-bold text-navy">{winningTrades.length}</div>
					<div class="text-sm text-gray-600">Winning Trades</div>
				</div>
			</div>
		</div>
	{/if}
</div>

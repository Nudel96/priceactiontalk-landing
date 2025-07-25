<script lang="ts">
	import { Calendar, TrendingUp, TrendingDown, AlertCircle, Globe } from '@lucide/svelte';
	import TradingViewEventsWidget from '$lib/components/TradingViewEventsWidget.svelte';

	// Mock economic data
	const majorEvents = [
		{
			id: 1,
			time: '08:30',
			currency: 'USD',
			event: 'Non-Farm Payrolls',
			impact: 'high',
			forecast: '180K',
			previous: '175K',
			actual: null
		},
		{
			id: 2,
			time: '10:00',
			currency: 'EUR',
			event: 'ECB Interest Rate Decision',
			impact: 'high',
			forecast: '4.50%',
			previous: '4.50%',
			actual: null
		},
		{
			id: 3,
			time: '14:00',
			currency: 'GBP',
			event: 'GDP Growth Rate',
			impact: 'medium',
			forecast: '0.2%',
			previous: '0.1%',
			actual: '0.3%'
		}
	];

	const marketSentiment = {
		overall: 'bullish',
		riskOn: 65,
		fearGreed: 72,
		vix: 18.5
	};

	const currencyStrength = [
		{ currency: 'USD', strength: 85, change: 2.1 },
		{ currency: 'EUR', strength: 72, change: -1.3 },
		{ currency: 'GBP', strength: 68, change: 0.8 },
		{ currency: 'JPY', strength: 45, change: -2.5 },
		{ currency: 'CHF', strength: 58, change: 1.2 },
		{ currency: 'AUD', strength: 62, change: 3.1 },
		{ currency: 'CAD', strength: 55, change: -0.7 },
		{ currency: 'NZD', strength: 48, change: 1.8 }
	];

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high': return 'bg-red-100 text-red-700 border-red-200';
			case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
			case 'low': return 'bg-green-100 text-green-700 border-green-200';
			default: return 'bg-gray-100 text-gray-700 border-gray-200';
		}
	};

	const getStrengthColor = (strength: number) => {
		if (strength >= 70) return 'bg-green-500';
		if (strength >= 50) return 'bg-yellow-500';
		return 'bg-red-500';
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-navy">Economic Overview</h1>
			<p class="text-gray-600 mt-2">Stay informed about market-moving events and economic indicators</p>
		</div>
		<div class="flex items-center gap-2 text-sm text-gray-500">
			<Globe class="w-4 h-4" />
			<span>Last updated: {new Date().toLocaleTimeString()}</span>
		</div>
	</div>

	<!-- Market Sentiment Overview -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-5 h-5 text-blue-600" />
				</div>
				<h3 class="font-semibold text-navy">Market Sentiment</h3>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-navy capitalize mb-2">{marketSentiment.overall}</div>
				<div class="text-sm text-gray-600">Overall market mood</div>
			</div>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
					<TrendingUp class="w-5 h-5 text-green-600" />
				</div>
				<h3 class="font-semibold text-navy">Risk Appetite</h3>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.riskOn}%</div>
				<div class="text-sm text-gray-600">Risk-on sentiment</div>
			</div>
		</div>

		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
					<AlertCircle class="w-5 h-5 text-purple-600" />
				</div>
				<h3 class="font-semibold text-navy">VIX Index</h3>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-navy mb-2">{marketSentiment.vix}</div>
				<div class="text-sm text-gray-600">Volatility index</div>
			</div>
		</div>
	</div>

	<!-- Today's Major Events -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<Calendar class="w-5 h-5 text-teal-600" />
			<h2 class="text-xl font-semibold text-navy">Today's Major Events</h2>
		</div>
		<div class="space-y-4">
			{#each majorEvents as event}
				<div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
					<div class="flex items-center gap-4">
						<div class="text-center">
							<div class="font-semibold text-navy">{event.time}</div>
							<div class="text-xs text-gray-500">{event.currency}</div>
						</div>
						<div class="flex-1">
							<h3 class="font-medium text-navy">{event.event}</h3>
							<div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
								<span>Forecast: {event.forecast}</span>
								<span>Previous: {event.previous}</span>
								{#if event.actual}
									<span class="font-medium">Actual: {event.actual}</span>
								{/if}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-3">
						<span class="px-2 py-1 rounded-full text-xs font-medium border {getImpactColor(event.impact)}">
							{event.impact.toUpperCase()}
						</span>
						{#if event.actual}
							<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						{:else}
							<div class="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Currency Strength Meter -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<Globe class="w-5 h-5 text-indigo-600" />
			<h2 class="text-xl font-semibold text-navy">Currency Strength Meter</h2>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			{#each currencyStrength as currency}
				<div class="text-center p-4 border border-gray-200 rounded-lg">
					<div class="font-bold text-lg text-navy mb-2">{currency.currency}</div>
					<div class="w-full bg-gray-200 rounded-full h-3 mb-2">
						<div 
							class="h-3 rounded-full transition-all duration-500 {getStrengthColor(currency.strength)}"
							style="width: {currency.strength}%">
						</div>
					</div>
					<div class="text-sm text-gray-600">{currency.strength}/100</div>
					<div class="text-xs {currency.change >= 0 ? 'text-green-600' : 'text-red-600'} mt-1">
						{currency.change >= 0 ? '+' : ''}{currency.change}%
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Economic Calendar Widget -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center gap-3 mb-6">
			<Calendar class="w-5 h-5 text-orange-600" />
			<h2 class="text-xl font-semibold text-navy">Economic Calendar</h2>
		</div>
		<div class="h-96 bg-[#1D222D] rounded-lg">
			<TradingViewEventsWidget />
		</div>
	</div>
</div>

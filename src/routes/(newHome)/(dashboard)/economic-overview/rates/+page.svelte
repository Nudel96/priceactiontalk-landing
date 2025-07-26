<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		Calendar, TrendingUp, TrendingDown, Building, 
		Activity, ArrowLeft, RefreshCw, AlertTriangle,
		Info, Percent, Clock, Globe
	} from '@lucide/svelte';

	// Interest rates data interfaces
	interface CentralBankMeeting {
		id: number;
		bank: string;
		country: string;
		date: string;
		time: string;
		current_rate: number;
		expected_rate: number;
		probability_hike: number;
		probability_hold: number;
		probability_cut: number;
		impact: 'high' | 'medium' | 'low';
	}

	interface YieldData {
		maturity: string;
		yield: number;
		change_1d: number;
		change_1w: number;
		change_1m: number;
	}

	interface RateDifferential {
		pair: string;
		rate_diff: number;
		change_1m: number;
		trend: 'widening' | 'narrowing' | 'stable';
	}

	// Mock data
	let upcomingMeetings: CentralBankMeeting[] = [];
	let yieldCurveData: { [country: string]: YieldData[] } = {};
	let rateDifferentials: RateDifferential[] = [];
	let selectedCountry = 'US';
	let isLoading = false;

	const countries = [
		{ code: 'US', name: 'United States', currency: 'USD' },
		{ code: 'EU', name: 'Eurozone', currency: 'EUR' },
		{ code: 'UK', name: 'United Kingdom', currency: 'GBP' },
		{ code: 'JP', name: 'Japan', currency: 'JPY' },
		{ code: 'CH', name: 'Switzerland', currency: 'CHF' },
		{ code: 'AU', name: 'Australia', currency: 'AUD' },
		{ code: 'CA', name: 'Canada', currency: 'CAD' },
		{ code: 'NZ', name: 'New Zealand', currency: 'NZD' }
	];

	onMount(() => {
		generateMockMeetings();
		generateYieldCurveData();
		generateRateDifferentials();
	});

	function generateMockMeetings() {
		const banks = [
			{ name: 'Federal Reserve', country: 'US', current: 5.25 },
			{ name: 'European Central Bank', country: 'EU', current: 4.50 },
			{ name: 'Bank of England', country: 'UK', current: 5.25 },
			{ name: 'Bank of Japan', country: 'JP', current: -0.10 },
			{ name: 'Swiss National Bank', country: 'CH', current: 1.75 },
			{ name: 'Reserve Bank of Australia', country: 'AU', current: 4.35 },
			{ name: 'Bank of Canada', country: 'CA', current: 5.00 },
			{ name: 'Reserve Bank of New Zealand', country: 'NZ', current: 5.50 }
		];

		upcomingMeetings = banks.map((bank, index) => {
			const date = new Date();
			date.setDate(date.getDate() + (index * 7) + Math.floor(Math.random() * 30));
			
			const prob_hold = Math.floor(Math.random() * 40) + 40; // 40-80%
			const prob_hike = Math.floor(Math.random() * (100 - prob_hold));
			const prob_cut = 100 - prob_hold - prob_hike;

			return {
				id: index + 1,
				bank: bank.name,
				country: bank.country,
				date: date.toISOString().split('T')[0],
				time: '14:00',
				current_rate: bank.current,
				expected_rate: bank.current + (Math.random() - 0.5) * 0.5,
				probability_hike: prob_hike,
				probability_hold: prob_hold,
				probability_cut: prob_cut,
				impact: index < 3 ? 'high' : index < 6 ? 'medium' : 'low'
			};
		});

		// Sort by date
		upcomingMeetings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	}

	function generateYieldCurveData() {
		const maturities = ['1M', '3M', '6M', '1Y', '2Y', '5Y', '10Y', '30Y'];
		
		countries.forEach(country => {
			yieldCurveData[country.code] = maturities.map(maturity => {
				const baseYield = country.code === 'JP' ? 0.5 : 
								 country.code === 'CH' ? 1.5 : 
								 country.code === 'EU' ? 3.0 : 4.5;
				
				const maturityMultiplier = maturities.indexOf(maturity) * 0.3;
				const yield_value = baseYield + maturityMultiplier + (Math.random() - 0.5) * 0.5;

				return {
					maturity,
					yield: Math.max(0, yield_value),
					change_1d: (Math.random() - 0.5) * 0.2,
					change_1w: (Math.random() - 0.5) * 0.5,
					change_1m: (Math.random() - 0.5) * 1.0
				};
			});
		});
	}

	function generateRateDifferentials() {
		const pairs = [
			'USD-EUR', 'USD-GBP', 'USD-JPY', 'USD-CHF',
			'EUR-GBP', 'EUR-JPY', 'GBP-JPY', 'AUD-USD'
		];

		rateDifferentials = pairs.map(pair => {
			const rate_diff = (Math.random() - 0.5) * 4;
			const change_1m = (Math.random() - 0.5) * 0.5;
			
			let trend: 'widening' | 'narrowing' | 'stable' = 'stable';
			if (Math.abs(change_1m) > 0.2) {
				trend = change_1m > 0 ? 'widening' : 'narrowing';
			}

			return {
				pair,
				rate_diff,
				change_1m,
				trend
			};
		});
	}

	function getImpactColor(impact: string): string {
		switch (impact) {
			case 'high': return 'text-red-600 bg-red-50';
			case 'medium': return 'text-yellow-600 bg-yellow-50';
			case 'low': return 'text-green-600 bg-green-50';
			default: return 'text-gray-600 bg-gray-50';
		}
	}

	function getProbabilityColor(probability: number): string {
		if (probability >= 70) return 'bg-green-500';
		if (probability >= 50) return 'bg-yellow-500';
		if (probability >= 30) return 'bg-orange-500';
		return 'bg-red-500';
	}

	function getTrendColor(trend: string): string {
		switch (trend) {
			case 'widening': return 'text-green-600';
			case 'narrowing': return 'text-red-600';
			default: return 'text-gray-600';
		}
	}

	function formatRate(rate: number): string {
		return rate.toFixed(2) + '%';
	}

	function formatChange(change: number): string {
		const sign = change >= 0 ? '+' : '';
		return `${sign}${change.toFixed(2)}bp`;
	}

	function refreshData() {
		isLoading = true;
		setTimeout(() => {
			generateMockMeetings();
			generateYieldCurveData();
			generateRateDifferentials();
			isLoading = false;
		}, 1000);
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getDaysUntil(dateString: string): number {
		const today = new Date();
		const meetingDate = new Date(dateString);
		const diffTime = meetingDate.getTime() - today.getTime();
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}

	// Get selected country data
	$: selectedCountryData = yieldCurveData[selectedCountry] || [];
	$: selectedCountryInfo = countries.find(c => c.code === selectedCountry);
</script>

<svelte:head>
	<title>Interest Rates Dashboard - Economic Overview</title>
	<meta name="description" content="Track central bank meetings, interest rate probabilities, yield curves, and rate differentials." />
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
		<div>
			<div class="flex items-center gap-4 mb-2">
				<a href="/economic-overview" class="flex items-center gap-2 text-teal-600 hover:text-teal-700 transition-colors">
					<ArrowLeft size={20} />
					<span>Back to Overview</span>
				</a>
			</div>
			<h1 class="text-3xl font-bold text-navy">Interest Rates Dashboard</h1>
			<p class="text-gray-600 mt-2">Central bank meetings, rate probabilities, and yield curve analysis</p>
		</div>
		
		<div class="flex items-center gap-3">
			<button
				on:click={refreshData}
				disabled={isLoading}
				class="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
			>
				<RefreshCw class="w-4 h-4 {isLoading ? 'animate-spin' : ''}" />
				Refresh Data
			</button>
		</div>
	</div>

	<!-- Upcoming Central Bank Meetings -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Calendar class="w-5 h-5 text-blue-600" />
			Upcoming Central Bank Meetings
		</h2>
		
		<div class="space-y-4">
			{#each upcomingMeetings.slice(0, 5) as meeting}
				<div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
					<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div class="flex-1">
							<div class="flex items-center gap-3 mb-2">
								<h3 class="font-semibold text-navy">{meeting.bank}</h3>
								<span class="px-2 py-1 rounded-full text-xs font-medium {getImpactColor(meeting.impact)}">
									{meeting.impact.toUpperCase()}
								</span>
							</div>
							<div class="flex items-center gap-4 text-sm text-gray-600">
								<span class="flex items-center gap-1">
									<Calendar class="w-4 h-4" />
									{formatDate(meeting.date)}
								</span>
								<span class="flex items-center gap-1">
									<Clock class="w-4 h-4" />
									{meeting.time}
								</span>
								<span class="flex items-center gap-1">
									<Percent class="w-4 h-4" />
									Current: {formatRate(meeting.current_rate)}
								</span>
								<span class="text-xs bg-gray-100 px-2 py-1 rounded">
									{getDaysUntil(meeting.date)} days
								</span>
							</div>
						</div>
						
						<!-- Rate Probabilities -->
						<div class="grid grid-cols-3 gap-2 text-center text-xs">
							<div class="p-2 bg-red-50 rounded">
								<div class="font-semibold text-red-700">Cut</div>
								<div class="text-red-600">{meeting.probability_cut}%</div>
							</div>
							<div class="p-2 bg-gray-50 rounded">
								<div class="font-semibold text-gray-700">Hold</div>
								<div class="text-gray-600">{meeting.probability_hold}%</div>
							</div>
							<div class="p-2 bg-green-50 rounded">
								<div class="font-semibold text-green-700">Hike</div>
								<div class="text-green-600">{meeting.probability_hike}%</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Yield Curve Analysis -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<div class="flex items-center justify-between mb-4">
			<h2 class="text-xl font-semibold text-navy flex items-center gap-2">
				<Activity class="w-5 h-5 text-teal-600" />
				Government Bond Yield Curve
			</h2>

			<!-- Country Selector -->
			<div class="flex items-center gap-2">
				<label for="country-select" class="text-sm font-medium text-gray-700">Country:</label>
				<select
					id="country-select"
					bind:value={selectedCountry}
					class="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
				>
					{#each countries as country}
						<option value={country.code}>{country.name} ({country.currency})</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Yield Curve Chart Placeholder -->
		<div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
			<div class="text-center text-gray-500">
				<Activity size={48} class="mx-auto mb-4 opacity-50" />
				<p class="text-lg font-medium">Yield Curve Chart</p>
				<p class="text-sm">Government bond yields across maturities</p>
				{#if selectedCountryInfo}
					<p class="text-xs mt-2">{selectedCountryInfo.name} ({selectedCountryInfo.currency})</p>
				{/if}
			</div>
		</div>

		<!-- Yield Data Table -->
		{#if selectedCountryData.length > 0}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-gray-200">
							<th class="text-left py-2 px-3 font-semibold text-gray-700">Maturity</th>
							<th class="text-center py-2 px-3 font-semibold text-gray-700">Yield</th>
							<th class="text-center py-2 px-3 font-semibold text-gray-700">1D Change</th>
							<th class="text-center py-2 px-3 font-semibold text-gray-700">1W Change</th>
							<th class="text-center py-2 px-3 font-semibold text-gray-700">1M Change</th>
						</tr>
					</thead>
					<tbody>
						{#each selectedCountryData as yield_data}
							<tr class="border-b border-gray-100 hover:bg-gray-50">
								<td class="py-2 px-3 font-medium text-navy">{yield_data.maturity}</td>
								<td class="text-center py-2 px-3 font-semibold">{formatRate(yield_data.yield)}</td>
								<td class="text-center py-2 px-3 {yield_data.change_1d >= 0 ? 'text-green-600' : 'text-red-600'}">
									{formatChange(yield_data.change_1d * 100)}
								</td>
								<td class="text-center py-2 px-3 {yield_data.change_1w >= 0 ? 'text-green-600' : 'text-red-600'}">
									{formatChange(yield_data.change_1w * 100)}
								</td>
								<td class="text-center py-2 px-3 {yield_data.change_1m >= 0 ? 'text-green-600' : 'text-red-600'}">
									{formatChange(yield_data.change_1m * 100)}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>

	<!-- Rate Differentials -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Globe class="w-5 h-5 text-indigo-600" />
			Interest Rate Differentials
		</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each rateDifferentials as differential}
				<div class="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
					<div class="flex items-center justify-between mb-2">
						<div class="font-semibold text-navy">{differential.pair}</div>
						<span class="px-2 py-1 rounded-full text-xs font-medium {getTrendColor(differential.trend)} bg-gray-50">
							{differential.trend.toUpperCase()}
						</span>
					</div>
					<div class="flex items-center justify-between">
						<div>
							<div class="text-lg font-bold text-navy">{formatRate(Math.abs(differential.rate_diff))}</div>
							<div class="text-sm text-gray-600">Rate Differential</div>
						</div>
						<div class="text-right">
							<div class="flex items-center gap-1 {differential.change_1m >= 0 ? 'text-green-600' : 'text-red-600'}">
								{#if differential.change_1m >= 0}
									<TrendingUp class="w-4 h-4" />
								{:else}
									<TrendingDown class="w-4 h-4" />
								{/if}
								<span class="text-sm font-medium">
									{differential.change_1m >= 0 ? '+' : ''}{formatRate(differential.change_1m)}
								</span>
							</div>
							<div class="text-xs text-gray-600">1M Change</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Rate Probability Table -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h2 class="text-xl font-semibold text-navy mb-4 flex items-center gap-2">
			<Percent class="w-5 h-5 text-orange-600" />
			Market-Implied Rate Probabilities
		</h2>

		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-gray-200">
						<th class="text-left py-3 px-4 font-semibold text-gray-700">Central Bank</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Current Rate</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Next Meeting</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Cut Probability</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Hold Probability</th>
						<th class="text-center py-3 px-4 font-semibold text-gray-700">Hike Probability</th>
					</tr>
				</thead>
				<tbody>
					{#each upcomingMeetings as meeting}
						<tr class="border-b border-gray-100 hover:bg-gray-50">
							<td class="py-3 px-4">
								<div class="font-semibold text-navy">{meeting.bank}</div>
								<div class="text-sm text-gray-600">{meeting.country}</div>
							</td>
							<td class="text-center py-3 px-4 font-semibold text-navy">
								{formatRate(meeting.current_rate)}
							</td>
							<td class="text-center py-3 px-4 text-sm text-gray-600">
								{formatDate(meeting.date)}
							</td>
							<td class="text-center py-3 px-4">
								<div class="flex items-center justify-center">
									<div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
										<div
											class="bg-red-500 h-2 rounded-full"
											style="width: {meeting.probability_cut}%"
										></div>
									</div>
									<span class="text-sm font-medium">{meeting.probability_cut}%</span>
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="flex items-center justify-center">
									<div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
										<div
											class="bg-gray-500 h-2 rounded-full"
											style="width: {meeting.probability_hold}%"
										></div>
									</div>
									<span class="text-sm font-medium">{meeting.probability_hold}%</span>
								</div>
							</td>
							<td class="text-center py-3 px-4">
								<div class="flex items-center justify-center">
									<div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
										<div
											class="bg-green-500 h-2 rounded-full"
											style="width: {meeting.probability_hike}%"
										></div>
									</div>
									<span class="text-sm font-medium">{meeting.probability_hike}%</span>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	<!-- Information Panel -->
	<div class="bg-gray-50 rounded-xl p-6">
		<div class="flex items-start gap-3">
			<Info class="w-5 h-5 text-gray-600 mt-1" />
			<div>
				<h3 class="font-semibold text-gray-700 mb-2">About Interest Rates Data</h3>
				<div class="text-sm text-gray-600 space-y-1">
					<p>• Central bank meeting dates and rate probabilities are derived from market pricing of interest rate derivatives.</p>
					<p>• Yield curves show government bond yields across different maturities, indicating market expectations for future rates.</p>
					<p>• Rate differentials between countries can influence currency movements and capital flows.</p>
					<p>• Higher probability of rate changes typically increases currency volatility around meeting dates.</p>
					<p>• This data should be combined with economic indicators and central bank communications for complete analysis.</p>
				</div>
			</div>
		</div>
	</div>
</div>

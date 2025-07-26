<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown, Globe } from '@lucide/svelte';

	// Props
	export let selectedCurrency: string = 'USD';
	export let availableCurrencies: string[] = ['USD', 'EUR', 'GBP', 'JPY', 'NZD'];
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let disabled: boolean = false;

	// Internal state
	let isOpen = false;

	const dispatch = createEventDispatcher<{
		change: string;
	}>();

	// Currency display names and flags
	const currencyInfo: Record<string, { name: string; flag: string; description: string }> = {
		USD: { name: 'US Dollar', flag: '🇺🇸', description: 'United States' },
		EUR: { name: 'Euro', flag: '🇪🇺', description: 'European Union' },
		GBP: { name: 'British Pound', flag: '🇬🇧', description: 'United Kingdom' },
		JPY: { name: 'Japanese Yen', flag: '🇯🇵', description: 'Japan' },
		NZD: { name: 'New Zealand Dollar', flag: '🇳🇿', description: 'New Zealand' }
	};

	// Size classes
	$: sizeClasses = {
		small: 'px-3 py-2 text-sm',
		medium: 'px-4 py-3 text-base',
		large: 'px-5 py-4 text-lg'
	}[size];

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function selectCurrency(currency: string) {
		selectedCurrency = currency;
		dispatch('change', currency);
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.currency-selector')) {
			isOpen = false;
		}
	}

	$: selectedInfo = currencyInfo[selectedCurrency];
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="currency-selector relative">
	<!-- Selected Currency Display -->
	<button
		on:click={toggleDropdown}
		class="w-full flex items-center justify-between border border-gray-300 rounded-lg bg-white transition-colors
			{sizeClasses}
			{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'}
			{isOpen ? 'border-teal-500 ring-2 ring-teal-500' : ''}"
		{disabled}
	>
		<div class="flex items-center gap-3">
			<Globe class="w-5 h-5 text-gray-400" />
			{#if selectedInfo}
				<div class="flex items-center gap-2">
					<span class="text-xl">{selectedInfo.flag}</span>
					<div class="text-left">
						<div class="font-semibold text-navy">{selectedCurrency}</div>
						<div class="text-xs text-gray-600">{selectedInfo.description}</div>
					</div>
				</div>
			{:else}
				<span class="text-gray-500">Select currency...</span>
			{/if}
		</div>
		<ChevronDown class="w-5 h-5 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}" />
	</button>

	<!-- Dropdown -->
	{#if isOpen}
		<div class="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
			<div class="max-h-64 overflow-y-auto">
				{#each availableCurrencies as currency}
					{@const info = currencyInfo[currency]}
					<button
						on:click={() => selectCurrency(currency)}
						class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0
							{selectedCurrency === currency ? 'bg-teal-50 text-teal-700' : ''}"
					>
						<div class="flex items-center gap-3">
							<span class="text-xl">{info.flag}</span>
							<div>
								<div class="font-semibold text-navy">{currency}</div>
								<div class="text-sm text-gray-600">{info.name}</div>
								<div class="text-xs text-gray-500">{info.description}</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.currency-selector {
		/* Ensure dropdown appears above other elements */
		z-index: 10;
	}
</style>

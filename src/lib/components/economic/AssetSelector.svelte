<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Search, ChevronDown, X } from '@lucide/svelte';
	import type { AssetData } from '$lib/types/economic';

	// Props
	export let assets: AssetData[] = [];
	export let selectedAsset: string = '';
	export let selectedAssets: string[] = [];
	export let multiSelect: boolean = false;
	export let showSearch: boolean = true;
	export let placeholder: string = 'Select asset...';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let disabled: boolean = false;

	// Internal state
	let isOpen = false;
	let searchTerm = '';
	let searchInput: HTMLInputElement;

	const dispatch = createEventDispatcher<{
		change: string;
		multiChange: string[];
	}>();

	// Filter assets based on search term
	$: filteredAssets = assets.filter(asset => 
		asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
		asset.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Get selected asset data
	$: selectedAssetData = assets.find(asset => asset.symbol === selectedAsset);

	// Size classes
	$: sizeClasses = {
		small: 'px-3 py-2 text-sm',
		medium: 'px-4 py-3 text-base',
		large: 'px-5 py-4 text-lg'
	}[size];

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
		if (isOpen && showSearch) {
			setTimeout(() => searchInput?.focus(), 100);
		}
	}

	function selectAsset(asset: AssetData) {
		if (multiSelect) {
			const newSelection = selectedAssets.includes(asset.symbol)
				? selectedAssets.filter(s => s !== asset.symbol)
				: [...selectedAssets, asset.symbol];
			dispatch('multiChange', newSelection);
		} else {
			selectedAsset = asset.symbol;
			dispatch('change', asset.symbol);
			isOpen = false;
		}
		searchTerm = '';
	}

	function removeAsset(assetSymbol: string) {
		if (multiSelect) {
			const newSelection = selectedAssets.filter(s => s !== assetSymbol);
			dispatch('multiChange', newSelection);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		}
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.asset-selector')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="asset-selector relative">
	<!-- Single Select Display -->
	{#if !multiSelect}
		<button
			on:click={toggleDropdown}
			class="w-full flex items-center justify-between border border-gray-600 rounded-lg bg-gray-700 transition-colors
				{sizeClasses}
				{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'}
				{isOpen ? 'border-teal-500 ring-2 ring-teal-500' : ''}"
			{disabled}
		>
			<div class="flex items-center gap-3">
				{#if selectedAssetData}
					<div>
						<div class="font-semibold text-gray-100">{selectedAssetData.symbol}</div>
						<div class="text-xs text-gray-300">{selectedAssetData.name}</div>
					</div>
				{:else}
					<span class="text-gray-400">{placeholder}</span>
				{/if}
			</div>
			<ChevronDown class="w-5 h-5 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}" />
		</button>
	{/if}

	<!-- Multi Select Display -->
	{#if multiSelect}
		<div class="w-full border border-gray-300 rounded-lg bg-white {sizeClasses} min-h-[2.5rem]
			{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500'}">
			
			<div class="flex flex-wrap gap-2">
				{#each selectedAssets as assetSymbol}
					{@const asset = assets.find(a => a.symbol === assetSymbol)}
					{#if asset}
						<span class="inline-flex items-center gap-1 px-2 py-1 bg-teal-900/30 text-teal-400 rounded-md text-sm">
							{asset.symbol}
							<button
								on:click={() => removeAsset(assetSymbol)}
								class="hover:bg-teal-800 rounded-full p-0.5"
								disabled={disabled}
							>
								<X class="w-3 h-3" />
							</button>
						</span>
					{/if}
				{/each}
				
				<button
					on:click={toggleDropdown}
					class="text-gray-400 hover:text-gray-300 text-sm"
					disabled={disabled}
				>
					{selectedAssets.length === 0 ? placeholder : 'Add more...'}
				</button>
			</div>
		</div>
	{/if}

	<!-- Dropdown -->
	{#if isOpen}
		<div class="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-64 overflow-hidden">
			<!-- Search Input -->
			{#if showSearch}
				<div class="p-3 border-b border-gray-600">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							bind:this={searchInput}
							bind:value={searchTerm}
							type="text"
							placeholder="Search assets..."
							class="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-gray-700 text-gray-100"
						/>
					</div>
				</div>
			{/if}

			<!-- Asset List -->
			<div class="max-h-48 overflow-y-auto">
				{#each filteredAssets as asset}
					<button
						on:click={() => selectAsset(asset)}
						class="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-600 last:border-b-0
							{multiSelect && selectedAssets.includes(asset.symbol) ? 'bg-teal-900/30 text-teal-400' : ''}
							{!multiSelect && selectedAsset === asset.symbol ? 'bg-teal-900/30 text-teal-400' : ''}"
					>
						<div class="flex items-center justify-between">
							<div>
								<div class="font-semibold text-gray-100">{asset.symbol}</div>
								<div class="text-sm text-gray-300">{asset.name}</div>
							</div>
							<div class="text-right">
								<div class="font-semibold text-gray-100">{asset.price.toFixed(asset.symbol.includes('JPY') ? 2 : 4)}</div>
								<div class="text-sm {asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}">
									{asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
								</div>
							</div>
						</div>
					</button>
				{:else}
					<div class="px-4 py-3 text-center text-gray-400">
						No assets found
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.asset-selector {
		/* Ensure dropdown appears above other elements */
		z-index: 10;
	}
</style>

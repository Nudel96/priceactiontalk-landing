<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ChevronDown } from '@lucide/svelte';
	import CurrencyIcon from '$lib/components/icons/CurrencyIcon.svelte';

	export let selectedAsset: string = 'USD';
	export let availableAssets: Array<{
		code: string;
		name: string;
		type: 'currency' | 'precious_metal';
	}> = [];

	const dispatch = createEventDispatcher<{
		change: string;
	}>();

	let isOpen = false;

	function selectAsset(asset: string) {
		selectedAsset = asset;
		isOpen = false;
		dispatch('change', asset);
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	// Get selected asset info
	$: selectedAssetInfo = availableAssets.find(a => a.code === selectedAsset);

	// Group assets by type
	$: groupedAssets = availableAssets.reduce((acc, asset) => {
		if (!acc[asset.type]) {
			acc[asset.type] = [];
		}
		acc[asset.type].push(asset);
		return acc;
	}, {} as Record<string, typeof availableAssets>);
</script>

<div class="relative">
	<button
		type="button"
		on:click={toggleDropdown}
		class="w-full flex items-center justify-between p-3 bg-gray-700 border border-gray-600 rounded-lg hover:border-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
	>
		<div class="flex items-center gap-3">
			{#if selectedAssetInfo}
				<CurrencyIcon currency={selectedAssetInfo.code} size={24} />
				<div class="text-left">
					<div class="font-semibold text-gray-100">{selectedAssetInfo.code}</div>
					<div class="text-sm text-gray-300">{selectedAssetInfo.name}</div>
				</div>
			{/if}
		</div>
		<ChevronDown class="w-5 h-5 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}" />
	</button>

	{#if isOpen}
		<div class="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg">
			{#each Object.entries(groupedAssets) as [type, assets]}
				<div class="p-2">
					<div class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
						{type === 'currency' ? 'Currencies' : 'Precious Metals'}
					</div>
					{#each assets as asset}
						<button
							type="button"
							on:click={() => selectAsset(asset.code)}
							class="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors {selectedAsset === asset.code ? 'bg-teal-900/30 text-teal-400' : 'text-gray-300'}"
						>
							<CurrencyIcon currency={asset.code} size={20} />
							<div class="text-left">
								<div class="font-medium">{asset.code}</div>
								<div class="text-sm text-gray-400">{asset.name}</div>
							</div>
						</button>
					{/each}
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Click outside to close -->
{#if isOpen}
	<div
		class="fixed inset-0 z-0"
		on:click={() => isOpen = false}
		on:keydown={(e) => e.key === 'Escape' && (isOpen = false)}
		role="button"
		tabindex="-1"
	></div>
{/if}

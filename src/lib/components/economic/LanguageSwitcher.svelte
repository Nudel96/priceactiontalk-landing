<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Globe, Check } from '@lucide/svelte';

	// Props
	export let currentLanguage: 'en' | 'de' = 'en';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let showLabel: boolean = true;
	export let disabled: boolean = false;

	// Available languages
	const languages = [
		{ code: 'en', name: 'English', flag: '🇺🇸' },
		{ code: 'de', name: 'Deutsch', flag: '🇩🇪' }
	] as const;

	// Internal state
	let isOpen = false;

	const dispatch = createEventDispatcher<{
		change: 'en' | 'de';
	}>();

	// Size configurations
	const sizeConfig = {
		small: {
			button: 'px-2 py-1 text-xs',
			dropdown: 'text-xs',
			icon: 'w-3 h-3'
		},
		medium: {
			button: 'px-3 py-2 text-sm',
			dropdown: 'text-sm',
			icon: 'w-4 h-4'
		},
		large: {
			button: 'px-4 py-3 text-base',
			dropdown: 'text-base',
			icon: 'w-5 h-5'
		}
	};

	$: config = sizeConfig[size];
	$: currentLang = languages.find(lang => lang.code === currentLanguage);

	function toggleDropdown() {
		if (disabled) return;
		isOpen = !isOpen;
	}

	function selectLanguage(langCode: 'en' | 'de') {
		if (langCode !== currentLanguage) {
			dispatch('change', langCode);
		}
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
		if (!target.closest('.language-switcher')) {
			isOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} on:keydown={handleKeydown} />

<div class="language-switcher relative">
	<!-- Language Button -->
	<button
		on:click={toggleDropdown}
		class="inline-flex items-center gap-2 border border-gray-300 rounded-lg bg-white transition-colors
			{config.button}
			{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500'}
			{isOpen ? 'border-teal-500 ring-2 ring-teal-500' : ''}"
		{disabled}
		title="Change language"
	>
		<Globe class={config.icon + ' text-gray-600'} />
		
		{#if showLabel && currentLang}
			<span class="font-medium text-gray-700">
				{currentLang.flag} {currentLang.name}
			</span>
		{:else if currentLang}
			<span class="font-medium text-gray-700">
				{currentLang.flag}
			</span>
		{/if}
		
		<svg 
			class="{config.icon} text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}" 
			fill="none" 
			stroke="currentColor" 
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	<!-- Language Dropdown -->
	{#if isOpen}
		<div class="absolute z-50 mt-1 w-full min-w-[140px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
			{#each languages as language}
				<button
					on:click={() => selectLanguage(language.code)}
					class="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors {config.dropdown}
						{language.code === currentLanguage ? 'bg-teal-50 text-teal-700' : 'text-gray-700'}"
				>
					<div class="flex items-center gap-2">
						<span>{language.flag}</span>
						<span class="font-medium">{language.name}</span>
					</div>
					
					{#if language.code === currentLanguage}
						<Check class="w-4 h-4 text-teal-600" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		/* Ensure dropdown appears above other elements */
		z-index: 10;
	}
</style>

<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { Sun, Moon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let mounted = false;

	onMount(() => {
		// Initialize theme on mount
		theme.init();
		mounted = true;
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<!-- Theme Toggle Button -->
<button
	on:click={toggleTheme}
	class="relative inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 
		bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
		border border-gray-200 dark:border-gray-600
		focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
	title={$theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
	aria-label={$theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
>
	{#if mounted}
		{#if $theme === 'light'}
			<!-- Moon icon for switching to dark mode -->
			<Moon class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-200" />
		{:else}
			<!-- Sun icon for switching to light mode -->
			<Sun class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-200" />
		{/if}
	{:else}
		<!-- Loading state - show moon by default -->
		<Moon class="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-200" />
	{/if}
</button>
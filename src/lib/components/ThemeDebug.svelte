<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let htmlClasses = '';
	let currentTheme = '';

	onMount(() => {
		// Check initial state
		updateDebugInfo();
		
		// Subscribe to theme changes
		const unsubscribe = theme.subscribe(newTheme => {
			currentTheme = newTheme;
			setTimeout(updateDebugInfo, 100);
		});

		return unsubscribe;
	});

	function updateDebugInfo() {
		htmlClasses = document.documentElement.className;
		currentTheme = $theme;
	}

	function forceToggle() {
		console.log('Force toggle clicked');
		theme.toggle();
		setTimeout(updateDebugInfo, 200);
	}
</script>

<div class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 text-sm">
	<h3 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Theme Debug</h3>
	
	<div class="space-y-1 text-gray-700 dark:text-gray-300">
		<div>Store Theme: <span class="font-mono">{currentTheme}</span></div>
		<div>HTML Classes: <span class="font-mono">{htmlClasses || 'none'}</span></div>
		<div>Dark Class: <span class="font-mono">{htmlClasses.includes('dark') ? 'YES' : 'NO'}</span></div>
	</div>
	
	<button 
		on:click={forceToggle}
		class="mt-2 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs"
	>
		Force Toggle
	</button>
	
	<!-- Test element to show theme working -->
	<div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
		<div class="text-gray-900 dark:text-gray-100 text-xs">
			This should change color with theme
		</div>
	</div>
</div>

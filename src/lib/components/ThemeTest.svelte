<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let htmlClasses = '';
	let computedBg = '';

	onMount(() => {
		updateDebugInfo();

		// Subscribe to theme changes
		const unsubscribe = theme.subscribe(() => {
			setTimeout(updateDebugInfo, 100);
		});

		return unsubscribe;
	});

	function updateDebugInfo() {
		htmlClasses = document.documentElement.className;

		// Check computed style of a test element
		const testEl = document.querySelector('.theme-test-bg');
		if (testEl) {
			computedBg = getComputedStyle(testEl).backgroundColor;
		}
	}

	function forceApplyTheme() {
		const isDark = $theme === 'dark';
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		updateDebugInfo();
	}
</script>

<!-- Simple test component to verify theme classes work -->
<div class="fixed top-4 left-4 z-50 space-y-2">
	<!-- Test basic conditional classes -->
	<div class="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
		<h3 class="text-gray-900 dark:text-gray-100 font-bold mb-2">Theme Test</h3>
		<p class="text-gray-700 dark:text-gray-300 text-sm">Current theme: {$theme}</p>
		<p class="text-gray-600 dark:text-gray-400 text-xs">HTML classes: {htmlClasses || 'none'}</p>
		<p class="text-gray-600 dark:text-gray-400 text-xs">Dark class: {htmlClasses.includes('dark') ? 'YES' : 'NO'}</p>

		<div class="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded theme-test-bg">
			<span class="text-gray-800 dark:text-gray-200 text-xs">This should change with theme</span>
			<div class="text-xs text-gray-500 dark:text-gray-400">BG: {computedBg}</div>
		</div>

		<!-- Test card class -->
		<div class="card mt-2">
			<p class="text-gray-900 dark:text-gray-100 text-xs">Card class test</p>
		</div>

		<!-- Buttons -->
		<div class="mt-2 space-x-1">
			<button
				on:click={() => theme.toggle()}
				class="px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs"
			>
				Toggle Theme
			</button>
			<button
				on:click={forceApplyTheme}
				class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
			>
				Force Apply
			</button>
		</div>
	</div>
</div>

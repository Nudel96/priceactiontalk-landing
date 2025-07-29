<script lang="ts">
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme';

	// Initialize theme when app mounts
	onMount(() => {
		theme.init();
	});
</script>

<!-- App content -->
<slot />

<style>
	/* Global theme transition styles */
	:global(html) {
		transition: background-color 0.2s ease-in-out;
	}
	
	:global(body) {
		transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
	}
	
	/* Ensure smooth transitions for all elements */
	:global(*) {
		transition-property: background-color, border-color, color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 150ms;
	}
	
	/* Base body styling for both themes */
	:global(body) {
		background-color: #f9fafb; /* bg-gray-50 */
		color: #111827; /* text-gray-900 */
	}

	:global(.dark body) {
		background-color: #111827; /* dark:bg-gray-900 */
		color: #f9fafb; /* dark:text-gray-100 */
	}
</style>

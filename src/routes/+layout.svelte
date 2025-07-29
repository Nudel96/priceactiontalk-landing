<script>
	import '../app.css';
	import { onMount } from 'svelte';

	// Apply permanent dark theme on app startup
	onMount(() => {
		// Set permanent dark theme
		document.documentElement.classList.add('dark');
		document.documentElement.classList.remove('light');
	});
</script>

<slot />

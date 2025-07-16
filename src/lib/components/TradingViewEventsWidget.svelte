<script lang="ts">
	/* eslint-disable svelte/no-dom-manipulating */
	import { onMount, onDestroy } from 'svelte';
	let container: HTMLDivElement;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
		script.async = true;
		script.type = 'text/javascript';
		script.innerHTML = JSON.stringify({
			colorTheme: 'dark',
			isTransparent: false,
			width: '100%',
			height: '100%',
			locale: 'en',
			importanceFilter: '0,1',
			countryFilter: 'us,de,gb,in,jp,cn'
		});
		container.appendChild(script);
	});

	onDestroy(() => {
		if (container) {
			container.innerHTML = '';
		}
	});
</script>

<div class="tradingview-widget-container h-full">
	<div bind:this={container} class="tradingview-widget-container__widget h-full"></div>
</div>

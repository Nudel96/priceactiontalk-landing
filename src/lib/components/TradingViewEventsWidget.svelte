<script lang="ts">
	import { onMount } from 'svelte';

	declare global {
		interface Window {
			TradingView: {
				widget: (options: Record<string, unknown>) => void;
			};
		}
	}

	let container: HTMLDivElement;

	onMount(() => {
		// wait until TradingView global is available
		if (!window.TradingView) return;
		// initialize widget using the container element
		new window.TradingView.widget({
			container_id: container,
			colorTheme: 'dark',
			isTransparent: false,
			width: '100%',
			height: '100%',
			locale: 'en',
			importanceFilter: '0,1',
			countryFilter: 'us,de,gb,in,jp,cn'
		});
	});
</script>

<svelte:head>
	<script src="https://s3.tradingview.com/external-embedding/embed-widget-events.js"></script>
</svelte:head>

<div bind:this={container} class="h-full"></div>

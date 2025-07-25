<script lang="ts">
	import { onMount } from 'svelte';

	let widgetContainer: HTMLDivElement;

	onMount(() => {
		// TradingView Economic Calendar Widget
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
		script.async = true;
		script.innerHTML = JSON.stringify({
			"colorTheme": "dark",
			"isTransparent": false,
			"width": "100%",
			"height": "100%",
			"locale": "en",
			"importanceFilter": "-1,0,1",
			"countryFilter": "us,eu,jp,gb,ch,au,ca,nz,cn"
		});

		if (widgetContainer) {
			widgetContainer.appendChild(script);
		}

		return () => {
			// Cleanup if needed
			if (widgetContainer && script.parentNode) {
				script.parentNode.removeChild(script);
			}
		};
	});
</script>

<div class="tradingview-widget-container h-full w-full">
	<div bind:this={widgetContainer} class="tradingview-widget-container__widget h-full w-full"></div>
	<div class="tradingview-widget-copyright">
		<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
			<span class="blue-text">Track all markets on TradingView</span>
		</a>
	</div>
</div>

<style>
	.tradingview-widget-copyright {
		font-size: 13px !important;
		line-height: 32px !important;
		text-align: center !important;
		vertical-align: middle !important;
		font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif !important;
		color: #B2B5BE !important;
	}

	.tradingview-widget-copyright .blue-text {
		color: #2962FF !important;
	}

	.tradingview-widget-copyright a {
		text-decoration: none !important;
		color: #B2B5BE !important;
	}

	.tradingview-widget-copyright a:visited {
		color: #B2B5BE !important;
	}

	.tradingview-widget-copyright a:hover .blue-text {
		color: #1E53E5 !important;
	}

	.tradingview-widget-copyright a:active .blue-text {
		color: #1848CC !important;
	}

	.tradingview-widget-copyright a:visited .blue-text {
		color: #2962FF !important;
	}
</style>

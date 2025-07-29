<script lang="ts">
	import { TrendingUp, TrendingDown, Minus, BarChart3, HelpCircle } from '@lucide/svelte';

	export let bias: string;
	export let size: number = 20;
	export let className: string = '';

	// Bias icon and color mapping
	const biasConfig = {
		'STRONG_BULLISH': { 
			icon: TrendingUp, 
			color: 'text-green-600', 
			bgColor: 'bg-green-50',
			label: 'Strong Bullish'
		},
		'BULLISH': { 
			icon: BarChart3, 
			color: 'text-green-500', 
			bgColor: 'bg-green-50',
			label: 'Bullish'
		},
		'NEUTRAL': { 
			icon: Minus, 
			color: 'text-gray-500', 
			bgColor: 'bg-gray-50',
			label: 'Neutral'
		},
		'BEARISH': { 
			icon: TrendingDown, 
			color: 'text-red-500', 
			bgColor: 'bg-red-50',
			label: 'Bearish'
		},
		'STRONG_BEARISH': { 
			icon: TrendingDown, 
			color: 'text-red-600', 
			bgColor: 'bg-red-50',
			label: 'Strong Bearish'
		}
	};

	$: config = biasConfig[bias] || { 
		icon: HelpCircle, 
		color: 'text-gray-400', 
		bgColor: 'bg-gray-50',
		label: 'Unknown'
	};
</script>

<div 
	class="inline-flex items-center justify-center rounded-full {config.bgColor} {className}"
	style="width: {size + 8}px; height: {size + 8}px;"
	title={config.label}
>
	<svelte:component 
		this={config.icon} 
		size={size} 
		class={config.color}
	/>
</div>

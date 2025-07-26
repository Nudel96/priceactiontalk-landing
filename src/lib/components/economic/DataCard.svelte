<script lang="ts">
	import { TrendingUp, TrendingDown, Minus } from '@lucide/svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';

	// Props
	export let title: string;
	export let value: string | number;
	export let change: number | undefined = undefined;
	export let changePercent: number | undefined = undefined;
	export let icon: any = undefined;
	export let color: string = 'blue';
	export let size: 'small' | 'medium' | 'large' = 'medium';
	export let loading: boolean = false;
	export let error: string | undefined = undefined;
	export let subtitle: string | undefined = undefined;
	export let trend: 'up' | 'down' | 'neutral' | undefined = undefined;
	export let clickable: boolean = false;
	export let href: string | undefined = undefined;

	// Color schemes
	const colorSchemes = {
		blue: {
			bg: 'bg-blue-50',
			icon: 'text-blue-600',
			title: 'text-blue-700',
			value: 'text-blue-900'
		},
		green: {
			bg: 'bg-green-50',
			icon: 'text-green-600',
			title: 'text-green-700',
			value: 'text-green-900'
		},
		red: {
			bg: 'bg-red-50',
			icon: 'text-red-600',
			title: 'text-red-700',
			value: 'text-red-900'
		},
		yellow: {
			bg: 'bg-yellow-50',
			icon: 'text-yellow-600',
			title: 'text-yellow-700',
			value: 'text-yellow-900'
		},
		purple: {
			bg: 'bg-purple-50',
			icon: 'text-purple-600',
			title: 'text-purple-700',
			value: 'text-purple-900'
		},
		teal: {
			bg: 'bg-teal-50',
			icon: 'text-teal-600',
			title: 'text-teal-700',
			value: 'text-teal-900'
		},
		gray: {
			bg: 'bg-gray-50',
			icon: 'text-gray-600',
			title: 'text-gray-700',
			value: 'text-gray-900'
		}
	};

	// Size configurations
	const sizeConfig = {
		small: {
			padding: 'p-4',
			iconSize: 16,
			titleSize: 'text-sm',
			valueSize: 'text-lg',
			changeSize: 'text-xs'
		},
		medium: {
			padding: 'p-6',
			iconSize: 20,
			titleSize: 'text-base',
			valueSize: 'text-2xl',
			changeSize: 'text-sm'
		},
		large: {
			padding: 'p-8',
			iconSize: 24,
			titleSize: 'text-lg',
			valueSize: 'text-3xl',
			changeSize: 'text-base'
		}
	};

	$: scheme = colorSchemes[color] || colorSchemes.blue;
	$: config = sizeConfig[size];

	// Determine trend from change if not explicitly provided
	$: calculatedTrend = trend || (
		change !== undefined ? (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral') :
		changePercent !== undefined ? (changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral') :
		'neutral'
	);

	// Format value
	$: formattedValue = typeof value === 'number' ? 
		(value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` :
		 value >= 1000 ? `${(value / 1000).toFixed(1)}K` :
		 value.toLocaleString()) : 
		value;

	// Format change
	$: formattedChange = change !== undefined ? 
		`${change >= 0 ? '+' : ''}${change.toFixed(2)}` : '';

	$: formattedChangePercent = changePercent !== undefined ? 
		`${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%` : '';

	// Change color
	$: changeColor = calculatedTrend === 'up' ? 'text-green-600' :
					 calculatedTrend === 'down' ? 'text-red-600' :
					 'text-gray-600';

	// Trend icon
	$: TrendIcon = calculatedTrend === 'up' ? TrendingUp :
				   calculatedTrend === 'down' ? TrendingDown :
				   Minus;

	function handleClick() {
		if (href) {
			window.location.href = href;
		}
	}
</script>

<!-- Card Container -->
<div 
	class="bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-200
		{config.padding}
		{clickable || href ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : ''}
		{loading ? 'animate-pulse' : ''}"
	on:click={handleClick}
	on:keydown={(e) => e.key === 'Enter' && handleClick()}
	role={clickable || href ? 'button' : undefined}
	tabindex={clickable || href ? 0 : undefined}
>
	<!-- Loading State -->
	{#if loading}
		<div class="flex items-center justify-center h-24">
			<LoadingSpinner size="medium" />
		</div>
	
	<!-- Error State -->
	{:else if error}
		<div class="text-center">
			<div class="text-red-600 {config.titleSize} font-medium mb-2">Error</div>
			<div class="text-red-500 text-sm">{error}</div>
		</div>
	
	<!-- Normal State -->
	{:else}
		<!-- Header with Icon and Title -->
		<div class="flex items-center justify-between mb-3">
			<div class="flex items-center gap-3">
				{#if icon}
					<div class="p-2 rounded-lg {scheme.bg}">
						<svelte:component this={icon} size={config.iconSize} class={scheme.icon} />
					</div>
				{/if}
				<div>
					<h3 class="font-semibold {config.titleSize} {scheme.title}">{title}</h3>
					{#if subtitle}
						<p class="text-xs text-gray-600 mt-1">{subtitle}</p>
					{/if}
				</div>
			</div>
			
			<!-- Trend Indicator -->
			{#if calculatedTrend !== 'neutral' && (change !== undefined || changePercent !== undefined)}
				<div class="flex items-center gap-1 {changeColor}">
					<TrendIcon size={16} />
				</div>
			{/if}
		</div>

		<!-- Value -->
		<div class="mb-2">
			<div class="font-bold {config.valueSize} {scheme.value}">{formattedValue}</div>
		</div>

		<!-- Change Information -->
		{#if change !== undefined || changePercent !== undefined}
			<div class="flex items-center gap-2 {config.changeSize}">
				{#if change !== undefined}
					<span class="font-medium {changeColor}">
						{formattedChange}
					</span>
				{/if}
				{#if changePercent !== undefined}
					<span class="font-medium {changeColor}">
						({formattedChangePercent})
					</span>
				{/if}
				{#if calculatedTrend !== 'neutral'}
					<TrendIcon size={12} class={changeColor} />
				{/if}
			</div>
		{/if}
	{/if}
</div>

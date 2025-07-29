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

	// Color schemes - Permanent Dark Theme
	const colorSchemes = {
		blue: {
			bg: 'bg-blue-900/20',
			icon: 'text-blue-400',
			title: 'text-blue-300',
			value: 'text-blue-100'
		},
		green: {
			bg: 'bg-green-900/20',
			icon: 'text-green-400',
			title: 'text-green-300',
			value: 'text-green-100'
		},
		red: {
			bg: 'bg-red-900/20',
			icon: 'text-red-400',
			title: 'text-red-300',
			value: 'text-red-100'
		},
		yellow: {
			bg: 'bg-yellow-900/20',
			icon: 'text-yellow-400',
			title: 'text-yellow-300',
			value: 'text-yellow-100'
		},
		purple: {
			bg: 'bg-purple-900/20',
			icon: 'text-purple-400',
			title: 'text-purple-300',
			value: 'text-purple-100'
		},
		teal: {
			bg: 'bg-teal-900/20',
			icon: 'text-teal-400',
			title: 'text-teal-300',
			value: 'text-teal-100'
		},
		gray: {
			bg: 'bg-gray-700',
			icon: 'text-gray-400',
			title: 'text-gray-300',
			value: 'text-gray-100'
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

	// Change color with dark mode support
	$: changeColor = calculatedTrend === 'up' ? 'text-green-600 dark:text-green-400' :
					 calculatedTrend === 'down' ? 'text-red-600 dark:text-red-400' :
					 'text-gray-600 dark:text-gray-400';

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
	class="bg-gray-800 rounded-xl shadow-md border border-gray-600 transition-all duration-200
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
						<p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
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

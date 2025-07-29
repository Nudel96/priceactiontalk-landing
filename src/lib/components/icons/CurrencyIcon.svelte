<script lang="ts">
	export let currency: string;
	export let size: number = 24;
	export let className: string = '';

	// Professional currency icon mapping using CSS-based flag icons
	const currencyConfig = {
		'USD': { code: 'US', name: 'United States Dollar', color: '#1f2937' },
		'EUR': { code: 'EU', name: 'Euro', color: '#1e40af' },
		'GBP': { code: 'GB', name: 'British Pound', color: '#dc2626' },
		'JPY': { code: 'JP', name: 'Japanese Yen', color: '#dc2626' },
		'AUD': { code: 'AU', name: 'Australian Dollar', color: '#059669' },
		'CAD': { code: 'CA', name: 'Canadian Dollar', color: '#dc2626' },
		'CHF': { code: 'CH', name: 'Swiss Franc', color: '#dc2626' },
		'CNY': { code: 'CN', name: 'Chinese Yuan', color: '#dc2626' },
		'NZD': { code: 'NZ', name: 'New Zealand Dollar', color: '#1e40af' },
		'XAU': { code: 'GOLD', name: 'Gold', color: '#f59e0b' },
		'XAG': { code: 'SILVER', name: 'Silver', color: '#6b7280' }
	};

	$: config = currencyConfig[currency as keyof typeof currencyConfig] || { code: currency, name: currency, color: '#6b7280' };
	$: isMetals = currency === 'XAU' || currency === 'XAG';
</script>

<div
	class="inline-flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors duration-200 {className}"
	style="width: {size}px; height: {size}px; min-width: {size}px;"
	title={config.name}
>
	{#if isMetals}
		<!-- Special icons for precious metals -->
		{#if currency === 'XAU'}
			<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={config.color} stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<path d="M12 6v12"/>
				<path d="M6 12h12"/>
			</svg>
		{:else if currency === 'XAG'}
			<svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke={config.color} stroke-width="2">
				<circle cx="12" cy="12" r="10"/>
				<path d="M8 12h8"/>
				<path d="M12 8v8"/>
			</svg>
		{/if}
	{:else}
		<!-- Currency code for regular currencies -->
		<span 
			class="text-xs font-bold"
			style="color: {config.color}; font-size: {size * 0.25}px;"
		>
			{config.code.slice(0, 2)}
		</span>
	{/if}
</div>

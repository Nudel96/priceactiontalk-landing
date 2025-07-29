<script lang="ts">
	import {
		TrendingUp, TrendingDown, BarChart3, Target, RotateCcw,
		BookOpen, MessageSquare, Trophy, DollarSign,
		Activity, Minus, HelpCircle, RefreshCw, Loader2
	} from '@lucide/svelte';

	export let iconType: string;
	export let size: number = 20;
	export let className: string = '';

	// Professional icon mapping for all emoji replacements
	const iconMap = {
		// Bias scoring icons
		'strong-bullish': TrendingUp,
		'bullish': BarChart3,
		'neutral': Minus,
		'bearish': TrendingDown,
		'strong-bearish': TrendingDown,
		'unknown': HelpCircle,
		
		// Navigation and action icons
		'market-overview': BarChart3,
		'bias-scoring': Target,
		'dashboard-overview': Activity,
		'refresh': RefreshCw,
		'loading': Loader2,
		
		// Activity icons
		'lesson': BookOpen,
		'forum': MessageSquare,
		'analysis': BarChart3,
		'level': Trophy,
		'trade': DollarSign,
		
		// Default fallback
		'default': Activity
	};

	$: IconComponent = iconMap[iconType] || iconMap['default'];
</script>

<svelte:component 
	this={IconComponent} 
	size={size} 
	class={className}
/>

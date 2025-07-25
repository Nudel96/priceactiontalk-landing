<script lang="ts">
	import { Plus, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, TrendingDown, Minus, ExternalLink } from '@lucide/svelte';

	// Currency pairs and metals
	const tradingPairs = [
		// Major pairs
		'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
		// Minor pairs
		'EURGBP', 'EURJPY', 'GBPJPY', 'EURCHF', 'GBPCHF', 'AUDCAD', 'AUDJPY',
		// Exotic pairs
		'USDTRY', 'USDZAR', 'USDMXN', 'USDSEK', 'USDNOK', 'USDPLN',
		// Metals
		'XAUUSD', 'XAGUSD', 'XPTUSD', 'XPDUSD'
	];

	const biasOptions = [
		{ value: 'long', label: 'Long', icon: TrendingUp, color: 'text-green-600', bgColor: 'bg-green-100' },
		{ value: 'short', label: 'Short', icon: TrendingDown, color: 'text-red-600', bgColor: 'bg-red-100' },
		{ value: 'consolidation', label: 'Consolidation', icon: Minus, color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
	];

	// Mock market analysis posts
	const marketPosts = [
		{
			id: 1,
			title: 'EURUSD Long Setup - Bullish Breakout Expected',
			pair: 'EURUSD',
			bias: 'long',
			description: 'Strong support at 1.0850 level with bullish divergence on RSI. Expecting breakout above 1.0920 resistance.',
			author: 'forex_analyst',
			authorLevel: 8,
			tradingViewLink: 'https://www.tradingview.com/x/AoxuZGe3/',
			timestamp: '2h ago',
			upvotes: 15,
			downvotes: 2,
			comments: 8,
			userVote: null // null, 'up', or 'down'
		},
		{
			id: 2,
			title: 'GBPJPY Short - Bearish Flag Pattern',
			pair: 'GBPJPY',
			bias: 'short',
			description: 'Clear bearish flag formation after strong downtrend. Target 185.50 level with stop above 188.20.',
			author: 'chart_master',
			authorLevel: 12,
			tradingViewLink: 'https://www.tradingview.com/x/BpxvHGf4/',
			timestamp: '4h ago',
			upvotes: 23,
			downvotes: 1,
			comments: 12,
			userVote: 'up'
		},
		{
			id: 3,
			title: 'XAUUSD Consolidation - Range Trading Opportunity',
			pair: 'XAUUSD',
			bias: 'consolidation',
			description: 'Gold trading in tight range between 2010-2030. Good for scalping strategies.',
			author: 'gold_trader',
			authorLevel: 6,
			tradingViewLink: 'https://www.tradingview.com/x/CqywIHg5/',
			timestamp: '6h ago',
			upvotes: 8,
			downvotes: 3,
			comments: 5,
			userVote: null
		}
	];

	let showNewPostModal = false;
	let newPost = {
		pair: '',
		bias: '',
		title: '',
		description: '',
		tradingViewLink: ''
	};

	const handleNewPost = () => {
		showNewPostModal = true;
	};

	const handleSubmitPost = () => {
		// Validate TradingView link
		if (!newPost.tradingViewLink.includes('tradingview.com')) {
			alert('Please enter a valid TradingView link');
			return;
		}

		// Submit post logic would go here
		console.log('Submitting post:', newPost);
		showNewPostModal = false;

		// Reset form
		newPost = {
			pair: '',
			bias: '',
			title: '',
			description: '',
			tradingViewLink: ''
		};
	};

	const handleVote = (postId: number, voteType: 'up' | 'down') => {
		// Vote logic would go here
		console.log(`Voting ${voteType} on post ${postId}`);
	};

	const getBiasInfo = (bias: string) => {
		return biasOptions.find(option => option.value === bias) || biasOptions[0];
	};

	const getTierInfo = (level: number) => {
		if (level <= 3) return { name: 'D-Tier', color: 'text-gray-600' };
		if (level <= 6) return { name: 'C-Tier', color: 'text-green-600' };
		if (level <= 9) return { name: 'B-Tier', color: 'text-blue-600' };
		if (level <= 12) return { name: 'A-Tier', color: 'text-purple-600' };
		return { name: 'A++-Tier', color: 'text-yellow-600' };
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-navy">Market Analysis</h1>
			<p class="text-gray-600 mt-2">Share your trading ideas and market analysis with the community</p>
		</div>
		<button
			on:click={handleNewPost}
			class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
			<Plus class="w-4 h-4" />
			New Analysis
		</button>
	</div>

	<!-- Market Analysis Posts -->
	<div class="space-y-6">
		{#each marketPosts as post}
			{@const biasInfo = getBiasInfo(post.bias)}
			{@const tierInfo = getTierInfo(post.authorLevel)}
			<div class="bg-white rounded-xl shadow-md p-6">
				<!-- Post Header -->
				<div class="flex items-start justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
							<span class="text-teal-600 font-semibold text-sm">{post.author.charAt(0).toUpperCase()}</span>
						</div>
						<div>
							<div class="font-semibold text-navy">{post.author}</div>
							<div class="text-sm text-gray-500">
								Level {post.authorLevel} • <span class="{tierInfo.color}">{tierInfo.name}</span> • {post.timestamp}
							</div>
						</div>
					</div>
					<div class="flex items-center gap-2">
						<span class="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded font-medium">{post.pair}</span>
						<div class="flex items-center gap-1 px-2 py-1 {biasInfo.bgColor} rounded">
							<svelte:component this={biasInfo.icon} class="w-4 h-4 {biasInfo.color}" />
							<span class="text-sm font-medium {biasInfo.color}">{biasInfo.label}</span>
						</div>
					</div>
				</div>

				<!-- Post Content -->
				<h3 class="text-lg font-semibold text-navy mb-2">{post.title}</h3>
				<p class="text-gray-700 mb-4">{post.description}</p>

				<!-- TradingView Link -->
				<div class="bg-gray-50 rounded-lg p-3 mb-4">
					<div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
						<ExternalLink class="w-4 h-4" />
						<span>TradingView Analysis</span>
					</div>
					<a
						href={post.tradingViewLink}
						target="_blank"
						rel="noopener noreferrer"
						class="text-teal-600 hover:text-teal-700 text-sm break-all">
						{post.tradingViewLink}
					</a>
				</div>

				<!-- Post Actions -->
				<div class="flex items-center justify-between pt-4 border-t border-gray-100">
					<div class="flex items-center gap-4">
						<button
							on:click={() => handleVote(post.id, 'up')}
							class="flex items-center gap-1 px-3 py-1 rounded-lg transition-colors {post.userVote === 'up' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-600'}">
							<ThumbsUp class="w-4 h-4" />
							<span class="text-sm">{post.upvotes}</span>
						</button>
						<button
							on:click={() => handleVote(post.id, 'down')}
							class="flex items-center gap-1 px-3 py-1 rounded-lg transition-colors {post.userVote === 'down' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-600'}">
							<ThumbsDown class="w-4 h-4" />
							<span class="text-sm">{post.downvotes}</span>
						</button>
					</div>
					<button class="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
						<MessageCircle class="w-4 h-4" />
						<span class="text-sm">{post.comments} comments</span>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- New Analysis Modal -->
{#if showNewPostModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<h3 class="text-xl font-semibold text-navy mb-6">Share Market Analysis</h3>

			<form on:submit|preventDefault={handleSubmitPost} class="space-y-4">
				<!-- Pair Selection -->
				<div>
					<label for="pair-select" class="block text-sm font-medium text-gray-700 mb-2">Trading Pair</label>
					<select
						id="pair-select"
						bind:value={newPost.pair}
						required
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
						<option value="">Select a pair...</option>
						{#each tradingPairs as pair}
							<option value={pair}>{pair}</option>
						{/each}
					</select>
				</div>

				<!-- Bias Selection -->
				<div>
					<span class="block text-sm font-medium text-gray-700 mb-2">Market Bias</span>
					<div class="grid grid-cols-3 gap-3">
						{#each biasOptions as option}
							<button
								type="button"
								on:click={() => newPost.bias = option.value}
								class="p-3 border-2 rounded-lg transition-all {newPost.bias === option.value
									? 'border-teal-500 bg-teal-50'
									: 'border-gray-200 hover:border-gray-300'}">
								<div class="flex items-center justify-center gap-2">
									<svelte:component this={option.icon} class="w-5 h-5 {option.color}" />
									<span class="font-medium">{option.label}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>

				<!-- Title -->
				<div>
					<label for="title-input" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
					<input
						id="title-input"
						type="text"
						bind:value={newPost.title}
						required
						placeholder="Enter analysis title..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="description-textarea" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
					<textarea
						id="description-textarea"
						bind:value={newPost.description}
						required
						rows="4"
						placeholder="Describe your analysis, key levels, and reasoning..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none">
					</textarea>
				</div>

				<!-- TradingView Link -->
				<div>
					<label for="tradingview-input" class="block text-sm font-medium text-gray-700 mb-2">TradingView Link</label>
					<input
						id="tradingview-input"
						type="url"
						bind:value={newPost.tradingViewLink}
						required
						placeholder="https://www.tradingview.com/x/..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
					<p class="text-xs text-gray-500 mt-1">Share your TradingView chart analysis link</p>
				</div>

				<!-- Modal Actions -->
				<div class="flex gap-3 pt-4">
					<button
						type="button"
						on:click={() => showNewPostModal = false}
						class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg transition-colors">
						Cancel
					</button>
					<button
						type="submit"
						class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg transition-colors">
						Share Analysis
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<script lang="ts">
	import { Plus, ThumbsUp, ThumbsDown, MessageCircle, TrendingUp, TrendingDown, Minus, ExternalLink } from '@lucide/svelte';
	import MarketPostModal from '$lib/components/MarketPostModal.svelte';
	import { language, t } from '$lib/stores/language';

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

	// Mock market posts data
	let marketPosts = [
		{
			id: 1,
			author: 'TradeMaster',
			avatar: '/avatars/trademaster.jpg',
			timestamp: '2h ago',
			tradingPair: 'EURUSD',
			bias: 'long',
			content: 'Strong bullish momentum on EUR/USD. Looking for continuation above 1.0850 resistance.',
			tradingViewLink: 'https://www.tradingview.com/x/abc123/',
			likes: 12,
			dislikes: 2,
			comments: 5,
			userLiked: false,
			userDisliked: false
		},
		{
			id: 2,
			author: 'ForexGuru',
			avatar: '/avatars/forexguru.jpg',
			timestamp: '4h ago',
			tradingPair: 'GBPUSD',
			bias: 'short',
			content: 'GBP showing weakness. Expecting retest of 1.2650 support level.',
			tradingViewLink: 'https://www.tradingview.com/x/def456/',
			likes: 8,
			dislikes: 1,
			comments: 3,
			userLiked: true,
			userDisliked: false
		},
		{
			id: 3,
			author: 'GoldTrader',
			avatar: '/avatars/goldtrader.jpg',
			timestamp: '6h ago',
			tradingPair: 'XAUUSD',
			bias: 'consolidation',
			content: 'Gold consolidating in range. Waiting for clear breakout direction.',
			tradingViewLink: 'https://www.tradingview.com/x/ghi789/',
			likes: 15,
			dislikes: 0,
			comments: 7,
			userLiked: false,
			userDisliked: false
		}
	];

	let showModal = false;
	let selectedPair = '';
	let selectedBias = '';

	// Function to get bias info
	const getBiasInfo = (bias: string) => {
		return biasOptions.find(option => option.value === bias) || biasOptions[0];
	};

	// Function to handle like/dislike
	const handleLike = (postId: number) => {
		marketPosts = marketPosts.map(post => {
			if (post.id === postId) {
				if (post.userLiked) {
					return { ...post, likes: post.likes - 1, userLiked: false };
				} else {
					const newPost = { ...post, likes: post.likes + 1, userLiked: true };
					if (post.userDisliked) {
						newPost.dislikes = post.dislikes - 1;
						newPost.userDisliked = false;
					}
					return newPost;
				}
			}
			return post;
		});
	};

	const handleDislike = (postId: number) => {
		marketPosts = marketPosts.map(post => {
			if (post.id === postId) {
				if (post.userDisliked) {
					return { ...post, dislikes: post.dislikes - 1, userDisliked: false };
				} else {
					const newPost = { ...post, dislikes: post.dislikes + 1, userDisliked: true };
					if (post.userLiked) {
						newPost.likes = post.likes - 1;
						newPost.userLiked = false;
					}
					return newPost;
				}
			}
			return post;
		});
	};

	// Function to open modal
	const openModal = () => {
		showModal = true;
	};

	// Function to handle new post
	const handleNewPost = (event: CustomEvent) => {
		const newPost = {
			id: marketPosts.length + 1,
			author: 'You',
			avatar: '/avatars/default.jpg',
			timestamp: 'now',
			...event.detail,
			likes: 0,
			dislikes: 0,
			comments: 0,
			userLiked: false,
			userDisliked: false
		};
		marketPosts = [newPost, ...marketPosts];
		showModal = false;
	};
</script>

<svelte:head>
	<title>{t('market.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<div class="bg-gray-800 border-b border-gray-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">{t('market.title', $language)}</h1>
				<p class="text-gray-400 mt-1">{t('market.subtitle', $language)}</p>
			</div>
			<button
				on:click={openModal}
				class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
			>
				<Plus size="20" />
				{t('market.new-post', $language)}
			</button>
		</div>
	</div>

	<!-- Market Posts -->
	<div class="max-w-4xl mx-auto p-6">
		<div class="space-y-6">
			{#each marketPosts as post}
				{@const biasInfo = getBiasInfo(post.bias)}
				{@const BiasIcon = biasInfo.icon}
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<!-- Post Header -->
					<div class="flex items-center justify-between mb-4">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
								<span class="text-sm font-medium">{post.author[0]}</span>
							</div>
							<div>
								<h3 class="font-medium text-white">{post.author}</h3>
								<p class="text-sm text-gray-400">{post.timestamp}</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-300">{post.tradingPair}</span>
							<div class="flex items-center gap-1 px-2 py-1 rounded-full {biasInfo.bgColor}">
								<BiasIcon size="14" class={biasInfo.color} />
								<span class="text-xs font-medium {biasInfo.color}">{biasInfo.label}</span>
							</div>
						</div>
					</div>

					<!-- Post Content -->
					<div class="mb-4">
						<p class="text-gray-300">{post.content}</p>
					</div>

					<!-- TradingView Link -->
					{#if post.tradingViewLink}
						<div class="mb-4">
							<a
								href={post.tradingViewLink}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 text-sm"
							>
								<ExternalLink size="16" />
								{t('market.view-chart', $language)}
							</a>
						</div>
					{/if}

					<!-- Post Actions -->
					<div class="flex items-center gap-4 pt-4 border-t border-gray-700">
						<button
							on:click={() => handleLike(post.id)}
							class="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors {post.userLiked ? 'text-green-400' : ''}"
						>
							<ThumbsUp size="18" />
							<span class="text-sm">{post.likes}</span>
						</button>
						<button
							on:click={() => handleDislike(post.id)}
							class="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors {post.userDisliked ? 'text-red-400' : ''}"
						>
							<ThumbsDown size="18" />
							<span class="text-sm">{post.dislikes}</span>
						</button>
						<button class="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
							<MessageCircle size="18" />
							<span class="text-sm">{post.comments}</span>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- Market Post Modal -->
{#if showModal}
	<MarketPostModal
		{tradingPairs}
		{biasOptions}
		on:submit={handleNewPost}
		on:close={() => showModal = false}
	/>
{/if}

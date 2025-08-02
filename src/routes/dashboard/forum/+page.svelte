<script lang="ts">
	import { Plus, MessageSquare, Eye, Clock, User } from '@lucide/svelte';
	import { language, t } from '$lib/stores/language';

	// Mock forum data
	const categories = [
		{ id: 1, name: 'Daily Setups', description: 'Share your daily trading setups and analysis', posts: 156, color: 'bg-blue-600' },
		{ id: 2, name: 'Trading Psychology', description: 'Discuss mindset and psychological aspects of trading', posts: 89, color: 'bg-purple-600' },
		{ id: 3, name: 'Technical Analysis', description: 'Chart patterns, indicators, and technical discussions', posts: 234, color: 'bg-green-600' },
		{ id: 4, name: 'Community Lounge', description: 'General discussions and community chat', posts: 67, color: 'bg-orange-600' },
		{ id: 5, name: 'Education & Resources', description: 'Learning materials, books, and educational content', posts: 123, color: 'bg-teal-600' }
	];

	const recentPosts = [
		{
			id: 1,
			title: 'How do you manage risk in volatile markets?',
			author: 'TraderJoe',
			category: 'Trading Psychology',
			replies: 12,
			views: 156,
			lastReply: '2h ago',
			lastReplyBy: 'ForexGuru'
		},
		{
			id: 2,
			title: 'EUR/USD breakout setup for tomorrow',
			author: 'ChartMaster',
			category: 'Daily Setups',
			replies: 8,
			views: 89,
			lastReply: '4h ago',
			lastReplyBy: 'TradePro'
		},
		{
			id: 3,
			title: 'Best books for understanding market structure?',
			author: 'NewTrader',
			category: 'Education & Resources',
			replies: 15,
			views: 203,
			lastReply: '6h ago',
			lastReplyBy: 'BookWorm'
		},
		{
			id: 4,
			title: 'RSI divergence on GBP/USD daily chart',
			author: 'TechAnalyst',
			category: 'Technical Analysis',
			replies: 6,
			views: 78,
			lastReply: '8h ago',
			lastReplyBy: 'ChartReader'
		},
		{
			id: 5,
			title: 'Weekend market discussion',
			author: 'CommunityMod',
			category: 'Community Lounge',
			replies: 23,
			views: 345,
			lastReply: '1d ago',
			lastReplyBy: 'WeekendTrader'
		}
	];

	let selectedCategory = '';

	const getCategoryColor = (categoryName: string) => {
		const category = categories.find(cat => cat.name === categoryName);
		return category ? category.color : 'bg-gray-600';
	};

	const filteredPosts = selectedCategory 
		? recentPosts.filter(post => post.category === selectedCategory)
		: recentPosts;
</script>

<svelte:head>
	<title>{t('forum.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<div class="bg-gray-800 border-b border-gray-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">{t('forum.title', $language)}</h1>
				<p class="text-gray-400 mt-1">{t('forum.subtitle', $language)}</p>
			</div>
			<button class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
				<Plus size="20" />
				{t('forum.new-post', $language)}
			</button>
		</div>
	</div>

	<div class="max-w-7xl mx-auto p-6">
		<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
			<!-- Categories Sidebar -->
			<div class="lg:col-span-1">
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h2 class="text-lg font-semibold text-white mb-4">{t('forum.categories', $language)}</h2>
					<div class="space-y-2">
						<button
							on:click={() => selectedCategory = ''}
							class="w-full text-left p-3 rounded-lg transition-colors {selectedCategory === '' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
						>
							<div class="font-medium">{t('forum.all-categories', $language)}</div>
							<div class="text-sm text-gray-400">{recentPosts.length} posts</div>
						</button>
						{#each categories as category}
							<button
								on:click={() => selectedCategory = category.name}
								class="w-full text-left p-3 rounded-lg transition-colors {selectedCategory === category.name ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
							>
								<div class="flex items-center gap-2 mb-1">
									<div class="w-3 h-3 rounded-full {category.color}"></div>
									<span class="font-medium">{category.name}</span>
								</div>
								<div class="text-sm text-gray-400">{category.description}</div>
								<div class="text-xs text-gray-500 mt-1">{category.posts} posts</div>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Posts List -->
			<div class="lg:col-span-3">
				<div class="bg-gray-800 rounded-lg border border-gray-700">
					<!-- Posts Header -->
					<div class="p-6 border-b border-gray-700">
						<h2 class="text-lg font-semibold text-white">
							{selectedCategory ? selectedCategory : t('forum.recent-posts', $language)}
						</h2>
					</div>

					<!-- Posts -->
					<div class="divide-y divide-gray-700">
						{#each filteredPosts as post}
							<div class="p-6 hover:bg-gray-700/50 transition-colors cursor-pointer">
								<div class="flex items-start justify-between">
									<div class="flex-1">
										<!-- Post Title -->
										<h3 class="text-white font-medium hover:text-teal-400 transition-colors mb-2">
											{post.title}
										</h3>

										<!-- Post Meta -->
										<div class="flex items-center gap-4 text-sm text-gray-400">
											<div class="flex items-center gap-1">
												<User size="14" />
												<span>{post.author}</span>
											</div>
											<div class="flex items-center gap-1">
												<div class="w-2 h-2 rounded-full {getCategoryColor(post.category)}"></div>
												<span>{post.category}</span>
											</div>
											<div class="flex items-center gap-1">
												<MessageSquare size="14" />
												<span>{post.replies} replies</span>
											</div>
											<div class="flex items-center gap-1">
												<Eye size="14" />
												<span>{post.views} views</span>
											</div>
										</div>

										<!-- Last Reply -->
										<div class="flex items-center gap-2 text-xs text-gray-500 mt-2">
											<Clock size="12" />
											<span>Last reply by {post.lastReplyBy} {post.lastReply}</span>
										</div>
									</div>

									<!-- Reply Count Badge -->
									<div class="flex-shrink-0 ml-4">
										<div class="bg-teal-600 text-white text-sm font-medium px-3 py-1 rounded-full">
											{post.replies}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>

					<!-- Load More -->
					<div class="p-6 border-t border-gray-700 text-center">
						<button class="text-teal-400 hover:text-teal-300 font-medium">
							{t('forum.load-more', $language)}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

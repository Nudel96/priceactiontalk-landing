<script lang="ts">
	import { MessageSquare, Users, Plus, Search, TrendingUp, Brain, Activity, MessageCircle } from '@lucide/svelte';

	// Mock forum data
	const forumCategories = [
		{
			id: 'daily-setups',
			name: 'Daily Setups',
			description: 'Share and discuss your trading setups and ideas for the day',
			icon: TrendingUp,
			iconColor: 'text-blue-500',
			bgColor: 'bg-blue-50',
			threads: 124,
			posts: 1543,
			lastPost: {
				title: 'EURUSD bullish setup for May 15',
				author: 'forex_trader_99',
				time: '2h ago'
			}
		},
		{
			id: 'macros-news',
			name: 'Macros & News',
			description: 'Discuss macro economic trends, news events, and their impact on markets',
			icon: Activity,
			iconColor: 'text-green-500',
			bgColor: 'bg-green-50',
			threads: 87,
			posts: 976,
			lastPost: {
				title: 'CPI data impact on USD pairs',
				author: 'news_analyst',
				time: '4h ago'
			}
		},
		{
			id: 'psychology',
			name: 'Psychology',
			description: 'Trading psychology, discipline, and mindset discussions',
			icon: Brain,
			iconColor: 'text-purple-500',
			bgColor: 'bg-purple-50',
			threads: 56,
			posts: 742,
			lastPost: {
				title: 'How to handle drawdown periods',
				author: 'mindful_trader',
				time: 'yesterday'
			}
		},
		{
			id: 'feedback-analysis',
			name: 'Feedback & Analysis',
			description: 'Get feedback on your trading plans, strategies, and performance',
			icon: MessageCircle,
			iconColor: 'text-orange-500',
			bgColor: 'bg-orange-50',
			threads: 209,
			posts: 1847,
			lastPost: {
				title: 'My 3-month trading plan - feedback needed',
				author: 'trading_newbie',
				time: '3h ago'
			}
		},
		{
			id: 'community-lounge',
			name: 'Community Lounge',
			description: 'General trading discussions and community interaction',
			icon: Users,
			iconColor: 'text-teal-500',
			bgColor: 'bg-teal-50',
			threads: 143,
			posts: 2353,
			lastPost: {
				title: 'Weekend trading reflections thread',
				author: 'community_mod',
				time: '1d ago'
			}
		}
	];

	// Forum statistics
	const forumStats = {
		totalThreads: 619,
		totalPosts: 7461,
		activeMembers: 923,
		newestMember: 'trader_joe'
	};

	let searchQuery = '';
	let showNewThreadModal = false;
	let newThread = {
		title: '',
		content: '',
		category: 'general'
	};

	const handleNewThread = () => {
		showNewThreadModal = true;
	};

	const handleCreateThread = () => {
		if (newThread.title && newThread.content) {
			// Add new thread to the beginning of the list
			const thread = {
				id: Date.now(),
				title: newThread.title,
				content: newThread.content,
				category: newThread.category,
				author: 'demo_user',
				authorLevel: 3,
				replies: 0,
				views: 1,
				lastActivity: 'just now',
				isPinned: false,
				isLocked: false
			};

			console.log('Creating new thread:', thread);

			// Reset form
			newThread = { title: '', content: '', category: 'general' };
			showNewThreadModal = false;
		}
	};

	const handleSearch = () => {
		// Search functionality would be implemented here
		console.log('Searching for:', searchQuery);
	};
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-navy">Forum</h1>
			<div class="flex items-center gap-2 mt-2 text-sm text-gray-600">
				<MessageSquare class="w-4 h-4" />
				<span>Welcome to the PriceActionTalk forum! Share your ideas, ask questions, and engage with the community.</span>
			</div>
		</div>
		<button
			on:click={handleNewThread}
			class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
			<Plus class="w-4 h-4" />
			New Thread
		</button>
	</div>

	<!-- Search Bar -->
	<div class="bg-white rounded-xl shadow-md p-4">
		<div class="flex gap-3">
			<div class="flex-1 relative">
				<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
				<input
					type="text"
					placeholder="Search forums..."
					bind:value={searchQuery}
					class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
				/>
			</div>
			<button
				on:click={handleSearch}
				class="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition-colors">
				Search
			</button>
		</div>
	</div>

	<!-- Forum Categories -->
	<div class="space-y-4">
		{#each forumCategories as category}
			<div class="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
				<div class="flex items-start justify-between">
					<div class="flex items-start gap-4 flex-1">
						<div class="w-12 h-12 {category.bgColor} rounded-lg flex items-center justify-center">
							<svelte:component this={category.icon} class="w-6 h-6 {category.iconColor}" />
						</div>
						<div class="flex-1">
							<h3 class="text-lg font-semibold text-navy mb-1">{category.name}</h3>
							<p class="text-gray-600 text-sm mb-3">{category.description}</p>
							<div class="flex items-center gap-4 text-xs text-gray-500">
								<span>{category.threads} threads</span>
								<span>{category.posts} posts</span>
							</div>
						</div>
					</div>
					<div class="text-right min-w-0 ml-4">
						<div class="text-sm font-medium text-navy truncate max-w-48">{category.lastPost.title}</div>
						<div class="text-xs text-gray-500 mt-1">
							by {category.lastPost.author} • {category.lastPost.time}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Forum Statistics -->
	<div class="bg-white rounded-xl shadow-md p-6">
		<h3 class="text-lg font-semibold text-navy mb-4">Forum Statistics</h3>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
			<div class="text-center">
				<div class="text-2xl font-bold text-teal-600 mb-1">{forumStats.totalThreads}</div>
				<div class="text-sm text-gray-600">Total Threads</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-teal-600 mb-1">{forumStats.totalPosts}</div>
				<div class="text-sm text-gray-600">Total Posts</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-teal-600 mb-1">{forumStats.activeMembers}</div>
				<div class="text-sm text-gray-600">Active Members</div>
			</div>
			<div class="text-center">
				<div class="text-2xl font-bold text-teal-600 mb-1">{forumStats.newestMember}</div>
				<div class="text-sm text-gray-600">Newest Member</div>
			</div>
		</div>
	</div>
</div>

<!-- New Thread Modal (placeholder) -->
{#if showNewThreadModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
			<h3 class="text-lg font-semibold text-navy mb-4">Create New Thread</h3>
			<p class="text-gray-600 mb-4">Thread creation functionality will be implemented here.</p>
			<div class="flex gap-3">
				<button
					on:click={() => showNewThreadModal = false}
					class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition-colors">
					Cancel
				</button>
				<button
					on:click={() => showNewThreadModal = false}
					class="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors">
					Create
				</button>
			</div>
		</div>
	</div>
{/if}

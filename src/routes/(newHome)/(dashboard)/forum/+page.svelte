<script lang="ts">
	import { MessageSquare, Users, Plus, Search, TrendingUp, Brain, Activity, MessageCircle, X } from '@lucide/svelte';

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
	let forumStats = {
		totalThreads: 619,
		totalPosts: 7461,
		activeMembers: 923,
		newestMember: 'trader_joe'
	};

	// Mock threads list
	let threads = [
		{
			id: 1,
			title: 'Best trading books for beginners?',
			author: 'newbie_trader',
			authorLevel: 1,
			category: 'general',
			replies: 23,
			views: 156,
			lastActivity: '2h ago',
			isPinned: false,
			isLocked: false
		},
		{
			id: 2,
			title: 'How to handle losing streaks',
			author: 'struggling_trader',
			authorLevel: 2,
			category: 'psychology',
			replies: 15,
			views: 89,
			lastActivity: '4h ago',
			isPinned: false,
			isLocked: false
		}
	];

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

			// Add to threads list
			threads = [thread, ...threads];

			// Update forum stats
			forumStats.totalThreads += 1;

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

		<!-- Recent Threads -->
		<div class="bg-white rounded-xl shadow-md p-6">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-semibold text-navy">Recent Threads</h2>
				<span class="text-sm text-gray-500">{threads.length} threads</span>
			</div>
			<div class="space-y-4">
				{#each threads as thread}
					<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="font-medium text-navy hover:text-teal-600 cursor-pointer">{thread.title}</h3>
								<div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
									<span>by {thread.author}</span>
									<span class="px-2 py-1 bg-gray-100 rounded-full text-xs">{thread.category}</span>
									<span>{thread.replies} replies</span>
									<span>{thread.views} views</span>
									<span>{thread.lastActivity}</span>
								</div>
							</div>
							{#if thread.isPinned}
								<div class="ml-4 text-yellow-500">📌</div>
							{/if}
							{#if thread.isLocked}
								<div class="ml-2 text-red-500">🔒</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="text-center py-8 text-gray-500">
						<MessageSquare class="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>No threads yet. Be the first to start a discussion!</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- New Thread Modal -->
{#if showNewThreadModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
		<div class="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
			<div class="flex items-center justify-between mb-6">
				<h3 class="text-xl font-semibold text-navy">Create New Thread</h3>
				<button on:click={() => showNewThreadModal = false} class="text-gray-400 hover:text-gray-600">
					<X class="w-5 h-5" />
				</button>
			</div>

			<div class="space-y-4">
				<!-- Category Selection -->
				<div>
					<label for="thread-category" class="block text-sm font-medium text-gray-700 mb-2">Category</label>
					<select
						id="thread-category"
						bind:value={newThread.category}
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
						<option value="general">General Discussion</option>
						<option value="trading-strategies">Trading Strategies</option>
						<option value="market-analysis">Market Analysis</option>
						<option value="psychology">Trading Psychology</option>
						<option value="macros-news">Macros & News</option>
						<option value="community">Community</option>
					</select>
				</div>

				<!-- Thread Title -->
				<div>
					<label for="thread-title" class="block text-sm font-medium text-gray-700 mb-2">Thread Title</label>
					<input
						id="thread-title"
						type="text"
						bind:value={newThread.title}
						placeholder="Enter a descriptive title for your thread"
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
					/>
				</div>

				<!-- Thread Content -->
				<div>
					<label for="thread-content" class="block text-sm font-medium text-gray-700 mb-2">Content</label>
					<textarea
						id="thread-content"
						bind:value={newThread.content}
						rows="6"
						placeholder="Write your post content here..."
						class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none">
					</textarea>
				</div>

				<!-- Guidelines -->
				<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h4 class="font-medium text-blue-900 mb-2">Community Guidelines</h4>
					<ul class="text-sm text-blue-800 space-y-1">
						<li>• Be respectful and constructive in your discussions</li>
						<li>• Use clear and descriptive titles</li>
						<li>• Search existing threads before creating new ones</li>
						<li>• Stay on topic and provide valuable insights</li>
					</ul>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex gap-3 mt-6">
				<button
					on:click={() => showNewThreadModal = false}
					class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
					Cancel
				</button>
				<button
					on:click={handleCreateThread}
					disabled={!newThread.title || !newThread.content}
					class="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
					Create Thread
				</button>
			</div>
		</div>
	</div>
{/if}

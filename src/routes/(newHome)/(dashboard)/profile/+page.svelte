<script lang="ts">
	import { User, Mail, Calendar, TrendingUp, MessageSquare, BookOpen, Trophy, Settings } from '@lucide/svelte';
	import ProfileEditModal from '$lib/components/ProfileEditModal.svelte';

	// Mock user data - in real app this would come from props/stores
	let user = {
		username: 'demo_user',
		email: 'demo@example.com',
		level: 3,
		xp: 250,
		joinDate: '2024-01-15',
		avatar: null,
		country: 'United States',
		stats: {
			forumPosts: 12,
			completedLessons: 15,
			marketAnalyses: 3,
			daysActive: 28,
			tradingChallengesWon: 0
		}
	};

	const getLevelInfo = (level: number) => {
		if (level <= 3) return { description: 'Beginner Trader', color: 'bg-gray-500' };
		if (level <= 6) return { description: 'Developing Trader', color: 'bg-green-500' };
		if (level <= 9) return { description: 'Intermediate Trader', color: 'bg-blue-500' };
		if (level <= 12) return { description: 'Advanced Trader', color: 'bg-purple-500' };
		return { description: 'Expert Trader', color: 'bg-yellow-500' };
	};

	const levelInfo = getLevelInfo(user.level);

	let showEditModal = false;

	const achievements = [
		{ name: 'First Steps', description: 'Completed your first lesson', earned: true, icon: BookOpen },
		{ name: 'Community Member', description: 'Made your first forum post', earned: true, icon: MessageSquare },
		{ name: 'Market Analyst', description: 'Shared your first market analysis', earned: true, icon: TrendingUp },
		{ name: 'Dedicated Learner', description: 'Complete 25 lessons', earned: false, icon: BookOpen },
		{ name: 'Trading Champion', description: 'Win your first trading challenge', earned: false, icon: Trophy }
	];

	const recentActivity = [
		{ type: 'lesson', title: 'Completed "Support and Resistance Basics"', time: '2 hours ago' },
		{ type: 'forum', title: 'Posted in "Daily Setups"', time: '1 day ago' },
		{ type: 'market', title: 'Shared EURUSD analysis', time: '2 days ago' },
		{ type: 'lesson', title: 'Completed "Risk Management Fundamentals"', time: '3 days ago' }
	];

	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'lesson': return BookOpen;
			case 'forum': return MessageSquare;
			case 'market': return TrendingUp;
			default: return User;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case 'lesson': return 'text-blue-500';
			case 'forum': return 'text-green-500';
			case 'market': return 'text-purple-500';
			default: return 'text-gray-500';
		}
	};
</script>

<div class="space-y-6">
	<!-- Profile Header -->
	<div class="bg-gray-800 rounded-xl shadow-md p-6">
		<div class="flex items-start gap-6">
			<div class="w-24 h-24 bg-teal-900/30 rounded-full flex items-center justify-center">
				{#if user.avatar}
					<img src={user.avatar} alt="Profile" class="w-24 h-24 rounded-full object-cover" />
				{:else}
					<User class="w-12 h-12 text-teal-600" />
				{/if}
			</div>
			<div class="flex-1">
				<div class="flex items-center justify-between mb-2">
					<h1 class="text-2xl font-bold text-navy">{user.username}</h1>
					<button
						on:click={() => showEditModal = true}
						class="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-teal-900/30 hover:text-teal-400 rounded-lg transition-colors text-gray-300">
						<Settings class="w-4 h-4" />
						<span class="text-sm">Edit Profile</span>
					</button>
				</div>
				<div class="space-y-2 text-sm text-gray-600">
					<div class="flex items-center gap-2">
						<Mail class="w-4 h-4" />
						<span>{user.email}</span>
					</div>
					<div class="flex items-center gap-2">
						<Calendar class="w-4 h-4" />
						<span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
					</div>
					<div class="flex items-center gap-2">
						<TrendingUp class="w-4 h-4" />
						<span>Level {user.level} • {levelInfo.description}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
		<div class="bg-gray-800 rounded-xl shadow-md p-4 text-center">
			<div class="text-2xl font-bold text-teal-400 mb-1">{user.stats.forumPosts}</div>
			<div class="text-sm text-gray-300">Forum Posts</div>
		</div>
		<div class="bg-gray-800 rounded-xl shadow-md p-4 text-center">
			<div class="text-2xl font-bold text-blue-400 mb-1">{user.stats.completedLessons}</div>
			<div class="text-sm text-gray-300">Lessons Completed</div>
		</div>
		<div class="bg-gray-800 rounded-xl shadow-md p-4 text-center">
			<div class="text-2xl font-bold text-purple-400 mb-1">{user.stats.marketAnalyses}</div>
			<div class="text-sm text-gray-300">Market Analyses</div>
		</div>
		<div class="bg-gray-800 rounded-xl shadow-md p-4 text-center">
			<div class="text-2xl font-bold text-orange-400 mb-1">{user.stats.daysActive}</div>
			<div class="text-sm text-gray-300">Days Active</div>
		</div>
		<div class="bg-gray-800 rounded-xl shadow-md p-4 text-center">
			<div class="text-2xl font-bold text-yellow-400 mb-1">{user.stats.tradingChallengesWon}</div>
			<div class="text-sm text-gray-300">Challenges Won</div>
		</div>
	</div>

	<!-- Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Achievements -->
		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-gray-100 mb-4">Achievements</h3>
			<div class="space-y-3">
				{#each achievements as achievement}
					<div class="flex items-center gap-3 p-3 rounded-lg {achievement.earned ? 'bg-green-900/20' : 'bg-gray-700'}">
						<div class="w-10 h-10 rounded-full flex items-center justify-center {achievement.earned ? 'bg-green-900/30' : 'bg-gray-600'}">
							<svelte:component this={achievement.icon} class="w-5 h-5 {achievement.earned ? 'text-green-400' : 'text-gray-400'}" />
						</div>
						<div class="flex-1">
							<div class="font-medium {achievement.earned ? 'text-gray-100' : 'text-gray-400'}">{achievement.name}</div>
							<div class="text-sm {achievement.earned ? 'text-gray-300' : 'text-gray-400'}">{achievement.description}</div>
						</div>
						{#if achievement.earned}
							<div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
								<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
								</svg>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!-- Recent Activity -->
		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-gray-100 mb-4">Recent Activity</h3>
			<div class="space-y-3">
				{#each recentActivity as activity}
					{@const ActivityIcon = getActivityIcon(activity.type)}
					{@const activityColor = getActivityColor(activity.type)}
					<div class="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
						<div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
							<svelte:component this={ActivityIcon} class="w-4 h-4 {activityColor}" />
						</div>
						<div class="flex-1">
							<div class="font-medium text-gray-100 text-sm">{activity.title}</div>
							<div class="text-xs text-gray-400">{activity.time}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Profile Edit Modal -->
<ProfileEditModal bind:showModal={showEditModal} bind:user />

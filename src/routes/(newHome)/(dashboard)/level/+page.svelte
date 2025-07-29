<script lang="ts">
	import { Trophy, TrendingUp, BookOpen, MessageSquare, Target } from '@lucide/svelte';

	// Mock user data - in real app this would come from props/stores
	const currentUser = {
		level: 3,
		xp: 250,
		username: 'demo_user'
	};

	// XP calculation system - gets progressively harder
	const getXpForLevel = (level: number): number => {
		if (level <= 1) return 0;
		// Exponential growth: level 2 = 100, level 3 = 250, level 4 = 450, etc.
		return Math.floor(50 * level * (level - 1) + 50);
	};

	const getXpToNextLevel = (currentLevel: number): number => {
		return getXpForLevel(currentLevel + 1) - getXpForLevel(currentLevel);
	};

	const getCurrentLevelXp = (currentLevel: number, totalXp: number): number => {
		return totalXp - getXpForLevel(currentLevel);
	};

	// XP sources and their values
	const xpSources = [
		{ name: 'Complete School Lesson', xp: 10, icon: BookOpen, color: 'text-blue-500' },
		{ name: 'Forum Post', xp: 2, icon: MessageSquare, color: 'text-green-500' },
		{ name: 'Market Analysis Post', xp: 5, icon: TrendingUp, color: 'text-purple-500' },
		{ name: 'Trading Challenge Win', xp: 25, icon: Trophy, color: 'text-yellow-500' },
		{ name: 'Daily Login Streak (7 days)', xp: 15, icon: Target, color: 'text-orange-500' }
	];

	// Calculate current level progress
	const xpToNext = getXpToNextLevel(currentUser.level);
	const currentLevelXp = getCurrentLevelXp(currentUser.level, currentUser.xp);
	const progressPercentage = Math.round((currentLevelXp / xpToNext) * 100);

	// Mock top traders data
	const topTraders = [
		{ rank: 1, username: 'master_trader', level: 15, xp: 2250 },
		{ rank: 2, username: 'price_action_pro', level: 12, xp: 1850 },
		{ rank: 3, username: 'forex_guru', level: 11, xp: 1520 },
		{ rank: 4, username: 'chart_wizard', level: 10, xp: 1200 },
		{ rank: 5, username: 'trend_master', level: 9, xp: 950 }
	];

	// User stats
	const userStats = {
		totalXp: currentUser.xp,
		tasksCompleted: 15,
		communityRank: 'Top 15%'
	};

	const getLevelInfo = (level: number) => {
		if (level <= 3) return { description: 'Beginner Trader', color: 'bg-gray-500' };
		if (level <= 6) return { description: 'Developing Trader', color: 'bg-green-500' };
		if (level <= 9) return { description: 'Intermediate Trader', color: 'bg-blue-500' };
		if (level <= 12) return { description: 'Advanced Trader', color: 'bg-purple-500' };
		return { description: 'Expert Trader', color: 'bg-yellow-500' };
	};

	const currentLevelInfo = getLevelInfo(currentUser.level);
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-navy">Level System</h1>
			<p class="text-gray-600 mt-2">Track your progress and compete with other traders</p>
		</div>
		<div class="text-right">
			<div class="text-sm text-gray-500">Current Level</div>
			<div class="text-2xl font-bold text-navy">{currentUser.level}</div>
		</div>
	</div>

	<!-- Current Level Progress -->
	<div class="bg-gray-800 rounded-xl shadow-md p-6">
		<div class="flex items-center justify-between mb-6">
			<div>
				<h2 class="text-xl font-semibold text-gray-100">Level {currentUser.level}</h2>
				<p class="text-gray-300">{currentLevelInfo.description}</p>
			</div>
			<div class="text-right">
				<div class="text-3xl font-bold text-gray-100 mb-1">{currentUser.level}</div>
				<div class="text-sm text-gray-400">Level</div>
			</div>
		</div>

		<div class="mb-4">
			<div class="flex justify-between text-sm mb-2">
				<span class="text-gray-600">Level {currentUser.level}</span>
				<span class="text-gray-600">Level {currentUser.level + 1}</span>
			</div>
			<div class="w-full bg-gray-200 rounded-full h-3">
				<div
					class="h-3 rounded-full bg-teal-500 transition-all duration-300"
					style="width: {progressPercentage}%">
				</div>
			</div>
			<div class="flex justify-between text-xs mt-1 text-gray-500">
				<span>{currentLevelXp} XP</span>
				<span>{xpToNext} XP</span>
			</div>
		</div>

		<p class="text-sm text-gray-600">
			You need <span class="font-semibold text-navy">{xpToNext - currentLevelXp} more XP</span> to reach level {currentUser.level + 1}.
			Keep completing lessons and homework to gain XP and unlock new trading knowledge!
		</p>
	</div>

	<!-- Stats and XP Sources -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Your Stats -->
		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-gray-100 mb-4">Your Stats</h3>
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-teal-900/30 rounded-full flex items-center justify-center">
							<Target class="w-4 h-4 text-teal-400" />
						</div>
						<span class="text-gray-300">Total XP</span>
					</div>
					<span class="font-semibold text-gray-100">{userStats.totalXp} points</span>
				</div>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-green-900/30 rounded-full flex items-center justify-center">
							<BookOpen class="w-4 h-4 text-green-400" />
						</div>
						<span class="text-gray-300">Tasks Completed</span>
					</div>
					<span class="font-semibold text-gray-100">{userStats.tasksCompleted} tasks</span>
				</div>
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="w-8 h-8 bg-purple-900/30 rounded-full flex items-center justify-center">
							<Trophy class="w-4 h-4 text-purple-400" />
						</div>
						<span class="text-gray-300">Community Rank</span>
					</div>
					<span class="font-semibold text-gray-100">{userStats.communityRank}</span>
				</div>
			</div>
		</div>

		<!-- How to Earn XP -->
		<div class="bg-gray-800 rounded-xl shadow-md p-6">
			<h3 class="text-xl font-semibold text-gray-100 mb-4">How to Earn XP</h3>
			<div class="space-y-3">
				{#each xpSources as source}
					<div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
						<div class="flex items-center gap-3">
							<svelte:component this={source.icon} class="w-5 h-5 {source.color}" />
							<span class="text-gray-300 text-sm">{source.name}</span>
						</div>
						<span class="font-semibold text-teal-400">+{source.xp} XP</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Top Traders Leaderboard -->
	<div class="bg-gray-800 rounded-xl shadow-md p-6">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-xl font-semibold text-gray-100">Top Traders</h3>
			<button class="text-teal-400 text-sm hover:underline">View full leaderboard →</button>
		</div>
		<div class="space-y-3">
			{#each topTraders as trader}
				<div class="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
					<div class="flex items-center gap-4">
						<div class="flex items-center justify-center w-8 h-8 rounded-full {trader.rank <= 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'} font-bold text-sm">
							#{trader.rank}
						</div>
						<div>
							<div class="font-semibold text-navy">{trader.username}</div>
							<div class="text-sm text-gray-500">Level {trader.level}</div>
						</div>
					</div>
					<div class="text-right">
						<div class="font-semibold text-navy">{trader.xp} XP</div>
						<div class="text-sm text-gray-500">Level {trader.level}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

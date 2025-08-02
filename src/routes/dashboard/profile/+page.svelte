<script lang="ts">
	import { User, Mail, Calendar, Trophy, TrendingUp, Edit, Save, X } from '@lucide/svelte';
	import { language, t } from '$lib/stores/language';

	// Mock user data
	let user = {
		username: 'TraderPro',
		email: 'traderpro@example.com',
		joinDate: '2023-06-15',
		level: 5,
		xp: 350,
		totalTrades: 47,
		winRate: 68.5,
		totalPnL: 1250.75,
		currentStreak: 3,
		bio: 'Passionate forex trader with 3 years of experience. Love sharing knowledge and learning from the community.',
		achievements: [
			{ id: 1, name: 'First Trade', description: 'Completed your first trade', icon: '🎯', earned: true },
			{ id: 2, name: 'Consistent Trader', description: '10 consecutive profitable days', icon: '📈', earned: true },
			{ id: 3, name: 'Community Helper', description: 'Helped 50+ traders in the forum', icon: '🤝', earned: true },
			{ id: 4, name: 'Risk Manager', description: 'Never risked more than 2% per trade', icon: '🛡️', earned: false },
			{ id: 5, name: 'Master Trader', description: 'Achieved 80%+ win rate over 100 trades', icon: '👑', earned: false }
		]
	};

	let isEditing = false;
	let editedBio = user.bio;

	const getNextLevelXp = (level: number) => (level + 1) * 100;
	const nextLevelXp = getNextLevelXp(user.level);
	const progressToNextLevel = (user.xp / nextLevelXp) * 100;

	const handleEditProfile = () => {
		isEditing = true;
		editedBio = user.bio;
	};

	const handleSaveProfile = () => {
		user.bio = editedBio;
		isEditing = false;
	};

	const handleCancelEdit = () => {
		editedBio = user.bio;
		isEditing = false;
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
</script>

<svelte:head>
	<title>{t('profile.title', $language)} - PriceActionTalk</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
	<!-- Header -->
	<div class="bg-gray-800 border-b border-gray-700 p-6">
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-2xl font-bold text-white">{t('profile.title', $language)}</h1>
				<p class="text-gray-400 mt-1">{t('profile.subtitle', $language)}</p>
			</div>
			{#if !isEditing}
				<button 
					on:click={handleEditProfile}
					class="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors"
				>
					<Edit size="16" />
					{t('profile.edit-profile', $language)}
				</button>
			{/if}
		</div>
	</div>

	<div class="max-w-4xl mx-auto p-6">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Profile Info -->
			<div class="lg:col-span-1">
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<!-- Avatar -->
					<div class="text-center mb-6">
						<div class="w-24 h-24 bg-gray-600 rounded-full mx-auto flex items-center justify-center mb-4">
							<User size="48" class="text-gray-300" />
						</div>
						<h2 class="text-xl font-bold text-white">{user.username}</h2>
						<p class="text-gray-400">Level {user.level} Trader</p>
					</div>

					<!-- Basic Info -->
					<div class="space-y-4">
						<div class="flex items-center gap-3 text-gray-300">
							<Mail size="16" class="text-gray-400" />
							<span class="text-sm">{user.email}</span>
						</div>
						<div class="flex items-center gap-3 text-gray-300">
							<Calendar size="16" class="text-gray-400" />
							<span class="text-sm">Joined {formatDate(user.joinDate)}</span>
						</div>
					</div>

					<!-- Level Progress -->
					<div class="mt-6">
						<div class="flex items-center justify-between text-sm text-gray-400 mb-2">
							<span>{t('profile.progress-to-next-level', $language)}</span>
							<span>{user.xp}/{nextLevelXp} XP</span>
						</div>
						<div class="w-full bg-gray-700 rounded-full h-2">
							<div 
								class="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
								style="width: {progressToNextLevel}%"
							></div>
						</div>
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Bio Section -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-lg font-semibold text-white">{t('profile.about', $language)}</h3>
						{#if isEditing}
							<div class="flex items-center gap-2">
								<button 
									on:click={handleSaveProfile}
									class="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
								>
									<Save size="14" />
									{t('profile.save', $language)}
								</button>
								<button 
									on:click={handleCancelEdit}
									class="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
								>
									<X size="14" />
									{t('profile.cancel', $language)}
								</button>
							</div>
						{/if}
					</div>
					{#if isEditing}
						<textarea 
							bind:value={editedBio}
							class="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 resize-none"
							rows="4"
							placeholder={t('profile.bio-placeholder', $language)}
						></textarea>
					{:else}
						<p class="text-gray-300">{user.bio}</p>
					{/if}
				</div>

				<!-- Trading Stats -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h3 class="text-lg font-semibold text-white mb-4">{t('profile.trading-stats', $language)}</h3>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div class="text-center">
							<div class="text-2xl font-bold text-white">{user.totalTrades}</div>
							<div class="text-sm text-gray-400">{t('profile.total-trades', $language)}</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold text-green-400">{user.winRate}%</div>
							<div class="text-sm text-gray-400">{t('profile.win-rate', $language)}</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold text-teal-400">{formatCurrency(user.totalPnL)}</div>
							<div class="text-sm text-gray-400">{t('profile.total-pnl', $language)}</div>
						</div>
						<div class="text-center">
							<div class="text-2xl font-bold text-blue-400">{user.currentStreak}</div>
							<div class="text-sm text-gray-400">{t('profile.current-streak', $language)}</div>
						</div>
					</div>
				</div>

				<!-- Achievements -->
				<div class="bg-gray-800 rounded-lg border border-gray-700 p-6">
					<h3 class="text-lg font-semibold text-white mb-4">{t('profile.achievements', $language)}</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#each user.achievements as achievement}
							<div class="flex items-center gap-4 p-4 rounded-lg {achievement.earned ? 'bg-gray-700' : 'bg-gray-700/50'} {achievement.earned ? '' : 'opacity-50'}">
								<div class="text-2xl">{achievement.icon}</div>
								<div class="flex-1">
									<h4 class="font-medium text-white">{achievement.name}</h4>
									<p class="text-sm text-gray-400">{achievement.description}</p>
								</div>
								{#if achievement.earned}
									<Trophy size="20" class="text-yellow-400" />
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

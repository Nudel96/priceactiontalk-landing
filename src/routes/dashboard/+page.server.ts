import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Mock user data for demo
	const user = {
		username: 'TraderPro',
		level: 5,
		xp: 350,
		total_trades: 47,
		win_rate: 68.5,
		total_pnl: 1250.75,
		current_streak: 3
	};

	// Placeholder data until backend integration
	const recentMarketPosts = [
		{ id: 1, title: 'EUR/USD trend outlook', author: 'CoachBob', created_at: '2h ago' },
		{ id: 2, title: 'GBP/USD breakout watch', author: 'Alice', created_at: '4h ago' },
		{ id: 3, title: 'USD/JPY resistance levels', author: 'TradeMaster', created_at: '6h ago' }
	];

	const recentForumPosts = [
		{
			id: 1,
			title: 'How do you manage risk?',
			author: 'TraderJoe',
			category: 'Psychology',
			replies: 5,
			created_at: '1h ago'
		},
		{
			id: 2,
			title: 'Best books for beginners',
			author: 'Alice',
			category: 'Community Lounge',
			replies: 8,
			created_at: '3h ago'
		},
		{
			id: 3,
			title: 'EUR/USD analysis',
			author: 'Bob',
			category: 'Daily Setups',
			replies: 3,
			created_at: '5h ago'
		}
	];

	return { user, recentMarketPosts, recentForumPosts };
};

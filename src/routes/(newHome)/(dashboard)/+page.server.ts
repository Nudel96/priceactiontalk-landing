import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Placeholder data until backend integration
	const recentMarketPosts = [
		{ id: 1, title: 'EUR/USD trend outlook', author: 'CoachBob' },
		{ id: 2, title: 'GBP/USD breakout watch', author: 'Alice' }
	];

	const recentForumPosts = [
		{
			id: 1,
			title: 'How do you manage risk?',
			author: { username: 'TraderJoe' },
			category: { name: 'Psychology' },
			comments: 5
		},
		{
			id: 2,
			title: 'Best books for beginners',
			author: { username: 'Alice' },
			category: { name: 'Community Lounge' },
			comments: 8
		},
		{
			id: 3,
			title: 'EUR/USD analysis',
			author: { username: 'Bob' },
			category: { name: 'Daily Setups' },
			comments: 3
		}
	];

	return { recentMarketPosts, recentForumPosts };
};

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
			author: 'TraderJoe'
		},
		{
			id: 2,
			title: 'Best books for beginners',
			author: 'Alice'
		},
		{
			id: 3,
			title: 'EUR/USD analysis',
			author: 'Bob'
		}
	];

	return { recentMarketPosts, recentForumPosts };
};

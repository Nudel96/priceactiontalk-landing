import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Placeholder data until backend integration
	const homeworks = [
		{
			id: 1,
			title: 'Study candlestick patterns',
			deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
			xp: 50
		},
		{
			id: 2,
			title: 'Write in trading journal',
			deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
			xp: 40
		},
		{
			id: 3,
			title: 'Watch price action video',
			deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
			xp: 30
		}
	];

	const threads = [
		{
			id: 1,
			title: 'How do you manage risk?',
			author: { username: 'TraderJoe' },
			category: { name: 'General' },
			comments: 5
		},
		{
			id: 2,
			title: 'Best books for beginners',
			author: { username: 'Alice' },
			category: { name: 'Education' },
			comments: 2
		},
		{
			id: 3,
			title: 'EUR/USD analysis',
			author: { username: 'Bob' },
			category: { name: 'Market' },
			comments: 3
		}
	];

	return { homeworks, threads };
};

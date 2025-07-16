import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

// Dummy user for placeholder authentication
const users = [{ email: 'user@example.com', password: '123456', token: 'abc123' }];

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = await request.json();
	const user = users.find((u) => u.email === email && u.password === password);
	if (user) {
		return json({ token: user.token });
	}
	return json({ error: 'Invalid credentials' }, { status: 401 });
};

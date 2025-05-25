import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

// Hier steht der Dummy-User:
const users = [{ email: 'user@example.com', password: '123456', token: 'abc123' }];

// ...ab hier kommt der Rest vom Code!

import type {Actions} from './$types';
import SurrealDB from 'surrealdb';
import {DB_HOST, DB_NAMESPACE, DB_DATABASE, DB_USERNAME, DB_PASSWORD} from '$env/static/private';

export const actions = {
    waitlist: async ({request}) => {
        const data = await request.formData();
        const email = data.get('email')?.toString().trim();
        
        const db = new SurrealDB();
        await db.connect(DB_HOST);
        await db.use({namespace: DB_NAMESPACE, database: DB_DATABASE});
        await db.signin({
            username: DB_USERNAME,
            password: DB_PASSWORD,
        });

        try {
            let created = await db.create('waitlist', {
                email: email,
            });
            return { success: true, message: 'You have been added to the waitlist!' };
        } catch (error) {
            return { success: false, message: 'Failed to add to waitlist. Please try again later.' };
        }
    }
} satisfies Actions;
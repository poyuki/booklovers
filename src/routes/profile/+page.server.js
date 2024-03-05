import { getUserBooks } from '$lib/firebase/database.server.js';

export async function load({ locals }) {
	const userBooks = await getUserBooks(locals.user.id);
	return { books: userBooks };
}
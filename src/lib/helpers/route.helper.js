import { goto } from '$app/navigation';
import { setUser } from '$lib/firebase/database.client.js';
import { sendJWTToken } from '$lib/firebase/auth.client.js';

export async function afterLogin(url, userId) {
	const route = url.searchParams.get('redirect') || '/';
	await setUser(userId);
	await sendJWTToken();
	await goto(route);
}
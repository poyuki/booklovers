import { readable } from 'svelte/store';
import { query, collection, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase.client.js';

export default readable(null, (set) => {
	const currentTime = Date.now() / 1000;
	const q = query(
		collection(db, 'books'),
		where('created_at', '>', currentTime),
		orderBy('created_at', 'desc'),
		limit(1)
	);

	const unsub = onSnapshot(q, (snapshot) => {
		if (snapshot.docs.length !== 1) return;
		if (snapshot.docChanges().find(d => d.type === 'added')) {
			const book = snapshot.docs[0].data();
			set({ ...book, id: snapshot.docs[0].id });
		}
	});

	return () => {
		unsub();
	};
});
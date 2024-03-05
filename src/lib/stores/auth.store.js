import { readable } from 'svelte/store';
import { is_client } from 'svelte/internal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default readable({ isActive: false, isLoggedIn: false, userId: '' }, (set) => {
	if (is_client) {
		onAuthStateChanged(getAuth(), (user) => {
			if (user) {
				set({ isActive: true, isLoggedIn: true, userId: user.uid });
			} else {
				set({ isActive: true, isLoggedIn: false, userId: '' });
			}
		});
	}
});
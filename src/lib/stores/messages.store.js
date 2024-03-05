import { writable } from 'svelte/store';
import { PUBLIC_ERROR_MESSAGE } from '$env/static/public';

const store = writable({ show: false, message: '', type: 'error' });
export default {
	subscribe: store.subscribe,
	showError: function(message = PUBLIC_ERROR_MESSAGE) {
		store.set({ show: true, message, type: 'error' });
	},
	showSuccess: function(message) {
		store.set({ show: true, message, type: 'success' });
	},
	hide: function() {
		store.set({ show: false, message: '', type: 'success' });
	}
};
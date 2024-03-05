<script>
	import { loginWithGoogle } from '$lib/firebase/auth.client.js';
	import messagesStore from '$lib/stores/messages.store.js';
	import { afterLogin } from '$lib/helpers/route.helper.js';
	import { page } from '$app/stores';

	$page;

	async function login() {
		try {
			const user = await loginWithGoogle();
			await afterLogin($page.url, user.uid);
		} catch (e) {
			if (e.code === 'auth/popup-closed-by-user') {
				return;
			}
			console.error(e);
			messagesStore.showError();
		}
	}
</script>

<div class="row">
	<div class="col">
		<button class="btn btn-primary w-100" on:click={login}>Login with Google</button>
	</div>
</div>
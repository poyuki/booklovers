<script>
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import { loginWithEmailAndPassword } from '$lib/firebase/auth.client.js';
	import { goto } from '$app/navigation';
	import messagesStore from '$lib/stores/messages.store.js';
	import { afterLogin } from '$lib/helpers/route.helper.js';
	import { page } from '$app/stores';

	async function onLogin(e) {
		const data = new FormData(e.target);
		const email = data.get('email');
		const password = data.get('password');
		try {
			const user = await loginWithEmailAndPassword(email, password);
			await afterLogin($page.url, user.uid);
		} catch (e) {
			if (['auth/invalid-credential', 'auth/invalid-email', 'auth/missing-password'].includes(e.code)) {
				messagesStore.showError('Invalid Credentials');
				return;
			}
			console.log(e);
			messagesStore.showError();
		}
	}
</script>
<svelte:head>
	<title>Book Lovers - Login</title>
</svelte:head>
<div class="row">
	<div class="col">
		<h1>Login</h1>
	</div>
</div>
<hr>
<AuthForm btnName="Login" on:submit={onLogin} />
<hr>
<LoginWithGoogle />
<hr>
<div class="row">
	<div class="col">
		<a href="/forgot-password" class="btn btn-warning w-100">Forgot Password</a>
	</div>
</div>

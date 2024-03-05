<script>
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import LoginWithGoogle from '$lib/components/Auth/LoginWithGoogle.svelte';
	import { registerWithEmailAndPassword } from '$lib/firebase/auth.client.js';
	import messagesStore from '$lib/stores/messages.store.js';
	import { goto } from '$app/navigation';
	import { afterLogin } from '$lib/helpers/route.helper.js';
	import { page } from '$app/stores';

	async function onRegister(event) {
		const data = new FormData(event.target);
		const email = data.get('email');
		const password = data.get('password');
		if (!email || !password) {
			messagesStore.showError('Please enter a valid email and password');
			return;
		}

		if (password.length < 6) {
			messagesStore.showError('Password must be 6 characters or more');
			return;
		}

		try {
			const user = await registerWithEmailAndPassword(email, password);
			await afterLogin($page.url, user.uid);
		} catch (e) {
			if (e.code === 'auth/email-already-in-use') {
				messagesStore.showError('You have already registered, please log in.');
				await goto('/login');
				return;
			}
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<svelte:head>
	<title>Book Lovers - Sign Up</title>
</svelte:head>

<div class="row">
	<div class="col">
		<h1>Sign Up</h1>
	</div>
</div>
<hr>
<AuthForm btnName="Sign Up" on:submit={onRegister} />
<hr>
<LoginWithGoogle />
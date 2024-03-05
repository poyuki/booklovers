<script>
	import AuthForm from '$lib/components/Auth/AuthForm.svelte';
	import { mailResetPasswordEmail } from '$lib/firebase/auth.client.js';
	import messagesStore from '$lib/stores/messages.store.js';

	let hideForm = false;

	async function onForgotPassword(e) {
		const data = new FormData(e.target);
		const email = data.get('email');
		try {
			await mailResetPasswordEmail(email);
			hideForm = true;
			messagesStore.showSuccess('Reset Password Email Sent!');
		} catch (err) {
			console.log(err);
			messagesStore.showError();
		}
	}

</script>

<svelte:head>
	<title>Book Lovers = Forgot Password</title>
</svelte:head>
<div class="row">
	<div class="col">
		<h1>Forgot Password</h1>
	</div>
</div>
<hr>
{#if !hideForm }
	<AuthForm withoutPassword="{true}" btnName="Forgot Password" on:submit={onForgotPassword} />
{/if}
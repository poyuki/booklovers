<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import Nav from '$lib/components/Nav.svelte';
	import messagesStore from '$lib/stores/messages.store.js';
	import '$lib/firebase/firebase.client';
	import { onDestroy, onMount } from 'svelte';
	import { sendJWTToken } from '$lib/firebase/auth.client.js';
	import authStore from '$lib/stores/auth.store.js';
	import bookNotifyStore from '$lib/stores/book-notify.store.js';

	let notifyBook = null;

	const unsub = bookNotifyStore.subscribe(book => {
		if (!$authStore.isLoggedIn) {
			notifyBook = book;
			return;
		}
		if ($authStore.userId !== book.user_id) {
			notifyBook = book;
		}
	});

	export let data;
	let isLoggedIn = data.isLoggedIn;
	$: isLoggedIn = $authStore.isActive ? $authStore.isLoggedIn : data.isLoggedIn;

	let timerId;

	async function sendServerToken() {
		try {
			await sendJWTToken();
		} catch (e) {
			console.error(e);
			clearInterval(timerId);
			messagesStore.showError();
		}
	}

	onMount(async () => {
		try {
			await sendServerToken();
			timerId = setInterval(async () => {
				await sendServerToken();
			}, 1000 * 10 * 60);
		} catch (e) {
			console.error(e);
			messagesStore.showError();
		}
		return () => {
			clearInterval(timerId);
		};
	});

	onDestroy(() => {
		unsub();
	});

	function closeMessage() {
		messagesStore.hide();
	}

	function closeNotifier() {
		notifyBook = null;
	}
</script>
<Nav {isLoggedIn} />
<main class="container">
	{#if $messagesStore.show }
		<div class="row mt-3">
			<div class="col">
				<div
					class:alert-success={$messagesStore.type === 'success'}
					class:alert-danger={$messagesStore.type === 'error'}
					class="alert alert-dismissible alert-danger" role="alert">
					{#if $messagesStore.type === 'error'}
						<strong>Error:</strong>
					{:else}
						<strong>Success:</strong>
					{/if}
					{$messagesStore.message}
					<button type="button" class="btn-close" aria-label="Close" on:click={closeMessage} />
				</div>
			</div>
		</div>
	{/if}
	<slot />
	{#if notifyBook}
		<div
			class="toast show position-fixed top-0 end-0 m-3"
			role="alert"
			aria-live="assertive"
			aria-atomic="true"
		>
			<div class="toast-header">
				<strong class="me-auto">New Book</strong>
				<button
					on:click={closeNotifier}
					type="button"
					class="btn-close"
					data-bs-dismiss="toast"
					aria-label="Close"
				/>
			</div>
			<div class="toast-body">
				Book
				<a data-sveltekit-preload-data="hover" href="/book/${notifyBook.id}">
					{notifyBook.title}
				</a>
				just created!!
			</div>
		</div>
	{/if}

</main>
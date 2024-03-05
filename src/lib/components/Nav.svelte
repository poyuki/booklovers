<script>
	import { page } from '$app/stores';
	import authStore from '$lib/stores/auth.store.js';
	import { logout } from '$lib/firebase/auth.client.js';
	import messagesStore from '$lib/stores/messages.store.js';
	import { goto } from '$app/navigation';

	let isExpanded = false;
	export let isLoggedIn = false;

	function toggleBurger() {
		isExpanded = !isExpanded;
	}

	function onLogout() {
		try {
			logout();
			goto('/');
		} catch (e) {
			console.log(e);
			messagesStore.showError();
		}
	}
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand" href="/">Book Lover</a>
		<button
			on:click={toggleBurger}
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarNav"
			aria-controls="navbarNav"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" class:show={isExpanded} id="navbarNav">
			<ul class="navbar-nav">
				{#if isLoggedIn }
					<li class="nav-item">
						<a class:active={$page.url.pathname === "/"}
							 class="nav-link" aria-current="page" href="/">Home</a>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/add'}
							 class="nav-link" href="/add">Add Book</a>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/profile'}
							 class="nav-link" href="/profile">Profile</a>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/about'}
							 class="nav-link" href="/about">About</a>
					</li>
					<li class="nav-item">
						<span class="nav-link" on:click={onLogout}>Logout</span>
					</li>
				{:else }
					<li class="nav-item">
						<a class:active={$page.url.pathname === "/"}
							 class="nav-link" aria-current="page" href="/">Home</a>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/about'}
							 class="nav-link" href="/about">About</a>
					</li>

					<li class="nav-item">
						<a class:active={$page.url.pathname === '/login'}
							 class="nav-link" href="/login">Login</a>
					</li>
					<li class="nav-item">
						<a class:active={$page.url.pathname === '/signup'}
							 class="nav-link" href="/signup">Sign Up</a>
					</li>
				{/if}
			</ul>
		</div>
	</div>
</nav>

<style>
    .nav-item > span {
        cursor: pointer;
    }
</style>
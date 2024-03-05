<script>
	import messagesStore from '$lib/stores/messages.store.js';
	import { goto } from '$app/navigation';
	import Book from '$lib/components/Book.svelte';

	export let data;

	async function back() {
		try {
			await goto(`/?page=${data.page - 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	}

	async function forward() {
		try {
			await goto(`/?page=${data.page + 1}`);
		} catch (e) {
			messagesStore.showError();
		}
	}


</script>
<div class="row">
	<div class="col">
		<h1>Latest Books</h1>
		<h3>Page: {data.page}</h3>
	</div>
</div>
{#each data.books as book (book.id)}
	<Book {book} />
{/each}
<div class="row mt-3">
	<div class="col">
		<button disabled="{!data.previous}"
						class="btn btn-info w-100"
						on:click={back}
		>
			Previous
		</button>
	</div>
	<div class="col">
		<button disabled="{!data.next}"
						class="btn btn-info w-100"
						on:click={forward}
		>
			Next
		</button>
	</div>
</div>

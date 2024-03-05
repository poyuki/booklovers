<script>
	import Book from '$lib/components/Book.svelte';

	export let data;

	function filterUnlikedBooks({ detail }) {
		data.books = data.books.filter(book => book.id !== detail.id);
	}
</script>

<h1>Favorites</h1>

{#each data.books as book (book.id)}
	<Book {book} on:toggle_like={filterUnlikedBooks} />
{/each}


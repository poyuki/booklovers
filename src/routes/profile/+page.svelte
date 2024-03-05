<script>
	import Book from '$lib/components/Book.svelte';

	export let data;
</script>

<h1>My Books</h1>

{#each data.books as book (book.id)}
	<Book {book} />
{/each}
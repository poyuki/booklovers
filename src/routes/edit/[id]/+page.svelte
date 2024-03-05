<script>
	import BookForm from '$lib/books/BookForm.svelte';

	export let data;
	export let form;
</script>

<BookForm form="{{...data.book,...form}}" />
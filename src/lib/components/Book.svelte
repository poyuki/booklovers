<script>
	import Like from '$lib/components/Like.svelte';
	import { goto } from '$app/navigation';

	export let book;

	function goToBookPage() {
		goto(`/book/${book.id}`);
	}
</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={goToBookPage} class="row mt-2">
	<div class="col col-12 col-sm-6 col-md-4">
		<img alt="{book.title}" src="{book.small_picture}" />
	</div>
	<div class="col col-12 col-sm-6 col-md-8">
		<h2>Title: {book.title}</h2>
		<h2>Author: {book.author}</h2>
		<p>
			{book.short_description}
		</p>
		<Like {book} on:toggle_like />
	</div>
</div>

<style>
    img {
        max-width: 90%;
        margin: 5px auto;
        max-height: 200px;
        display: block;
    }

    .row {
        border: solid 1px gray;
        cursor: pointer;
    }
</style>
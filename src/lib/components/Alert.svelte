<script lang="ts">
	export let title = 'Error';
	export let message: string;
</script>

<aside class="alert variant-ghost-error">
	<div class="alert-message">
		<h3 class="h3">{title}</h3>
		{message}
	</div>
</aside>

<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Alert from './Alert.svelte';
	import { GET } from '$lib/api';

	export let classId: number | undefined;
</script>

{#await GET('/classes', {})}
	<div class="flex justify-center my-3">
		<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
	</div>
{:then { data, error }}
	{#if error}
		Failed loading classes: {error}.
	{/if}
	<label class="label">
		<span>Target class</span>
		<select class="select mt-3 px-4" bind:value={classId}>
			{#each data.sort((k1, k2) => k1.name.localeCompare(k2.name)) as kl}
				<option value={kl.id}>{kl.name} [{kl.id}]</option>
			{/each}
		</select>
	</label>
{:catch error}
	<Alert message={`Something went wrong, please try again later. (${error})`} />
{/await}

<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Alert from './Alert.svelte';
	import { GET, type Class } from '$lib/api';

	export let classId: number | undefined;
	export let filter = '';

	let classes = GET('/classes', {});

	const filterClasses = (classes: Class[]) => {
		const filtered = classes
			.filter(
				(k) =>
					k.name.toLowerCase().includes(filter.toLowerCase()) ||
					k.longName.toLowerCase().includes(filter.toLowerCase())
			)
			.sort((k1, k2) => k1.name.localeCompare(k2.name));
		classId = filtered.length > 0 ? filtered[0].id : -1;
		return filtered;
	};
</script>

{#await classes}
	<div class="flex justify-center my-3">
		<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
	</div>
{:then { data, error }}
	{#if error}
		Failed loading classes: {error}.
	{/if}
	<label class="label">
		<span>Search</span>
		<input class="input" type="text" placeholder="Some class" bind:value={filter} />
	</label>
	<label class="label">
		<span>Target class</span>
		<select class="select mt-3 px-4" bind:value={classId}>
			{#key filter}
				{#each filterClasses(data) as kl}
					<option value={kl.id}>{kl.name} [{kl.id}]</option>
				{/each}
			{/key}
		</select>
	</label>
{:catch error}
	<Alert message={`Something went wrong, please try again later. (${error})`} />
{/await}

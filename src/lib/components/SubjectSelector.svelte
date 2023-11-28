<script lang="ts">
	import { GET, type Lesson, type Metadata } from '$lib/api';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	export let classId: number | undefined;
	export let subjects: number[];

	const getSubjects = (lessons: Lesson[]) => {
		const out = [] as Metadata[];
		lessons.forEach((l) =>
			l.su.forEach((su) => {
				if (out.find((m) => m.id === su.id)) return;
				out.push(su);
			})
		);
		return out;
	};
</script>

{#await GET('/lessons/{classId}', { params: { path: { classId: classId || 0 } } })}
	<div class="flex justify-center my-3">
		<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
	</div>
{:then { data, error }}
	<div class="mt-3 space-y-3">
		{#if error}
			No lessons returned by the server.
		{:else if !data.length}
			No lessons found in range. Are you sure this class exists and is active?
		{:else}
			{#each getSubjects(data) as su}
				<label class="flex items-center space-x-2">
					<input
						class="checkbox"
						type="checkbox"
						on:click={() => {
							if (subjects.includes(su.id)) subjects.splice(subjects.indexOf(su.id), 1);
							else subjects.push(su.id);
						}}
					/>
					<p>{su.longname} ({su.name})</p>
				</label>
			{/each}
		{/if}
	</div>
{/await}

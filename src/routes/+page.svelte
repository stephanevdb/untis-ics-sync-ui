<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { GET, type Lesson, type Metadata } from '$lib/api';
	import { Step, Stepper } from '@skeletonlabs/skeleton';

	let classId: number | undefined;
	let type: 'includedSubjects' | 'excludedSubjects' | undefined;
	let subjects: number[] = [];
	let finished = false;

	const classesPromise = GET('/classes', {});

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

<div class="container card mx-auto p-6">
	{#if !finished}
		<Stepper on:complete={() => (finished = true)}>
			<Step locked={!classId}>
				<svelte:fragment slot="header">Step 1: Select class</svelte:fragment>
				Select the class you want to subscribe to. If you're currently partaking in multiple classes
				at once, do this for each class individually.

				{#await classesPromise}
					Loading classes...
				{:then { data, error }}
					{#if error}
						Failed loading classes: {error}.
					{/if}
					<hr class="mt-3" />
					<select class="select mt-3 px-4" bind:value={classId}>
						{#each data.sort((k1, k2) => k1.name.localeCompare(k2.name)) as kl}
							<option value={kl.id}>{kl.name} [{kl.id}]</option>
						{/each}
					</select>
				{/await}
			</Step>
			<Step>
				<svelte:fragment slot="header">Step 2: Select subjects (optional)</svelte:fragment>
				Only following a few subjects of a class? Feel free to include or exclude them here.
				{#await GET('/lessons/{classId}', { params: { path: { classId: classId || 0 } } })}
					Fetching lessons to come, this may take a while...
				{:then { data, error }}
					{#if error}
						No lessons found in range. Are you sure this class exists and is active?
					{:else}
						<div class="mt-3">
							<label class="flex items-center space-x-2">
								<input
									class="radio"
									type="radio"
									name="type"
									checked={type === undefined}
									on:change={() => (type = undefined)}
								/>
								<p>Don't include or exclude any classes.</p>
							</label>
							<label class="flex items-center space-x-2">
								<input
									class="radio"
									type="radio"
									name="type"
									checked={type === 'excludedSubjects'}
									on:change={() => (type = 'excludedSubjects')}
								/>
								<p>Exclude the classes that I select below.</p>
							</label>
							<label class="flex items-center space-x-2">
								<input
									class="radio"
									type="radio"
									name="type"
									checked={type === 'includedSubjects'}
									on:change={() => (type = 'includedSubjects')}
								/>
								<p>Include the classes that I select below.</p>
							</label>
						</div>
						<hr />
						<div class="mt-3 space-y-3">
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
									<p>{su.name} ({su.longname})</p>
								</label>
							{/each}
						</div>
					{/if}
				{/await}
			</Step>
		</Stepper>
	{:else}
		Your link is:
		<span class="font-semibold underline">
			{`${PUBLIC_API_URL}/lessons/${classId}/ics${
				type !== undefined ? `?${type}=${encodeURIComponent(subjects.join(','))}` : ''
			}`}
		</span>
	{/if}
</div>

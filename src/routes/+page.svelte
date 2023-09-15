<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import { GET, type Lesson, type Metadata } from '$lib/api';
	import Alert from '$lib/components/Alert.svelte';
	import { ProgressRadial, Step, Stepper } from '@skeletonlabs/skeleton';

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

	const getUrl = () =>
		`${PUBLIC_API_URL}/lessons/${classId}/ics${
			type !== undefined ? `?${type}=${encodeURIComponent(subjects.join(','))}` : ''
		}`;
</script>

<div class="container card mx-auto p-6">
	{#if !finished}
		<Stepper on:complete={() => (finished = true)}>
			<Step locked={!classId}>
				<svelte:fragment slot="header">Step 1: Select class</svelte:fragment>
				Select the class you want to subscribe to. If you're currently partaking in multiple classes
				at once, do this for each class individually.
				<hr class="mt-3" />

				{#await classesPromise}
					<div class="flex justify-center my-3">
						<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
					</div>
				{:then { data, error }}
					{#if error}
						Failed loading classes: {error}.
					{/if}
					<select class="select mt-3 px-4" bind:value={classId}>
						{#each data.sort((k1, k2) => k1.name.localeCompare(k2.name)) as kl}
							<option value={kl.id}>{kl.name} [{kl.id}]</option>
						{/each}
					</select>
				{:catch error}
					<Alert message={`Something went wrong, please try again later. (${error})`} />
				{/await}
			</Step>
			<Step>
				<svelte:fragment slot="header">Step 2: Select subjects (optional)</svelte:fragment>
				Only following a few subjects of a class? Feel free to include or exclude them here.
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
				{#await GET('/lessons/{classId}', { params: { path: { classId: classId || 0 } } })}
					<div class="flex justify-center my-3">
						<ProgressRadial width="w-16" meter="stroke-primary-500" track="stroke-primary-500/30" />
					</div>
				{:then { data, error }}
					{#if error}
						No lessons found in range. Are you sure this class exists and is active?
					{:else}
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
		That's it! Use the link below to subscribe to your personalized calendar.
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] my-2">
			<div class="input-group-shim">ical://</div>
			<input type="text" readonly value={getUrl()} />
			<button
				class="variant-filled-primary w-16"
				on:click={() => navigator.clipboard.writeText(getUrl())}>Copy</button
			>
		</div>

		<button
			class="btn variant-filled-primary w-full"
			on:click={() => {
				classId = undefined;
				type = undefined;
				subjects = [];
				finished = false;
			}}>Need another class?</button
		>
	{/if}
</div>

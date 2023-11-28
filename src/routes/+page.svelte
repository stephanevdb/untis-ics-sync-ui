<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import AlertsSelector from '$lib/components/AlertsSelector.svelte';
	import ClassSelector from '$lib/components/ClassSelector.svelte';
	import SubjectSelector from '$lib/components/SubjectSelector.svelte';
	import SubjectTypeSelector from '$lib/components/SubjectTypeSelector.svelte';
	import { Step, Stepper, toastStore } from '@skeletonlabs/skeleton';

	let classId: number | undefined;
	let type: 'includedSubjects' | 'excludedSubjects' | undefined;
	let subjects: number[] = [];
	let offset = 0;
	let alarms: number[] = [];
	let finished = false;

	const getUrl = () => {
		const params = new URLSearchParams();
		if (type) params.append(type, subjects.join(','));
		if (offset) params.append('offset', offset.toString());
		if (alarms.length) params.append('alarms', alarms.join(','));

		const url = `${PUBLIC_API_URL}/lessons/${classId}/ics`;
		if (params.toString()) return url.concat('?', params.toString());
		return url;
	};

	const copyToClipboard = (value: string) => {
		toastStore.trigger({ message: 'Copied to clipboard!', background: 'variant-filled-primary' });
		navigator.clipboard.writeText(value);
	};

	const getHolidayUrl = () => `${PUBLIC_API_URL}/holidays`;
</script>

<div class="container card mx-auto p-6">
	{#if !finished}
		<Stepper on:complete={() => (finished = true)}>
			<Step locked={!classId}>
				<svelte:fragment slot="header">Step 1: Select class</svelte:fragment>
				Select the class you want to subscribe to. If you're currently partaking in multiple classes
				at once, do this for each class individually.
				<hr class="mt-3" />
				<ClassSelector bind:classId />
			</Step>
			<Step>
				<svelte:fragment slot="header">Step 2: Select subjects (optional)</svelte:fragment>
				Only following a few subjects of a class? Feel free to include or exclude them here.
				<SubjectTypeSelector bind:type />
				<hr />
				<SubjectSelector bind:classId bind:subjects />
			</Step>
			<Step>
				<svelte:fragment slot="header">Step 3: Alarms (optional)</svelte:fragment>
				Want to be notified before each lesson? Enter the desired amount of minutes before each subject
				below and make sure "remove alarms" is disabled in your preferred calendar.
				<hr class="mt-3" />
				<AlertsSelector bind:alarms />
			</Step>
		</Stepper>
	{:else}
		That's it! Use the link below to subscribe to your personalized calendar.
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] mt-2 mb-4">
			<div class="input-group-shim">ical://</div>
			<input type="text" readonly value={getUrl()} />
			<button class="variant-filled-primary" on:click={() => copyToClipboard(getUrl())}>Copy</button
			>
		</div>
		Looking for a holiday calendar? Use the one below to get automatically updated future holidays.
		<div class="input-group input-group-divider grid-cols-[auto_1fr_auto] my-2">
			<div class="input-group-shim">ical://</div>
			<input type="text" readonly value={getHolidayUrl()} />
			<button class="variant-filled-primary" on:click={() => copyToClipboard(getHolidayUrl())}
				>Copy</button
			>
		</div>

		<button
			class="btn variant-filled-primary w-full"
			on:click={() => {
				classId = undefined;
				type = undefined;
				subjects = [];
				offset = 0;
				alarms = [];
				finished = false;
			}}
		>
			Need another class?
		</button>
	{/if}
</div>

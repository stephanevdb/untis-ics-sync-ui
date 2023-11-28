<script lang="ts">
	export let alarms: number[];
	export let newAlarm = 0;
</script>

<label class="label">
	<span>Time before (in minutes, positive)</span>
	<div class="flex mt-3 gap-3">
		<input class="input px-4" type="number" min={0} bind:value={newAlarm} />
		<button
			class="btn variant-filled-primary"
			on:click={() => {
				alarms.push(newAlarm);
				alarms = alarms;
				newAlarm = 0;
			}}>Add</button
		>
	</div>
</label>
{#each alarms as alarm}
	<div class="flex">
		<span class="mr-auto self-center">{alarm} minutes before all events...</span>
		<button
			class="btn variant-ghost-primary"
			on:click={() => {
				alarms.splice(alarms.indexOf(alarm), 1);
				alarms = alarms;
			}}>Delete</button
		>
	</div>
{/each}

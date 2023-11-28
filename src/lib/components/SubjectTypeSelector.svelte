<script lang="ts">
	export let type: 'excludedSubjects' | 'includedSubjects' | undefined;
</script>

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

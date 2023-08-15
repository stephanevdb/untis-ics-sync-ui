<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';

	import { AppBar, AppShell, LightSwitch } from '@skeletonlabs/skeleton';
	import NavBar from '$lib/components/navigation/NavBar.svelte';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar>
			<svelte:fragment slot="lead">
				<h1 class="text-bold text-xl">Untis ICS Sync</h1>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<NavBar />
	</svelte:fragment>
	<slot />
</AppShell>

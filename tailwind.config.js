/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,ts,svelte}',
		path.join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,ts,svelte}')
	],
	theme: {
		extend: {}
	},
	plugins: [...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()]
};

<!-- apps/svelte5/src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import { authStore } from '$lib/shared/stores/auth.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types'; // Import tipe otomatis SvelteKit

	let { data, children } = $props<{ data: LayoutData, children: any }>();

	// Svelte 5: Sinkronisasi data server ke client side store
    // Ini memastikan authStore.user terisi saat halaman pertama kali dimuat (SSR)
    $effect(() => {
        authStore.setSession(data.user);
    });

	const queryClient = new QueryClient();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>

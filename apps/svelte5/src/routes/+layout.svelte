<!-- apps/svelte5/src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import { authStore } from '$lib/shared/stores/auth.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types'; // Import tipe otomatis SvelteKit
	import { onMount } from 'svelte';
    import { Toaster, toast } from 'svelte-sonner'; // Asumsi Anda pakai library toast populer
    import { navigating } from '$app/state';
    import { loadingStore } from '$lib/shared/stores/loading.svelte';
    import LoadingBar from '$lib/components/ui/LoadingBar.svelte';
    import { beforeNavigate, afterNavigate } from '$app/navigation'; 
    import { untrack } from 'svelte';

	let { data, children } = $props<{ data: LayoutData, children: any }>();

    beforeNavigate(() => {
        loadingStore.start();
    });

    afterNavigate(() => {
        loadingStore.done();
    });

	// Svelte 5: Sinkronisasi data server ke client side store
    // Ini memastikan authStore.user terisi saat halaman pertama kali dimuat (SSR)
    $effect(() => {
        const currentUser = data.user;

        untrack(() => {
            if (currentUser) {
                authStore.setSession(currentUser);
            } else {
                authStore.clearSession();
            }
        });
    });

	const queryClient = new QueryClient();
	

	onMount(() => {
        // Mendengarkan semua teriakan error dari REST, gRPC, atau komponen apapun
        const handleAppError = (e: Event) => {
            const customEvent = e as CustomEvent;
            toast.error(customEvent.detail || 'Terjadi kesalahan jaringan.');
        };

        window.addEventListener('app:error', handleAppError);

        return () => window.removeEventListener('app:error', handleAppError);
    });
</script>

<Toaster richColors position="bottom-right" />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>

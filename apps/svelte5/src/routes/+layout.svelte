<!-- apps/svelte5/src/routes/+layout.svelte -->
<script lang="ts">
	import './layout.css';
	import { authStore } from '$lib/shared/stores/auth.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import type { LayoutData } from './$types'; // Import tipe otomatis SvelteKit
	import { onMount } from 'svelte';
    import { Toaster, toast } from 'svelte-sonner'; // Asumsi Anda pakai library toast populer
    import { loadingStore } from '$lib/shared/stores/loading.svelte';
    import LoadingBar from '$lib/components/ui/LoadingBar.svelte';
    import LoadingCircle from '$lib/components/ui/LoadingCircle.svelte';
    // import { beforeNavigate, afterNavigate } from '$app/navigation'; 
    import { untrack } from 'svelte';
    import { navigating } from '$app/state';

	let { data, children } = $props<{ data: LayoutData, children: any }>();

    let isNavigatingLock = false;

	// Svelte 5: Sinkronisasi data server ke client side store
    // Ini memastikan authStore.user terisi saat halaman pertama kali dimuat (SSR)
    // 1. Radar Khusus Auth (Memantau data.user)
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

    // 2. Radar Khusus Loading Navigasi (Memantau $app/state navigating)
    $effect(() => {
        // BACA state navigasi
        const isNavigating = !!(navigating?.to || navigating?.from);

        untrack(() => {
            // EKSEKUSI: Hanya jalankan start() jika gembok terbuka (false)
            if (isNavigating && !isNavigatingLock) {
                isNavigatingLock = true; // Kunci gembok
                loadingStore.start();
            } 
            // Hanya jalankan done() jika gembok sedang terkunci (true)
            else if (!isNavigating && isNavigatingLock) {
                isNavigatingLock = false; // Buka gembok
                loadingStore.done();
            }
        });
    });

	const queryClient = new QueryClient();
	

	onMount(() => {
        // 1. EKSEKUSI PEMBUNUHAN INITIAL LOADER
        // Karena ini dijalankan oleh Svelte, CSP menganggapnya 100% aman (Trusted Script)
        const loader = document.getElementById('initial-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 100); // Hapus dari DOM setelah fade-out
        }

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

<!-- <LoadingBar /> -->
 <LoadingCircle />

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>

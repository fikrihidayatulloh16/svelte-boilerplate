<!-- apps/svelte5/src/routes/(protected)/dashboard/user_table/+page.svelte -->
<script lang="ts">
    import { useUsersQuery } from "$lib/features/user/api/user.queries";
    import UserTable from "$lib/features/user/components/userTable.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import { onMount, onDestroy } from 'svelte';
    import { useQueryClient } from '@tanstack/svelte-query';

    let searchTerm = $state("");
    const queryClient = useQueryClient();
    let eventSource: EventSource;

    onMount(() => {
    eventSource = new EventSource('/api/events/users'); // Atau '/api/events' sesuai endpoint SvelteKit Anda

    // 1. CEK STATUS KONEKSI (Apakah pipa benar-benar menganga?)
    eventSource.onopen = () => {
        console.log("🟢 [RADAR SSE] Koneksi Pipa Terbuka dan Menunggu!");
    };

    // 2. TANGKAP ERROR (Apakah tiba-tiba putus di tengah jalan?)
    eventSource.onerror = (err) => {
        console.error("🔴 [RADAR SSE] Pipa Terputus/Error:", err);
    };

    // 3. TANGKAP PESAN DEFAULT (Jika Axum tidak mengeset nama event)
    eventSource.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
            console.log("🧩 JSON Berhasil Diparsing:", payload);
            
            // KUNCI: Sesuaikan deteksi ini dengan format asli dari Rust!
            const isUsersUpdated = 
                (payload.type === 'DataUpdated' && payload.entity === 'users') ||
                (payload.DataUpdated && payload.DataUpdated.entity === 'users');

            if (isUsersUpdated) {
                console.log("🔥 Invalidation memanggil!");
                queryClient.invalidateQueries({ queryKey: ['users'] });
            } else {
                console.log("⚠️ Event diterima, tapi bukan untuk 'users':", payload);
            }
        } catch (e) {
            console.warn("⚠️ Gagal memparsing JSON dari SSE:", event.data);
        }
    };

    // 4. TANGKAP CUSTOM EVENT (Jika Axum mengeset event("DataUpdated"))
    // Ini sangat sering terjadi jika menggunakan Serde Enum di Axum SSE
    eventSource.addEventListener('DataUpdated', (event) => {
        console.log("📥 [RADAR SSE] Sinyal CUSTOM 'DataUpdated' Diterima:", event.data);
        prosesSinyal(event.data);
    });

    // 5. TANGKAP CUSTOM EVENT ALTERNATIF (Bentuk raw dari enum Rust)
    eventSource.addEventListener('VolatileEvent', (event) => {
        console.log("📥 [RADAR SSE] Sinyal CUSTOM 'VolatileEvent' Diterima:", event.data);
        prosesSinyal(event.data);
    });

    function prosesSinyal(rawData: string) {
        try {
            const payload = JSON.parse(rawData);
            console.log("🧩 JSON Berhasil Diparsing:", payload);
            
            // Hanguskan cache!
            console.log("🔥 Invalidation memanggil!");
            queryClient.invalidateQueries({ queryKey: ['users'] });
        } catch (e) {
            console.warn("⚠️ Gagal memparsing JSON dari SSE:", rawData);
        }
    }
});

    onDestroy(() => {
        // WAJIB: Tutup koneksi saat pindah halaman agar memori tidak bocor
        if (eventSource) eventSource.close();
    });
    
    // TanStack Query dipanggil di sini
    // const userQuery = useUsersQuery(() => searchTerm);

    // DEBUGGING SVELTE 5: Pantau terus status Query
    // $effect(() => {
    //     console.log("Query Status:", userQuery.status);
    //     console.log("Query Data:", userQuery.data);
    //     console.log("Query Error:", userQuery.error);
    // });
</script>

<main class="container mx-auto py-10 space-y-4">
    

    <UserTable 

    />
</main>
<!-- apps/svelte5/src/lib/features/user/components/userTable.svelte -->
<script lang="ts">
    import { useUsersQuery } from "../api/queries";
    
    // Asumsi import komponen UI (Shadcn-Svelte) Anda
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import Input from "$lib/components/ui/input/input.svelte";

    // State Svelte 5 (Runes) Lokal
    let search = $state("");
    let debouncedSearch = $state(""); // Ini yang akan dikirim ke Server (ditunda)
    let page = $state(1);
    let limit = $state(10);

    $effect(() => {
        // 1. KUNCI UTAMA: Baca variabel secara sinkron di sini agar Svelte melacaknya!
        const currentSearch = search; 

        const timer = setTimeout(() => {
            // 2. Gunakan variabel lokal yang sudah dibaca tadi
            if (debouncedSearch !== currentSearch) {
                debouncedSearch = currentSearch;
                page = 1;
            }
        }, 500);

        return () => clearTimeout(timer);
    });

    // TanStack Query terhubung ke Runes
    const query = useUsersQuery(
        () => debouncedSearch, 
        () => page, 
        () => limit
    );

    // Menghitung total halaman secara reaktif berdasarkan data dari API
    let totalPages = $derived(
        Math.ceil((query.data?.total || 0) / limit) || 1
    );

    let startRow = $derived((page - 1) * limit + 1);
    let endRow = $derived(Math.min(page * limit, query.data?.total || 0));
</script>

<div class="space-y-4 p-4">
<div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Manajemen User</h1>
        
        <Input 
            bind:value={search} 
            placeholder="Cari user (otomatis fetch)..." 
            class="max-w-sm"
            // oninput={() => {
            //     page = 1; // KUNCI UTAMA: Reset halaman setiap kali mengetik!
            // }}
        />
        {#if search !== debouncedSearch}
            <span class="text-xs text-blue-500 font-medium ml-3 animate-pulse">Mengetik...</span>
        {/if}
    </div>
    <div class="rounded-md border">
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[50px]">No</Table.Head> 
                    <Table.Head>Nama Lengkap</Table.Head>
                    <Table.Head>Email</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Dibuat Pada</Table.Head>
                    <Table.Head>Diperbarui Pada</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#if query.isLoading}
                    <Table.Row>
                        <Table.Cell colspan={5} class="h-24 text-center">
                            Memuat data...
                        </Table.Cell>
                    </Table.Row>
                {:else if query.isError}
                    <Table.Row>
                        <Table.Cell colspan={5} class="h-24 text-center text-red-500">
                            Gagal memuat data.
                        </Table.Cell>
                    </Table.Row>
                {:else if !query.data?.items || query.data.items.length === 0}
                    <Table.Row>
                        <Table.Cell colspan={5} class="h-24 text-center">
                            Tidak ada data pengguna.
                        </Table.Cell>
                    </Table.Row>
                {:else}
                    {#each query.data.items as user, i}
                        {@const rowNumber = (page - 1) * limit + i + 1}
                        
                        <Table.Row>
                            <Table.Cell class="font-medium">{rowNumber}</Table.Cell>
                            
                            <Table.Cell class="font-medium">{user.fullName}</Table.Cell>
                            <Table.Cell>{user.email}</Table.Cell>
                            <Table.Cell>
                                <Badge variant={user.isActive ? "default" : "destructive"}>
                                    {user.isActive ? "Aktif" : "Nonaktif"}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell>
                                {new Date(user.updated_at).toLocaleDateString('id-ID')}
                            </Table.Cell>
                            <Table.Cell>
                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                {/if}
            </Table.Body>
        </Table.Root>
    </div>

    <div class="flex items-center justify-between text-sm">
        <div class="text-muted-foreground">
            Menampilkan {query.data?.total ? startRow : 0} - {endRow} dari {query.data?.total || 0} data
        </div>

        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <p>Baris per halaman</p>
                <select 
                    bind:value={limit} 
                    onchange={() => page = 1} 
                    class="border rounded p-1"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div class="font-medium">
                Halaman {page} dari {totalPages}
            </div>

            <div class="flex gap-2">
                <button 
                    disabled={page === 1}
                    onclick={() => page -= 1}
                    class="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Sebelumnya
                </button>

                <button 
                    disabled={page === totalPages || query.data?.total === 0}
                    onclick={() => page += 1}
                    class="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Selanjutnya
                </button>
            </div>
        </div>
    </div>
</div>
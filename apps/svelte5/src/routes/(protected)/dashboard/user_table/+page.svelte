<!-- apps/svelte5/src/routes/+page.svelte -->
<script lang="ts">
    import { useUsersQuery } from "$lib/features/user/api/queries";
    import UserTable from "$lib/features/user/components/userTable.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let searchTerm = $state("");
    
    // TanStack Query dipanggil di sini
    const userQuery = useUsersQuery(() => searchTerm);

    // DEBUGGING SVELTE 5: Pantau terus status Query
    // $effect(() => {
    //     console.log("Query Status:", userQuery.status);
    //     console.log("Query Data:", userQuery.data);
    //     console.log("Query Error:", userQuery.error);
    // });
</script>

<main class="container mx-auto py-10 space-y-4">
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Manajemen User</h1>
        
        <Input 
            bind:value={searchTerm} 
            placeholder="Cari user (otomatis fetch)..." 
            class="max-w-sm"
        />
    </div>

    <UserTable 
        users={userQuery.data?.items ?? []} 
        isLoading={userQuery.isLoading} 
    />
</main>
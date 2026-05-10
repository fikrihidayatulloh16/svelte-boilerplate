<!-- apps/svelte5/src/routes/(protected)/dashboard/user_table/+page.svelte -->
<script lang="ts">
    import { useUsersQuery } from "$lib/features/user/api/user.queries";
    import UserTable from "$lib/features/user/components/userTable.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let searchTerm = $state("");
    
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
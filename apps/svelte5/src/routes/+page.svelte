<script lang="ts">
    import { createUserStore } from "$lib/features/user/stores/userStore.svelte";
    import UserTable from "$lib/features/user/components/userTable.svelte";
    import { onMount } from "svelte";

    // Inisialisasi store
    const userStore = createUserStore();

    onMount(() => {
        userStore.fetchUsers();
    });
</script>

<main class="container mx-auto py-10 space-y-4">
    <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold tracking-tight">Manajemen User</h1>
        <p class="text-sm text-muted-foreground text-nova">
            Total: {userStore.totalCount} User
        </p>
    </div>

    <UserTable store={userStore} />
</main>
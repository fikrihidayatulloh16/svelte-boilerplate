<!-- apps/svelte5/src/lib/features/user/components/userTable.svelte -->
<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import type { User } from "$lib/gen/proto/user_pb";

    // Kita terima data langsung sebagai props, bukan store
    let { users = [], isLoading = false } = $props<{ 
        users: User[], 
        isLoading: boolean 
    }>();
</script>

<div class="rounded-md border">
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Nama Lengkap</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Dibuat Pada</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#if isLoading}
                <Table.Row>
                    <Table.Cell colspan={4} class="text-center">Memuat data...</Table.Cell>
                </Table.Row>
            {:else if users.length === 0}
                <Table.Row>
                    <Table.Cell colspan={4} class="text-center">Tidak ada data.</Table.Cell>
                </Table.Row>
            {:else}
                {#each users as user}
                    <Table.Row>
                        <Table.Cell class="font-medium">{user.fullName}</Table.Cell>
                        <Table.Cell>{user.email}</Table.Cell>
                        <Table.Cell>
                            <Badge variant={user.isActive ? "default" : "destructive"}>
                                {user.isActive ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                    </Table.Row>
                {/each}
            {/if}
        </Table.Body>
    </Table.Root>
</div>
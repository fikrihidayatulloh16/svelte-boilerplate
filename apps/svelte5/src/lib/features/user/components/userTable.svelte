<script lang="ts">
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    
    // Kita terima store sebagai prop
    let { store } = $props();
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
            {#if store.isLoading}
                <Table.Row>
                    <Table.Cell colspan={4} class="text-center">Memuat data...</Table.Cell>
                </Table.Row>
            {:else if store.users.length === 0}
                <Table.Row>
                    <Table.Cell colspan={4} class="text-center">Tidak ada data.</Table.Cell>
                </Table.Row>
            {:else}
                {#each store.users as user}
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
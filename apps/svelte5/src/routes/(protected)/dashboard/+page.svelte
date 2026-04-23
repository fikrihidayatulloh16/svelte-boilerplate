<script lang="ts">
    import { authStore } from '$lib/shared/stores/auth.svelte';
</script>

<main class="p-10 space-y-6">
    <h1 class="text-3xl font-bold">Selamat Datang di Dashboard</h1>
    
    <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-lg">
            Status Login: 
            <span class="font-bold text-green-600">
                {authStore.isLoggedIn ? 'AKTIF' : 'TIDAK AKTIF'}
            </span>
        </p>

        {#if authStore.user}
            <ul class="mt-4 list-disc list-inside text-gray-700">
                <li>ID: {authStore.user.id}</li>
                <li>Nama: {authStore.user.fullName}</li>
                <li>Role: <span class="uppercase font-semibold text-blue-600">{authStore.user.role}</span></li>
            </ul>
        {/if}
    </div>
</main>
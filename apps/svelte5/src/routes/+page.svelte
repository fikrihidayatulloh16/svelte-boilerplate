<!-- apps/svelte5/src/routes/+page.svelte -->
<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";

    let searchTerm = $state("");
    
</script>

<main class="container mx-auto py-10 space-y-4">
    <div class="flex flex-col gap-4">
        <h1 class="text-2xl font-bold">Selamat Datang Di Boilerplate-Svelte5</h1>
        <h2 class="text-2xl font-bold">Silahkan masuk ke halaman login (contoh) </h2>

        <a 
            href="/auth/login" 
            class="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
            Login Page
        </a>

        
        <Input 
            bind:value={searchTerm} 
            placeholder="Cari user (otomatis fetch)..." 
            class="max-w-sm"
        />
    </div>
</main>
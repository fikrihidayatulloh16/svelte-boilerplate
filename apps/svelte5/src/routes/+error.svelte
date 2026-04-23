<script lang="ts">
    import { page } from '$app/stores';
    import { Button } from '$lib/components/ui/button'; // Sesuaikan jika Anda punya komponen UI
</script>

<main class="flex h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
    <h1 class="text-6xl font-bold text-red-500">{$page.status}</h1>
    
    <h2 class="mt-4 text-2xl font-semibold text-gray-800">Ups! Terjadi Kesalahan.</h2>
    
    <p class="mt-2 text-gray-600 max-w-md">
        {$page.error?.message || 'Kami tidak dapat memproses permintaan Anda saat ini.'}
    </p>

    <div class="mt-8 flex gap-4">
        <Button onclick={() => window.history.back()} variant="outline">
            Kembali
        </Button>
        <Button onclick={() => window.location.href = '/'}>
            Ke Beranda
        </Button>
    </div>
</main>
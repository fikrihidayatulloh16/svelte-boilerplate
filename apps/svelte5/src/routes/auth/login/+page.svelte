<script lang="ts">
    import { enhance } from '$app/forms';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

    let isSubmitting = $state(false);
</script>

<main class="flex h-screen items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md border">
        <h1 class="text-2xl font-bold mb-6 text-center">Login Sistem</h1>

        <form 
            method="POST" 
            action="?/login" 
            use:enhance={() => {
            isSubmitting = true;
            
            // Fungsi ini berjalan SETELAH server merespon
            return async ({ result, update }) => {
                isSubmitting = false;

                if (result.type === 'redirect') {
                    // SERVER MENJAWAB SUKSES (Redirect)
                    // Panggil sonner di sini! Karena ini berjalan di browser.
                    toast.success("Berhasil, selamat datang di Dashboard!");
                    console.log("pengecekan toast");
                    
                } else if (result.type === 'failure') {
                    // SERVER MENJAWAB GAGAL
                    toast.error("Gagal masuk.");
                }
                
                // Lanjutkan update state SvelteKit bawaan (termasuk eksekusi redirect-nya)
                await update();
            };
        }}
            class="space-y-4"
        >
            <div>
                <label for="email" class="text-sm font-medium">Email</label>
                <Input id="email" name="email" type="email" placeholder="try admin@example.com" required />
            </div>
            
            <div>
                <label for="password" class="text-sm font-medium">Password</label>
                <Input id="password" name="password" type="password" placeholder="try admin123" required />
            </div>

            <Button type="submit" class="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Memproses...' : 'Masuk'}
            </Button>
        </form>
    </div>
</main>
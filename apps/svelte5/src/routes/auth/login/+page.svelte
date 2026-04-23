<script lang="ts">
    import { enhance } from '$app/forms';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';

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
                return async ({ update }) => {
                    await update();
                    isSubmitting = false;
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
<script lang="ts">
    import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
    import { superForm } from 'sveltekit-superforms';
    import type { PageData } from './$types';

    // Menerima data inisial dari fungsi 'load' di +page.server.ts
    let { data } = $props<{ data: PageData }>();

    const { form, errors, message, enhance, delayed } = superForm(data.form);
</script>

<main class="relative flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div class="absolute right-6 top-6">
        <ThemeToggle />
    </div>

    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
        <h1 class="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">Login Sistem</h1>

        {#if $message}
            <div class="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50">
                {$message}
            </div>
        {/if}

        <form method="POST" action="?/login" use:enhance class="space-y-5">
            
            <div>
                <label for="email" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    bind:value={$form.email}
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="nama@email.com"
                />
                {#if $errors.email}
                    <p class="mt-1 text-sm text-red-500 dark:text-red-400">{$errors.email}</p>
                {/if}
            </div>

            <div>
                <label for="password" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    bind:value={$form.password}
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    placeholder="masukkan password"
                />
                {#if $errors.password}
                    <p class="mt-1 text-sm text-red-500 dark:text-red-400">{$errors.password}</p>
                {/if}
            </div>

            <button 
                type="submit" 
                disabled={$delayed}
                class="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
            >
                {#if $delayed}
                    Sedang memproses...
                {:else}
                    Masuk
                {/if}
            </button>
        </form>
    </div>
</main>
<script lang="ts">
    import { themeStore } from '$lib/shared/stores/theme.svelte';
    import Sun from 'lucide-svelte/icons/sun';
    import Moon from 'lucide-svelte/icons/moon';
</script>

<button
    onclick={() => themeStore.toggle()}
    class="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
    aria-label="Toggle Dark Mode"
>
    <div class="transition-transform duration-500 {themeStore.mode === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'} absolute">
        <Sun class="h-5 w-5 text-amber-500" />
    </div>
    
    <div class="transition-transform duration-500 {themeStore.mode === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'} absolute">
        <Moon class="h-5 w-5 text-blue-400" />
    </div>
</button>
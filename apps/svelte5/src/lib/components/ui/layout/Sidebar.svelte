<script lang="ts">
    import { page } from '$app/stores';
    import { X } from 'lucide-svelte';

    // Tipe data untuk struktur menu
    export type MenuItem = { label: string; href: string; icon: any };

    let { 
        menuItems, 
        isOpen, 
        closeSidebar 
    } = $props<{ 
        menuItems: MenuItem[], 
        isOpen: boolean, 
        closeSidebar: () => void 
    }>();

    // Deteksi apakah menu sedang aktif berdasarkan URL saat ini
    let currentPath = $derived($page.url.pathname);
</script>

{#if isOpen}
    <div 
        class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity md:hidden"
        onclick={closeSidebar}
        role="presentation"
    ></div>
{/if}

<aside class="fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:static md:translate-x-0
    {isOpen ? 'translate-x-0' : '-translate-x-full'}
">
    
    <div class="flex h-16 items-center justify-between px-6 md:hidden">
        <span class="text-xl font-black text-gray-900 dark:text-white">MyApp.</span>
        <button onclick={closeSidebar} class="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X class="h-6 w-6" />
        </button>
    </div>

    <div class="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 md:h-screen">
        <ul class="space-y-1">
            {#each menuItems as item}
                {@const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/')}
                <li>
                    <a 
                        href={item.href}
                        onclick={() => {
                            // Tutup sidebar di mobile saat link diklik
                            if (window.innerWidth < 768) closeSidebar();
                        }}
                        class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                        {isActive 
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800/50 dark:hover:text-white'}"
                    >
                        <svelte:component 
                            this={item.icon} 
                            class="h-5 w-5 {isActive ? 'text-blue-700 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}" 
                        />
                        {item.label}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
</aside>
<!-- apps/svelte5/src/lib/components/ui/layout/Navbar.svelte -->
<script lang="ts">
    import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
    import Menu from 'lucide-svelte/icons/menu';
    import Bell from 'lucide-svelte/icons/bell';
    import CircleUser from 'lucide-svelte/icons/circle-user';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

    // Menerima fungsi dari parent (layout) untuk membuka sidebar di mobile
    let { toggleSidebar } = $props<{ toggleSidebar: () => void }>();
</script>

<header class="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80 sm:px-6">
    
    <div class="flex items-center gap-4">
        <button 
            onclick={toggleSidebar}
            class="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 md:hidden"
            aria-label="Buka Menu"
        >
            <Menu class="h-6 w-6" />
        </button>
        <div class="hidden md:block">
            <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-black text-transparent dark:from-blue-400 dark:to-indigo-400">
                MyApp.
            </span>
        </div>
    </div>

    <div class="flex items-center gap-3">
        <button class="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <Bell class="h-5 w-5" />
            <span class="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        
        <ThemeToggle />

        <div class="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

        <!-- <button class="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <CircleUser class="h-8 w-8 text-gray-600 dark:text-gray-300" />
        </button> -->

        <DropdownMenu.Root>
            <DropdownMenu.Trigger><CircleUser class="h-8 w-8 text-gray-600 dark:text-gray-300" />User</DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Group>
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Profile</DropdownMenu.Item>
                <DropdownMenu.Item>Billing</DropdownMenu.Item>
                <DropdownMenu.Item>Team</DropdownMenu.Item>
                <DropdownMenu.Item>Subscription</DropdownMenu.Item>
                <DropdownMenu.Item>Log out</DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
</header>
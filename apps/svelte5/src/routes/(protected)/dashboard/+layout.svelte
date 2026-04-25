<script lang="ts">
    import Navbar from '$lib/components/ui/layout/Navbar.svelte';
    import Sidebar, { type MenuItem } from '$lib/components/ui/layout/Sidebar.svelte';
    
    // Import Icon yang dibutuhkan untuk menu ini
    import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard';
    import Users from 'lucide-svelte/icons/users';
    import Settings from 'lucide-svelte/icons/settings';
    import Database from 'lucide-svelte/icons/database';

    let { children } = $props();

    // State untuk mengontrol Sidebar di Mobile
    let isMobileSidebarOpen = $state(false);

    // INILAH DATA DOMAINNYA (Bisa diganti jika ini adalah folder (admin) atau (guru))
    const dashboardMenu: MenuItem[] = [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Table User', href: '/dashboard/user_table', icon: Users },
        { label: 'Data Master', href: '/dashboard/master', icon: Database },
        { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
    ];
</script>

<div class="flex min-h-screen w-full bg-gray-50 dark:bg-gray-950">
    
    <Sidebar 
        menuItems={dashboardMenu} 
        isOpen={isMobileSidebarOpen} 
        closeSidebar={() => isMobileSidebarOpen = false} 
    />

    <div class="flex flex-1 flex-col overflow-hidden">
        
        <Navbar toggleSidebar={() => isMobileSidebarOpen = true} />

        <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div class="mx-auto max-w-7xl">
                {@render children()}
            </div>
        </main>

    </div>
</div>
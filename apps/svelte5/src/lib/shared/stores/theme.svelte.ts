class ThemeStore {
    // State reaktif
    mode = $state<'light' | 'dark' | 'system'>('system');

    constructor() {
        // Hanya jalankan di browser (client-side)
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            this.mode = savedTheme || 'system';
        }
    }

    toggle() {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            this.mode = 'light';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            this.mode = 'dark';
        }
    }
}

export const themeStore = new ThemeStore();
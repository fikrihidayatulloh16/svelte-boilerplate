// apps/svelte5/src/lib/features/user/api/user.queries.ts
import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
import { userService } from './user.service'; // sesuaikan path

// 1. KONTRAK: Beritahu TypeScript bahwa kita meminta FUNGSI, bukan angka mati
export function useUsersQuery(
    search: () => string,
    page: () => number,     // <-- Harus () => number, bukan sekadar number
    limit: () => number     // <-- Harus () => number
) {
    return createQuery(() => {
        // Karena mereka fungsi, kita wajb mengeksekusinya untuk mendapatkan nilainya
        const currentSearch = search();
        const currentPage = page();
        const currentLimit = limit();

        return {
            queryKey: ['users', currentSearch, currentPage, currentLimit],
            queryFn: async () => await userService.fetchAll(currentSearch, currentPage, currentLimit),
            placeholderData: keepPreviousData,
            staleTime: 10 * 60 * 1000,              // 30 detik cukup untuk admin dashboard
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,     // tambah ini
            refetchOnReconnect: true,       // tambah ini
        };
    });
}
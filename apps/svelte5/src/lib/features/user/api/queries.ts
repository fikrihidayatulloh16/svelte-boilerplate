// features/user/api/queries.ts
import { createQuery } from '@tanstack/svelte-query';
import { userService } from './service'; // <--- Panggil Service, bukan Client

export function useUsersQuery(search: () => string) {
    return createQuery(() => ({
        queryKey: ['users', search()],
        queryFn: async () => await userService.fetchAll(search(), 1) 
    }));
}
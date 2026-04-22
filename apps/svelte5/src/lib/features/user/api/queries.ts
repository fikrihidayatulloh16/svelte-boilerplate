// apps/svelte5/src/lib/features/user/api/queries.ts
import { createQuery } from '@tanstack/svelte-query';
import { userClient } from './grpcClient';

export function useUsersQuery(search: () => string) { // Terima sebagai fungsi agar reaktif
	return createQuery(() => ({ // <--- WAJIB dibungkus fungsi di Svelte 5
		queryKey: ['users', search()], // Panggil fungsinya di sini
		queryFn: async () => {
			const res = await userClient.getUsers({ 
				search: search(), 
				page: 1, 
				limit: 10 
			});
			return res;
		}
	}));
}
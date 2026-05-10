// apps/svelte5/src/routes/(protected)/dashboard/+page.server.ts
import { userGrpcClient } from '$lib/features/user/api/user.grpcClient.js';
import { redirect } from '@sveltejs/kit';

// +page.server.ts
import { createServerGrpcClient } from '$lib/shared/server/grpc-client.js';

export const load = async ({ locals, cookies }) => {
    if (!locals.user) redirect(302, '/auth/login');

    const token = cookies.get('session_token') ?? '';
    const client = createServerGrpcClient(token); // ← gRPC native, cepat

    const result = await client.getUsers({ page: 1, limit: 20, search: '' });
    return { users: result.users };
};
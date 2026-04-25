// apps/svelte5/src/routes/auth/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Jika user sudah login, tendang dari SEMUA halaman di dalam folder /auth
    if (locals.user) {
        throw redirect(303, '/dashboard');
    }
    return {};
};
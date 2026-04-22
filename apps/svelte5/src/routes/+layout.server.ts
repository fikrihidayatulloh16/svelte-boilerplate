// apps/svelte5/src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Kita ambil user dari locals yang sudah diisi oleh hooks.server.ts
    return {
        user: locals.user
    };
};
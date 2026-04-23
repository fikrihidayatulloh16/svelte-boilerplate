import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Karena ini diletakkan di root (protected), 
    // SEMUA halaman di dalam folder ini otomatis terlindungi!
    if (!locals.user) {
        throw redirect(303, '/auth/login');
    }

    return {
        user: locals.user
    };
};
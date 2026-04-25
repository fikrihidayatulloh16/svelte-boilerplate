import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { authClient } from '$lib/features/auth/api/auth.grpcClient';

export const actions: Actions = {
    // Action 'default' karena route ini hanya punya satu tugas
    default: async ({ cookies }) => {
        try {
            // 1. Beri tahu backend gRPC untuk mematikan sesi di server (Database)
            await authClient.logout({});
        } catch (error) {
            // Walaupun gRPC gagal (misal server mati), kita TETAP harus
            // memaksa user logout di sisi klien demi keamanan.
            console.error("Gagal memberitahu backend saat logout", error);
        }

        // 2. Hancurkan Kunci (Cookie) di sisi klien
        cookies.delete('session_token', { 
            path: '/',
            // Pastikan atribut ini sama dengan saat Anda membuat cookie di login
            secure: process.env.NODE_ENV === 'production', 
            httpOnly: true,
            sameSite: 'lax'
        });

        // 3. Tendang kembali ke halaman login
        throw redirect(303, '/auth/login');
    }
};
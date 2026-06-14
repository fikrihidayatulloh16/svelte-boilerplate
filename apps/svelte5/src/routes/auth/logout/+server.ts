import { redirect } from '@sveltejs/kit';
import { authClient } from '$lib/features/auth/api/auth.grpcClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { authService } from '$lib/features/auth/api/auth.service';
import { createServerAuthClient } from '$lib/shared/server/grpc-client';

export const POST: RequestHandler = async ({ cookies, fetch }) => {
    // 1. Ekstrak Refresh Token dari brankas HttpOnly
    const refreshToken = cookies.get('refresh_token');
    const sessionToken = cookies.get('session_token') || '';

    if (refreshToken) {
        try {
            // 2. Beritahu server Rust untuk mem-blacklist token ini di Redis
            const authGrpc = createServerAuthClient(sessionToken);
            await authGrpc.logout({ refreshToken });
        } catch (error) {
            // Meskipun server Rust gagal merespons, kita TETAP harus menghapus sesi lokal
            console.error("🚨 Gagal mem-blacklist token di Backend, melanjutkan penghapusan sesi lokal.", error);
        }
    }

    // 3. KUNCI UTAMA: Hancurkan cookie di browser pengguna!
    cookies.delete('session_token', { path: '/' });
    cookies.delete('refresh_token', { path: '/' });

    // 4. Kembalikan respons sukses ke UI
        return json({ success: true, message: "Berhasil keluar dari sistem" });
        
        // throw redirect(303, '/auth/login');
};

// export const actions: Actions = {
//     // Action 'default' karena route ini hanya punya satu tugas
//     default: async ({ cookies }) => {
//         try {
//             // 1. Beri tahu backend gRPC untuk mematikan sesi di server (Database)
//             await authClient.logout({});
//         } catch (error) {
//             // Walaupun gRPC gagal (misal server mati), kita TETAP harus
//             // memaksa user logout di sisi klien demi keamanan.
//             console.error("Gagal memberitahu backend saat logout", error);
//         }

//         // 2. Hancurkan Kunci (Cookie) di sisi klien
        // cookies.delete('session_token', { 
        //     path: '/',
        //     // Pastikan atribut ini sama dengan saat Anda membuat cookie di login
        //     secure: process.env.NODE_ENV === 'production', 
        //     httpOnly: true,
        //     sameSite: 'lax'
        // });

//         // 3. Tendang kembali ke halaman login
//         throw redirect(303, '/auth/login');
//     }
// };
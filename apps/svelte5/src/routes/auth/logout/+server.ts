import { redirect } from '@sveltejs/kit';
import { authClient } from '$lib/features/auth/api/auth.grpcClient';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, fetch }) => {
    // 1. Ambil token sebelum dihancurkan
    const token = cookies.get('session_token');

    if (token) {
        try {
            // 2. Beritahu Rust Backend untuk mem-blacklist token ini.
            // Anda bisa menggunakan REST fetch (seperti yang Anda tes) atau gRPC Client.
            // Contoh menggunakan REST Fetch:
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (err) {
            console.error("Gagal mem-blacklist token di server Rust:", err);
            // Tetap lanjutkan penghapusan cookie meskipun backend gagal dihubungi
        }
    }

    // 3. KUNCI UTAMA: Hancurkan cookie di browser pengguna!
    cookies.delete('session_token', { path: '/' });

    // 4. Kembalikan respons sukses ke UI
        return json({ success: true });
        
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
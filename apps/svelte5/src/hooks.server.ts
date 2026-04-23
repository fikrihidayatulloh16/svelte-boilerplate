// apps/svelte5/src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authHandler: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        // --- BAYANGKAN LOGIKA INI NANTINYA ---
        // const grpcResponse = await userClient.getProfile({ token });
        // ATAU
        // const restResponse = await fetch('/api/profile').then(r => r.json());

        // --- UNTUK SEKARANG (MOCKING) ---
        // Kita masukkan objek murni biasa. Bebas tambah properti apa saja!
        event.locals.user = {
            id: '1',
            fullName: 'Admin User',
            role: 'admin',      // <-- Tidak akan error lagi!
            email: 'admin@example.com'
        };
    } else {
        event.locals.user = null;
    }

    // --- PROTEKSI RUTE (Pintu Gerbang) ---
    const isAccessingDashboard = event.url.pathname.startsWith('/dashboard');
    
    // Jika mencoba masuk dashboard tapi tidak ada user di Locals
    if (isAccessingDashboard && !event.locals.user) {
        // Gunakan 303 untuk redirect setelah pengecekan server
        throw redirect(303, '/auth/login');
    }

    return resolve(event);
};

export const handle = sequence(authHandler);
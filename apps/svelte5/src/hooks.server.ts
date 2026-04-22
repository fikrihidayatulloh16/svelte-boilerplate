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
            fullName: 'Fikri Hidayatulloh',
            role: 'admin',      // <-- Tidak akan error lagi!
            email: 'fikri@example.com'
        };
    } else {
        event.locals.user = null;
    }

    return resolve(event);
};

export const handle = sequence(authHandler);
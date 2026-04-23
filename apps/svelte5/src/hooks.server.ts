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

    const response = await resolve(event);

    // Suntikkan keamanan tambahan di Header Response
    response.headers.set('X-Frame-Options', 'DENY'); // Cegah Clickjacking
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Cegah MIME sniffing
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Opsional: Jika ingin sangat ketat (CSP)
    // response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline';");

    return response;
};

export const handle = sequence(authHandler);
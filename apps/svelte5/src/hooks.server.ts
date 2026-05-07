// apps/svelte5/src/hooks.server.ts
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { HandleServerError } from '@sveltejs/kit';
import { authService } from '$lib/features/auth/api/auth.service';

const authHandler: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session_token');

    if (token) {
        try {
            // Trik Ninja: Decode JWT Payload tanpa library tambahan (hanya base64 decode)
            const payloadBase64 = token.split('.')[1];
            // Tambahkan padding '=' jika kurang, untuk mencegah error atob
            const paddedBase64 = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
            
            const payload = JSON.parse(Buffer.from(paddedBase64, 'base64').toString('utf-8'));

            // Cek apakah token sudah expired
            if (Date.now() >= payload.exp * 1000) {
                throw new Error("Token expired");
            }

            // Masukkan ke locals agar bisa dipakai di semua halaman Svelte!
            event.locals.user = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                // fullName tidak ada di JWT log Anda, bisa dikosongkan atau ditambahkan di Rust nanti
                fullName: 'User' 
            };
        } catch (err) {
            console.error("🚨 Token Invalid / Expired, menghapus sesi...");
            event.cookies.delete('session_token', { path: '/' });
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);

    // Suntikkan keamanan tambahan di Header Response
    response.headers.set('X-Frame-Options', 'DENY'); // Cegah Clickjacking
    response.headers.set('X-Content-Type-Options', 'nosniff'); // Cegah MIME sniffing
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Opsional: Jika ingin sangat ketat (CSP)
    response.headers.set(
        'Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +            // Mengizinkan script bawaan Svelte
        "style-src 'self' 'unsafe-inline'; " +             // KUNCI: Mengembalikan gaya Tailwind/CSS Anda!
        "img-src 'self' data: https:; " +                  // Mengizinkan gambar dari data URI (SVG/Favicon)
        "connect-src 'self' http://localhost:3000 ws:;"    // Mengizinkan gRPC (localhost:3000) & Vite HMR (ws:)
    );

    

    return response;
};

export const handleError: HandleServerError = async ({ error, event, status, message }) => {
    // 1. Log error di terminal backend (sangat berguna untuk debugging)
    console.error(`🚨 [SERVER ERROR] pada ${event.url.pathname}:`, error);

    // 2. Kembalikan pesan yang aman ke +error.svelte
    return {
        message: status === 404 
            ? 'Halaman tidak ditemukan.' 
            : 'Terjadi kesalahan pada server kami. Tim sedang menanganinya.',
        errorId: crypto.randomUUID()
    };
};

export const handle = sequence(authHandler);
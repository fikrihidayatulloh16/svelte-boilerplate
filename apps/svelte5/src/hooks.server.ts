// apps/svelte5/src/hooks.server.ts
import { error as svelteError, redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { HandleServerError } from '@sveltejs/kit';
import { authService } from '$lib/features/auth/api/auth.service';
import { NetworkUnavailableError, AuthenticationError } from '$lib/features/auth/api/auth.adapter'; // <-- Import Error Kustom
import { createServerGrpcClient } from '$lib/shared/server/grpc-client';

const authHandler: Handle = async ({ event, resolve }) => {
    let sessionToken = event.cookies.get('session_token');
    const refreshToken = event.cookies.get('refresh_token');

    // SKENARIO 1: Token Sesi Expired / Tidak Ada, TAPI Refresh Token Ada
    if (!sessionToken && refreshToken) {
        try {
            const newTokens = await authService.refreshSession(refreshToken);
            
            event.cookies.set('session_token', newTokens.sessionToken, {
                path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 15
            });
            event.cookies.set('refresh_token', newTokens.refreshToken, {
                path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7
            });
            
            sessionToken = newTokens.sessionToken;
        } catch (err) {
            // DETEKSI CERDAS BERDASARKAN DOMAIN ERROR
            if (err instanceof NetworkUnavailableError) {
                console.error("🚧 Backend Rust sedang down. Sesi lokal DIPERTAHANKAN.");
                // Lempar 503 langsung. Proses berhenti di sini, layout Svelte akan memunculkan halaman error.
                throw svelteError(503, "Layanan otentikasi sedang tidak tersedia. Silakan muat ulang halaman sebentar lagi.");
            }

            if (err instanceof AuthenticationError) {
                console.warn("🚨 Token invalid/ditolak Rust. Menghapus sesi lokal...");
            } else {
                console.error("🚨 Silent Refresh Gagal oleh sebab tak terduga, menghapus sesi...", err);
            }

            // Sapu bersih sesi lokal (Kebijakan Bumi Hangus HANYA jika bukan karena jaringan putus)
            event.cookies.delete('session_token', { path: '/' });
            event.cookies.delete('refresh_token', { path: '/' });
            sessionToken = undefined;
        }
    }

    // SKENARIO 2: Validasi & Ekstrak Data dari Session Token yang hidup
    if (sessionToken) {
        try {
            const payloadBase64 = sessionToken.split('.')[1];
            const paddedBase64 = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
            const payload = JSON.parse(Buffer.from(paddedBase64, 'base64').toString('utf-8'));

            // Trik Ninja Validasi Lokal
            if (Date.now() >= payload.exp * 1000) {
                // Sengaja lempar error jika masih tembus (meski harusnya sudah ditangani Skenario 1)
                throw new Error("Token expired lokal"); 
            }

            event.locals.user = {
                id: payload.sub,
                email: payload.email,
                role: payload.role,
                fullName: payload.fullName || 'User' 
            };
        } catch (err) {
            // Fallback jika decode gagal atau token korup
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
        "connect-src 'self' http://localhost:50051 ws:; "  // Mengizinkan gRPC (localhost:3000) & Vite HMR (ws:)
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
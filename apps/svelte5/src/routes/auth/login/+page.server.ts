import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // --- MOCK LOGIC: Pura-pura validasi ke Backend ---
        // Jika di dunia nyata, di sini Anda melakukan:
        // const res = await fetch('http://api.fikri.com/login', { ... })
        // const token = res.json().token;

        if (email === 'admin@example.com' && password === 'admin123') {
            // Berhasil login! Kita tanam Cookie session_token
            cookies.set('session_token', 'mock-jwt-token-xyz-789', {
                path: '/',
                httpOnly: true, // Tidak bisa dibaca XSS hacker
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 Hari
            });

            // Redirect ke halaman terproteksi
            throw redirect(303, '/dashboard');
        }

        // Jika gagal login
        return fail(401, { error: 'Email atau password salah!' });
    }
} satisfies Actions;
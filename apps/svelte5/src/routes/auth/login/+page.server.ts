// apps/svelte5/src/routes/auth/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { toast } from 'svelte-sonner';

export const actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        // --- MOCK LOGIC: Pura-pura validasi ke Backend ---
        // Jika di dunia nyata, di sini Anda melakukan:
        // const res = await fetch('http://api.fikri.com/login', { ... })

        //  SESUAIKAN APAKAH TOKEN ATAU COOKIE

        // const token = res.json().token;

        // ===================== atau ====================

        // try {
        //     // --- MENGHUBUNGI BACKEND ASLI ---
        //     // const response = await api.login({ email, password });
            
        //     // Jika sukses, set cookie
        //     cookies.set('session_token', 'token-dari-backend', { path: '/' });
            
        // } catch (error: any) {
        //     // --- MENANGKAP ERROR DARI BACKEND ---
        //     // Backend biasanya mengirim status code dan pesan.
        //     // Misalnya backend (Go/Nest) membalas: 400 Bad Request, "Email tidak ditemukan"
            
        //     const backendMessage = error?.response?.data?.message // Jika pakai Axios/REST
        //                         || error?.rawMessage              // Jika pakai ConnectRPC/gRPC
        //                         || 'Terjadi kesalahan pada server backend.';

        //     // Kembalikan pesan asli backend ke UI
        //     return fail(error.status || 500, { error: backendMessage });
        // }

        // // Redirect dilakukan di LUAR try-catch agar tidak dianggap error
        // throw redirect(303, '/dashboard');

        //====================================================

        if (email === 'admin@example.com' && password === 'admin123') {
            // Berhasil login! Kita tanam Cookie session_token
            cookies.set('session_token', 'mock-jwt-token-xyz-789', {
                path: '/',
                httpOnly: true, // Tidak bisa dibaca XSS hacker
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 Hari
            });

            // toast.success("Berhasil, selamat datang")

            // Redirect ke halaman terproteksi
            throw redirect(303, '/dashboard');
        }

        // Jika gagal login
        return fail(401, { error: 'Email atau password salah!' });
    }
} satisfies Actions;
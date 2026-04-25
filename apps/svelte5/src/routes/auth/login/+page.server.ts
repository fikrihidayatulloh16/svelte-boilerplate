// apps/svelte5/src/routes/auth/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/features/auth/auth.schema'; 
import { authClient } from "$lib/features/auth/api/auth.grpcClient";
import type { z } from 'zod'; // Tambahkan ini
import { dev } from '$app/environment'; // Gunakan bawaan SvelteKit untuk cek env

// Definisikan tipe data form agar inferensi berjalan mulus
type LoginSchema = typeof loginSchema;

export const load: PageServerLoad = async ({locals}) => {
    // Tambahkan as any pada zod adapter jika TS masih protes soal versi zod
    return {
        form: await superValidate(zod(loginSchema))
    };
};

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        // A. Validasi dengan tipe eksplisit
        const form = await superValidate(request, zod(loginSchema));

        // B. Cek validitas
        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            // C. gRPC Backend sekarang akan mengenali email & password sebagai string
            const response = await authClient.login({
                email: form.data.email,
                password: form.data.password
            });

            // D. Set Cookie
            cookies.set('session_token', response.sessionToken, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: !dev, // Otomatis true di production, false di local
                maxAge: 60 * 60 * 24 * 7 
            });

        } catch (error: any) {
            // E. Hapus penggunaan toast di sini. Gunakan message()
            // Nantinya di +page.svelte kamu tangkap message ini untuk ditampilkan lewat toast
            return message(form, error.rawMessage || "Gagal melakukan login, periksa kembali kredensial Anda.", {
                status: 401 
            });
        }

        // F. Redirect
        throw redirect(303, '/dashboard');
    }
};
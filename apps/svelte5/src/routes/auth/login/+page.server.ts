// src/routes/auth/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema, type LoginFormData } from '$lib/features/auth/auth.schema'; 
import { authService } from '$lib/features/auth/api/auth.service';
import { dev } from '$app/environment'; 

export const load = async () => {
    // 1. Kembalikan as any untuk membungkam konflik versi Zod vs Superforms
    const form = await superValidate(zod(loginSchema as any));
    return { form };
};

export const actions = {
    login: async ({ request, cookies }) => {
        // 2. Kembalikan as any di sini juga
        const form = await superValidate(request, zod(loginSchema as any));

        if (!form.valid) {
            return fail(400, { form });
        }

        // ==========================================
        // THE NINJA CAST (DOUBLE CASTING)
        // ==========================================
        // Paksa TypeScript mengubah objek kosong '{}' menjadi 'unknown' dulu, 
        // baru kemudian dicetak menjadi LoginFormData. Ini dijamin tidak akan error.
        const formData = form.data as unknown as LoginFormData;

        try {
            const response = await authService.login({
                // 3. Sekarang TypeScript mengenali formData.email dan formData.password!
                email: formData.email,
                password: formData.password
            });

            // Simpan Session Token (misal 15 menit)
            cookies.set('session_token', response.sessionToken, {
                path: '/',
                httpOnly: true, 
                sameSite: 'lax',
                secure: !dev,
                maxAge: 60 * 15 
            });

            // Simpan Refresh Token (misal 7 hari)
            cookies.set('refresh_token', response.refreshToken, {
                path: '/',
                httpOnly: true, 
                sameSite: 'lax',
                secure: !dev,
                maxAge: 60 * 60 * 24 * 7 
            });

        } catch (error: any) {
            return message(form, error.rawMessage || error.message || "Gagal melakukan login", {
                status: 401 
            });
        }

        throw redirect(303, '/dashboard');
    }
};
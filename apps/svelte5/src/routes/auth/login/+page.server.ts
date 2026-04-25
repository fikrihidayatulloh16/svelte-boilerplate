// src/routes/auth/login/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/features/auth/auth.schema'; 
import { authService } from '$lib/features/auth/api/auth.service';
import { dev } from '$app/environment'; 

// 1. Export the load function correctly
export const load = async () => {
    // Force the type cast to any if the adapter is complaining due to version mismatch
    const form = await superValidate(zod(loginSchema as any));
    return { form };
};

export const actions = {
    login: async ({ request, cookies }) => {
        // Force the type cast here as well
        const form = await superValidate(request, zod(loginSchema as any));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            // Note: because we used 'as any' above, we might need to explicitly 
            // type the argument here if TS complains about Record<string, unknown>
            const response = await authService.login({
                email: form.data.email as string,
                password: form.data.password as string
            });

            cookies.set('session_token', response.sessionToken, {
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
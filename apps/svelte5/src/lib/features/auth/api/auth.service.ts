// apps/svelte5/src/lib/features/auth/api/auth.service.ts

// 1. Panggil authClient (sang Gatekeeper yang tahu harus pakai mock atau real)
import { authClient } from "./auth.grpcClient"; 
// 2. Ambil tipe data input dari schema
import type { LoginFormData } from "../auth.schema";

export const authService = {
    // Parameter menggunakan tipe dari Zod yang sudah dijamin bersih!
    async login(credentials: LoginFormData) {
        try {
            const res = await authClient.login({ 
                email: credentials.email, 
                password: credentials.password 
            });

            return {
                sessionToken: res.sessionToken,
                user: {
                    // Now TypeScript is happy because both mock and real 
                    // return the same property name (e.g., fullName)
                    name: res.user?.fullName || 'User Tanpa Nama'
                }
            };
        } catch (error) {
            console.error("🚨 GAGAL DI AUTH SERVICE:", error);
            throw error; 
        }
    },

    async logout() {
        try {
            return await authClient.logout({});
        } catch (error) {
            console.error("🚨 GAGAL LOGOUT:", error);
            throw error;
        }
    },

    async getProfile(token: string) {
        // Service yang akan menentukan apakah memanggil gRPC, REST, atau Mock
        const res = await authClient.getProfile({ token });
        console.log("Berhasil masuk ke service getprofile dengan data : ", res);
        
        return {
            id: res.id,
            fullName: res.fullName,
            role: res.role,
            email: res.email
        };
    }
};
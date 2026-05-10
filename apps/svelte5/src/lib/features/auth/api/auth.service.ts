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
                // Zod menggunakan password_raw, Proto TS menggunakan passwordRaw
                password: credentials.password 
            });

            // 2. Perbaikan Logika: Tangani respon 'error' dari backend
            if (res.status === "error") {
                // Lempar ke block catch agar ditangkap oleh UI/Superforms
                throw new Error(res.message || "Login gagal dari server");
            }

            // 3. Perbaikan Output: Sesuaikan kembalian murni dengan apa yang ada di Proto
            return {
                // Proto mengembalikan 'token', bukan 'sessionToken'
                sessionToken: res.sessionToken,
                user: {
                    id: res.user?.id,
                    email: res.user?.email,
                    fullName: res.user?.fullName,
                    role: res.user?.role
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

    // async getProfile(token: string) {
    //     // Service yang akan menentukan apakah memanggil gRPC, REST, atau Mock
    //     const res = await authClient.getProfile({ token });
    //     console.log("Berhasil masuk ke service getprofile dengan data : ", res);
        
    //     return {
    //         id: res.id,
    //         fullName: res.fullName,
    //         role: res.role,
    //         email: res.email
    //     };
    // }
};
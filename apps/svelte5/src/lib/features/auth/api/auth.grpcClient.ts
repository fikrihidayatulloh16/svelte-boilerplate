// apps/svelte5/src/lib/features/auth/api/auth.grpcClient.ts

import { createClient } from "@connectrpc/connect";
import { transport } from "$lib/shared/api/transport";
import { AuthService } from "$lib/gen/proto/auth_pb"; 

// 1. Client Nyata (Tersambung ke gRPC Backend)
export const realClient = createClient(AuthService, transport);

// 2. Client Palsu (Mock)
export const mockClient = {
    login: async (req: any) => {
        if (req.email === 'admin@example.com' && req.password === 'admin123') {
            return { 
                sessionToken: 'mock-token-xyz', 
                // Ensure this matches the proto definition!
                user: { fullName: 'Admin' } 
            };
        }
        throw new Error("Email atau password salah");
    },
    logout: async () => {
        return { success: true, message: "Berhasil logout" };
    },
    getProfile: async (token: any) => {
        if (token != null) {
            return { fullName: 'Admin Service', role: "admin", email: "admin@example.com" };
        }
        
    }
};

// 3. SWITCHER (Tinggal ubah true/false saat backend asli sudah siap)
const USE_MOCK = true;

// Ini yang di-export dan dipakai oleh +page.server.ts
// Nanti kalau backend siap, tinggal ganti USE_MOCK = false.
export const authClient = USE_MOCK ? mockClient : realClient;
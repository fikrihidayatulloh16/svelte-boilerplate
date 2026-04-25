// apps/svelte5/src/lib/features/auth/api/auth.grpcClient.ts

import { createClient } from "@connectrpc/connect";
import { transport } from "$lib/shared/api/transport";
import { AuthService } from "$lib/gen/proto/auth_pb"; 

// 1. Client Nyata (Tersambung ke gRPC Backend)
const realClient = createClient(AuthService, transport);

// 2. Client Palsu (Mock)
const mockClient = {
    login: async (req: any) => {
        // Simulasi delay jaringan
        // await new Promise(resolve => setTimeout(resolve, 1000)); 
        
        if (req.email === 'admin@example.com' && req.password === 'admin123') {
            return { sessionToken: 'mock-token-xyz', user: { full_name: 'Admin' } };
        }
        throw new Error("Email atau password salah");
    },
    logout: async () => {
        // await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi delay
        return { success: true, message: "Berhasil logout" };
    }
};

// 3. SWITCHER (Tinggal ubah true/false saat backend asli sudah siap)
const USE_MOCK = true;

// Ini yang di-export dan dipakai oleh +page.server.ts
// Nanti kalau backend siap, tinggal ganti USE_MOCK = false.
export const authClient = USE_MOCK ? mockClient : realClient;
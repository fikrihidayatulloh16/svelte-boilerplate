// apps/svelte5/src/lib/shared/api/transport.ts
import { createRouterTransport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web"; // <-- Import untuk Real API
import { userMock } from "$lib/features/user/api/mock";
import { errorInterceptor } from "./interceptors";

// Ganti ke 'false' nanti jika Backend Nginx/Go/NestJS Anda sudah siap
const USE_MOCK = true; 

// --- 1. MOCK TRANSPORT (Simulasi tanpa jaringan) ---
const mockTransport = createRouterTransport((router) => {
    userMock(router);
}, {
    transport: {
        interceptors: [errorInterceptor]
        // Tidak ada 'credentials' di sini karena tidak pakai jaringan HTTP
    }
});

// --- 2. REAL TRANSPORT (Untuk Production/Backend Asli) ---
const realTransport = createConnectTransport({
    // Karena Anda pakai Nginx reverse proxy di domain yang sama
    baseUrl: "/api", 
    interceptors: [errorInterceptor],
    // DI SINI tempatnya agar browser otomatis mengirim Cookie ke Backend
    // credentials: "include", 
});

// Export transport sesuai saklar
export const transport = USE_MOCK ? mockTransport : realTransport;
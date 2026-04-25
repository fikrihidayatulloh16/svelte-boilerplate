// apps/svelte5/src/lib/shared/api/interceptors.ts
import { type Interceptor, Code, ConnectError } from "@connectrpc/connect";
import { toast } from "svelte-sonner";
import { loadingStore } from "../stores/loading.svelte";
import { browser } from "$app/environment"; // Cek apakah di browser atau server
import { goto } from "$app/navigation";

interface RetryOptions {
    maxAttempts: number;
    initialDelayMs: number;
}

export const loadingInterceptor: Interceptor = (next) => async (req) => {
    // Kita hanya mengaktifkan loading bar jika di browser
    if (browser) loadingStore.start();
    
    try {
        return await next(req);
    } finally {
        if (browser) loadingStore.done();
    }
};

export const errorInterceptor: Interceptor = (next) => async (req) => {
    try {
        return await next(req);
    } catch (err: any) {
        // 1. Ekstrak pesan dengan fallback yang aman
        const errorMessage = err.message || "Terjadi kesalahan pada koneksi API.";

        // 2. Logging di terminal server (untuk debugging)
        if (!browser) {
            console.error(`[gRPC Server Error] ${req.service.typeName}.${req.method.name}:`, err);
        }

        // 3. Logika UI (Hanya dijalankan di Browser)
        if (browser) {
            switch (err.code) {
                case Code.Unauthenticated: // Kode 16
                    toast.error("Sesi habis, mengalihkan ke login...");
                    // Gunakan goto agar navigasi halus (SPA), bukan window.location
                    setTimeout(() => goto('/auth/login'), 1500);
                    break;

                case Code.PermissionDenied: // Kode 7
                    toast.error("Anda tidak memiliki izin untuk aksi ini.");
                    break;

                case Code.InvalidArgument: // Kode 3
                    toast.warning(`Data tidak valid: ${errorMessage}`);
                    break;

                case Code.NotFound: // Kode 5
                    toast.error("Data tidak ditemukan.");
                    break;

                default:
                    // Jangan tampilkan toast jika ini error pembatalan request (Canceled)
                    if (err.code !== Code.Canceled) {
                        toast.error(`Sistem Error: ${errorMessage}`);
                    }
                    break;
            }
        }

        // 4. Lemparkan kembali agar server-side logic (+page.server.ts) 
        // tetap bisa menangkap error ini (misal untuk return fail(400))
        throw err;
    }
};

export const retryInterceptor = (options: RetryOptions = { maxAttempts: 3, initialDelayMs: 1000 }): Interceptor => {
    return (next) => async (req) => {
        let attempts = 0;
        
        while (true) {
            try {
                attempts++;
                return await next(req);
            } catch (err) {
                const isConnectError = err instanceof ConnectError;
                
                // Tentukan kode apa saja yang layak di-retry
                const shouldRetry = isConnectError && (
                    err.code === Code.Unavailable || 
                    err.code === Code.Aborted ||
                    err.code === Code.DeadlineExceeded
                );

                // Jika sudah maksimal mencoba atau tidak layak di-retry, lempar error-nya
                if (!shouldRetry || attempts >= options.maxAttempts) {
                    throw err;
                }

                // Kalkulasi Exponential Backoff: 1s, 2s, 4s...
                const delay = options.initialDelayMs * Math.pow(2, attempts - 1);
                
                console.warn(`[gRPC Retry] Percobaan ke-${attempts} gagal. Mencoba lagi dalam ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    };
};
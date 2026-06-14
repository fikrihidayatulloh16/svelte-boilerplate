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
        if (!browser) {
            console.error(`[gRPC Server Error] ${req.service.typeName}.${req.method.name}:`, err);
            throw err;
        }

        // Alih-alih memanggil toast langsung, kita gunakan CustomEvent browser.
        // Ini membuat layer jaringan terlepas sepenuhnya (decoupled) dari pustaka UI apa pun.
        if (browser && err instanceof ConnectError) {
            const event = new CustomEvent("app:api-error", {
                detail: {
                    code: err.code,
                    message: err.rawMessage || "Terjadi kesalahan pada koneksi API."
                }
            });
            window.dispatchEvent(event);
        }

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

export const authInterceptor: Interceptor = (next) => async (req) => {
    if (browser) {
        // Ambil token dari cookie yang bisa dibaca JS
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('session_token='))
            ?.split('=')[1];

        if (token) {
            req.header.set('authorization', `Bearer ${token}`);
        }
    }
    return next(req);
};

export const rumLatencyInterceptor: Interceptor = (next) => async (req) => {
    // 1. Catat waktu sebelum request berangkat dari Browser
    const start = performance.now();
    
    try {
        // 2. Biarkan request berjalan ke Rust
        const response = await next(req);
        
        // 3. Catat waktu saat response selesai diproses Browser
        const duration = Math.round(performance.now() - start);
        
        // Cukup log di console browser saat tahap development
        console.log(`[RUM] ${req.method.name}: ${duration}ms (E2E)`);
        
        // TODO (Tahap Lanjut): Kirim 'duration' ini ke server metrik
        
        return response;
    } catch (error) {
        const duration = Math.round(performance.now() - start);
        console.error(`[RUM] ${req.method.name} GAGAL: ${duration}ms (E2E)`);
        throw error;
    }
};
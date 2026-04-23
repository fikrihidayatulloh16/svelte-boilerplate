import type { Interceptor } from "@connectrpc/connect";
import { Code, ConnectError } from "@connectrpc/connect";
import { toast } from "svelte-sonner";
import { loadingStore } from "../stores/loading.svelte";

export const loadingInterceptor: Interceptor = (next) => async (req) => {
    loadingStore.start(); // Mulai saat request berangkat
    try {
        return await next(req);
    } finally {
        loadingStore.done(); // Selesai saat respon diterima (sukses maupun error)
    }
};

// Error Interceptor: Hanya bertugas menangkap error dari backend
export const errorInterceptor: Interceptor = (next) => async (req) => {
    try {
        return await next(req);
    } catch (err: any) {
        // --- BACKEND MERESPON ERROR ---
        
        // 1. Ekstrak pesan dari Backend
        const errorMessage = err.rawMessage || "Gagal terhubung ke API.";
        
        // 2. Munculkan Toast berdasarkan Kode Status gRPC (Code)
        // gRPC punya kode error sendiri (misal: 16 = Unauthenticated, 3 = Invalid Argument)
        
        if (err.code === 16) { 
            toast.error("Sesi Anda habis. Silakan login kembali.");
            // Opsional: window.location.href = '/auth/login';
        } else if (err.code === 3) {
            toast.warning(`Input tidak valid: ${errorMessage}`);
        } else {
            // Error umum (500 Internal Server Error, dll)
            toast.error(`Sistem Error: ${errorMessage}`);
        }

        // 3. Lemparkan error kembali agar komponen tetap tahu ada yang salah
        throw err;
    }
};
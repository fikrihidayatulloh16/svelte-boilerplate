import type { Interceptor } from "@connectrpc/connect";
import { Code, ConnectError } from "@connectrpc/connect";

// authInterceptor SUDAH DIHAPUS. Keamanan ditangani oleh Cookie Browser.

// Error Interceptor: Hanya bertugas menangkap error dari backend
export const errorInterceptor: Interceptor = (next) => async (req) => {
    try {
        return await next(req);
    } catch (err) {
        if (err instanceof ConnectError && err.code === Code.Unauthenticated) {
            console.error("Sesi habis atau tidak valid.");
            // Beri tahu aplikasi SvelteKit (di +layout.svelte) untuk redirect ke login
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            }
        }
        throw err; 
    }
};
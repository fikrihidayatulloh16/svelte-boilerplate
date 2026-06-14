// apps/svelte5/src/routes/api/events/users/+server.ts
import type { RequestHandler } from './$types';

const RUST_SSE_ENDPOINT = "http://localhost:3000/api/events/sse"; 

export const GET: RequestHandler = async ({ cookies, request }) => {
    const sessionToken = cookies.get('session_token');

    if (!sessionToken) {
        return new Response("Unauthorized", { status: 401 });
    }

    const abortController = new AbortController();
    request.signal.addEventListener('abort', () => {
        console.log("🛑 Klien menutup tab/browser. Memutus koneksi SSE...");
        abortController.abort();
    });

    try {
        const backendRes = await fetch(RUST_SSE_ENDPOINT, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                'Accept': 'text/event-stream'
            },
            signal: abortController.signal
        });

        if (!backendRes.ok || !backendRes.body) {
            throw new Error(`Rust menolak koneksi SSE: ${backendRes.statusText}`);
        }

        // ==========================================
        // THE FIX: MANUAL STREAM PUSHER
        // ==========================================
        const stream = new ReadableStream({
            async start(controller) {
                // 1. Paksa Vite/Browser mengakui koneksi dengan mengirim "Comment" kosong
                // Ini akan langsung memicu 'onopen' di browser!
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode(": PING DARI SVELTEKIT (MEMBUKA PIPA)\n\n"));

                // 2. Ambil pengontrol baca dari stream Rust
                const reader = backendRes.body!.getReader();

                try {
                    // 3. Pompa data terus menerus selama koneksi hidup
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        
                        // Dorong chunk data mentah dari Rust langsung ke Browser
                        controller.enqueue(value);
                    }
                } catch (e: any) {
                    if (e.name !== 'AbortError') {
                        console.error("🚨 Error saat membaca stream Rust:", e);
                    }
                } finally {
                    try { controller.close(); } catch (_) {}
                }
            },
            cancel() {
                abortController.abort();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                // Header krusial untuk menonaktifkan kompresi dan buffering
                'X-Accel-Buffering': 'no',
                'Transfer-Encoding': 'chunked'
            }
        });

    } catch (err: any) {
        console.error("🚨 Kegagalan Proxy SSE:", err.message);
        return new Response("Internal Server Error pada Proxy SSE", { status: 500 });
    }
};
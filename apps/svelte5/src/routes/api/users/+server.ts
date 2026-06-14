// apps/svelte5/src/routes/api/users/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createServerGrpcClient } from '$lib/shared/server/grpc-client';

export const GET: RequestHandler = async ({ url, cookies }) => {
    // 1. Ekstrak token dari brankas HttpOnly
    const sessionToken = cookies.get('session_token');

    if (!sessionToken) {
        return json({ error: "Sesi tidak valid atau telah habis" }, { status: 401 });
    }

    // 2. Ambil parameter pencarian dan paginasi dari URL Browser
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search') || "";

    try {
        // 3. Rakit klien gRPC HTTP/2 khusus server (The Proxy)
        // Klien ini sudah dikonfigurasi di sesi sebelumnya untuk menyisipkan header Authorization
        const userGrpc = createServerGrpcClient(sessionToken);

        // 4. Tembak Rust!
        const res = await userGrpc.getUsers({ search, page, limit });

        // 5. Kembalikan data murni ke Browser sebagai JSON biasa
        return json({
            users: res.users,
            total: Number(res.totalCount)
        });
    } catch (error: any) {
        console.error("🚨 BFF Proxy Error (GetUsers):", error);
        // Tangkap error gRPC dan teruskan ke frontend
        return json(
            { error: error.rawMessage || "Gagal mengambil data dari server internal" }, 
            { status: error.code === 16 ? 401 : 500 }
        );
    }
};
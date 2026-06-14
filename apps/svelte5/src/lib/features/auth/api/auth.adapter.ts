// apps/svelte5/src/lib/features/auth/api/auth.adapter.ts
import { realClient } from "./auth.grpcClient";
import type { LoginFormData } from "../auth.schema";
import { ConnectError } from "@connectrpc/connect";
import { PUBLIC_USE_MOCK } from '$env/static/public';

// 1. KONTRAK PORT (Inilah yang membuat Service jadi buta)
export interface IAuthPort {
    login(credentials: LoginFormData): Promise<{
        sessionToken: string;
        refreshToken: string;
        user: { id: string; email: string; fullName: string; role: string };
    }>;
    logout(refreshToken: string): Promise<boolean>;
    refreshSession(refreshToken: string): Promise<{ sessionToken: string; refreshToken: string }>;
}

// 2. ERROR TRANSLATOR (Mencegah gRPC bocor ke Service)
function translateError(error: unknown, defaultMessage: string): never {
    if (error instanceof ConnectError) {
        throw new Error(error.rawMessage || defaultMessage);
    }
    // Jika nanti Anda ganti ke REST/Axios, Anda cukup tambah deteksi AxiosError di sini!
    throw new Error(defaultMessage);
}

// 3. IMPLEMENTASI ASLI (gRPC HTTP/2)
const grpcAdapter: IAuthPort = {
    async login(credentials) {
        try {
            const res = await realClient.login({ email: credentials.email, password: credentials.password });
            return {
                sessionToken: res.sessionToken,
                refreshToken: res.refreshToken,
                user: {
                    id: res.user?.id || "",
                    email: res.user?.email || "",
                    fullName: res.user?.fullName || "",
                    role: res.user?.role || "user"
                }
            };
        } catch (err) {
            translateError(err, "Login gagal, periksa kembali email dan password Anda.");
        }
    },
    async logout(refreshToken) {
        try {
            const res = await realClient.logout({ refreshToken });
            return res.success;
        } catch (err) {
            translateError(err, "Gagal melakukan logout dari server.");
        }
    },
    async refreshSession(refreshToken) {
        try {
            const res = await realClient.refreshToken({ refreshToken });
            return { sessionToken: res.accessToken, refreshToken: res.refreshToken };
        } catch (err) {
            translateError(err, "Sesi Anda telah kedaluwarsa sepenuhnya.");
        }
    }
};

// 4. IMPLEMENTASI MOCK (Untuk Development tanpa Rust)
const mockAdapter: IAuthPort = {
    async login(credentials) {
        return {
            sessionToken: "mock-session-123",
            refreshToken: "mock-refresh-456",
            user: { id: "1", email: credentials.email, fullName: "Mock User", role: "admin" }
        };
    },
    async logout() { return true; },
    async refreshSession() {
        return { sessionToken: "new-mock-session", refreshToken: "new-mock-refresh" };
    }
};

// 5. EXPORT SANG PENJAGA GERBANG
export const authAdapter: IAuthPort = PUBLIC_USE_MOCK === 'true' ? mockAdapter : grpcAdapter;
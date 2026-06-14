// apps/svelte5/src/lib/features/auth/api/auth.service.ts
import { authAdapter } from "./auth.adapter"; 
import type { LoginFormData } from "../auth.schema";

// Entitas murni UI
export interface AuthSession {
    sessionToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
    };
}

export const authService = {
    
    async login(credentials: LoginFormData): Promise<AuthSession> {
        // Service BENAR-BENAR BUTA. Ia hanya memanggil fungsi dan melempar hasil.
        // Jika error, errornya sudah berupa standar JavaScript Error dari adapter.
        return await authAdapter.login(credentials);
    },

    async logout(refreshToken: string): Promise<boolean> {
        return await authAdapter.logout(refreshToken);
    },

    async refreshSession(refreshToken: string) {
        return await authAdapter.refreshSession(refreshToken);
    }
    
};
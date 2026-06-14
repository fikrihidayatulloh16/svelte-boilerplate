// apps/svelte5/src/lib/features/user/api/user.service.ts
import { userGrpcClient } from "./user.grpcClient";
import { userSchema, type UserEntity } from "../schema/user.schema";

export const userService = {
    async fetchAll(search: string, page: number, limit: number) {
        try {
            // 1. Tembak SvelteKit Internal API, BUKAN server Rust!
            const params = new URLSearchParams({ search, page: String(page), limit: String(limit) });
            const res = await fetch(`/api/users?${params.toString()}`);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Gagal mengambil data user");
            }

            const data = await res.json();

            // 2. Mapping Cerdas dengan Zod (Anti-Corruption Layer)
            const items: UserEntity[] = data.users.map((u: any) => {
                return userSchema.parse({
                    id: u.id,
                    email: u.email,
                    fullName: u.fullName,
                    // Pastikan penamaan field sesuai dengan JSON yang dihasilkan SvelteKit
                    avatar_url: u.avatarUrl || u.avatar_url, 
                    isActive: u.isActive,
                    createdAt: new Date(u.createdAt || Date.now()),
                    updated_at: new Date(u.updatedAt || Date.now())
                });
            });

            return { items, total: data.total };
        } catch (error) {
            console.error("🚨 GAGAL DI SERVICE LAYER UI:", error);
            throw error; 
        }
    }
};
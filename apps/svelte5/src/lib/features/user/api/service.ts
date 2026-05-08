// apps/svelte5/src/lib/features/user/api/service.ts
import { userClient } from "./grpcClient";
import { userSchema, type UserEntity } from "../schema/user.schema";

export const userService = {
    // Tambahkan parameter limit di sini
    async fetchAll(search: string, page: number, limit: number) {
        try {
            const res = await userClient.getUsers({ search, page, limit });

            // Mapping cerdas dengan Zod tetap berjalan
            const items: UserEntity[] = res.users.map((u) => {
                return userSchema.parse({
                    id: u.id,
                    email: u.email,
                    fullName: u.fullName,
                    avatar_url: u.avatarUrl,
                    isActive: u.isActive,
                    createdAt: new Date(u.createdAt),
                    updated_at: new Date(u.updatedAt)
                });
            });

            console.log(res);
            

            // Pastikan Anda membalikkan items (bukan res.users mentah)
            return { items, total: Number(res.totalCount) };
        } catch (error) {
            console.error("🚨 GAGAL DI SERVICE LAYER:", error);
            throw error; 
        }
    }
};
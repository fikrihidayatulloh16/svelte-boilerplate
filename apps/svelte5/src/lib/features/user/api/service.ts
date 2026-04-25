// apps/svelte5/src/lib/features/user/api/service.ts
import { userClient } from "./grpcClient";
import { userSchema, type UserEntity } from "../schema/user.schema";

export const userService = {
    async fetchAll(search: string, page: number) {
        try {
            // console.log("1. Service dipanggil!");
            // Panggil client secara normal (dia akan lari ke Mock secara otomatis jika USE_MOCK=true)
            const res = await userClient.getUsers({ search, page, limit: 10 });

            // console.log("2. Data mentah dari Mock/Backend:", res);
            
            // Mapping cerdas dengan Zod
            const items: UserEntity[] = res.users.map((u) => {
                return userSchema.parse({
                    id: u.id,
                    email: u.email,
                    fullName: u.fullName,
                    avatar_url: u.avatarUrl,
                    isActive: u.isActive,
                    // Kita hanya perlu mengintervensi bagian yang butuh transformasi
                    createdAt: new Date(u.createdAt),
                    updated_at: new Date(u.updatedAt)
                });
            });

            // console.log("3. Data berhasil di-map:", items);

            return { items, total: res.totalCount };
        } catch (error) {
            console.error("🚨 GAGAL DI SERVICE LAYER:", error);
            throw error; // Lempar lagi agar TanStack tahu ini error
        }
    }
};
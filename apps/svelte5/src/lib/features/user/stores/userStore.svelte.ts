// apps/svelte5/src/lib/features/user/stores/userStore.svelte.ts
import { userClient } from "../api/grpcClient";
import type { User } from "$lib/gen/proto/user_pb";
import { userService } from "../api/service";
import type { UserEntity } from "../schema/user.schema";

export function createUserStore() {
    let users = $state<UserEntity[]>([]);
    let isLoading = $state(false);
    let totalCount = $state(0);
    
    // Simpan parameter pencarian di store agar reaktif
    let page = $state(1);
    let limit = $state(10);
    let search = $state("");

    // Fungsi utama
    async function fetchUsers() {
        isLoading = true;
        try {
            // PANGGIL SERVICE (Zod), BUKAN CLIENT!
            const response = await userService.fetchAll(search, page, limit);
            users = response.items;
            totalCount = response.total;
        } catch (error) {
            console.error("Gagal mengambil user:", error);
        } finally {
            isLoading = false;
        }
    }

    return {
        get users() { return users },
        get isLoading() { return isLoading },
        get totalCount() { return totalCount },
        
        get page() { return page },
        set page(v: number) { 
            page = v; 
            fetchUsers(); // Otomatis fetch data baru saat halaman diubah
        },
        
        get limit() { return limit },
        set limit(v: number) { 
            limit = v; 
            page = 1; // Kembali ke halaman 1 jika limit diubah
            fetchUsers(); 
        },

        get search() { return search },
        set search(v: string) {
            search = v;
            page = 1; // Kembali ke halaman 1 jika mencari kata baru
            // fetchUsers(); // Panggil ini manual via tombol cari, atau otomatis di sini (debounce disarankan)
        },

        fetchUsers
    };
}
import { userClient } from "../api/grpcClient";
import type { User } from "$lib/gen/proto/user_pb";

export function createUserStore() {
    // State menggunakan Runes
    let users = $state<User[]>([]);
    let isLoading = $state(false);
    let totalCount = $state(0);

    // Fungsi untuk mengambil data
    async function fetchUsers(search = "", page = 1) {
        isLoading = true;
        try {
            const response = await userClient.getUsers({
                search,
                page,
                limit: 10
            });
            users = response.users;
            totalCount = response.totalCount;
        } catch (error) {
            console.error("Gagal mengambil user:", error);
        } finally {
            isLoading = false;
        }
    }

    return {
        // Getter agar state tetap read-only dari luar
        get users() { return users },
        get isLoading() { return isLoading },
        get totalCount() { return totalCount },
        fetchUsers
    };
}
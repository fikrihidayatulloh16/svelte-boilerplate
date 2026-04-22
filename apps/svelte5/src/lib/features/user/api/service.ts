// features/user/api/service.ts
import { userClient } from "./grpcClient";
// import { userRestClient } from "./rest-client";

export const userService = {
    async getUserList(search: string) {
        // Jika ingin ganti ke REST, tinggal ganti baris ini saja. 
        // Komponen UI & TanStack Query tidak akan tahu perubahannya.
        return await userClient.getUsers({ search, page: 1, limit: 10 });
    }
};
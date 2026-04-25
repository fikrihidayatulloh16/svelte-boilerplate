// apps/svelte5/src/lib/features/user/api/grpcClient.ts

import { createClient } from "@connectrpc/connect";
import { transport } from "$lib/shared/api/transport";
import { UserService } from "$lib/gen/proto/user_pb"; // Cek jika file ini ada

export const userClient = createClient(UserService, transport);
// apps/svelte5/src/lib/features/user/api/user.grpcClient.ts
import { createClient, type Interceptor } from "@connectrpc/connect";
import { createGrpcTransport } from "$lib/shared/api/transport";
import { UserService } from "$lib/gen/proto/user_pb"; 

export const userGrpcClient = createClient(UserService, createGrpcTransport());
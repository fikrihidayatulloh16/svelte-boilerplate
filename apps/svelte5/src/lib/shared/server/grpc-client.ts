// apps/svelte5/src/lib/shared/server/grpc-client.ts — khusus server SvelteKit
import { createGrpcTransport } from "@connectrpc/connect-node";
import { createClient, type Interceptor } from "@connectrpc/connect";
import { UserService } from "$lib/gen/proto/user_pb";
import { AuthService } from "$lib/gen/proto/auth_pb";

export const createServerGrpcClient = (token: string) => {
    const authInterceptor: Interceptor = (next) => async (req) => {
        req.header.set('authorization', `Bearer ${token}`);
        return next(req);
    };

    // gRPC native HTTP/2 — server to server, lebih cepat dari gRPC-Web
    const transport = createGrpcTransport({
        baseUrl: "http://localhost:50051",
        interceptors: [authInterceptor],
    });

    return createClient(UserService, transport);
};

export const createServerAuthClient = (token: string) => {
    const authInterceptor: Interceptor = (next) => async (req) => {
        if (token) {
            req.header.set('authorization', `Bearer ${token}`);
        }
        return next(req);
    };

    const transport = createGrpcTransport({
        baseUrl: "http://localhost:50051",
        interceptors: [authInterceptor],
        // Node.js akan otomatis menggunakan HTTP/2 yang jauh lebih cepat!
    });

    return createClient(AuthService, transport);
};
import { createRouterTransport, type Interceptor } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { PUBLIC_API_URL, PUBLIC_USE_MOCK } from '$env/static/public';
import { userMock } from "$lib/features/user/api/user.mock";
import {
    authInterceptor,
    errorInterceptor,
    loadingInterceptor,
    retryInterceptor
} from "./interceptors";

export const createGrpcTransport = (customInterceptors: Interceptor[] = []) => {
    if (PUBLIC_USE_MOCK === 'true') {
        return createRouterTransport((router) => {
            userMock(router);
        }, {
            transport: {
                interceptors: [
                    ...customInterceptors,
                    loadingInterceptor,
                    errorInterceptor,
                ],
            }
        });
    }

    return createGrpcWebTransport({
        baseUrl: PUBLIC_API_URL,
        interceptors: [
            ...customInterceptors,
            authInterceptor,
            retryInterceptor({ maxAttempts: 3, initialDelayMs: 1000 }),
            loadingInterceptor,
            errorInterceptor,
        ],
    });
};
import { createRouterTransport } from "@connectrpc/connect";
import { userMock } from "$lib/features/user/api/mock"; 

export const transport = createRouterTransport((router) => {
  // Masukkan 'router' ke dalam fungsi mock
  userMock(router);
});
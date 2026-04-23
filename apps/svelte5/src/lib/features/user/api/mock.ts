import type { ConnectRouter } from "@connectrpc/connect";
import { UserService } from "$lib/gen/proto/user_pb";

export const userMock = (router: ConnectRouter) => {
  router.service(UserService, {
    async getUsers(req) {
      // req di sini otomatis bertipe GetUsersRequest
      console.log("Mock Call:", req);
      
      return {
        users: [
          { 
            id: "1", 
            fullName: "Muhammad Fikri Hidayatulloh", 
            email: "fikri@example.com",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            avatarUrl: "",
            role: "admin",
          },
          { 
            id: "2", 
            fullName: "John Doe", 
            email: "johndoe@example.com",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            avatarUrl: "",
            role: "admin",
          },
          { 
            id: "3", 
            fullName: "SuperAdmin", 
            email: "superadmin@example.com",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            avatarUrl: "",
            role: "superadmin",
            hash_password: "superadmin",
          }
        ],
        totalCount: 3
      };
    }
  });
};
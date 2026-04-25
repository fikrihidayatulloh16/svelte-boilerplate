// apps/svelte5/src/lib/features/auth/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email({ message: "Format email salah" }),
    password: z.string().min(6, "Password minimal 6 karakter")
});

// AJAIBNYA ZOD: Anda bisa mengekstrak tipe TypeScript murni dari Zod
export type LoginFormData = z.infer<typeof loginSchema>;
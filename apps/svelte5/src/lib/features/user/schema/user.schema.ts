import { z } from 'zod';

// Ini adalah standar "User" di aplikasi kita.
// Tidak peduli backend mengirim 'full_name' atau 'fullName', 
// di UI kita maunya selalu 'name'.
export const userSchema = z.object({
    id: z.string(),
    email: z.string().email(),
    fullName: z.string(),
    avatar_url: z.string(),
    isActive: z.boolean(),
    createdAt: z.date(), // Kita ubah string ISO dari API jadi objek Date asli
    updated_at: z.date(), // Kita ubah string ISO dari API jadi objek Date asli
});

// Inilah tipe yang akan dipakai oleh Komponen UI
export type UserEntity = z.infer<typeof userSchema>;


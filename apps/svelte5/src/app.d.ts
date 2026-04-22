// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
// apps/svelte5/src/app.d.ts
declare global {
	namespace App {
		interface Locals {
            // Tipe murni, tidak ada urusan dengan gRPC
            user: {
                id: string;
                fullName: string;
                role: string;
                email?: string;
            } | null;
        }
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

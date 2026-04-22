// apps/svelte5/src/lib/shared/stores/auth.svelte.ts

// Definisikan tipe murni di sini juga, atau import dari file tipe terpisah
type AppUser = NonNullable<App.Locals['user']>;

class AuthStore {
    #user = $state<AppUser | null>(null);
    #initialized = $state(false);

    get user() { return this.#user; }
    get isLoggedIn() { return !!this.#user; }

    setSession(user: AppUser | null) {
        this.#user = user;
        this.#initialized = true;
    }

    clearSession() {
        this.#user = null;
    }
}

export const authStore = new AuthStore();
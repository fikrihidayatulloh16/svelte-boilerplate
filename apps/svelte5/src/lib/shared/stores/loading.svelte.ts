import { untrack } from 'svelte'; // <-- Import ini

class LoadingStore {
    private _activeRequests = $state(0);
    isLoading = $derived(this._activeRequests > 0);

    start() {
        // Untrack membuat fungsi ini kebal dari infinite loop jika dipanggil dalam $effect
        untrack(() => {
            this._activeRequests++;
        });
    }

    done() {
        untrack(() => {
            this._activeRequests = Math.max(0, this._activeRequests - 1);
        });
    }

    forceStop() {
        untrack(() => {
            this._activeRequests = 0;
        });
    }
}

export const loadingStore = new LoadingStore();
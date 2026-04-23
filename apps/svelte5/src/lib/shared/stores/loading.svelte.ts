import { untrack } from 'svelte';

class LoadingStore {
    private _activeRequests = $state(0);
    progress = $state(0); // State untuk persentase
    private _interval: any;

    isLoading = $derived(this._activeRequests > 0);

    start() {
        untrack(() => {
            this._activeRequests++;
            if (this._activeRequests === 1) {
                this._startTrickle();
            }
        });
    }

    private _startTrickle() {
        this.progress = 10; // Mulai dari 10%
        this._interval = setInterval(() => {
            untrack(() => {
                if (this.progress < 90) {
                    // Semakin mendekati 90, jalannya semakin pelan (realistis)
                    const increment = (90 - this.progress) * 0.1;
                    this.progress += increment;
                }
            });
        }, 300);
    }

    done() {
        untrack(() => {
            this._activeRequests = Math.max(0, this._activeRequests - 1);
            if (this._activeRequests === 0) {
                this.progress = 100;
                clearInterval(this._interval);
                // Beri jeda sebentar agar user melihat angka 100% sebelum hilang
                setTimeout(() => {
                    untrack(() => { if (this._activeRequests === 0) this.progress = 0; });
                }, 200);
            }
        });
    }
}

export const loadingStore = new LoadingStore();
import { untrack } from 'svelte';

class LoadingStore {
    private _activeRequests = $state(0);
    progress = $state(0);
    isSlow = $state(false); // State untuk pesan koneksi lambat
    private _interval: any;
    private _slowTimer: any;

    isLoading = $derived(this._activeRequests > 0);

    start() {
        untrack(() => {
            this._activeRequests++;
            if (this._activeRequests === 1) {
                this.isSlow = false;
                this._startTrickle();
                // Jika dalam 5 detik belum selesai, munculkan pesan "Koneksi Lambat"
                this._slowTimer = setTimeout(() => {
                    untrack(() => { if (this.isLoading) this.isSlow = true; });
                }, 5000);
            }
        });
    }

    private _startTrickle() {
        this.progress = 10;
        this._interval = setInterval(() => {
            untrack(() => {
                if (this.progress < 90) {
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
                // 1. Loncat ke 100% (Kejujuran Visual)
                this.progress = 100;
                
                // 2. Bersihkan semua timer
                clearInterval(this._interval);
                clearTimeout(this._slowTimer);

                // 3. Beri jeda 500ms agar mata manusia sempat melihat angka 100%
                setTimeout(() => {
                    untrack(() => {
                        if (this._activeRequests === 0) {
                            this.progress = 0;
                            this.isSlow = false;
                        }
                    });
                }, 500);
            }
        });
    }

    cancelAll() {
        untrack(() => {
            this._activeRequests = 0;
            this.progress = 0;
            this.isSlow = false;
            clearInterval(this._interval);
            clearTimeout(this._slowTimer);
            // Opsional: window.location.reload() jika ingin membatalkan navigasi secara paksa
        });
    }
}

export const loadingStore = new LoadingStore();
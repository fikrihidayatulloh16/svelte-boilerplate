// apps/svelte5/src/lib/shared/stores/loading.svelte.ts
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
        }, 100);
    }

    done() {
        untrack(() => {
            // Jika ini adalah request terakhir yang selesai
            if (this._activeRequests === 1) {
                // 1. Loncat ke 100% SEBELUM mematikan status loading
                this.progress = 100;

                // 2. Bersihkan semua timer simulasi
                clearInterval(this._interval);
                clearTimeout(this._slowTimer);

                // 3. Beri jeda 500ms (atau lebih) agar user puas melihat 100%
                setTimeout(() => {
                    untrack(() => {
                        // 4. BARU SEKARANG kita matikan status loading
                        // Ini akan memicu {#if} di UI menghilang
                        this._activeRequests = 0; 
                        this.progress = 0;
                        this.isSlow = false;
                    });
                }, 100); // Saya naikkan sedikit ke 700ms agar lebih mantap
            } else {
                // Jika masih ada request lain yang berjalan, kurangi saja seperti biasa
                this._activeRequests = Math.max(0, this._activeRequests - 1);
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
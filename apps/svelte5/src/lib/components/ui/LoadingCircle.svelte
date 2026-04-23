<!-- apps/svelte5/src/lib/components/ui/LoadingCircle.svelte -->
<script lang="ts">
    import { loadingStore } from '$lib/shared/stores/loading.svelte';

    const size = 120;
    const stroke = 8;
    const center = size / 2;
    const radius = center - stroke;
    const circumference = 2 * Math.PI * radius;

    let dashoffset = $derived(circumference - (loadingStore.progress / 100) * circumference);
</script>

{#if loadingStore.isLoading}
    <div class="fixed inset-0 z-[999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div class="flex flex-col items-center gap-6">
            
            <div class="relative flex items-center justify-center">
                <svg width={size} height={size} class="rotate-[-90deg]">
                    <circle cx={center} cy={center} r={radius} stroke="currentColor" stroke-width={stroke} fill="transparent" class="text-gray-200" />
                    <circle cx={center} cy={center} r={radius} stroke="currentColor" stroke-width={stroke} fill="transparent"
                        stroke-dasharray={circumference}
                        style="stroke-dashoffset: {dashoffset}; transition: stroke-dashoffset 0.1s linear;"
                        stroke-linecap="round" class="text-blue-600" />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center font-mono">
                    <span class="text-2xl font-bold text-gray-800">{Math.round(loadingStore.progress)}%</span>
                </div>
            </div>

            <div class="flex flex-col items-center gap-4 text-center">
                {#if loadingStore.isSlow}
                    <p class="text-sm font-medium text-amber-600 animate-pulse">
                        Koneksi lambat, mohon tunggu sebentar...
                    </p>
                {/if}
                <button 
                    onclick={() => loadingStore.cancelAll()}
                    class="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-red-600"
                >
                    Batalkan
                </button>
            </div>
        </div>
    </div>
{/if}
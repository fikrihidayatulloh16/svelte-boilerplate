<script lang="ts">
    import { loadingStore } from '$lib/shared/stores/loading.svelte';
    import { fade, scale } from 'svelte/transition';

    const size = 120;
    const stroke = 8;
    const center = size / 2;
    const radius = center - stroke;
    const circumference = 2 * Math.PI * radius;

    // Hitung offset SVG berdasarkan progress
    let dashoffset = $derived(circumference - (loadingStore.progress / 100) * circumference);
</script>

{#if loadingStore.isLoading}
    <div 
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 z-[999] flex items-center justify-center bg-white/60 backdrop-blur-[2px]"
    >
        <div in:scale={{ start: 0.8, duration: 300 }} class="relative flex items-center justify-center">
            <svg width={size} height={size} class="rotate-[-90deg]">
                <circle
                    cx={center} cy={center} r={radius}
                    stroke="currentColor" stroke-width={stroke}
                    fill="transparent" class="text-gray-200"
                />
                <circle
                    cx={center} cy={center} r={radius}
                    stroke="currentColor" stroke-width={stroke}
                    fill="transparent"
                    stroke-dasharray={circumference}
                    style="stroke-dashoffset: {dashoffset}; transition: stroke-dashoffset 0.3s ease;"
                    stroke-linecap="round"
                    class="text-blue-600"
                />
            </svg>

            <div class="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span class="text-2xl font-bold text-gray-800">
                    {Math.round(loadingStore.progress)}%
                </span>
                <span class="text-[10px] uppercase tracking-widest text-gray-500">Memuat</span>
            </div>
        </div>
    </div>
{/if}
<script lang="ts">
    import { loadingStore } from '$lib/shared/stores/loading.svelte';
</script>

{#if loadingStore.isLoading}
    <div class="fixed left-0 top-0 z-[100] h-1 w-full overflow-hidden bg-transparent">
        <div class="absolute h-full bg-blue-600 transition-all duration-300 animate-loading-bar shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
    </div>
{/if}

<style>
    @keyframes loading-bar {
        0% { width: 0%; left: 0%; }
        50% { width: 70%; left: 15%; }
        100% { width: 0%; left: 100%; }
    }
    .animate-loading-bar {
        animation: loading-bar 1.5s infinite ease-in-out;
    }
</style>
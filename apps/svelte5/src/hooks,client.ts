import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
    // 1. Log error ke console (atau kirim ke Sentry jika di production)
    console.error('🚨 [CLIENT ERROR]:', error);

    // 2. Format pesan yang aman untuk ditampilkan ke user (jangan bocorkan data sensitif)
    const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
    
    return {
        message: isNetworkError 
            ? 'Gagal terhubung ke server. Periksa koneksi internet Anda.' 
            : message || 'Terjadi kesalahan sistem di browser.',
        // Anda bisa menambahkan ID tracking jika punya
        errorId: crypto.randomUUID() 
    };
};
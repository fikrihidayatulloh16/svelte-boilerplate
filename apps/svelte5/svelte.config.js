import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter(),

        csrf: {
            checkOrigin: true, // Pastikan ini true (defaultnya memang true)
        },
        
        // --- ENTERPRISE LEVEL CSP ---
        csp: {
            // mode 'nonce' sangat aman untuk Server-Side Rendering (SSR)
            mode: 'nonce', 
            directives: {
                // Hanya izinkan resource dari domain sendiri
                'default-src': ['self'],
                
                // INILAH RAhasianya: Tanpa 'unsafe-inline'. 
                // SvelteKit akan otomatis menyuntikkan nonce ke script bawaannya!
                'script-src': ['self'], 
                
                // Svelte component & Tailwind kadang butuh inline-style untuk animasi/transisi
                'style-src': ['self', 'unsafe-inline'], 
                
                // Izinkan gambar dari domain sendiri dan data base64
                'img-src': ['self', 'data:', 'https:'], 
                
                // Izinkan koneksi API (fetch/gRPC) hanya ke domain sendiri
                'connect-src': ['self'] ,

                'object-src': ['none'], // Melarang plugin seperti Flash/Java
                'base-uri': ['self'],   // Membatasi tag <base>
            }
        }
    }
};

export default config;

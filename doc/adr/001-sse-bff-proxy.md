# ADR 003: Penggunaan SvelteKit sebagai Backend-For-Frontend (BFF) SSE Proxy

## Status
Diterima (Accepted)

Tanggal: 14 Juni 2026

## Konteks (Context)
Aplikasi membutuhkan pembaruan data secara *real-time* (Cache Invalidation) di sisi klien tanpa membebani server dengan *polling* yang agresif atau *overhead* WebSockets. Solusi yang dipilih di *backend* (Rust) adalah **Server-Sent Events (SSE)** menggunakan Axum (`/v1/events/sse`).

Tantangan muncul pada lapisan keamanan:
1. Token otentikasi disimpan di *browser* menggunakan **Cookie HttpOnly** (untuk mencegah serangan XSS).
2. API `EventSource` bawaan *browser* tidak mendukung injeksi *custom header* (seperti `Authorization: Bearer`).
3. Mengirim token melalui *Query Parameter URL* (`?token=...`) ditolak karena melanggar standar keamanan (token akan terekam di *server logs* dan *browser history*).

## Keputusan (Decision)
Kita tidak akan membiarkan *browser* (Klien Svelte) terkoneksi langsung ke server Rust untuk arus SSE. Sebagai gantinya, kita menggunakan SvelteKit Node.js sebagai **BFF (Backend-For-Frontend) Proxy**.

Alur kerja:
1. *Browser* membuka koneksi `EventSource` pasif ke rute internal SvelteKit (`/api/events`).
2. SvelteKit (di server) membaca *Cookie HttpOnly*, mengekstrak `session_token`.
3. SvelteKit membuka koneksi HTTP murni ke Rust (`/v1/events/sse`), menyisipkan *header* `Authorization: Bearer <token>`.
4. SvelteKit mem-*pipe* (meneruskan) *stream* data dari Rust langsung ke *browser*.

## Konsekuensi (Consequences)
* **Positif:** Keamanan *cookie HttpOnly* tetap terjaga 100%. Tidak ada token yang bocor ke JS atau URL.
* **Positif:** Kode *frontend* menjadi sangat bodoh (*dumb* & *decoupled*); ia tidak perlu tahu urusan otentikasi jaringan.
* **Negatif/Mitigasi:** Node.js harus menahan koneksi berumur panjang (*long-lived connections*). Untuk mencegah *Memory Leak*, siklus hidup proksi harus dipantau ketat menggunakan `AbortController` agar koneksi ke Rust langsung diputus saat *browser* klien tertutup.
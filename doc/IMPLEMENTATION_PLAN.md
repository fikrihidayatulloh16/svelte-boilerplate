# Implementation Plan & Dev Log

## 🚨 [URGENT/INTERRUPT] 
*(Tempat untuk tugas darurat yang tiba-tiba muncul dan menahan tugas utama)*
- [ ] Perbaiki Domain Leakage di `database.rs` (Blocker untuk rotasi token).

---

## 🚧 [IN PROGRESS] 

3. Dampak pada File Server SvelteKit (Titik Paling Banyak Berubah)
Karena Anda mengadopsi mekanisme Refresh Token, Anda harus mengamankan token baru ini di sisi server SvelteKit menggunakan HttpOnly Cookie.

A. Endpoint API Login Lokal (src/routes/api/auth/login/+server.ts)
Saat memproses sukses login, Anda sekarang harus menyimpan dua jenis cookie, bukan hanya satu.

B. Endpoint API Logout Lokal (src/routes/api/auth/logout/+server.ts)
Ubah API internal SvelteKit agar mengekstrak refresh_token dari cookie sebelum menghancurkannya, lalu kirimkan token tersebut ke server Rust.

4. Tantangan Arsitektur Berikutnya: Di Mana Meletakkan RefreshToken?
Ini adalah fungsi baru yang Anda tambahkan ke proto: rpc RefreshToken(RefreshTokenRequest). Pertanyaannya, di mana SvelteKit harus mengeksekusi fungsi ini?

Tempat paling logis dan aman untuk meletakkannya adalah di src/hooks.server.ts.

Setiap kali pengguna membuka halaman baru atau melakukan refresh, hooks SvelteKit akan memeriksa apakah session_token sudah kedaluwarsa tetapi refresh_token masih aktif. Jika kondisi itu terpenuhi, hooks akan menembak gRPC authGrpcClient.refreshToken ke Rust secara diam-diam (silent refresh) untuk mendapatkan session_token baru sebelum halaman selesai dimuat.

---

## 🚧 [PENDING] 

Fix Zod version mismatch in +page.server.ts to remove double casting in page server to remove const formData = form.data as unknown as LoginFormData;

---

## 🚧 [UPCOMING] 

---

## 🧊 [BACKLOG / PAUSED]

====================================================================
# 📚 ARCHIVE & HISTORY (Jangan Dihapus!)
# Svelte5 Boilerplate

## Table of Content

---

## Structure

---

## 🚀 Developer Workflow Guide (SvelteKit + gRPC Clean Architecture)

Panduan ini adalah peta jalan (roadmap) Anda saat ingin menambahkan fitur baru (misalnya: product, transaction, employee) dari nol. Ikuti alur ini secara berurutan agar aplikasi tetap Decoupled dan bersih.

### 🧱 PHASE 1: The Contract & Source (Backend Layer)

#### 0. Create The Contract (.proto)

Jangan menulis kode frontend sebelum ada kontrak yang jelas dengan backend.

1. Buat file .proto di apps/svelte5/proto/ (Contoh: user.proto).

2. Generate tipe data TypeScript dengan menjalankan perintah di terminal(pastikan sedang di apps/svelte5):
```Bash
npx buf generate
```

#### 1. Create The Client & Mock (api/client.ts & api/mock.ts)

Buat "kurir" untuk mengambil data mentah. Karena kita decoupled, siapkan juga versi Mock agar bisa ngoding tanpa menunggu backend siap.

- Buat file grpcClient.ts untuk memanggil fungsi dari hasil generate Protobuf.

- Buat file mock.ts berisi data statis (JSON).

- Gunakan variabel USE_MOCK di client.ts sebagai switcher.

### 🧠 PHASE 2: The Domain & Translator (Service Layer)

#### 2. Create Domain Entity / Schema (schema.ts)

**Penting**: Zod bukan hanya untuk mutasi/form! Zod adalah Single Source of Truth untuk tipe data di UI (Domain Entity).

- Buat file [feature].schema.ts (Contoh: user.schema.ts).

- Buat Zod Object standar yang akan dipakai oleh komponen Svelte.

- Abaikan nama variabel snake_case dari gRPC, gunakan standar camelCase UI di sini.

#### 3. Create The Service (api/service.ts)

Ini adalah "Sang Penerjemah". Service adalah **SATU-SATUNYA** file yang tahu tentang gRPC/REST.

- Buat fungsi untuk memanggil Client (Langkah 1).

- Lakukan Mapping & Parsing: Ubah format data kotor dari backend menjadi format Schema / Entity (Langkah 2) yang bersih.

### ⚡ PHASE 3: The State & UI (Presentation Layer)

#### 4. Create Queries / Mutations (api/queries.ts / api/mutations.ts)

Pilih alat yang tepat untuk kebutuhan Anda:

- Untuk Get/Read Data (Tabel, Detail): Buat TanStack Query (createQuery) di queries.ts. Panggil fungsi dari Service.

- Untuk Create/Update/Delete (Action Button): Buat TanStack Mutation (createMutation) di mutations.ts. Pastikan memanggil queryClient.invalidateQueries di bagian onSuccess.

- Untuk Form / Auth (Login, Register): Jangan pakai TanStack! Gunakan Superforms + Zod di SvelteKit Action (+page.server.ts).

#### 5. Create UI Components (components/)

Buat komponen "Dumb/Pure" (Contoh: userTable.svelte).

- **Aturan Emas**: Komponen UI HANYA boleh mengimpor tipe dari schema.ts.

- Jangan pernah melakukan import dari folder proto atau memanggil gRPC langsung di sini. Lempar data menggunakan Props.

#### 6. Assembly in the Page (routes/)

Rakit semuanya di halaman yang akan dilihat user (Contoh: routes/(protected)/user/+page.svelte).

1. Panggil TanStack Query (userQuery).

2. Masukkan userQuery.data ke dalam Props di UI Component.

3. Jalankan development server:

```Bash
# Hapus cache Vite (jika ada error misterius) lalu jalankan server
rm -rf node_modules/.vite && npm run dev
```

---

## Current Contract



### auth contract

```Protobuf
syntax = "proto3";

package v1;

// Objek data UserLogin
message LoginRequest {
    string email = 1;
    string password = 2;
}

// Kontrak jawaban dari server (Response)
message LoginResponse {
  string session_token = 1;
  UserLoginResponse user = 2;
}

message UserLoginResponse {
  string id = 1;
  string email = 2;
  string full_name = 3;
  string role = 4;
}

message LogoutRequest {
  // Kosong tidak masalah! 
  // Di gRPC web/SvelteKit, session_token biasanya dikirim lewat 
  // Header (Metadata), bukan lewat body request agar lebih aman.
}

message LogoutResponse {
  bool success = 1;
  string message = 2;
}

// Definisi layanan (Service)
service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
  rpc Logout(LogoutRequest) returns (LogoutResponse);
}
```

### user contract

```Protobuf
syntax = "proto3";

package v1;

// Objek data User
message User {
    // WARNING: DO NOT CHANGE THIS STRUCT NO MATTER WHAT!!!
    string id = 1;
    string email = 2;
    string full_name = 3;
    string avatar_url = 4; // Commonly use
    bool is_active = 5;

    // use the correct data type
    string created_at = 6; 
    string updated_at = 7;

    // use this next beneath to spesific business, such as paid_status, OR loyalty_points
}

// Kontrak permintaan data (Request)
message GetUsersRequest {
  int32 page = 1;
  int32 limit = 2;
  string search = 3;
}

// Kontrak jawaban dari server (Response)
message GetUsersResponse {
  repeated User users = 1;
  int32 total_count = 2;
}

// Definisi layanan (Service)
service UserService {
  rpc GetUsers(GetUsersRequest) returns (GetUsersResponse);
}

```

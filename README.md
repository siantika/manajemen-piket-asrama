# Manajemen Piket Asrama

## Setup Lokal

1. Install dependency:

```bash
npm install
```

2. Siapkan environment variable:

- Untuk local cepat, file `.env` sudah disediakan.
- Untuk environment lain, copy dari `.env.example` lalu isi nilainya.

Variable minimum yang wajib ada:

- `JWT_SECRET`
- `COOKIE_SECRET`
- `MONGODB_URI`

Catatan:

- Untuk local MongoDB, gunakan contoh: `mongodb://127.0.0.1:27017/manajemen_piket`.
- Jika pakai MongoDB Atlas, isi `MONGODB_URI` sesuai connection string Atlas.

3. Jalankan development server:

```bash
npm run dev
```

4. Build dan test:

```bash
npm run build
npm test
```

<div align="center">
  <h1>MUSLIM API</h1>
  <p>
    <strong>REST API Al-Quran Indonesia (Kemenag), Dzikir Harian, Kumpulan Doa, Hadits Arba'in</strong>
  </p>
  <p>
    Dibangun dengan Cloudflare Workers + Hono + D1 Database
  </p>
</div>

## Tentang

REST API ini menyediakan data Al-Quran Indonesia, kumpulan doa, dzikir harian, dan hadits arba'in dari berbagai sumber terpercaya.

> Fork dari [Otang45/muslim-api](https://github.com/Otang45/muslim-api) - Refactored untuk Cloudflare Workers

### Fitur

- **Al-Quran**: Surah, Ayat, Juz, Halaman, Asbab Nuzul, Asmaul Husna, Tafsir Kemenag, Kata per kata
- **Doa**: Kumpulan doa dari Al-Quran, Hadits, dan doa harian
- **Dzikir**: Dzikir pagi, sore, dan setelah sholat
- **Hadits**: Hadits Arba'in An-Nawawi
- **Audio**: Murottal Shaykh Mishari Alafasy

### Sumber Data

- [Quran Kemenag](https://quran.kemenag.go.id/)
- [Kumpulan Doa Sehari-hari](https://jatim.kemenag.go.id/file/file/kumpulanbukuelektronik/pgdx1436850980.pdf)
- [Hadits Arba'in](https://haditsarbain.com/)

---

## Dokumentasi API

### Base URL

```
https://your-worker.your-subdomain.workers.dev
```

### Endpoints

#### Al-Quran

| Endpoint | Deskripsi | Parameter |
|----------|-----------|-----------|
| `GET /v1/quran/surah` | Daftar semua surah | `id` (opsional) |
| `GET /v1/quran/ayah` | Semua ayat | - |
| `GET /v1/quran/ayah/surah` | Ayat per surah | `id` (wajib) |
| `GET /v1/quran/ayah/specific` | Ayat spesifik | `surahId`, `ayahId` (wajib) |
| `GET /v1/quran/ayah/range` | Rentang ayat | `surahId`, `start`, `end` (wajib) |
| `GET /v1/quran/ayah/juz` | Ayat per juz | `id` (wajib) |
| `GET /v1/quran/ayah/page` | Ayat per halaman | `id` (wajib) |
| `GET /v1/quran/ayah/find` | Cari ayat | `query` (wajib, min 3 karakter) |
| `GET /v1/quran/juz` | Daftar juz | `id` (opsional) |
| `GET /v1/quran/tafsir` | Tafsir | `id` (opsional) |
| `GET /v1/quran/asbab` | Asbab Nuzul | `id` (opsional) |
| `GET /v1/quran/asma` | Asmaul Husna | - |
| `GET /v1/quran/theme` | Tema Al-Quran | `id` (opsional) |
| `GET /v1/quran/word` | Kata per kata | - |
| `GET /v1/quran/word/surah` | Kata per kata (surah) | `id` (wajib) |
| `GET /v1/quran/word/ayah` | Kata per kata (ayat) | `surahId`, `ayahId` (wajib) |

#### Doa

| Endpoint | Deskripsi | Parameter |
|----------|-----------|-----------|
| `GET /v1/doa` | Semua doa | `source` (opsional): quran, hadits, pilihan, harian, ibadah, haji, lainnya |
| `GET /v1/doa/find` | Cari doa | `query` (wajib) |

#### Dzikir

| Endpoint | Deskripsi | Parameter |
|----------|-----------|-----------|
| `GET /v1/dzikir` | Semua dzikir | `type` (opsional): pagi, sore, solat |

#### Hadits

| Endpoint | Deskripsi | Parameter |
|----------|-----------|-----------|
| `GET /v1/hadits` | Semua hadits | `nomor` (opsional) |
| `GET /v1/hadits/find` | Cari hadits | `query` (wajib) |

### Contoh Response

```json
{
  "status": 200,
  "data": {
    "number": "1",
    "name_short": "الفاتحة",
    "name_long": "سُورَةُ ٱلْفَاتِحَةِ",
    "name_id": "Al-Fatihah",
    "translation_id": "Pembukaan",
    "number_of_verses": "7",
    "revelation_id": "Makkiyyah"
  }
}
```

---

## Self-Hosting (Deploy Sendiri)

### Prasyarat

- [Bun](https://bun.sh/) atau [Node.js](https://nodejs.org/) v18+
- Akun [Cloudflare](https://cloudflare.com/) (gratis)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### Langkah Deploy

#### 1. Clone Repository

```bash
git clone https://github.com/username/muslim-api.git
cd muslim-api
```

#### 2. Install Dependencies

```bash
bun install
# atau
npm install
```

#### 3. Login ke Cloudflare

```bash
bunx wrangler login
```

#### 4. Buat Database D1

```bash
bunx wrangler d1 create muslim-api-db
```

Catat `database_id` dari output, lalu update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "muslim-api-db"
database_id = "your-database-id-here"  # Ganti dengan ID dari langkah sebelumnya
```

#### 5. Jalankan Migration (Schema)

```bash
# Local development
bunx wrangler d1 migrations apply muslim-api-db --local

# Production
bunx wrangler d1 migrations apply muslim-api-db --remote
```

#### 6. Import Data

```bash
# Local development
bunx wrangler d1 execute muslim-api-db --local --file=migrations/0002_seed_data.sql

# Production
bunx wrangler d1 execute muslim-api-db --remote --file=migrations/0002_seed_data.sql
```

> **Catatan**: File seed data cukup besar (~24MB). Jika timeout, coba split file atau import per tabel.

#### 7. Test Local

```bash
bun run dev
# API berjalan di http://localhost:8787
```

#### 8. Deploy ke Production

```bash
bun run deploy
```

Setelah deploy, API akan tersedia di:
```
https://muslim-api.<your-subdomain>.workers.dev
```

---

## Development

### Scripts

| Command | Deskripsi |
|---------|-----------|
| `bun run dev` | Jalankan development server |
| `bun run deploy` | Deploy ke Cloudflare Workers |
| `bun run db:create` | Buat database D1 baru |
| `bun run db:migrate:local` | Jalankan migration (local) |
| `bun run db:migrate:prod` | Jalankan migration (production) |
| `bun run db:seed:local` | Import data (local) |
| `bun run db:seed:prod` | Import data (production) |

### Struktur Proyek

```
muslim-api/
├── src/
│   ├── index.ts          # Entry point & routing
│   └── routes/           # API route handlers
│       ├── surah.ts
│       ├── ayah.ts
│       ├── juz.ts
│       ├── tafsir.ts
│       ├── asbab.ts
│       ├── asma.ts
│       ├── theme.ts
│       ├── word.ts
│       ├── doa.ts
│       ├── dzikir.ts
│       └── hadits.ts
├── migrations/
│   ├── 0001_init.sql     # Database schema
│   └── 0002_seed_data.sql # Data seed
├── database/
│   └── alquran.db        # SQLite source (backup)
├── wrangler.toml         # Cloudflare config
├── tsconfig.json
└── package.json
```

---

## Tech Stack

- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/)
- **Framework**: [Hono](https://hono.dev/)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **Language**: TypeScript

---

## Credits

- Original project by [Otang45](https://github.com/Otang45/muslim-api)
- Data Al-Quran dari [Kemenag RI](https://quran.kemenag.go.id/)

## License

MIT License - Silakan fork dan gunakan untuk keperluan apapun.

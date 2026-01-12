import { Hono } from "hono";
import { cors } from "hono/cors";

// Routes
import { surahRoutes } from "./routes/surah";
import { ayahRoutes } from "./routes/ayah";
import { juzRoutes } from "./routes/juz";
import { asbabRoutes } from "./routes/asbab";
import { asmaRoutes } from "./routes/asma";
import { tafsirRoutes } from "./routes/tafsir";
import { themeRoutes } from "./routes/theme";
import { wordRoutes } from "./routes/word";
import { doaRoutes } from "./routes/doa";
import { dzikirRoutes } from "./routes/dzikir";
import { haditsRoutes } from "./routes/hadits";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("*", cors());

// Root endpoint - API documentation
app.get("/", (c) => {
  const baseUrl = new URL(c.req.url).origin;

  return c.json({
    name: "Muslim API",
    version: "2.0.0",
    description: "REST API untuk Al-Quran (Kemenag), Doa, Dzikir, dan Hadits",
    baseUrl: baseUrl,
    documentation: `${baseUrl}/v1`,
    endpoints: {
      quran: `${baseUrl}/v1/quran`,
      doa: `${baseUrl}/v1/doa`,
      dzikir: `${baseUrl}/v1/dzikir`,
      hadits: `${baseUrl}/v1/hadits`,
    },
    maintainer: "Otang45",
    github: "https://github.com/Otang45/muslim-api",
  });
});

// V1 API documentation
app.get("/v1", (c) => {
  const baseUrl = new URL(c.req.url).origin;

  return c.json({
    version: "1.0",
    description: "Muslim API v1 - Dokumentasi lengkap endpoint",
    categories: [
      {
        name: "Al-Quran",
        description: "Data Al-Quran lengkap termasuk surah, ayat, tafsir, dan lainnya",
        baseEndpoint: `${baseUrl}/v1/quran`,
        endpoints: [
          {
            path: "/surah",
            method: "GET",
            description: "Daftar semua surah atau detail surah tertentu",
            parameters: [
              { name: "id", type: "number", required: false, description: "Nomor surah (1-114)" }
            ],
            examples: [
              { description: "Semua surah", url: `${baseUrl}/v1/quran/surah` },
              { description: "Surah Al-Fatihah", url: `${baseUrl}/v1/quran/surah?id=1` }
            ]
          },
          {
            path: "/ayah",
            method: "GET",
            description: "Semua ayat Al-Quran",
            examples: [
              { description: "Semua ayat", url: `${baseUrl}/v1/quran/ayah` }
            ]
          },
          {
            path: "/ayah/surah",
            method: "GET",
            description: "Ayat berdasarkan surah",
            parameters: [
              { name: "id", type: "number", required: true, description: "Nomor surah" }
            ],
            examples: [
              { description: "Ayat surah Al-Fatihah", url: `${baseUrl}/v1/quran/ayah/surah?id=1` }
            ]
          },
          {
            path: "/ayah/specific",
            method: "GET",
            description: "Ayat spesifik berdasarkan surah dan nomor ayat",
            parameters: [
              { name: "surahId", type: "number", required: true, description: "Nomor surah" },
              { name: "ayahId", type: "number", required: true, description: "Nomor ayat" }
            ],
            examples: [
              { description: "Al-Fatihah ayat 1", url: `${baseUrl}/v1/quran/ayah/specific?surahId=1&ayahId=1` }
            ]
          },
          {
            path: "/ayah/range",
            method: "GET",
            description: "Ayat dalam rentang tertentu",
            parameters: [
              { name: "surahId", type: "number", required: true, description: "Nomor surah" },
              { name: "start", type: "number", required: true, description: "Ayat mulai" },
              { name: "end", type: "number", required: true, description: "Ayat akhir" }
            ],
            examples: [
              { description: "Al-Fatihah ayat 1-3", url: `${baseUrl}/v1/quran/ayah/range?surahId=1&start=1&end=3` }
            ]
          },
          {
            path: "/ayah/juz",
            method: "GET",
            description: "Ayat berdasarkan juz",
            parameters: [
              { name: "id", type: "number", required: true, description: "Nomor juz (1-30)" }
            ],
            examples: [
              { description: "Ayat juz 30", url: `${baseUrl}/v1/quran/ayah/juz?id=30` }
            ]
          },
          {
            path: "/ayah/page",
            method: "GET",
            description: "Ayat berdasarkan halaman mushaf",
            parameters: [
              { name: "id", type: "number", required: true, description: "Nomor halaman (1-604)" }
            ],
            examples: [
              { description: "Ayat halaman 1", url: `${baseUrl}/v1/quran/ayah/page?id=1` }
            ]
          },
          {
            path: "/ayah/find",
            method: "GET",
            description: "Cari ayat berdasarkan teks",
            parameters: [
              { name: "query", type: "string", required: true, description: "Kata kunci pencarian (min 3 karakter)" }
            ],
            examples: [
              { description: "Cari kata 'rahman'", url: `${baseUrl}/v1/quran/ayah/find?query=rahman` }
            ]
          },
          {
            path: "/juz",
            method: "GET",
            description: "Daftar juz atau detail juz tertentu",
            parameters: [
              { name: "id", type: "number", required: false, description: "Nomor juz (1-30)" }
            ],
            examples: [
              { description: "Semua juz", url: `${baseUrl}/v1/quran/juz` },
              { description: "Juz 30", url: `${baseUrl}/v1/quran/juz?id=30` }
            ]
          },
          {
            path: "/tafsir",
            method: "GET",
            description: "Tafsir ayat Al-Quran",
            parameters: [
              { name: "id", type: "number", required: false, description: "ID tafsir" }
            ],
            examples: [
              { description: "Semua tafsir", url: `${baseUrl}/v1/quran/tafsir` },
              { description: "Tafsir spesifik", url: `${baseUrl}/v1/quran/tafsir?id=1` }
            ]
          },
          {
            path: "/asbab",
            method: "GET",
            description: "Asbabun Nuzul (sebab turunnya ayat)",
            parameters: [
              { name: "id", type: "number", required: false, description: "ID asbab nuzul" }
            ],
            examples: [
              { description: "Semua asbab nuzul", url: `${baseUrl}/v1/quran/asbab` }
            ]
          },
          {
            path: "/asma",
            method: "GET",
            description: "Asmaul Husna (99 nama Allah)",
            examples: [
              { description: "Semua Asmaul Husna", url: `${baseUrl}/v1/quran/asma` }
            ]
          },
          {
            path: "/theme",
            method: "GET",
            description: "Tema-tema dalam Al-Quran",
            parameters: [
              { name: "id", type: "number", required: false, description: "ID tema" }
            ],
            examples: [
              { description: "Semua tema", url: `${baseUrl}/v1/quran/theme` }
            ]
          },
          {
            path: "/word",
            method: "GET",
            description: "Terjemahan kata per kata",
            examples: [
              { description: "Semua kata", url: `${baseUrl}/v1/quran/word` }
            ]
          },
          {
            path: "/word/surah",
            method: "GET",
            description: "Kata per kata berdasarkan surah",
            parameters: [
              { name: "id", type: "number", required: true, description: "Nomor surah" }
            ],
            examples: [
              { description: "Kata per kata Al-Fatihah", url: `${baseUrl}/v1/quran/word/surah?id=1` }
            ]
          },
          {
            path: "/word/ayah",
            method: "GET",
            description: "Kata per kata berdasarkan ayat",
            parameters: [
              { name: "surahId", type: "number", required: true, description: "Nomor surah" },
              { name: "ayahId", type: "number", required: true, description: "Nomor ayat" }
            ],
            examples: [
              { description: "Kata per kata Al-Fatihah:1", url: `${baseUrl}/v1/quran/word/ayah?surahId=1&ayahId=1` }
            ]
          }
        ]
      },
      {
        name: "Doa",
        description: "Kumpulan doa dari berbagai sumber",
        baseEndpoint: `${baseUrl}/v1/doa`,
        endpoints: [
          {
            path: "/",
            method: "GET",
            description: "Daftar semua doa atau filter berdasarkan sumber",
            parameters: [
              { name: "source", type: "string", required: false, description: "Sumber doa: quran, hadits, pilihan, harian, ibadah, haji, lainnya" }
            ],
            examples: [
              { description: "Semua doa", url: `${baseUrl}/v1/doa` },
              { description: "Doa harian", url: `${baseUrl}/v1/doa?source=harian` }
            ]
          },
          {
            path: "/find",
            method: "GET",
            description: "Cari doa berdasarkan judul",
            parameters: [
              { name: "query", type: "string", required: true, description: "Kata kunci pencarian" }
            ],
            examples: [
              { description: "Cari doa tidur", url: `${baseUrl}/v1/doa/find?query=tidur` }
            ]
          }
        ]
      },
      {
        name: "Dzikir",
        description: "Dzikir pagi, sore, dan setelah sholat",
        baseEndpoint: `${baseUrl}/v1/dzikir`,
        endpoints: [
          {
            path: "/",
            method: "GET",
            description: "Daftar dzikir atau filter berdasarkan waktu",
            parameters: [
              { name: "type", type: "string", required: false, description: "Jenis dzikir: pagi, sore, solat" }
            ],
            examples: [
              { description: "Semua dzikir", url: `${baseUrl}/v1/dzikir` },
              { description: "Dzikir pagi", url: `${baseUrl}/v1/dzikir?type=pagi` },
              { description: "Dzikir sore", url: `${baseUrl}/v1/dzikir?type=sore` },
              { description: "Dzikir setelah sholat", url: `${baseUrl}/v1/dzikir?type=solat` }
            ]
          }
        ]
      },
      {
        name: "Hadits",
        description: "Hadits Arba'in An-Nawawi",
        baseEndpoint: `${baseUrl}/v1/hadits`,
        endpoints: [
          {
            path: "/",
            method: "GET",
            description: "Daftar semua hadits atau hadits tertentu",
            parameters: [
              { name: "nomor", type: "number", required: false, description: "Nomor hadits" }
            ],
            examples: [
              { description: "Semua hadits", url: `${baseUrl}/v1/hadits` },
              { description: "Hadits nomor 1", url: `${baseUrl}/v1/hadits?nomor=1` }
            ]
          },
          {
            path: "/find",
            method: "GET",
            description: "Cari hadits berdasarkan judul",
            parameters: [
              { name: "query", type: "string", required: true, description: "Kata kunci pencarian" }
            ],
            examples: [
              { description: "Cari hadits tentang iman", url: `${baseUrl}/v1/hadits/find?query=iman` }
            ]
          }
        ]
      }
    ],
    responseFormat: {
      success: {
        status: 200,
        data: "object | array"
      },
      notFound: {
        status: 404,
        data: "{} | []"
      },
      error: {
        status: 500,
        message: "string"
      }
    },
    maintainer: "Otang45"
  });
});

// Mount routes
app.route("/v1/quran/surah", surahRoutes);
app.route("/v1/quran/ayah", ayahRoutes);
app.route("/v1/quran/juz", juzRoutes);
app.route("/v1/quran/asbab", asbabRoutes);
app.route("/v1/quran/asma", asmaRoutes);
app.route("/v1/quran/tafsir", tafsirRoutes);
app.route("/v1/quran/theme", themeRoutes);
app.route("/v1/quran/word", wordRoutes);
app.route("/v1/doa", doaRoutes);
app.route("/v1/dzikir", dzikirRoutes);
app.route("/v1/hadits", haditsRoutes);

// 404 handler
app.notFound((c) => {
  return c.json({ status: 404, message: "Not Found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(err);
  return c.json({ status: 500, message: err.message }, 500);
});

export default app;

-- Migration: Initial schema for Muslim API
-- Database: Cloudflare D1

-- Surah table
CREATE TABLE IF NOT EXISTS surah (
  number TEXT NOT NULL,
  sequence TEXT NOT NULL,
  number_of_verses TEXT NOT NULL,
  name_short TEXT NOT NULL,
  name_long TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_id TEXT NOT NULL,
  translation_en TEXT NOT NULL,
  translation_id TEXT NOT NULL,
  revelation TEXT NOT NULL,
  revelation_en TEXT NOT NULL,
  revelation_id TEXT NOT NULL,
  tafsir TEXT NOT NULL,
  audio_url TEXT NOT NULL
);

-- Juz table
CREATE TABLE IF NOT EXISTS juz (
  number TEXT,
  name TEXT,
  name_start_arab TEXT,
  name_end_arab TEXT,
  name_start_id TEXT,
  name_end_id TEXT,
  verse_start TEXT,
  verse_end TEXT,
  surah_id_start TEXT,
  surah_id_end TEXT,
  ayat_arab TEXT,
  ayat_latin TEXT,
  ayat_indo TEXT
);

-- Asmaul Husna table
CREATE TABLE IF NOT EXISTS asmaul_husna (
  id INTEGER,
  arab TEXT,
  latin TEXT,
  indo TEXT
);

-- Ayah table
CREATE TABLE IF NOT EXISTS ayah (
  id TEXT,
  surah TEXT,
  ayah TEXT,
  arab TEXT,
  latin TEXT,
  page TEXT,
  juz TEXT,
  hizb TEXT,
  asbab TEXT,
  audio TEXT DEFAULT '',
  theme TEXT DEFAULT '',
  text TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);

-- Tafsir table
CREATE TABLE IF NOT EXISTS tafsir (
  id TEXT,
  ayah TEXT,
  wajiz TEXT,
  tahlili TEXT
);

-- Theme table
CREATE TABLE IF NOT EXISTS theme (
  id TEXT,
  name TEXT
);

-- Word table
CREATE TABLE IF NOT EXISTS word (
  id TEXT,
  surah TEXT,
  ayah TEXT,
  word TEXT,
  arab TEXT,
  indo TEXT
);

-- Asbab Nuzul table
CREATE TABLE IF NOT EXISTS asbab_nuzul (
  id TEXT,
  ayah TEXT,
  text TEXT
);

-- Dzikir table
CREATE TABLE IF NOT EXISTS dzikir (
  type TEXT,
  arab TEXT,
  indo TEXT,
  ulang TEXT
);

-- Doa table
CREATE TABLE IF NOT EXISTS doa (
  judul TEXT,
  arab TEXT,
  indo TEXT,
  source TEXT DEFAULT ''
);

-- Hadits table
CREATE TABLE IF NOT EXISTS hadits (
  no TEXT,
  judul TEXT,
  arab TEXT,
  indo TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ayah_surah ON ayah(surah);
CREATE INDEX IF NOT EXISTS idx_ayah_juz ON ayah(juz);
CREATE INDEX IF NOT EXISTS idx_ayah_page ON ayah(page);
CREATE INDEX IF NOT EXISTS idx_word_surah ON word(surah);
CREATE INDEX IF NOT EXISTS idx_word_ayah ON word(surah, ayah);
CREATE INDEX IF NOT EXISTS idx_doa_source ON doa(source);
CREATE INDEX IF NOT EXISTS idx_dzikir_type ON dzikir(type);

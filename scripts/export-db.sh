#!/bin/bash

# Script untuk export data dari SQLite ke SQL file untuk D1

DB_FILE="database/alquran.db"
OUTPUT_FILE="migrations/0002_seed_data.sql"

echo "Exporting data from $DB_FILE..."

# Tables to export
TABLES=("surah" "juz" "asmaul_husna" "ayah" "tafsir" "theme" "word" "asbab_nuzul" "dzikir" "doa" "hadits")

# Clear output file
> "$OUTPUT_FILE"

echo "-- Seed data for Muslim API" >> "$OUTPUT_FILE"
echo "-- Generated from alquran.db" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

for table in "${TABLES[@]}"; do
  echo "Exporting $table..."
  echo "-- Data for $table" >> "$OUTPUT_FILE"
  sqlite3 "$DB_FILE" ".mode insert $table" "SELECT * FROM $table;" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
done

echo "Export complete! Output saved to $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Create D1 database: wrangler d1 create muslim-api-db"
echo "2. Update database_id in wrangler.toml"
echo "3. Run migrations: wrangler d1 migrations apply muslim-api-db --local"
echo "4. Import seed data: wrangler d1 execute muslim-api-db --local --file=migrations/0002_seed_data.sql"

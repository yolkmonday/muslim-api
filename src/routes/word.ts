import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const wordRoutes = new Hono<{ Bindings: Bindings }>();

// Get all words
wordRoutes.get("/", async (c) => {
  const db = c.env.DB;

  try {
    const { results } = await db
      .prepare(
        "SELECT * FROM word ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC"
      )
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get words by surah
wordRoutes.get("/surah", async (c) => {
  const id = c.req.query("id");
  const db = c.env.DB;

  if (!id) {
    return c.json({ status: 400, message: "Parameter diperlukan (id)." }, 400);
  }

  try {
    const { results } = await db
      .prepare(
        "SELECT * FROM word WHERE surah = ? ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC"
      )
      .bind(id)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get words by ayah
wordRoutes.get("/ayah", async (c) => {
  const surahId = c.req.query("surahId");
  const ayahId = c.req.query("ayahId");
  const db = c.env.DB;

  if (!surahId || !ayahId) {
    return c.json({ status: 400, message: "Parameter diperlukan (surahId, ayahId)." }, 400);
  }

  try {
    const { results } = await db
      .prepare(
        "SELECT * FROM word WHERE surah = ? AND ayah = ? ORDER BY CAST(surah as INTEGER), CAST(ayah as INTEGER), CAST(word as INTEGER) ASC"
      )
      .bind(surahId, ayahId)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

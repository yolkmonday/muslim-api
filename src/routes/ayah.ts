import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const ayahRoutes = new Hono<{ Bindings: Bindings }>();

// Get all ayah
ayahRoutes.get("/", async (c) => {
  const db = c.env.DB;

  try {
    const { results } = await db.prepare("SELECT * FROM ayah ORDER BY CAST(id as INTEGER) ASC").all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get ayah by range
ayahRoutes.get("/range", async (c) => {
  const surahId = c.req.query("surahId");
  const start = c.req.query("start");
  const end = c.req.query("end");
  const db = c.env.DB;

  if (!surahId || !start || !end) {
    return c.json({ status: 400, message: "Parameter diperlukan (surahId, start, end)." }, 400);
  }

  try {
    const { results } = await db
      .prepare(
        "SELECT * FROM ayah WHERE surah = ? AND ayah BETWEEN CAST(? as INTEGER) AND CAST(? as INTEGER) ORDER BY CAST(id as INTEGER) ASC"
      )
      .bind(surahId, start, end)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get ayah by surah
ayahRoutes.get("/surah", async (c) => {
  const id = c.req.query("id");
  const db = c.env.DB;

  if (!id) {
    return c.json({ status: 400, message: "Parameter diperlukan (id)." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM ayah WHERE surah = ? ORDER BY CAST(id as INTEGER) ASC")
      .bind(id)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get ayah by juz
ayahRoutes.get("/juz", async (c) => {
  const id = c.req.query("id");
  const db = c.env.DB;

  if (!id) {
    return c.json({ status: 400, message: "Parameter diperlukan (id)." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM ayah WHERE juz = ? ORDER BY CAST(id as INTEGER) ASC")
      .bind(id)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get ayah by page
ayahRoutes.get("/page", async (c) => {
  const id = c.req.query("id");
  const db = c.env.DB;

  if (!id) {
    return c.json({ status: 400, message: "Parameter diperlukan (id)." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM ayah WHERE page = ? ORDER BY CAST(id as INTEGER) ASC")
      .bind(id)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Get specific ayah
ayahRoutes.get("/specific", async (c) => {
  const surahId = c.req.query("surahId");
  const ayahId = c.req.query("ayahId");
  const db = c.env.DB;

  if (!surahId || !ayahId) {
    return c.json({ status: 400, message: "Parameter diperlukan (surahId, ayahId)." }, 400);
  }

  try {
    const data = await db
      .prepare("SELECT * FROM ayah WHERE surah = ? AND ayah = ?")
      .bind(surahId, ayahId)
      .first();
    if (!data) {
      return c.json({ status: 404, data: {} }, 404);
    }
    return c.json({ status: 200, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Search ayah
ayahRoutes.get("/find", async (c) => {
  const query = c.req.query("query");
  const db = c.env.DB;

  if (!query || query.length < 3) {
    return c.json({ status: 400, message: "Parameter diperlukan (query). Harus lebih dari 3 karakter." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM ayah WHERE text LIKE ? ORDER BY CAST(id as INTEGER) ASC")
      .bind(`%${query}%`)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

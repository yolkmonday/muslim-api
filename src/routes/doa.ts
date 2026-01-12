import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const doaRoutes = new Hono<{ Bindings: Bindings }>();

// Get all doa or by source
doaRoutes.get("/", async (c) => {
  const source = c.req.query("source");
  const db = c.env.DB;

  try {
    if (source) {
      const { results } = await db
        .prepare("SELECT * FROM doa WHERE source = ? ORDER BY judul ASC")
        .bind(source)
        .all();
      return c.json({ status: 200, data: results });
    } else {
      const { results } = await db.prepare("SELECT * FROM doa ORDER BY judul ASC").all();
      return c.json({ status: 200, data: results });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Search doa
doaRoutes.get("/find", async (c) => {
  const query = c.req.query("query");
  const db = c.env.DB;

  if (!query) {
    return c.json({ status: 400, message: "Parameter diperlukan (query)." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM doa WHERE judul LIKE ? ORDER BY judul ASC")
      .bind(`%${query}%`)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

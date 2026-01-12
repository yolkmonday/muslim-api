import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const haditsRoutes = new Hono<{ Bindings: Bindings }>();

// Get all hadits or by nomor
haditsRoutes.get("/", async (c) => {
  const nomor = c.req.query("nomor");
  const db = c.env.DB;

  try {
    if (nomor) {
      const data = await db.prepare("SELECT * FROM hadits WHERE no = ?").bind(nomor).first();
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      }
      return c.json({ status: 200, data });
    } else {
      const { results } = await db.prepare("SELECT * FROM hadits ORDER BY CAST(no as INTEGER) ASC").all();
      return c.json({ status: 200, data: results });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

// Search hadits
haditsRoutes.get("/find", async (c) => {
  const query = c.req.query("query");
  const db = c.env.DB;

  if (!query) {
    return c.json({ status: 400, message: "Parameter diperlukan (query)." }, 400);
  }

  try {
    const { results } = await db
      .prepare("SELECT * FROM hadits WHERE judul LIKE ? ORDER BY CAST(no as INTEGER) ASC")
      .bind(`%${query}%`)
      .all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

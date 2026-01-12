import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const juzRoutes = new Hono<{ Bindings: Bindings }>();

juzRoutes.get("/", async (c) => {
  const id = c.req.query("id");
  const db = c.env.DB;

  try {
    if (id) {
      const data = await db.prepare("SELECT * FROM juz WHERE number = ?").bind(id).first();
      if (!data) {
        return c.json({ status: 404, data: {} }, 404);
      }
      return c.json({ status: 200, data });
    } else {
      const { results } = await db.prepare("SELECT * FROM juz ORDER BY CAST(number as INTEGER) ASC").all();
      return c.json({ status: 200, data: results });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

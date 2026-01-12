import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const dzikirRoutes = new Hono<{ Bindings: Bindings }>();

dzikirRoutes.get("/", async (c) => {
  const type = c.req.query("type");
  const db = c.env.DB;

  try {
    if (type) {
      const { results } = await db.prepare("SELECT * FROM dzikir WHERE type = ?").bind(type).all();
      return c.json({ status: 200, data: results });
    } else {
      const { results } = await db.prepare("SELECT * FROM dzikir").all();
      return c.json({ status: 200, data: results });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

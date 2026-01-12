import { Hono } from "hono";

type Bindings = {
  DB: D1Database;
};

export const asmaRoutes = new Hono<{ Bindings: Bindings }>();

asmaRoutes.get("/", async (c) => {
  const db = c.env.DB;

  try {
    const { results } = await db.prepare("SELECT * FROM asmaul_husna ORDER BY CAST(id as INTEGER) ASC").all();
    return c.json({ status: 200, data: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ status: 500, message }, 500);
  }
});

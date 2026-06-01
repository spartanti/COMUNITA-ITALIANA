import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { sponsorsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

// Public: only active sponsors
router.get("/sponsors", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(sponsorsTable)
    .where(eq(sponsorsTable.active, true))
    .orderBy(asc(sponsorsTable.sortOrder));
  res.json(rows);
});

// Admin: all sponsors
router.get("/sponsors/all", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(sponsorsTable).orderBy(asc(sponsorsTable.sortOrder));
  res.json(rows);
});

router.post("/sponsors", requireAdmin, async (req, res): Promise<void> => {
  const { name, logoUrl, websiteUrl, active, sortOrder } = req.body as {
    name?: string;
    logoUrl?: string;
    websiteUrl?: string;
    active?: boolean;
    sortOrder?: number;
  };

  if (!name || !logoUrl) {
    res.status(400).json({ error: "name e logoUrl são obrigatórios" });
    return;
  }

  const [sponsor] = await db
    .insert(sponsorsTable)
    .values({
      name,
      logoUrl,
      websiteUrl: websiteUrl ?? "",
      active: active ?? true,
      sortOrder: sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(sponsor);
});

router.patch("/sponsors/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }

  const { name, logoUrl, websiteUrl, active, sortOrder } = req.body as Partial<typeof sponsorsTable.$inferInsert>;
  const updates: Partial<typeof sponsorsTable.$inferInsert> = {};
  if (name !== undefined) updates.name = name;
  if (logoUrl !== undefined) updates.logoUrl = logoUrl;
  if (websiteUrl !== undefined) updates.websiteUrl = websiteUrl;
  if (active !== undefined) updates.active = active;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;

  const [sponsor] = await db
    .update(sponsorsTable)
    .set(updates)
    .where(eq(sponsorsTable.id, id))
    .returning();

  if (!sponsor) { res.status(404).json({ error: "Patrocinador não encontrado" }); return; }
  res.json(sponsor);
});

router.delete("/sponsors/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }

  const [sponsor] = await db.delete(sponsorsTable).where(eq(sponsorsTable.id, id)).returning();
  if (!sponsor) { res.status(404).json({ error: "Patrocinador não encontrado" }); return; }
  res.sendStatus(204);
});

export default router;

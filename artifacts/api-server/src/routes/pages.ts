import { Router, type IRouter } from "express";
import { db, pagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

// Public: list active pages (for menu rendering)
router.get("/pages", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.active, true))
    .orderBy(asc(pagesTable.menuOrder));
  res.json(rows);
});

// Admin: list all pages
router.get("/pages/all", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db.select().from(pagesTable).orderBy(asc(pagesTable.menuOrder));
  res.json(rows);
});

// Public: get page by slug
router.get("/pages/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [row] = await db.select().from(pagesTable).where(eq(pagesTable.slug, slug));
  if (!row || !row.active) { res.status(404).json({ error: "Página não encontrada" }); return; }
  res.json(row);
});

router.post("/pages", requireAdmin, async (req, res): Promise<void> => {
  const { slug, title, content, menuLabel, menuSection, menuOrder, active } = req.body as {
    slug?: string; title?: string; content?: string;
    menuLabel?: string; menuSection?: string; menuOrder?: number; active?: boolean;
  };
  if (!slug || !title) { res.status(400).json({ error: "slug e title são obrigatórios" }); return; }

  const [page] = await db.insert(pagesTable).values({
    slug, title,
    content: content ?? "",
    menuLabel: menuLabel ?? title,
    menuSection: menuSection ?? "none",
    menuOrder: menuOrder ?? 0,
    active: active ?? true,
  }).returning();

  res.status(201).json(page);
});

router.patch("/pages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }

  const { slug, title, content, menuLabel, menuSection, menuOrder, active } = req.body as Partial<typeof pagesTable.$inferInsert>;
  const updates: Partial<typeof pagesTable.$inferInsert> = {};
  if (slug !== undefined) updates.slug = slug;
  if (title !== undefined) updates.title = title;
  if (content !== undefined) updates.content = content;
  if (menuLabel !== undefined) updates.menuLabel = menuLabel;
  if (menuSection !== undefined) updates.menuSection = menuSection;
  if (menuOrder !== undefined) updates.menuOrder = menuOrder;
  if (active !== undefined) updates.active = active;
  updates.updatedAt = new Date();

  const [page] = await db.update(pagesTable).set(updates).where(eq(pagesTable.id, id)).returning();
  if (!page) { res.status(404).json({ error: "Página não encontrada" }); return; }
  res.json(page);
});

router.delete("/pages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  const [page] = await db.delete(pagesTable).where(eq(pagesTable.id, id)).returning();
  if (!page) { res.status(404).json({ error: "Página não encontrada" }); return; }
  res.sendStatus(204);
});

export default router;

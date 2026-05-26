import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bannersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

router.get("/banners", async (_req, res): Promise<void> => {
  const rows = await db.select().from(bannersTable).orderBy(asc(bannersTable.sortOrder));
  res.json(rows);
});

router.get("/banners/active", async (_req, res): Promise<void> => {
  const [banner] = await db
    .select()
    .from(bannersTable)
    .where(eq(bannersTable.active, true))
    .orderBy(asc(bannersTable.sortOrder))
    .limit(1);

  res.json(banner ?? null);
});

router.post("/banners", requireAdmin, async (req, res): Promise<void> => {
  const { title, subtitle, imageUrl, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl, active, sortOrder } = req.body as {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    ctaPrimaryText?: string;
    ctaPrimaryUrl?: string;
    ctaSecondaryText?: string;
    ctaSecondaryUrl?: string;
    active?: boolean;
    sortOrder?: number;
  };

  if (!title || !imageUrl) {
    res.status(400).json({ error: "title e imageUrl são obrigatórios" });
    return;
  }

  const [banner] = await db
    .insert(bannersTable)
    .values({
      title,
      subtitle: subtitle ?? "",
      imageUrl,
      ctaPrimaryText: ctaPrimaryText ?? "Conheça a Associação",
      ctaPrimaryUrl: ctaPrimaryUrl ?? "/quem-somos",
      ctaSecondaryText: ctaSecondaryText ?? "Associe-se",
      ctaSecondaryUrl: ctaSecondaryUrl ?? "/contato",
      active: active ?? false,
      sortOrder: sortOrder ?? 0,
    })
    .returning();

  res.status(201).json(banner);
});

router.patch("/banners/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { title, subtitle, imageUrl, ctaPrimaryText, ctaPrimaryUrl, ctaSecondaryText, ctaSecondaryUrl, active, sortOrder } = req.body as Partial<typeof bannersTable.$inferInsert>;

  const updates: Partial<typeof bannersTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (subtitle !== undefined) updates.subtitle = subtitle;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (ctaPrimaryText !== undefined) updates.ctaPrimaryText = ctaPrimaryText;
  if (ctaPrimaryUrl !== undefined) updates.ctaPrimaryUrl = ctaPrimaryUrl;
  if (ctaSecondaryText !== undefined) updates.ctaSecondaryText = ctaSecondaryText;
  if (ctaSecondaryUrl !== undefined) updates.ctaSecondaryUrl = ctaSecondaryUrl;
  if (active !== undefined) updates.active = active;
  if (sortOrder !== undefined) updates.sortOrder = sortOrder;

  const [banner] = await db
    .update(bannersTable)
    .set(updates)
    .where(eq(bannersTable.id, id))
    .returning();

  if (!banner) {
    res.status(404).json({ error: "Banner não encontrado" });
    return;
  }

  res.json(banner);
});

router.delete("/banners/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const [banner] = await db
    .delete(bannersTable)
    .where(eq(bannersTable.id, id))
    .returning();

  if (!banner) {
    res.status(404).json({ error: "Banner não encontrado" });
    return;
  }

  res.sendStatus(204);
});

export default router;

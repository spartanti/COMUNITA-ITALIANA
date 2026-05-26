import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

router.get("/posts", async (req, res): Promise<void> => {
  const { category, published } = req.query as { category?: string; published?: string };

  let query = db.select().from(postsTable).orderBy(desc(postsTable.createdAt));

  const rows = await query;

  let filtered = rows;
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (published !== undefined) {
    const isPub = published === "true";
    filtered = filtered.filter((p) => p.published === isPub);
  }

  res.json(filtered);
});

router.get("/posts/:slug", async (req, res): Promise<void> => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;

  const [post] = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.slug, slug));

  if (!post) {
    res.status(404).json({ error: "Post não encontrado" });
    return;
  }

  res.json(post);
});

router.post("/posts", requireAdmin, async (req, res): Promise<void> => {
  const { title, slug, content, excerpt, category, imageUrl, published } = req.body as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    imageUrl?: string;
    published?: boolean;
  };

  if (!title || !slug || content == null) {
    res.status(400).json({ error: "title, slug e content são obrigatórios" });
    return;
  }

  const [post] = await db
    .insert(postsTable)
    .values({ title, slug, content, excerpt: excerpt ?? "", category: category ?? "Notícias", imageUrl: imageUrl ?? "", published: published ?? true })
    .returning();

  res.status(201).json(post);
});

router.patch("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const { title, slug, content, excerpt, category, imageUrl, published } = req.body as {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    category?: string;
    imageUrl?: string;
    published?: boolean;
  };

  const updates: Partial<typeof postsTable.$inferInsert> = {};
  if (title !== undefined) updates.title = title;
  if (slug !== undefined) updates.slug = slug;
  if (content !== undefined) updates.content = content;
  if (excerpt !== undefined) updates.excerpt = excerpt;
  if (category !== undefined) updates.category = category;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  if (published !== undefined) updates.published = published;

  const [post] = await db
    .update(postsTable)
    .set(updates)
    .where(eq(postsTable.id, id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post não encontrado" });
    return;
  }

  res.json(post);
});

router.delete("/posts/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const [post] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, id))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post não encontrado" });
    return;
  }

  res.sendStatus(204);
});

export default router;

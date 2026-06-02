import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

const PUBLIC_KEYS = ["google_analytics_id", "site_title", "site_description"];

router.get("/settings", async (_req, res): Promise<void> => {
  const rows = await db.select().from(settingsTable);
  const filtered = rows.filter((r) => PUBLIC_KEYS.includes(r.key));
  res.json(filtered);
});

router.get("/settings/all", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select({ id: settingsTable.id, key: settingsTable.key, value: settingsTable.value, label: settingsTable.label })
    .from(settingsTable)
    .where(eq(settingsTable.key, settingsTable.key));

  const filtered = rows.filter((r) => r.key !== "admin_password_hash");
  res.json(filtered);
});

// Public: fetch a single setting by key (page content, etc.)
// Must be defined AFTER /settings/all so "all" isn't swallowed by :key
router.get("/settings/:key", async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  if (key === "admin_password_hash") { res.status(403).json({ error: "Acesso negado" }); return; }
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  if (!row) { res.status(404).json({ error: "Configuração não encontrada" }); return; }
  res.json(row);
});

router.put("/settings/:key", requireAdmin, async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;

  if (key === "admin_password_hash") {
    res.status(403).json({ error: "Não é possível editar esta configuração" });
    return;
  }

  const { value, label } = req.body as { value?: string; label?: string };

  if (value == null) {
    res.status(400).json({ error: "value é obrigatório" });
    return;
  }

  const [setting] = await db
    .insert(settingsTable)
    .values({ key, value, label: label ?? key })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value, label: label ?? key } })
    .returning();

  res.json(setting);
});

export default router;

import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createAdminToken } from "../middlewares/adminAuth";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { password } = req.body as { password?: string };

  if (!password) {
    res.status(400).json({ error: "Senha obrigatória" });
    return;
  }

  const [setting] = await db
    .select()
    .from(settingsTable)
    .where(eq(settingsTable.key, "admin_password_hash"));

  if (!setting) {
    res.status(401).json({ error: "Admin não configurado. Use a rota de setup." });
    return;
  }

  const valid = await bcrypt.compare(password, setting.value);
  if (!valid) {
    req.log.warn("Failed admin login attempt");
    res.status(401).json({ error: "Senha incorreta" });
    return;
  }

  const token = createAdminToken();
  res.json({ token });
});

router.post("/auth/setup", async (req, res): Promise<void> => {
  const { password, setupKey } = req.body as { password?: string; setupKey?: string };

  if (setupKey !== process.env.SESSION_SECRET) {
    res.status(403).json({ error: "Chave de setup inválida" });
    return;
  }

  if (!password || password.length < 8) {
    res.status(400).json({ error: "Senha deve ter pelo menos 8 caracteres" });
    return;
  }

  const hash = await bcrypt.hash(password, 12);

  await db
    .insert(settingsTable)
    .values({ key: "admin_password_hash", value: hash, label: "Admin Password Hash" })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value: hash } });

  logger.info("Admin password configured");
  res.json({ ok: true });
});

export default router;

import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { associatesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

function formatCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

router.post("/associates", async (req, res): Promise<void> => {
  const { nomeCompleto, dataNascimento, cpf, cep, logradouro, numero, bairro, cidade, estado, complemento, whatsapp, email } = req.body as {
    nomeCompleto?: string;
    dataNascimento?: string;
    cpf?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    complemento?: string;
    whatsapp?: string;
    email?: string;
  };

  if (!nomeCompleto || !cpf || !cep || !whatsapp || !email) {
    res.status(400).json({ error: "Nome completo, CPF, CEP, WhatsApp e e-mail são obrigatórios" });
    return;
  }

  const cpfClean = formatCpf(cpf);
  if (cpfClean.length !== 11) {
    res.status(400).json({ error: "CPF inválido" });
    return;
  }

  const existing = await db
    .select({ id: associatesTable.id })
    .from(associatesTable)
    .where(eq(associatesTable.cpf, cpfClean))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "CPF já cadastrado" });
    return;
  }

  const [associate] = await db
    .insert(associatesTable)
    .values({
      nomeCompleto,
      dataNascimento: dataNascimento ?? "",
      cpf: cpfClean,
      cep: cep.replace(/\D/g, ""),
      logradouro: logradouro ?? "",
      numero: numero ?? "",
      bairro: bairro ?? "",
      cidade: cidade ?? "",
      estado: estado ?? "",
      complemento: complemento ?? "",
      whatsapp: whatsapp.replace(/\D/g, ""),
      email,
    })
    .returning();

  res.status(201).json({ ok: true, id: associate.id });
});

router.get("/associates", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(associatesTable)
    .orderBy(desc(associatesTable.createdAt));
  res.json(rows);
});

router.delete("/associates/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID inválido" }); return; }

  const [row] = await db.delete(associatesTable).where(eq(associatesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Associado não encontrado" }); return; }
  res.sendStatus(204);
});

export default router;

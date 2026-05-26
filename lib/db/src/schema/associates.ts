import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const associatesTable = pgTable("associates", {
  id: serial("id").primaryKey(),
  nomeCompleto: text("nome_completo").notNull(),
  cpf: text("cpf").notNull(),
  cep: text("cep").notNull(),
  logradouro: text("logradouro").notNull().default(""),
  bairro: text("bairro").notNull().default(""),
  cidade: text("cidade").notNull().default(""),
  estado: text("estado").notNull().default(""),
  complemento: text("complemento").notNull().default(""),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAssociateSchema = createInsertSchema(associatesTable).omit({ id: true, createdAt: true });
export type InsertAssociate = z.infer<typeof insertAssociateSchema>;
export type Associate = typeof associatesTable.$inferSelect;

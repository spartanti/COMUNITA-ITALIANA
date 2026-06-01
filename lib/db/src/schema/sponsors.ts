import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sponsorsTable = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  websiteUrl: text("website_url").notNull().default(""),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSponsorSchema = createInsertSchema(sponsorsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSponsor = z.infer<typeof insertSponsorSchema>;
export type Sponsor = typeof sponsorsTable.$inferSelect;

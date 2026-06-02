import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  menuLabel: text("menu_label").notNull().default(""),
  menuSection: text("menu_section").notNull().default("none"), // 'none' | 'top' | 'institucional'
  menuOrder: integer("menu_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

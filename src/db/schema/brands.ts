import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { stores } from "./stores";
import { relations } from "drizzle-orm";
import { products } from "./products";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

// Solução principal está na linha do parentBrandId
export const brands = pgTable("brands", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentBrandId: text("parent_brand_id").references(
    (): AnyPgColumn => brands.id, // Referência direta à coluna
    { onDelete: "set null" }
  ), // Auto-relacionamento
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// Relações simplificadas
export const brandRelations = relations(brands, ({ one, many }) => ({
  store: one(stores, {
    fields: [brands.storeId],
    references: [stores.id],
  }),
  parentBrand: one(brands, {
    // Auto-relacionamento direto
    fields: [brands.parentBrandId],
    references: [brands.id],
  }),
  products: many(products),
}));

// Tipagens (mantenha igual)
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;

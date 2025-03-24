import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { relations } from "drizzle-orm";
import { productCategories } from "./productCategories";

export const categories = pgTable("categories", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull().unique(),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(productCategories),
}));

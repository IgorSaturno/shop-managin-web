import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { stores } from "./stores";
import { relations } from "drizzle-orm";
import { productTags } from "./product-tags";

export const tags = pgTable("tags", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  tag_name: text("tag_name").notNull(),
  slug: text("slug").notNull().unique(),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tagRelations = relations(tags, ({ many }) => ({
  products: many(productTags),
}));

export type Tag = typeof tags.$inferSelect;

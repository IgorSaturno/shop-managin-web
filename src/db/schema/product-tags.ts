import { pgTable, text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const productTags = pgTable("product_tags", {
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.id],
  }),
}));

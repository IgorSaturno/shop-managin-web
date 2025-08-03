import { pgTable, text } from "drizzle-orm/pg-core";
import { products } from "./products";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const productTags = pgTable("product_tags", {
  productId: text("product_id")
    .notNull()
    .references(() => products.product_id, { onDelete: "cascade" }),
  tagId: text("tag_id")
    .notNull()
    .references(() => tags.tag_id, { onDelete: "cascade" }),
});

export const productTagRelations = relations(productTags, ({ one }) => ({
  product: one(products, {
    fields: [productTags.productId],
    references: [products.product_id],
  }),
  tag: one(tags, {
    fields: [productTags.tagId],
    references: [tags.tag_id],
  }),
}));

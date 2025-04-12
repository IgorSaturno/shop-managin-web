import { pgTable, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products } from "./products";
import { categories } from "./categories";

export const productCategories = pgTable("product_categories", {
  productId: text("product_id")
    .notNull()
    .references(() => products.product_id, { onDelete: "cascade" }),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.category_id, { onDelete: "cascade" }),
});

export const productCategoryRelations = relations(
  productCategories,
  ({ one }) => ({
    product: one(products, {
      fields: [productCategories.productId],
      references: [products.product_id],
    }),
    category: one(categories, {
      fields: [productCategories.categoryId],
      references: [categories.category_id],
    }),
  })
);

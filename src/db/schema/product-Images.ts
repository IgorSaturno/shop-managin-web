import { createId } from "@paralleldrive/cuid2";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const productImages = pgTable("product_images", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  url: text("url").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

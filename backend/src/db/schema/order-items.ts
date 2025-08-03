import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users, orders, products } from ".";
import { relations } from "drizzle-orm";

export const orderItems = pgTable("orders_items", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, {
      onDelete: "cascade",
    }),
  productId: text("product_id").references(() => products.product_id, {
    onDelete: "set null",
  }),
  priceInCents: integer("price_in_cents").notNull(),
  quantity: integer("quantity").notNull(),
  productName: text("product_name").notNull(), // Nome do produto no momento da compra
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
    relationName: "order_item_order",
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.product_id],
    relationName: "order_item_product",
  }),
}));

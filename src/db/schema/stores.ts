import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users, orders, products } from ".";
import { relations } from "drizzle-orm";

export const stores = pgTable("stores", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  managerId: text("manager_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const storesRelations = relations(stores, ({ one, many }) => {
  return {
    manager: one(users, {
      fields: [stores.managerId],
      references: [users.id],
      relationName: "store_manager",
    }),
    orders: many(orders),
    products: many(products),
  };
});

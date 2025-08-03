import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { orders } from "./orders";
import { stores } from "./stores";

export const userRoleEnum = pgEnum("user_role", ["manager", "customer"]);

export const users = pgTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 11 }).notNull(),
  cep: varchar("cep", { length: 9 }),
  streetName: text("street_name"),
  number: varchar("number", { length: 4 }),
  complement: text("complement"),
  role: userRoleEnum("role").default("customer").notNull(),
  storeId: text("storeId").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ one, many }) => {
  return {
    managedStore: one(stores, {
      fields: [users.id],
      references: [stores.managerId],
      relationName: "managed_store",
    }),

    orders: many(orders),
  };
});

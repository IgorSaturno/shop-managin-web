import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { stores } from "./stores";
import { orderItems } from "./order-items";
import { varchar } from "drizzle-orm/pg-core";

export const orderStatusEnum = pgEnum("order_status", [
  "pending", // Pedido criado, aguardando pagamento
  "approved", // Pagamento confirmado
  "refused", // Pagamento recusado
  "refunded", // Pagamento reembolsado
  "returned", // De volta a loja
  "processing", // Em preparação (separação de estoque, embalagem)
  "in_transit", // Saiu do centro de distribuição
  "delivering", // Entregador a caminho do destino
  "delivered", // Entregue ao cliente
  "canceled", // Pedido cancelado
  "failed_delivery", // Falha na entrega
]);

export const orders = pgTable("orders", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text("customer_id").references(() => users.id, {
    onDelete: "set null",
  }),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id, {
      onDelete: "cascade",
    }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalInCents: integer("total_in_cents").notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  streetName: text("street_name").notNull(),
  number: varchar("number", { length: 4 }).notNull(),
  complement: text("complement"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: "order_customer",
    }),
    store: one(stores, {
      fields: [orders.storeId],
      references: [stores.id],
      relationName: "order_store",
    }),

    orderItems: many(orderItems),
  };
});

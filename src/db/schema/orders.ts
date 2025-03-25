import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { relations } from "drizzle-orm";
import { stores } from "./stores";
import { orderItems } from "./order-items";

export const orderStatusEnum = pgEnum("order_status", [
  // Fluxo principal
  "pending", // Pedido criado, aguardando pagamento
  "payment_approved", // Pagamento confirmado
  "processing", // Em preparação (separação de estoque, embalagem)
  "in_transit", // Saiu do centro de distribuição
  "out_for_delivery", // Entregador a caminho do destino
  "delivered", // Entregue ao cliente
  "completed", // Pedido finalizado (período de devolução expirado)

  // Fluxos alternativos
  "awaiting_payment", // Aguardando confirmação de pagamento (ex: boleto)
  "on_hold", // Requer verificação manual (ex: fraude)
  "backorder", // Aguardando reposição de estoque
  "partially_shipped", // Parcialmente enviado (pedidos divididos)

  // Estados finais
  "canceled", // Cancelado antes do envio
  "returned", // Devolvido pelo cliente
  "refunded", // Reembolso processado
  "payment_failed", // Pagamento recusado/rejeitado
  "failed_delivery", // Tentativa de entrega sem sucesso
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
      fields: [orders.customerId],
      references: [stores.id],
      relationName: "order_store",
    }),

    orderItems: many(orderItems),
  };
});

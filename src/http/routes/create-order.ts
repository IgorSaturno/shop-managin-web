import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { eq } from "drizzle-orm";
import { orders, users } from "../../db/schema";
import { createId } from "@paralleldrive/cuid2";

export const createOrder = new Elysia().use(auth).post(
  "/orders",
  async ({ getCurrentUser, body, set }) => {
    const { storeId, id: customerId } = await getCurrentUser();
    if (!storeId) {
      throw new UnauthorizedError();
    }

    // Buscando os dados do cliente
    const customer = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, customerId);
      },
    });

    if (!customer) {
      set.status = 400;
      return { message: "Customer not found" };
    }

    const orderId = createId();

    // Aqui, você pode utilizar dados do body (por exemplo, itens, total, etc.)
    // Para simplificar, vamos assumir que o total é enviado no body
    const { totalInCents } = body as { totalInCents: number };

    const order = await db
      .insert(orders)
      .values({
        id: orderId,
        customerId: customer.id,
        storeId: storeId,
        totalInCents,
        status: "pending",
        // Copiando os dados de endereço do cliente:
        cep: customer.cep,
        address: customer.address,
        number: customer.number,
        complement: customer.complement,
        createdAt: new Date(),
      })
      .returning();

    return order;
  },
  {
    body: t.Object({
      totalInCents: t.Number(),
      // Outras propriedades do pedido podem ser definidas aqui
    }),
  }
);

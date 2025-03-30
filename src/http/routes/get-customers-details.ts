import { and, count, eq, sum } from "drizzle-orm";
import { db } from "../../db/connection";
import { orders, users } from "../../db/schema";
import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getCustomerDetails = new Elysia().use(auth).get(
  "/customers/:customerId",
  async ({ getCurrentUser, params }) => {
    const { storeId } = await getCurrentUser();
    const { customerId } = params;

    if (!storeId) {
      throw new UnauthorizedError();
    }

    const customer = await db
      .select({
        customerId: users.id,
        customerName: users.name,
        email: users.email,
        phone: users.phone,
        streetName: users.streetName,
        cep: users.cep,
        number: users.number,
        complement: users.complement,
        createdAt: users.createdAt,
        orderCount: count(orders.id).as("orderCount"),
      })
      .from(users)
      .leftJoin(orders, eq(orders.customerId, users.id))
      .where(
        and(
          eq(users.storeId, storeId),
          eq(users.role, "customer"),
          eq(users.id, customerId)
        )
      )
      .groupBy(users.id);

    if (!customer.length) {
      return { error: "Customer not found" };
    }

    return customer[0];
  },
  {
    params: t.Object({
      customerId: t.String(),
    }),
  }
);

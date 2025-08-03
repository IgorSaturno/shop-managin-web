import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getCustomerHistory = new Elysia().use(auth).get(
  "/customers/:customerId/orders",
  async ({ getCurrentUser, params }) => {
    const { storeId } = await getCurrentUser();
    const { customerId } = params;

    if (!storeId) {
      throw new UnauthorizedError();
    }

    const customerOrders = await db.query.orders.findMany({
      columns: {
        id: true,
        createdAt: true,
        totalInCents: true,
      },
      where(fields, { eq, and }) {
        return and(
          eq(fields.customerId, customerId),
          eq(fields.storeId, storeId)
        );
      },
      orderBy: (fields, { desc }) => desc(fields.createdAt),
    });

    return customerOrders;
  },
  {
    params: t.Object({
      customerId: t.String(),
    }),
  }
);

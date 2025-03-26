import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { db } from "../../db/connection";

export const getOrderDetails = new Elysia().use(auth).get(
  "/orders/:orderId",
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params;
    const { storeId } = await getCurrentUser();

    if (!storeId) {
      throw new UnauthorizedError();
    }

    const order = await db.query.orders.findFirst({
      columns: {
        id: true,
        status: true,
        totalInCents: true,
        createdAt: true,
      },
      with: {
        customer: {
          columns: {
            name: true,
            phone: true,
            email: true,
          },
        },
        orderItems: {
          columns: {
            id: true,
            priceInCents: true,
            quantity: true,
            thumbnailUrl: true,
          },
          with: {
            product: {
              columns: {
                name: true,
              },
            },
          },
        },
      },
      where(fields, { eq, and }) {
        return and(eq(fields.id, orderId), eq(fields.storeId, storeId));
      },
    });
    if (!order) {
      set.status = 400;
      return { message: "Order not found." };
    }

    return order;
  },
  {
    params: t.Object({
      orderId: t.String(),
    }),
  }
);

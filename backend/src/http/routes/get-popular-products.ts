import Elysia from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { orderItems, orders, products } from "../../db/schema";
import { desc, eq, sum } from "drizzle-orm";

export const getPopularProducts = new Elysia()
  .use(auth)
  .get("/metrics/popular-products", async ({ getCurrentUser }) => {
    const { storeId } = await getCurrentUser();

    if (!storeId) {
      throw new UnauthorizedError();
    }

    const popularProducts = await db
      .select({
        product: products.product_name,
        amount: sum(orderItems.quantity).mapWith(Number),
      })
      .from(orderItems)
      .leftJoin(orders, eq(orders.id, orderItems.orderId))
      .leftJoin(products, eq(products.product_id, orderItems.productId))
      .where(eq(orders.storeId, storeId))
      .groupBy(products.product_name)
      .orderBy((fields) => {
        return desc(fields.amount);
      })
      .limit(5);

    return popularProducts;
  });

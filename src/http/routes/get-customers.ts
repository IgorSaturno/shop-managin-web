import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { users, orders } from "../../db/schema";

export const getCustomers = new Elysia().use(auth).get(
  "/customers",
  async ({ getCurrentUser, query }) => {
    const { storeId } = await getCurrentUser();
    const { customerId, name, email, phone, pageIndex } = query;

    if (!storeId) {
      throw new UnauthorizedError();
    }

    // console.log("Query parameters:", query);
    // console.log("Store ID:", storeId);

    const baseQuery = db
      .select({
        customerId: users.id,
        customerName: users.name,
        email: users.email,
        phone: users.phone,
        orderCount: count(orders.id).as("orderCount"),
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(orders, eq(orders.customerId, users.id))
      .where(
        and(
          eq(users.storeId, storeId),
          eq(users.role, "customer"),
          customerId ? eq(users.id, customerId) : undefined,
          name ? ilike(users.name, `%${name}%`) : undefined,
          email ? ilike(users.email, `%${email}%`) : undefined,
          phone ? ilike(users.phone, `%${phone}%`) : undefined
        )
      )
      .groupBy(users.id);

    const [customersCount, allCustomers] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      db
        .select()
        .from(baseQuery.as("baseQuery"))
        .offset(pageIndex * 10)
        .limit(10)
        .orderBy((fields) => [desc(fields.orderCount), desc(fields.createdAt)]),
    ]);

    return {
      customers: allCustomers,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: customersCount[0]?.count ?? 0,
      },
    };
  },
  {
    query: t.Object({
      customerId: t.Optional(t.String()),
      name: t.Optional(t.String()),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  }
);

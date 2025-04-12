import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { discountCoupon } from "../../db/schema/discount-coupon";
import { sql } from "drizzle-orm";

export const createCoupon = new Elysia().use(auth).post(
  "/discount-coupons",
  async ({ body, getCurrentUser }) => {
    await getCurrentUser();

    const [newCoupon] = await db
      .insert(discountCoupon)
      .values({
        ...body,
        discountValue: body.discountValue,
        minimumOrder: body.minimumOrder || "0",
        validFrom: body.validFrom ? new Date(body.validFrom) : sql`now()`,
        validUntil: new Date(body.validUntil),
      })
      .returning();

    return newCoupon;
  },
  {
    body: t.Object({
      code: t.String(),
      discountType: t.Union([t.Literal("percentage"), t.Literal("fixed")]),
      discountValue: t.String(),
      minimumOrder: t.Optional(t.String()),
      maxUses: t.Optional(t.Number()),
      validFrom: t.Optional(t.String({ format: "date-time" })), // Formato ISO
      validUntil: t.String({ format: "date-time" }), // Formato ISO
      active: t.Optional(t.Boolean()),
    }),
  }
);

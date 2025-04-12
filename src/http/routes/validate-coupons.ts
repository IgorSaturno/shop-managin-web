import { Elysia, t } from "elysia";
import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../../db/connection";
import { discountCoupon } from "../../db/schema/discount-coupon";

export const validateCoupon = new Elysia().post(
  "/validate",
  async ({ body }) => {
    const now = new Date();

    const result = await db
      .select()
      .from(discountCoupon)
      .where(
        and(
          eq(discountCoupon.code, body.code),
          eq(discountCoupon.active, true),
          lte(discountCoupon.validFrom, now),
          gte(discountCoupon.validUntil, now)
        )
      )
      .execute();

    if (!result) throw new Error("Cupom inválido");

    return result;
  },
  {
    body: t.Object({
      code: t.String(),
      total: t.Number(),
    }),
  }
);

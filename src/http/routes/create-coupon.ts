import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { discountCoupon } from "../../db/schema/discount-coupon";

export const createCoupon = new Elysia().use(auth).post(
  "/discount-coupons",
  async ({ body, getCurrentUser }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    console.log("Dados recebidos:", body); // Antes da inserção
    const [newCoupon] = await db
      .insert(discountCoupon)
      .values({
        storeId,
        code: body.code,
        discountType: body.discountType,
        discountValue: body.discountValue,
        minimumOrder: body.minimumOrder || "0",
        validFrom: body.validFrom ? new Date(body.validFrom) : new Date(), // Remova sql`now()`
        validUntil: new Date(body.validUntil),
        active: body.active ?? true,
      })
      .returning();
    console.log("Cupom criado:", newCoupon); // Após inserção
    return newCoupon;
  },
  {
    body: t.Object({
      code: t.String(),
      discountType: t.Union([t.Literal("percentage"), t.Literal("fixed")]),
      discountValue: t.Number(), // Alterado para number
      minimumOrder: t.Optional(t.String()),
      maxUses: t.Optional(t.Number()),
      validFrom: t.Optional(t.String({ format: "date-time" })),
      validUntil: t.String({ format: "date-time" }),
      active: t.Optional(t.Boolean()),
    }),
  }
);

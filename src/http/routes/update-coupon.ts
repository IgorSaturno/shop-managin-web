import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { discountCoupon } from "../../db/schema/discount-coupon";
import { eq } from "drizzle-orm";

export const updateCoupon = new Elysia().use(auth).patch(
  "/discount-coupons/:id",
  async ({ params, body, getCurrentUser }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    // Verifica se o cupom pertence à loja do usuário
    const [existingCoupon] = await db
      .select()
      .from(discountCoupon)
      .where(
        eq(discountCoupon.discount_coupon_id, params.id) &&
          eq(discountCoupon.storeId, storeId)
      );

    if (!existingCoupon) {
      throw new Error("Cupom não encontrado ou não autorizado");
    }

    // Atualiza apenas os campos fornecidos
    const [updatedCoupon] = await db
      .update(discountCoupon)
      .set({
        code: body.code,
        discountType: body.discountType,
        discountValue:
          body.discountValue !== undefined
            ? body.discountValue.toString()
            : undefined,
        minimumOrder: body.minimumOrder,
        validFrom: body.validFrom ? new Date(body.validFrom) : undefined,
        validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
        active: body.active,
      })
      .where(
        eq(discountCoupon.discount_coupon_id, params.id) &&
          eq(discountCoupon.storeId, storeId)
      )
      .returning();

    return updatedCoupon;
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Partial(
      t.Object({
        code: t.String(),
        discountType: t.Union([t.Literal("percentage"), t.Literal("fixed")]),
        discountValue: t.Number(),
        minimumOrder: t.Optional(t.String()),
        maxUses: t.Optional(t.Number()),
        validFrom: t.Optional(t.String({ format: "date-time" })),
        validUntil: t.String({ format: "date-time" }),
        active: t.Optional(t.Boolean()),
      })
    ),
  }
);

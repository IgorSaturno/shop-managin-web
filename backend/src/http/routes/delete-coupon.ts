import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { discountCoupon } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/connection";

export const deleteCoupon = new Elysia().use(auth).delete(
  "/discount-coupons/:discountId",
  async ({ getCurrentUser, params, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    // Verifica se a categoria pertence à loja
    const [coupon] = await db
      .select()
      .from(discountCoupon)
      .where(
        and(
          eq(discountCoupon.discount_coupon_id, params.discountId),
          eq(discountCoupon.storeId, storeId)
        )
      );

    if (!coupon) {
      set.status = 404;
      return { message: "Coupon not found" };
    }

    await db
      .delete(discountCoupon)
      .where(eq(discountCoupon.discount_coupon_id, params.discountId));

    return { success: true };
  },
  {
    params: t.Object({
      discountId: t.String(),
    }),
  }
);

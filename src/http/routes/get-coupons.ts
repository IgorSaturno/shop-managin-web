import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "../../db/connection";
import { discountCoupon, discountCouponToProducts } from "../../db/schema";
import { auth } from "../auth";
import Elysia, { t } from "elysia";

export const getCoupons = new Elysia().use(auth).get(
  "/discount-coupons",
  async ({ getCurrentUser, query }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const { pageIndex, status } = query;
    const perPage = 10;
    const offset = pageIndex * perPage;

    // Query principal para cupons
    const couponsQuery = db
      .select({
        id: discountCoupon.discount_coupon_id,
        code: discountCoupon.code,
        discountType: sql<string>`UPPER(${discountCoupon.discountType})`,
        discountValue: discountCoupon.discountValue,
        validUntil: discountCoupon.validUntil,
        active: discountCoupon.active,
        createdAt: discountCoupon.createdAt,
        updatedAt: discountCoupon.updatedAt,
      })
      .from(discountCoupon)
      .where(
        and(
          eq(discountCoupon.storeId, storeId),
          status && status !== "all"
            ? eq(discountCoupon.active, status === "active")
            : undefined
        )
      )
      .orderBy(desc(discountCoupon.createdAt))
      .limit(perPage)
      .offset(offset);

    // Query para produtos associados (após buscar os cupons)
    const coupons = await couponsQuery.execute();
    const couponIds = coupons.map((coupons) => coupons.id);

    let productsMap = new Map<string, string[]>();
    if (couponIds.length > 0) {
      const couponProducts = await db
        .select({
          couponId: discountCouponToProducts.couponId,
          productId: discountCouponToProducts.productId,
        })
        .from(discountCouponToProducts)
        .where(inArray(discountCouponToProducts.couponId, couponIds));

      couponProducts.forEach(({ couponId, productId }) => {
        if (!productsMap.has(couponId)) productsMap.set(couponId, []);
        productsMap.get(couponId)!.push(productId);
      });
    }

    // Query de contagem total (otimizada)
    const totalCount = await db
      .select({ count: count() })
      .from(discountCoupon)
      .where(
        and(
          eq(discountCoupon.storeId, storeId),
          status && status !== "all"
            ? eq(discountCoupon.active, status === "active")
            : undefined
        )
      )
      .execute()
      .then((res) => res[0]?.count || 0);

    return {
      coupons: coupons.map((coupon) => ({
        ...coupon,
        products:
          productsMap.get(coupon.id)?.map((productId) => ({ productId })) || [],
      })),
      meta: {
        pageIndex,
        perPage,
        totalCount,
      },
    };
  },
  {
    query: t.Object({
      pageIndex: t.Numeric({ minimum: 0 }),
      status: t.Optional(t.String({ enum: ["active", "inactive", "all"] })), // Validação explícita
    }),
  }
);

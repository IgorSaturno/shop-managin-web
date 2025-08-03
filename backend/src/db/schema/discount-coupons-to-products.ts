import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { discountCoupon } from "./discount-coupon";
import { products } from "./products";

export const discountCouponToProducts = pgTable(
  "discount_coupon_to_products",
  {
    couponId: text("coupon_id")
      .notNull()
      .references(() => discountCoupon.discount_coupon_id, {
        onDelete: "cascade",
      }),

    productId: text("product_id")
      .notNull()
      .references(() => products.product_id, {
        onDelete: "cascade",
      }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.couponId, t.productId] }),
  })
);

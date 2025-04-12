import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  text,
  varchar,
  numeric,
  integer,
  timestamp,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { products } from "./products";
import { relations } from "drizzle-orm";

export const discountCoupon = pgTable("discount_coupons", {
  discount_coupon_id: text("discount_coupon_id")
    .$defaultFn(() => createId())
    .primaryKey(),
  code: varchar("code", { length: 20 }).unique().notNull(),
  discountType: varchar("discount_type", {
    enum: ["percentage", "fixed"],
  }).notNull(),
  discountValue: numeric("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  minimumOrder: numeric("minimum_order", { precision: 10, scale: 2 }).default(
    "0"
  ),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").default(0),
  validFrom: timestamp("valid_from", { mode: "date" }).defaultNow(),
  validUntil: timestamp("valid_until", { mode: "date" }).notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const discountCouponToProductsRelations = relations(
  discountCouponToProducts,
  ({ one }) => ({
    coupon: one(discountCoupon, {
      fields: [discountCouponToProducts.couponId],
      references: [discountCoupon.discount_coupon_id],
    }),
    product: one(products, {
      fields: [discountCouponToProducts.productId],
      references: [products.product_id],
    }),
  })
);

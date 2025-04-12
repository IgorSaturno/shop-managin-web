import Elysia from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { discountCoupon } from "../../db/schema/discount-coupon";

export const getCoupons = new Elysia()
  .use(auth)
  .get("/discount-coupons", async ({ getCurrentUser }) => {
    await getCurrentUser();
    return await db.select().from(discountCoupon);
  });

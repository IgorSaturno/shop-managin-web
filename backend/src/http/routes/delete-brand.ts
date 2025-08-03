import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { brands } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const deleteBrand = new Elysia().use(auth).delete(
  "/brands/:brandId",
  async ({ getCurrentUser, params, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const [brand] = await db
      .select()
      .from(brands)
      .where(
        and(eq(brands.brand_id, params.brandId), eq(brands.storeId, storeId))
      );

    if (!brand) {
      set.status = 404;
      return { message: "Brand not found" };
    }

    await db.delete(brands).where(eq(brands.brand_id, params.brandId));

    return { success: true };
  },
  {
    params: t.Object({
      brandId: t.String(),
    }),
  }
);

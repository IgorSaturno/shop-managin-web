import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { brands } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getBrands = new Elysia().use(auth).get(
  "/brands",
  async ({ getCurrentUser }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    return db
      .select({
        value: brands.brand_id,
        label: brands.brand_name,
      })
      .from(brands)
      .where(eq(brands.storeId, storeId));
  },
  {
    response: t.Array(
      t.Object({
        value: t.String(),
        label: t.String(),
      })
    ),
  }
);

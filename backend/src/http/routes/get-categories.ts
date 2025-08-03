import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { categories } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getCategories = new Elysia().use(auth).get(
  "/categories",
  async ({ getCurrentUser }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    return db
      .select({
        value: categories.category_id,
        label: categories.category_name,
      })
      .from(categories)
      .where(eq(categories.storeId, storeId));
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

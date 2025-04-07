import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { categories } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/connection";

export const deleteCategory = new Elysia().use(auth).delete(
  "/categories/:categoryId",
  async ({ getCurrentUser, params, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    // Verifica se a categoria pertence à loja
    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.category_id, params.categoryId),
          eq(categories.storeId, storeId)
        )
      );

    if (!category) {
      set.status = 404;
      return { message: "Category not found" };
    }

    await db
      .delete(categories)
      .where(eq(categories.category_id, params.categoryId));

    return { success: true };
  },
  {
    params: t.Object({
      categoryId: t.String(),
    }),
  }
);

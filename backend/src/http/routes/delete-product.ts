import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { products } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const deleteProduct = new Elysia().use(auth).delete(
  "/products/:productId",
  async ({ getCurrentUser, params, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    // Verifica se o produto pertence à loja do usuário
    const [product] = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.product_id, params.productId),
          eq(products.storeId, storeId)
        )
      );

    if (!product) {
      set.status = 404;
      return { message: "Product not found" };
    }

    // Deleta o produto
    await db.delete(products).where(eq(products.product_id, params.productId));

    return { success: true };
  },
  {
    params: t.Object({
      productId: t.String(),
    }),
  }
);

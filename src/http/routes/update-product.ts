import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { and, eq } from "drizzle-orm";
import { productImages, products } from "../../db/schema";

export const updateProduct = new Elysia().use(auth).put(
  "/products/:id",
  async ({ params, body, getCurrentUser, set }) => {
    try {
      const { storeId } = await getCurrentUser();
      const { id } = params;

      if (!storeId) {
        set.status = 401;
        return { error: "Usuário não associado a uma loja" };
      }

      // Verificação de produto
      const product = await db.query.products.findFirst({
        where: and(eq(products.product_id, id), eq(products.storeId, storeId)),
      });

      if (!product) {
        set.status = 404;
        return { error: "Produto não encontrado" };
      }

      // Atualização básica
      await db
        .update(products)
        .set({
          product_name: body.name,
          description: body.description,
          priceInCents: Math.round(body.priceInCents * 100),
          stock: body.stock,
          status: body.status,
          categoryId: body.categoryId,
          brandId: body.brandId,
        })
        .where(eq(products.product_id, id));

      // Atualização de imagens
      await db.transaction(async (tx) => {
        // 1. Remover imagens antigas
        await tx.delete(productImages).where(eq(productImages.productId, id));

        // 2. Inserir novas imagens com ordem
        if (body.images?.length > 0) {
          await tx.insert(productImages).values(
            body.images.map((url, index) => ({
              url,
              productId: id,
              order: index,
            }))
          );
        }
      });

      return { success: true };
    } catch (error) {
      set.status = 500;
      return { error: "Falha na atualização" };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
      priceInCents: t.Number(),
      stock: t.Integer(),
      status: t.Union(
        [t.Literal("available"), t.Literal("unavailable")],
        t.Literal("archived")
      ),
      categoryId: t.String(),
      brandId: t.String(),
      images: t.Array(t.String()), // Agora usando URLs
    }),
    params: t.Object({
      id: t.String(),
    }),
  }
);

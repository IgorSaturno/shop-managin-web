import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { products, productImages } from "../../db/schema";
import { createId } from "@paralleldrive/cuid2";

export const createProduct = new Elysia().use(auth).post(
  "/products",
  async ({ getCurrentUser, body, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) {
      throw new Error("Store not found");
    }

    const {
      name,
      description,
      characteristics,
      priceInCents,
      sku,
      stock,
      isFeatured,
      isArchived,
      status,
      categoryId,
      brandId,
      images, // array de URLs de imagem
      video, // opcional, URL do vídeo
    } = body as {
      name: string;
      description: string;
      characteristics: string;
      priceInCents: number;
      sku: string;
      stock: number;
      isFeatured: boolean;
      isArchived: boolean;
      status: string;
      categoryId: string;
      brandId: string;
      images: string[];
      video?: string;
    };

    const productId = createId();

    // Cria o produto
    const [product] = await db
      .insert(products)
      .values({
        id: productId,
        name,
        description,
        characteristics,
        priceInCents,
        sku,
        stock,
        isFeatured,
        isArchived,
        status,
        categoryId,
        brandId,
        storeId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Insere as imagens, limitando a 4
    if (images && images.length > 0) {
      const imagesToInsert = images.slice(0, 4).map((url) => ({
        id: createId(),
        productId: productId,
        url,
        altText: name,
        createdAt: new Date(),
      }));

      await db.insert(productImages).values(imagesToInsert);
    }

    // Se houver vídeo, pode salvar em outro campo ou tabela conforme sua lógica

    return product;
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      characteristics: t.String(),
      priceInCents: t.Number(),
      sku: t.String(),
      stock: t.Number(),
      isFeatured: t.Boolean(),
      isArchived: t.Boolean(),
      status: t.String(),
      categoryId: t.String(),
      brandId: t.String(),
      images: t.Array(t.String()),
      video: t.Optional(t.String()),
    }),
  }
);

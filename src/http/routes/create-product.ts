import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { products } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const createProduct = new Elysia().use(auth).post(
  "/products",
  async ({ getCurrentUser, body, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const {
      product_name,
      description,
      characteristics,
      priceInCents,
      stock,
      categoryId,
      brandId,
      status = "available",
      isFeatured = false,
      isArchived = false,
      sku,
      tags = [],
      images = [],
    } = body;

    // Validação dos campos obrigatórios
    if (!product_name || !description || !characteristics || !priceInCents) {
      set.status = 400;
      return { message: "Campos obrigatórios faltando" };
    }

    try {
      const [product] = await db
        .insert(products)
        .values({
          id: createId(),
          product_name,
          description,
          characteristics,
          priceInCents,
          stock,
          categoryId,
          brandId,
          storeId,
          status,
          isFeatured,
          isArchived,
          sku,
        })
        .returning();

      return product;
    } catch (error) {
      set.status = 500;
      return { message: "Falha ao criar produto" };
    }
  },
  {
    body: t.Object({
      product_name: t.String(),
      description: t.String(),
      characteristics: t.String(),
      priceInCents: t.Integer(),
      stock: t.Integer(),
      categoryId: t.String(),
      brandId: t.String(),
      status: t.Optional(
        t.Union([
          t.Literal("available"),
          t.Literal("unavailable"),
          t.Literal("archived"),
        ])
      ),
      isFeatured: t.Optional(t.Boolean()),
      isArchived: t.Optional(t.Boolean()),
      sku: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String())),
      images: t.Optional(t.Array(t.String())),
    }),
  }
);

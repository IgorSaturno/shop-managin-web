import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import {
  brands,
  categories,
  products,
  productTags,
  tags,
} from "../../db/schema";
import { eq, ilike, inArray } from "drizzle-orm";

export const getProducts = new Elysia().get(
  "/products",
  async ({ query }) => {
    const { productName, pageIndex, productId, status, category, subBrand } =
      query;
    const perPage = 10;

    const baseQuery = await db
      .select({
        productId: products.id,
        productName: products.name,
        description: products.description,
        category: categories.name,
        subBrand: brands.name,
        priceInCents: products.priceInCents,
        stock: products.stock,
        sku: products.sku,
        isFeatured: products.isFeatured,
        status: products.status,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(categories, eq(products.categoryId, categories.id));

    // Aplica os filtros
    if (productName) {
      baseQuery = baseQuery.where(ilike(products.name, `%${productName}%`));
    }
    if (productId) {
      baseQuery = baseQuery.where(eq(products.id, productId));
    }
    if (status && status !== "all") {
      baseQuery = baseQuery.where(
        eq(products.status, status as "available" | "unavailable" | "archived")
      );
    }
    if (category && category !== "all") {
      baseQuery = baseQuery.where(eq(categories.name, category));
    }
    if (subBrand && subBrand !== "all") {
      baseQuery = baseQuery.where(eq(brands.name, subBrand));
    }

    const finalQuery = baseQuery.offset(pageIndex * perPage).limit(perPage);

    const productsList = await finalQuery;
    const productIds = productsList.map((p) => p.productId);

    const tagsData = await db
      .select({
        productId: productTags.productId,
        tagName: tags.name,
      })
      .from(productTags)
      .innerJoin(tags, eq(productTags.tagId, tags.id))
      .where(inArray(productTags.productId, productIds));

    const tagsByProduct: Record<string, string[]> = {};
    tagsData.forEach((row) => {
      if (!tagsByProduct[row.productId]) {
        tagsByProduct[row.productId] = [];
      }
      tagsByProduct[row.productId].push(row.tagName);
    });

    const productsWithTags = productsList.map((product) => ({
      ...product,
      tags: tagsByProduct[product.productId] || [],
    }));

    return {
      products: productsWithTags,
      meta: {
        pageIndex,
        perPage,
        totalCount: productsList.length,
      },
    };
  },
  {
    query: t.Object({
      productName: t.Optional(t.String()),
      pageIndex: t.Numeric({ minimum: 0 }),
      productId: t.Optional(t.String()),
      status: t.Optional(t.String()),
      category: t.Optional(t.String()),
      subBrand: t.Optional(t.String()),
    }),
  }
);

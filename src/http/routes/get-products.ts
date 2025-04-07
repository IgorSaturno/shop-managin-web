import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import {
  brands,
  categories,
  products,
  productTags,
  tags,
} from "../../db/schema";
import { and, count, desc, eq, exists, ilike, inArray, sql } from "drizzle-orm";

export const getProducts = new Elysia().use(auth).get(
  "/products",
  async ({ getCurrentUser, query }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new UnauthorizedError();

    const {
      productName,
      productId,
      status,
      category,
      brandId,
      tags: filterTags,
      pageIndex,
    } = query;
    const perPage = 10;

    // Constrói a query base com JOINs para categorias e marcas
    const baseQuery = db
      .select({
        productId: products.id,
        productName: products.product_name,
        description: products.description,
        priceInCents: products.priceInCents,
        stock: products.stock,
        sku: products.sku,
        isFeatured: products.isFeatured,
        status: products.status,
        createdAt: products.createdAt,
        categoryId: categories.category_id,
        brandId: brands.brand_id,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.category_id))
      .leftJoin(brands, eq(products.brandId, brands.brand_id))
      .where(
        and(
          eq(products.storeId, storeId),
          productName
            ? ilike(products.product_name, `%${productName}%`)
            : undefined,
          productId ? eq(products.id, productId) : undefined,
          status && status !== "all"
            ? eq(
                products.status,
                status as "available" | "unavailable" | "archived"
              )
            : undefined,
          category && category !== "all"
            ? eq(products.categoryId, category)
            : undefined,
          query.brandId && query.brandId !== "all"
            ? eq(products.brandId, query.brandId)
            : undefined,
          // Filtro por tags: qualifica explicitamente a coluna "name" da tabela "tags"
          filterTags && filterTags.length > 0
            ? exists(
                db
                  .select()
                  .from(productTags)
                  .leftJoin(tags, eq(productTags.tagId, tags.id))
                  .where(
                    and(
                      eq(productTags.productId, products.id),
                      inArray(tags.tag_name, filterTags)
                    )
                  )
              )
            : undefined
        )
      );

    // Executa em paralelo a contagem e a busca paginada
    const [amountQuery, allProducts] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as("baseQuery")),
      db
        .select()
        .from(baseQuery.as("baseQuery"))
        .offset(pageIndex * perPage)
        .limit(perPage)
        .orderBy((fields) => [
          sql`CASE ${fields.status}
            WHEN 'available' THEN 1
            WHEN 'unavailable' THEN 2
            WHEN 'archived' THEN 3
          END`,
          desc(fields.createdAt),
        ]),
    ]);

    const productIds = allProducts.map((p) => p.productId);
    let tagsMap = new Map();

    if (productIds.length > 0) {
      const productTagsData = await db
        .select({
          productId: productTags.productId,
          tagName: tags.tag_name,
        })
        .from(productTags)
        .leftJoin(tags, eq(productTags.tagId, tags.id))
        .where(inArray(productTags.productId, productIds));

      tagsMap = productTagsData.reduce((map, row) => {
        if (!map.has(row.productId)) {
          map.set(row.productId, []);
        }
        map.get(row.productId).push(row.tagName);
        return map;
      }, new Map());
    }

    const productsWithTags = allProducts.map((product) => ({
      ...product,
      tags: tagsMap.get(product.productId) || [],
    }));

    const totalCount = amountQuery[0]?.count;

    return {
      products: productsWithTags,
      meta: {
        pageIndex,
        perPage,
        totalCount,
      },
    };
  },
  {
    query: t.Object({
      productName: t.Optional(t.String()),
      productId: t.Optional(t.String()),
      status: t.Optional(t.String()),
      category: t.Optional(t.String()),
      brandId: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String())),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  }
);

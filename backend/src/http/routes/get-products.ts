import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import {
  brands,
  categories,
  discountCoupon,
  discountCouponToProducts,
  productCategories,
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
      categoryId,
      brandId,
      tags: filterTags,
      pageIndex,
    } = query;
    const perPage = 10;

    // Constrói a query base com JOINs para categorias e marcas
    const baseQuery = db
      .select({
        productId: products.product_id,
        productName: products.product_name,
        description: products.description,
        priceInCents: products.priceInCents,
        stock: products.stock,
        sku: products.sku,
        isFeatured: products.isFeatured,
        status: products.status,
        createdAt: products.createdAt,
        categoryIds:
          sql`ARRAY_AGG(DISTINCT ${productCategories.categoryId})`.as(
            "categoryIds"
          ),
        brandId: products.brandId,
      })
      .from(products)
      .leftJoin(
        productCategories,
        eq(products.product_id, productCategories.productId)
      )
      .groupBy(products.product_id)
      .leftJoin(brands, eq(products.brandId, brands.brand_id))
      .where(
        and(
          eq(products.storeId, storeId),
          productName
            ? ilike(products.product_name, `%${productName}%`)
            : undefined,
          productId ? eq(products.product_id, productId) : undefined,
          status && status !== "all"
            ? eq(
                products.status,
                status as "available" | "unavailable" | "archived"
              )
            : undefined,
          categoryId && categoryId !== "all"
            ? eq(productCategories.categoryId, categoryId)
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
                  .leftJoin(tags, eq(productTags.tagId, tags.tag_id))
                  .where(
                    and(
                      eq(productTags.productId, products.product_id),
                      inArray(tags.tag_id, filterTags)
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

    let couponsMap = new Map<
      string,
      Array<{
        code: string;
        discountType: "percentage" | "fixed";
        discountValue: number;
      }>
    >();

    if (productIds.length > 0) {
      const [productTagsData, productCoupons] = await Promise.all([
        db
          .select({
            productId: productTags.productId,
            tagName: tags.tag_name,
          })
          .from(productTags)
          .leftJoin(tags, eq(productTags.tagId, tags.tag_id))
          .where(inArray(productTags.productId, productIds)),

        db
          .select({
            productId: discountCouponToProducts.productId,
            code: discountCoupon.code,
            discountType: discountCoupon.discountType,
            discountValue: discountCoupon.discountValue,
          })
          .from(discountCouponToProducts)
          .innerJoin(
            discountCoupon,
            and(
              eq(
                discountCouponToProducts.couponId,
                discountCoupon.discount_coupon_id
              ),
              eq(discountCoupon.active, true)
            )
          )
          .where(inArray(discountCouponToProducts.productId, productIds)),
      ]);

      productTagsData.forEach((row) => {
        if (!tagsMap.has(row.productId)) {
          tagsMap.set(row.productId, new Set<string>());
        }
        if (row.tagName) {
          tagsMap.get(row.productId)!.add(row.tagName);
        }
      });

      productCoupons.forEach(
        ({ productId, code, discountType, discountValue }) => {
          if (code) {
            if (!couponsMap.has(productId)) {
              couponsMap.set(productId, []);
            }

            const type = discountType.toLowerCase() as "percentage" | "fixed";

            if (!["percentage", "fixed"].includes(type)) {
              console.error(
                `Invalid discount type: ${type} for product ${productId}`
              );
              return;
            }

            couponsMap.get(productId)!.push({
              code,
              discountType: type,
              discountValue: Number(discountValue),
            });
          }
        }
      );
    }

    const productsWithMetadata = allProducts.map((product) => ({
      ...product,
      tags: Array.from(tagsMap.get(product.productId) || []),
      coupons: couponsMap.get(product.productId) || [],
    }));

    const totalCount = amountQuery[0]?.count || 0;

    return {
      products: productsWithMetadata,
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
      categoryId: t.Optional(t.String()),
      brandId: t.Optional(t.String()),
      tags: t.Optional(t.Array(t.String())),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  }
);

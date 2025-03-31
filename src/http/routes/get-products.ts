import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { productImages, products } from "../../db/schema";
import { eq, ilike } from "drizzle-orm";

export const getProducts = new Elysia().get(
  "/products",
  async ({ query }) => {
    const { name, pageIndex } = query;
    const perPage = 10;

    const baseQuery = db
      .select({
        productId: products.id,
        productName: products.name,
        description: products.description,
        priceInCents: products.priceInCents,
        stock: products.stock,
        sku: products.sku,
        isFeatured: products.isFeatured,
        image: db
          .select({ url: productImages.url })
          .from(productImages)
          .where(eq(productImages.productId, products.id))
          .limit(1)
          .as("image"),
      })
      .from(products)
      .where(name ? ilike(products.name, `%${name}%`) : undefined)
      .offset(pageIndex * perPage)
      .limit(perPage);

    const productsList = await baseQuery;

    const totalCount = productsList.length;

    return {
      products: productsList,
      meta: {
        pageIndex,
        perPage,
        totalCount,
      },
    };
  },
  {
    query: t.Object({
      name: t.Optional(t.String()),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  }
);

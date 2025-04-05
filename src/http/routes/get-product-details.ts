import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import {
  products,
  productImages,
  categories,
  productCategories,
  tags,
  productTags,
  brands,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const getProductDetails = new Elysia().use(auth).get(
  "/products/:productId",
  async ({ getCurrentUser, params }) => {
    const { storeId } = await getCurrentUser();
    const { productId } = params;

    if (!storeId) {
      throw new UnauthorizedError();
    }

    // Consulta básica do produto
    const product = await db
      .select({
        productId: products.id,
        productName: products.product_name,
        description: products.description,
        priceInCents: products.priceInCents,
        stock: products.stock,
        sku: products.sku,
        status: products.status,
        brandId: products.brandId,
        isFeatured: products.isFeatured,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.id, productId))
      .then((res) => res[0]);

    if (!product) {
      return { error: "Produto não encontrado" };
    }

    // Busca as imagens (limitando a 4)
    const imagesData = await db
      .select({ url: productImages.url })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .limit(4);

    // Busca as categorias (exemplo usando join com tabela associativa)
    const categoryData = await db
      .select({
        id: categories.category_id,
        categoryName: categories.category_name,
      })
      .from(categories)
      .innerJoin(
        productCategories,
        eq(productCategories.categoryId, categories.category_id)
      )
      .where(eq(productCategories.productId, productId))
      .then((res) => res[0]);

    // Busca as tags (exemplo similar)
    const tagsData = await db
      .select({ tagId: tags.id, tagName: tags.tag_name })
      .from(tags)
      .innerJoin(productTags, eq(productTags.tagId, tags.id))
      .where(eq(productTags.productId, productId));

    let brandData = null;
    if (product.brandId) {
      brandData = await db
        .select({
          brandId: brands.brand_id,
          brandName: brands.brand_name,
        })
        .from(brands)
        .where(eq(brands.brand_id, product.brandId))
        .then((res) => res[0]);
    }

    return {
      productId: product.productId,
      productName: product.productName,
      description: product.description,
      priceInCents: product.priceInCents,
      stock: product.stock,
      sku: product.sku,
      status: product.status,
      category: categoryData ? categoryData.categoryName : "",
      subBrand: brandData ? brandData.brandName : "",
      tags: tagsData.map((tag) => tag.tagName),
      images: imagesData.map((img) => img.url),
      createdAt: product.createdAt,
    };
  },
  {
    params: t.Object({
      productId: t.String(),
    }),
  }
);

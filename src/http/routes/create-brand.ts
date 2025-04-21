import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { brands } from "../../db/schema";

export const createBrand = new Elysia().use(auth).post(
  "/brands",
  async ({ getCurrentUser, body }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const [newBrand] = await db
      .insert(brands)
      .values({
        brand_name: body.name,
        storeId,
        slug: body.name.toLowerCase().replace(/\s+/g, "-"), // Generate slug from name
      })
      .returning();
    return newBrand;
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
    }),
  }
);

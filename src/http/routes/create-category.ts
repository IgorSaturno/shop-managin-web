import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { categories } from "../../db/schema";

export const createCategory = new Elysia().use(auth).post(
  "/categories",
  async ({ getCurrentUser, body, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const [newCategory] = await db
      .insert(categories)
      .values({
        category_name: body.name,
        storeId,
      })
      .returning();

    return newCategory;
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
    }),
  }
);

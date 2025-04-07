import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { tags } from "../../db/schema";

export const createTag = new Elysia().use(auth).post(
  "/tags",
  async ({ getCurrentUser, body, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const [newTag] = await db
      .insert(tags)
      .values({
        tag_name: body.name,
        storeId,
        slug: body.name.toLowerCase().replace(/\s+/g, "-"), // Generate slug from name
      })
      .returning();

    return newTag;
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
    }),
  }
);

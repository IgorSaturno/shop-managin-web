import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { tags } from "../../db/schema";
import { and, eq } from "drizzle-orm";

export const deleteTag = new Elysia().use(auth).delete(
  "/tags/:tagId",
  async ({ getCurrentUser, params, set }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    const [tag] = await db
      .select()
      .from(tags)
      .where(and(eq(tags.tag_id, params.tagId), eq(tags.storeId, storeId)));

    if (!tag) {
      set.status = 404;
      return { message: "Tag not found" };
    }

    await db.delete(tags).where(eq(tags.tag_id, params.tagId));

    return { success: true };
  },
  {
    params: t.Object({
      tagId: t.String(),
    }),
  }
);

import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { tags } from "../../db/schema";
import { eq } from "drizzle-orm";

export const getTags = new Elysia().use(auth).get(
  "/tags",
  async ({ getCurrentUser }) => {
    const { storeId } = await getCurrentUser();
    if (!storeId) throw new Error("Unauthorized");

    return db
      .select({
        value: tags.tag_id,
        label: tags.tag_name,
      })
      .from(tags)
      .where(eq(tags.storeId, storeId));
  },
  {
    response: t.Array(
      t.Object({
        value: t.String(),
        label: t.String(),
      })
    ),
  }
);

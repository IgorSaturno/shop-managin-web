import Elysia, { t } from "elysia";
import { db } from "../../db/connection";

export const getTags = new Elysia().get("/tags", async () => {
  const allTags = await db.query.tags.findMany({
    columns: {
      id: true,
      tag_name: true,
      slug: true,
    },
  });
  return allTags;
});

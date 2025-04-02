import Elysia from "elysia";
import { db } from "../../db/connection";

export const getCategories = new Elysia().get("/categories", async () => {
  const allCategories = await db.query.categories.findMany({
    columns: {
      id: true,
      name: true,
    },
  });
  return allCategories;
});

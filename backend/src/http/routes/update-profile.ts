import Elysia, { t } from "elysia";
import { auth } from "../auth";

import { eq } from "drizzle-orm";
import { stores } from "../../db/schema";
import { db } from "../../db/connection";

export const updateProfile = new Elysia().use(auth).put(
  "/profile",
  async ({ getCurrentUser, set, body }) => {
    const { storeId } = await getCurrentUser();

    if (!storeId) {
      set.status = 401;
      throw new Error("Not authenticated");
    }

    const { name, description } = body;

    await db
      .update(stores)
      .set({
        store_name: name,
        description,
      })
      .where(eq(stores.id, storeId));

    set.status = 204;
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()),
    }),
  }
);

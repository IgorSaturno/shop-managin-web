import Elysia from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";

export const getManagedStore = new Elysia()
  .use(auth)
  .get("/managed-store", async ({ getCurrentUser }) => {
    const { storeId } = await getCurrentUser();

    if (!storeId) {
      throw new Error("User is not a manager.");
    }

    const managedStore = await db.query.stores.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, storeId);
      },
    });

    return managedStore;
  });

import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { stores, users } from "../../db/schema";

export const registerStore = new Elysia().post(
  "/stores",
  async ({ body, set }) => {
    const { storeName, managerName, email, phone } = body;

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: "manager",
      })
      .returning({
        id: users.id,
      });

    if (!manager) {
      throw new Error("Manager insertion failed");
    }

    await db.insert(stores).values({
      name: storeName,
      managerId: manager.id,
    });

    set.status = 204;
  },
  {
    body: t.Object({
      storeName: t.String(),
      managerName: t.String(),
      phone: t.String(),
      email: t.String({ format: "email" }),
    }),
  }
);

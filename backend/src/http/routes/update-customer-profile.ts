import Elysia, { t } from "elysia";
import { auth } from "../auth";
import { db } from "../../db/connection";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

export const updateCustomerProfile = new Elysia().use(auth).put(
  "/profile/customer",
  async ({ getCurrentUser, set, body }) => {
    const currentUser = await getCurrentUser();
    // Aqui, certifique-se de que o usuário tem a role "customer"
    if (!currentUser || currentUser.role !== "customer") {
      set.status = 401;
      throw new UnauthorizedError();
    }

    const { name, email, phone, cep, streetName, number, complement } = body;

    // Atualiza os dados do usuário, incluindo os campos opcionais
    await db
      .update(users)
      .set({
        name,
        email,
        phone,
        ...(cep ? { cep } : {}),
        ...(streetName ? { streetName } : {}),
        ...(number ? { number } : {}),
        ...(complement ? { complement } : {}),
      })
      .where(eq(users.id, currentUser.id));

    set.status = 204;
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: "email" }),
      phone: t.String(),
      cep: t.Optional(t.String()),
      streetName: t.Optional(t.String()),
      number: t.Optional(t.String()),
      complement: t.Optional(t.String()),
    }),
  }
);

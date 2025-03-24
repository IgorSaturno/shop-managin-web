import Elysia, { t } from "elysia";
import { db } from "../../db/connection";
import { createId } from "@paralleldrive/cuid2";
import { authLinks } from "../../db/schema";
import { env } from "../../env";
import { mail } from "../../lib/mail";
import nodemailer from "nodemailer";

export const sendAuthLink = new Elysia().post(
  "/authenticate",
  async ({ body }) => {
    const { email } = body;

    const userFromEmail = await db.query.users.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email);
      },
    });
    if (!userFromEmail) {
      throw new Error("User not found.");
    }

    const authLinkCode = createId();

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    });

    // Enviar email

    const authLink = new URL("/auth-links/authenticate", env.API_BASE_URL);

    authLink.searchParams.set("code", authLinkCode);
    authLink.searchParams.set("redirect", env.AUTH_REDIRECT_URL);

    const info = await mail.sendMail({
      from: {
        name: "Shop-Managin",
        address: "hi@shopmanagin.com",
      },
      to: email,
      subject: "Authenticate to Shop Managin",
      text: `Use the following link to authenticate on Shop Managin: ${authLink.toString()}`,
    });
    console.log(nodemailer.getTestMessageUrl(info));
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
    }),
  }
);

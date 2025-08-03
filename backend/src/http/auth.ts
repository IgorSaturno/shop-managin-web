import jwt from "@elysiajs/jwt";
import Elysia, { t, type Static } from "elysia";
import { env } from "../env";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { NotAManagerError } from "./errors/not-a-manager-error";

const jwtPayload = t.Object({
  sub: t.String(),
  storeId: t.Optional(t.String()),
});

export const auth = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    NOT_A_MANAGER: NotAManagerError,
  })
  .onError(({ error, code, set }) => {
    switch (code) {
      case "UNAUTHORIZED": {
        set.status = 401;
        return { code, message: error.message };
      }
      case "NOT_A_MANAGER": {
        set.status = 401;
        return { code, message: error.message };
      }
    }
  })
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    })
  )
  .derive({ as: "scoped" }, ({ jwt, cookie }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload);

        if (cookie.auth) {
          cookie.auth.value = token;
          cookie.auth.httpOnly = true;
          cookie.auth.maxAge = 60 * 60 * 24 * 7; // 7 dias
          cookie.auth.path = "/";
        } else {
          throw new Error("Cookie 'auth' não está disponível.");
        }
      },

      signOut: async () => {
        if (cookie.auth) {
          cookie.auth.remove();
        } else {
          throw new Error("Cookie 'auth' não está disponível.");
        }
      },

      getCurrentUser: async () => {
        const authCookie = cookie.auth?.value;

        const payload = await jwt.verify(authCookie);

        if (!payload) {
          throw new UnauthorizedError();
        }

        return {
          userId: payload.sub,
          storeId: payload.storeId,
        };
      },
    };
  });

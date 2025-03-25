import { Elysia, t } from "elysia";
import { registerStore } from "./routes/register-store";
import { sendAuthLink } from "./routes/send-auth-link";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { signOut } from "./routes/sign-out";
import { getProfile } from "./routes/get-profile";
import { getManagedStore } from "./routes/get-managed-store";
import { getOrderDetails } from "./routes/get-order-details";
import { approveOrder } from "./routes/approve-order";
import { cancelOrder } from "./routes/cancel-order";
import { deliverOrder } from "./routes/deliver-order";
import { dispatchOrder } from "./routes/dispatch-order";

const app = new Elysia()
  .use(registerStore)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedStore)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(cancelOrder)
  .use(deliverOrder)
  .use(dispatchOrder)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION": {
        set.status = error.status;
        return error.toResponse();
      }
      default: {
        console.error(error);
        return new Response(null, { status: 500 });
      }
    }
  });

app.listen(3333, () => {
  console.log("🔥  HTTP server running!");
});

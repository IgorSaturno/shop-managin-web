import { api } from "@/lib/axios";

export interface ReturnOrderParams {
  orderId: string;
}

export async function returnOrder({ orderId }: ReturnOrderParams) {
  await api.patch(`/orders/${orderId}/return`);
}

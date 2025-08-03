import { api } from "@/lib/axios";

export interface RefuseOrderParams {
  orderId: string;
}

export async function refuseOrder({ orderId }: RefuseOrderParams) {
  await api.patch(`/orders/${orderId}/refuse`);
}

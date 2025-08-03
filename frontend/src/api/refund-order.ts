import { api } from "@/lib/axios";

export interface RefundOrderParams {
  orderId: string;
}

export async function refundOrder({ orderId }: RefundOrderParams) {
  await api.patch(`/orders/${orderId}/refund`);
}

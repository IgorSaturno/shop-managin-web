import { api } from "@/lib/axios";

export interface FailedDeliveryOrderParams {
  orderId: string;
}

export async function failedDeliveryOrder({
  orderId,
}: FailedDeliveryOrderParams) {
  await api.patch(`/orders/${orderId}/failed-delivery`);
}

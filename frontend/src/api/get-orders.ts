import { api } from "@/lib/axios";

export interface GetOrdersQuery {
  pageIndex?: number | null;
  orderId?: string | null;
  customerName?: string | null;
  status?: string | null;
}

export interface GetOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status:
      | "pending"
      | "approved"
      | "refused"
      | "refunded"
      | "returned"
      | "processing"
      | "in_transit"
      | "delivering"
      | "delivered"
      | "canceled"
      | "failed_delivery";
    customerName: string;
    total: number;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getOrders({
  pageIndex,
  orderId,
  customerName,
  status,
}: GetOrdersQuery) {
  const response = await api.get<GetOrdersResponse>("/orders", {
    params: {
      pageIndex,
      orderId,
      customerName,
      status: status,
    },
  });

  return response.data;
}

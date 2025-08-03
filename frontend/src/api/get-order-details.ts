import { api } from "@/lib/axios";

export interface GetOrderDetailsParams {
  orderId: string;
}

export interface GetOrderDetailsResponse {
  id: string;
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
  totalInCents: number;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  orderItems: {
    id: string;
    priceInCents: number;
    quantity: number;
    product: {
      product_name: string;
    };
  }[];

  cep: string;
  streetName: string;
  number: string;
  complement?: string;
}

export async function getOrderDetails({ orderId }: GetOrderDetailsParams) {
  const response = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`);

  return response.data;
}

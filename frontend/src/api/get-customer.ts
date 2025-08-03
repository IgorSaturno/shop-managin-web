import { api } from "@/lib/axios";

export interface GetCustomersQuery {
  pageIndex?: number | null;
  customerId?: string | null;
  customerName?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface GetCustomersResponse {
  customers: {
    customerId: string;
    customerName: string;
    email: string;
    phone: string | null;
    orderCount: number;
    createdAt: string;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

export async function getCustomers({
  pageIndex,
  customerId,
  customerName,
  email,
  phone,
}: GetCustomersQuery) {
  const response = await api.get<GetCustomersResponse>("/customers", {
    params: {
      pageIndex,
      customerId,
      name: customerName,
      email,
      phone,
    },
  });

  return response.data;
}

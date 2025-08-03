import { api } from "@/lib/axios";

export interface GetCustomerHistoryParams {
  customerId: string;
}

export interface GetCustomerHistoryResponse {
  id: string;
  createdAt: string;
  totalInCents: number;
}

export async function getCustomerHistory({
  customerId,
}: GetCustomerHistoryParams) {
  const response = await api.get<GetCustomerHistoryResponse[]>(
    `/customers/${customerId}/orders`,
  );
  return response.data;
}

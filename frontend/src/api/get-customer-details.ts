import { api } from "@/lib/axios";

export interface GetCustomerDetailsParams {
  customerId: string;
}

export interface GetCustomerDetailsResponse {
  customerId: string;
  customerName: string;
  email: string;
  phone: string | null;
  cep: string;
  streetName: string;
  number: string;
  complement?: string;
  createdAt: string;
  orderCount: number;
}

export async function GetCustomerDetails({
  customerId,
}: GetCustomerDetailsParams) {
  const response = await api.get<GetCustomerDetailsResponse>(
    `/customers/${customerId}`,
  );
  return response.data;
}

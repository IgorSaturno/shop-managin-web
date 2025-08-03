import { api } from "@/lib/axios";

export interface GetManagedStoreResponse {
  id: string;
  store_name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  description: string | null;
  managerId: string | null;
  avatarUrl: string | null;
}

export async function getManagedStore() {
  const response = await api.get<GetManagedStoreResponse>("/managed-store");

  return response.data;
}

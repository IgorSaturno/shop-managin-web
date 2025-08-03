import { api } from "@/lib/axios";

export interface CreateTagResponse {
  tag_id: string;
  tag_name: string;
  slug: string;
  storeId: string;
}

export async function createTag(name: string) {
  const response = await api.post<CreateTagResponse>("/tags", { name });
  return response.data;
}

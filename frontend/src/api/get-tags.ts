import { api } from "@/lib/axios";

export interface GetTagsResponse {
  tag_id: string;
  tag_name: string;
  slug: string;
  storeId: string;
}

export async function getTags(): Promise<GetTagsResponse[]> {
  const response = await api.get<{ value: string; label: string }[]>("/tags");
  return response.data.map((tag) => ({
    tag_id: tag.value,
    tag_name: tag.label,
    slug: "",
    storeId: "",
  }));
}

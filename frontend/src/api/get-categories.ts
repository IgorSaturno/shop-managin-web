import { api } from "@/lib/axios";

export interface GetCategoryResponse {
  category_id: string;
  category_name: string;
  storeId: string;
}

export async function getCategories(): Promise<GetCategoryResponse[]> {
  const response =
    await api.get<{ value: string; label: string }[]>("/categories");
  return response.data.map((category) => ({
    category_id: category.value,
    category_name: category.label,
    storeId: "",
  }));
}

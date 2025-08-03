import { api } from "@/lib/axios";

export async function deleteCategory(categoryId: string) {
  await api.delete(`/categories/${categoryId}`);
}

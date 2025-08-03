import { api } from "@/lib/axios";

export async function deleteTag(tagId: string) {
  await api.delete(`/tags/${tagId}`);
}

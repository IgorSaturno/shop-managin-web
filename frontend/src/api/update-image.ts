import { api } from "@/lib/axios";

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!response.data.url) {
    throw new Error("Erro ao enviar imagem");
  }

  return response.data;
}

import { api } from "@/lib/axios";

export type ProductFormData = {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: "available" | "unavailable" | "archived";
  categoryId: string;
  brandId: string;
  tags: string[];
  images: string[];
};

export async function updateProduct(data: ProductFormData) {
  const payload = {
    ...data,
    status: data.status, // Já está no formato correto
    images: data.images, // Array de URLs
  };
  const response = await api.put(`/products/${data.id}`, payload);
  return response.data;
}

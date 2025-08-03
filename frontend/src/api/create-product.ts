import { api } from "@/lib/axios";

export interface CreateProductPayload {
  name: string;
  description: string;
  characteristics: string;
  priceInCents: number;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isArchived: boolean;
  status: string;
  categoryId: string;
  brandId: string;
  images: string[]; // array de URLs
  video?: string;
}

export async function createProduct(payload: CreateProductPayload) {
  const response = await api.post("/products", payload);
  return response.data;
}

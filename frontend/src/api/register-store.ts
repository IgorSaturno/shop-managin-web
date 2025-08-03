import { api } from "@/lib/axios";

export interface registerStoreBody {
  storeName: string;
  managerName: string;
  email: string;
  phone: string;
}

export async function registerStore({
  storeName,
  managerName,
  phone,
  email,
}: registerStoreBody) {
  await api.post("/stores", { storeName, managerName, phone, email });
}

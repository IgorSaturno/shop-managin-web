import { api } from "@/lib/axios";

interface UpdateCustomerProfileBody {
  name: string;
  email: string;
  phone: string;
  cep?: string | null;
  streetName?: string | null;
  number?: string | null;
  complement?: string | null;
}

export async function updateCustomerProfile({
  name,
  email,
  phone,
  cep,
  streetName,
  number,
  complement,
}: UpdateCustomerProfileBody) {
  await api.put("/profile/customer", {
    name,
    email,
    phone,
    cep,
    streetName,
    number,
    complement,
  });
}

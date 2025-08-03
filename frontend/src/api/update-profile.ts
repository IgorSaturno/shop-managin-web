import { api } from "@/lib/axios";

interface UpdateProfileBody {
  name: string;
  description: string | null;
  // avatarUrl: string | null;
}

export async function updateProfile({
  name,
  description,
  // avatarUrl,
}: UpdateProfileBody) {
  await api.put("/profile", {
    name,
    description,
    // avatarUrl,
  });
}

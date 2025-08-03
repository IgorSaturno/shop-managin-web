import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const updateUser = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
});

type UpdateUser = z.infer<typeof updateUser>;

export function User() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateUser>();

  async function handleUpdateUser(data: UpdateUser) {
    try {
      console.log(data);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Dados de usuário atualizados.", {
        action: {
          label: "Reenviar",
          onClick: () => handleUpdateUser(data),
        },
      });
    } catch {
      toast.error("Erro ao tentar atualizar dados.");
    }
  }

  return (
    <>
      <Helmet title="Users" />
      <div className="flex flex-col">
        <div className="border-b py-3">
          <h1 className="text-xl font-semibold">Profile</h1>
          <p className="text-sm">
            É assim que outras pessoas verão você no site.{" "}
          </p>
        </div>
        <div>
          <form
            onSubmit={handleSubmit(handleUpdateUser)}
            className="w-[720px] space-y-4 py-3"
          >
            <div className="space-y-2">
              <Label htmlFor="username" className="text-md font-semibold">
                Username
              </Label>
              <Input
                placeholder="Digite seu nome fantasia..."
                id="username"
                type="text"
                {...register("username")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-md font-semibold">
                Email
              </Label>
              <Input id="email" type="email" {...register("email")} />
            </div>

            <Button disabled={isSubmitting} className="" type="submit">
              Update profile
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

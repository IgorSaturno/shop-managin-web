import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

const customerFiltersSchema = z.object({
  customerId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

type CustomerFiltersSchema = z.infer<typeof customerFiltersSchema>;

export function CustomerFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const customerId = searchParams.get("customerId");
  const phone = searchParams.get("phone");
  const email = searchParams.get("email");

  const { register, handleSubmit, reset } = useForm<CustomerFiltersSchema>({
    resolver: zodResolver(customerFiltersSchema),
    defaultValues: {
      customerId: customerId ?? "",
      phone: phone ?? "",
      email: email ?? "",
    },
  });

  function handleFilter({ customerId, phone, email }: CustomerFiltersSchema) {
    setSearchParams((state) => {
      if (customerId) {
        state.set("customerId", customerId);
      } else {
        state.delete("customerId");
      }

      if (phone) {
        state.set("phone", phone);
      } else {
        state.delete("phone");
      }

      if (email) {
        state.set("email", email);
      } else {
        state.delete("email");
      }

      state.set("page", "1");

      return state;
    });
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete("customerId");
      state.delete("phone");
      state.delete("email");
      state.set("page", "1");

      return state;
    });

    reset({
      customerId: "",
      phone: "",
      email: "",
    });
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
        <Input
          placeholder="ID do cliente"
          className="h-8 w-full sm:w-[120px]"
          {...register("customerId")}
        />
        <Input
          placeholder="Email"
          className="h-8 w-full sm:w-[200px]"
          {...register("email")}
        />
        <Input
          placeholder="Telefone"
          className="h-8 w-full sm:w-[180px]"
          {...register("phone")}
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
          <Button
            type="submit"
            variant="secondary"
            size="xs"
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 h-4 w-4" />
            Filtrar resultados
          </Button>

          <Button
            type="button"
            variant="outline"
            size="xs"
            className="w-full sm:w-auto"
            onClick={handleClearFilters}
          >
            <X className="mr-2 h-4 w-4" />
            Remover filtros
          </Button>
        </div>
      </div>
    </form>
  );
}

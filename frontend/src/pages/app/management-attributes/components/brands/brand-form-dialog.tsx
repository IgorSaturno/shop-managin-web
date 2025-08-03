import { createBrand } from "@/api/create-brand";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface BrandFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BrandFormDialog({ open, onOpenChange }: BrandFormDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (value: { name: string }) => {
    try {
      if (!value.name.trim()) {
        toast.warning("Digite um nome para a marca");
        return;
      }
      await createBrand(value.name);
      await queryClient.invalidateQueries({ queryKey: ["brands"] });
      form.reset();
      onOpenChange(false);
      toast.success("Marca criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      toast.error("Erro ao criar marca.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Marca</DialogTitle>
          <DialogDescription>Digite o nome da nova Marca.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da marca" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

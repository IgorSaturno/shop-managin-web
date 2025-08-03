import { createCoupon } from "@/api/create-coupon";
import { Button } from "@/components/ui/button";
import { DateRangePickerValidate } from "@/components/ui/date-range-picker-validate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const couponFormSchema = z
  .object({
    code: z.string().min(3, "Código deve ter pelo menos 3 caracteres"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(1, "Valor deve ser maior que 0"),
    minimumOrder: z.string().optional(),
    maxUses: z.number().min(1).optional(),
    validFrom: z
      .date()
      .refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "A data inicial não pode ser no passado",
      }),
    validUntil: z.date(),
    active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.validUntil < data.validFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Data final deve ser após a data inicial",
        path: ["validUntil"],
      });
    }
  });

type CouponFormValues = z.infer<typeof couponFormSchema>;

export function CouponFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minimumOrder: "",
      maxUses: undefined,
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      active: true,
    },
  });

  async function onSubmit(values: CouponFormValues) {
    try {
      await createCoupon({
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        minimumOrder: values.minimumOrder,
        maxUses: values.maxUses,
        validFrom: values.validFrom.toISOString(),
        validUntil: values.validUntil.toISOString(),
        active: values.active,
      });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Cupom criado!");
      onSuccess();
      onOpenChange(false);
      form.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Erro ao criar cupom");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Cupom</DialogTitle>
          <DialogDescription>Preencha os dados do cupom</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="EXEMPLO123" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Desconto</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentual</SelectItem>
                        <SelectItem value="fixed">Valor Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minimumOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pedido Mínimo</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxUses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usos Máximos</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período</FormLabel>
                  <FormControl>
                    <DateRangePickerValidate
                      date={{
                        from: field.value,
                        to: form.getValues("validUntil"),
                      }}
                      onDateChange={(range) => {
                        if (range?.from) {
                          field.onChange(range.from);
                          form.setValue("validUntil", range.to!);
                        }
                      }}
                      disabled={{ before: new Date() }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                  <FormLabel>Ativo</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Criar Cupom
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

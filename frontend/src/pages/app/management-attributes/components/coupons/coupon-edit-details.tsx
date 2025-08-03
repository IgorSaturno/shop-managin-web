import { z } from "zod";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateCoupon } from "@/api/update-coupon";
import { Loader2 } from "lucide-react";
import { Coupon } from "@/api/get-coupons";
import { api } from "@/lib/axios";
import { DateRangePickerValidate } from "@/components/ui/date-range-picker-validate";

interface CouponEditDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon: Coupon;
  onSuccess: () => void;
}

const couponEditSchema = z
  .object({
    id: z.string(),
    code: z.string().min(1, "Código é obrigatório"),
    discountType: z.enum(["percentage", "fixed"]),
    discountValue: z.number().min(0.01, "Valor deve ser maior que 0"),
    minimumOrder: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    maxUses: z
      .number()
      .min(1, "Mínimo 1 uso")
      .optional()
      .nullable()
      .transform((val) => val ?? undefined),
    validFrom: z
      .date()
      .refine((date) => !isNaN(date.getTime()), "Data inicial inválida")
      .refine(
        (date) => date >= new Date(new Date().setHours(0, 0, 0, 0)),
        "A data inicial não pode ser no passado",
      ),
    validUntil: z.date(),
    active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.validUntil < data.validFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A data final deve ser após a data inicial",
        path: ["validUntil"],
      });
    }
  });

type CouponEditSchema = z.infer<typeof couponEditSchema>;

export function CouponEditDetails({
  open,
  onOpenChange,
  coupon,
  onSuccess,
}: CouponEditDetailsProps) {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues, // getValues vem do react-hook-form
    setError: setFormError,
    clearErrors,
  } = useForm<CouponEditSchema>({
    resolver: zodResolver(couponEditSchema),
    defaultValues: {
      ...coupon,
      minimumOrder: coupon.minimumOrder?.toString() ?? "",
      maxUses: coupon.maxUses ?? undefined,
      validFrom: new Date(coupon.validFrom),
      validUntil: new Date(coupon.validUntil),
    },
  });

  const discountType = useWatch({ control, name: "discountType" });
  const code = useWatch({ control, name: "code" });

  useEffect(() => {
    let isMounted = true;
    const checkCodeAvailability = async (newCode: string) => {
      if (newCode === coupon.code) return;

      try {
        const response = await api.get(
          `/discount-coupons/check-code?code=${newCode}`,
        );

        if (isMounted) {
          if (!response.data.available) {
            setFormError("code", {
              type: "manual",
              message: "Este código já está em uso",
            });
          } else {
            setFormError("code", {});
          }
        }
      } catch (error) {
        console.error("Erro ao verificar código:", error);
      }
    };

    const debounceCheck = setTimeout(() => {
      if (code && code !== coupon.code) {
        checkCodeAvailability(code);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(debounceCheck);
    };
  }, [code, coupon.code, setFormError]);

  async function onSave(data: CouponEditSchema) {
    try {
      // ... suas validações manuais antes do patch
      await updateCoupon(coupon.id, {
        ...data,
        validFrom: data.validFrom.toISOString(),
        validUntil: data.validUntil.toISOString(),
      });

      toast.success("Cupom atualizado com sucesso!");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      // ← AQUI: trata erro Axios/500 antes de acessar err.response.data
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
        return;
      }

      // a seguir, seus erros customizados
      if (err.message === "Código já está em uso") {
        setFormError("code", {
          type: "manual",
          message: "Este código já está em uso",
        });
        toast.error("Não foi possível atualizar: Código já está em uso");
        return;
      }

      if (err.message.includes("data")) {
        toast.error(err.message);
        setFormError(
          err.message.includes("inicial") ? "validFrom" : "validUntil",
          { type: "manual", message: err.message },
        );
        return;
      }

      // fallback genérico
      toast.error("Erro ao atualizar cupom");
      console.error("Erro detalhado:", err);
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Cupom</DialogTitle>
          <DialogDescription>Altere os dados do cupom</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Controller
            name="code"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  {...field}
                  className={fieldState.error ? "border-red-500" : ""}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldState.error.type === "manual"
                      ? "Este código já está em uso"
                      : fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="discountType"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label>Tipo de Desconto *</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        Porcentagem (%)
                      </SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="discountValue"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="value">Valor *</Label>
                  <Input
                    id="value"
                    type="number"
                    step={discountType === "percentage" ? "1" : "0.01"}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="minimumOrder"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="min-order">Pedido Mínimo (R$)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    step="0.01"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="maxUses"
              control={control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="max-uses">Usos Máximos</Label>
                  <Input
                    id="max-uses"
                    type="number"
                    min="1"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                  {fieldState.error && (
                    <p className="mt-1 text-sm text-red-500">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="validFrom"
            control={control}
            render={({ field }) => (
              <DateRangePickerValidate
                date={{
                  from: field.value,
                  to: getValues("validUntil"), // getValues vem do react-hook-form
                }}
                onDateChange={(range) => {
                  if (range?.from) {
                    clearErrors("validFrom");
                    setValue("validFrom", range.from);
                  }
                  if (range?.to) {
                    clearErrors("validUntil");
                    setValue("validUntil", range.to);
                  }
                }}
                disabled={{ before: new Date() }}
                fromDate={new Date()}
              />
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

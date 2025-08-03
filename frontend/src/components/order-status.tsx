export type OrderStatus =
  | "pending"
  | "approved"
  | "refused"
  | "refunded"
  | "returned"
  | "processing"
  | "in_transit"
  | "delivering"
  | "delivered"
  | "canceled"
  | "failed_delivery";

interface OrderStatusProps {
  status: OrderStatus;
}

const orderStatusMap: Record<OrderStatus, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  refused: "Recusado",
  refunded: "Reembolsado",
  returned: "Devolvido",
  processing: "Processando",
  in_transit: "Em transito",
  delivering: "Em entrega",
  delivered: "Entregue",
  canceled: "Cancelado",
  failed_delivery: "Falha na entrega",
};

export function OrderStatus({ status }: OrderStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {status === "pending" && (
        <span className="h-2 w-2 rounded-full bg-slate-400" />
      )}
      {status === "approved" && (
        <span className="h-2 w-2 rounded-full bg-emerald-300" />
      )}
      {["canceled", "refused", "failed_delivery"].includes(status) && (
        <span className="h-2 w-2 rounded-full bg-rose-500" />
      )}
      {status === "delivered" && (
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      )}
      {status === "refunded" && (
        <span className="h-2 w-2 rounded-full bg-gray-100" />
      )}
      {["processing", "delivering", "in_transit", "returned"].includes(
        status,
      ) && <span className="h-2 w-2 rounded-full bg-amber-500" />}
      <span className="font-medium text-muted-foreground">
        {orderStatusMap[status]}
      </span>
    </div>
  );
}

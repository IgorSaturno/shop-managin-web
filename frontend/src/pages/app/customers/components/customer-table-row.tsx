import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";

import { History, Search } from "lucide-react";
import { CustomerDetails } from "./customer-details";
import { CustomerHistory } from "./customer-history";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CustomerTableRowProps {
  customer: {
    customerId: string;
    customerName: string;
    email: string;
    phone?: string | null;
    orderCount: number;
    createdAt: string;
  };
}

export function CustomerTableRow({ customer }: CustomerTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <TableRow>
      <TableCell className="sm:w-[64px]">
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Informações do cliente</span>
            </Button>
          </DialogTrigger>
          <CustomerDetails
            open={isDetailsOpen}
            customerId={customer.customerId}
          />
        </Dialog>
      </TableCell>

      <TableCell className="font-mono text-xs font-medium">
        {customer.customerId}
      </TableCell>

      <TableCell className="text-muted-foreground">
        {" "}
        {formatDistanceToNow(customer.createdAt, {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="sm:w-[120px]">{customer.email}</TableCell>
      <TableCell className="font-medium">{customer.customerName}</TableCell>
      <TableCell className="sm:w-[100px]">{customer.orderCount}</TableCell>
      <TableCell className="sm:w-[100px]">{customer.phone || "N/A"}</TableCell>

      {/* <TableCell className="sm:w-[100px]">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              client.status === "Ativo" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="font-medium text-muted-foreground">
            {client.status}
            Ativo
          </span>
        </div>
      </TableCell> */}
      <TableCell className="sm:w-[132px]">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="xs">
                <History className="mr-2 h-3 w-3" />
                Histórico
              </Button>
            </DialogTrigger>
            <CustomerHistory
              customerId={customer.customerId}
              customerName={customer.customerName}
              open={true}
            />
          </Dialog>
        </div>
      </TableCell>
    </TableRow>
  );
}

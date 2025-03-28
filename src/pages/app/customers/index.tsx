import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";

import { CustomerFilters } from "./components/customer-filters";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomerTableRow } from "./components/customer-table-row";
import { Pagination } from "@/components/pagination";
import { getCustomers } from "@/api/get-customers";

export function Customers() {
  const [searchParams, setSearchParams] = useSearchParams();

  const name = searchParams.get("name");
  const email = searchParams.get("email");

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get("page") ?? "1");

  const { data: result } = useQuery({
    queryKey: ["customers", pageIndex, name, email],
    queryFn: () => getCustomers({ pageIndex, name, email }),
  });

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set("page", (pageIndex + 1).toString());
      return state;
    });
  }

  return (
    <>
      <Helmet title="Clientes" />
      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Clientes
        </h1>

        <CustomerFilters />

        <div className="overflow-x-auto">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[100px]">Identificador</TableHead>
                  <TableHead className="w-[120px]">E-mail</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[164px]">Telefone</TableHead>
                  <TableHead className="w-[100px]">N.Compras</TableHead>
                  <TableHead className="w-[100px]">Cadastrado em</TableHead>
                  <TableHead className="w-[132px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result?.customers.map((customer) => (
                  <CustomerTableRow key={customer.id} customer={customer} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {result && (
          <Pagination
            onPageChange={handlePaginate}
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={result.meta.perPage}
          />
        )}
      </div>
    </>
  );
}

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  onEdit: (item: TData) => void;
  onDelete: (item: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  // Adiciona coluna de ações dinamicamente
  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(row.original)}
        >
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(row.original)}
        >
          Excluir
        </Button>
      </div>
    ),
  };

  const table = useReactTable({
    data,
    columns: [...columns, actionColumn],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getCanSort() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        header.column.toggleSorting(
                          header.column.getIsSorted() === "asc",
                        )
                      }
                    >
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {loading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {table.getAllColumns().map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                Nenhum resultado encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

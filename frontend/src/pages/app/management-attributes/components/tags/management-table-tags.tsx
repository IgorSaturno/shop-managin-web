// management-table-tags.tsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getTags } from "@/api/get-tags";
import { deleteTag } from "@/api/delete-tag";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TagFormDialog } from "./tag-form-dialog";
import { CirclePlus, Trash } from "lucide-react";
import { toast } from "sonner";

export function ManagementTableTags() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: tags, isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId);
      await queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag removida com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tag:", error);
      toast.error("Erro ao excluir tag.");
    }
  };

  return (
    <div className="rounded-md border p-1">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
        >
          <CirclePlus className="h-4 w-4" />
          Nova Tag
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">ID</TableHead>
            <TableHead className="w-[50%]">Nome</TableHead>
            <TableHead className="w-[20%]"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Carregando tags...
              </TableCell>
            </TableRow>
          ) : tags?.length ? (
            tags.map((tag) => (
              <TableRow key={tag.tag_id}>
                <TableCell className="font-mono text-xs">
                  {tag.tag_id}
                </TableCell>
                <TableCell className="font-medium">{tag.tag_name}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleDeleteTag(tag.tag_id)}
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Nenhuma tag cadastrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TagFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["tags"] })}
      />
    </div>
  );
}

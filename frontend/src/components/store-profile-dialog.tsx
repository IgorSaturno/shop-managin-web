import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  getManagedStore,
  GetManagedStoreResponse,
} from "@/api/get-managed-store";
import { updateProfile } from "@/api/update-profile";

import { Button } from "./ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";
// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { uploadImage } from "@/api/update-image";

const storeProfileSchema = z.object({
  store_name: z.string().min(1),
  description: z.string().nullable(),
  // avatarUrl: z.string().nullable(),
});

type StoreProfileSchema = z.infer<typeof storeProfileSchema>;

export function StoreProfileDialog() {
  const queryClient = useQueryClient();

  const { data: managedStore } = useQuery({
    queryKey: ["managed-store"],
    queryFn: getManagedStore,
    staleTime: Infinity,
  });

  // const [previewImage, setPreviewImage] = useState<string>(
  //   managedStore?.avatarUrl ?? "/default-avatar.png",
  // );
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: {
      store_name: managedStore?.store_name ?? "",
      description: managedStore?.description ?? "",
      // avatarUrl: managedStore?.avatarUrl ?? null,
    },
  });

  useEffect(() => {
    if (managedStore) {
      reset({
        store_name: managedStore.store_name,
        description: managedStore.description,
      });
    }
  }, [managedStore, reset]);

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ name, description /**avatarUrl */ }) {
      const { cached } = updateManagedStoreCache({
        store_name: name,
        description,
        // avatarUrl,
      });

      return { previousProfile: cached };
    },
    onError(_error, _variables, context) {
      if (context?.previousProfile) {
        updateManagedStoreCache(context.previousProfile);
      }
    },
  });

  function updateManagedStoreCache({
    store_name,
    description,
    // avatarUrl,
  }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<GetManagedStoreResponse>([
      "managed-store",
    ]);

    if (cached) {
      queryClient.setQueryData<GetManagedStoreResponse>(["managed-store"], {
        ...cached,
        store_name,
        description,
        // avatarUrl,
      });
    }

    return { cached };
  }

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      //   let avatarUrl = managedStore?.avatarUrl ?? null;

      //   if (selectedFile) {
      //     const uploadResponse = await uploadImage(selectedFile);
      //     avatarUrl = uploadResponse.url; // Supondo que o retorno da API tenha a URL da imagem
      //   }

      await updateProfileFn({
        name: data.store_name,
        description: data.description,
        // avatarUrl: data.avatarUrl,
      });

      toast.success("Perfil atualizado com sucesso!");
    } catch {
      toast.error("Falha ao atualizar o perfil, tente novamente");
    }
  }

  // function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setPreviewImage(URL.createObjectURL(file));
  //   }
  // }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          {/* <div className="grid grid-cols-4 items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={previewImage ?? "/default-avatar.png"}
                alt="Avatar da loja"
              />
              <AvatarFallback>LOJA</AvatarFallback>
            </Avatar>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div> */}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input
              className="col-span-3"
              id="name"
              {...register("store_name")}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              {...register("description")}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

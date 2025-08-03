import { Building, ChevronDown, LogOut } from "lucide-react";

import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { getManagedStore } from "@/api/get-managed-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/get-profile";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { StoreProfileDialog } from "./store-profile-dialog";
import { useState } from "react";
import { signOut } from "@/api/sign-out";
import { useNavigate } from "react-router-dom";

export function AccountMenu() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: managedStore, isLoading: isLoadingManagedStore } = useQuery({
    queryKey: ["managed-store"],
    queryFn: getManagedStore,
    staleTime: Infinity,
  });

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate("/sign-in", { replace: true });
    },
  });

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex select-none items-center gap-2"
          >
            {isLoadingManagedStore ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              managedStore?.store_name
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-auto">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span>{profile?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {profile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
              <Building className="mr-2 h-4 w-4" />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            asChild
            className="text-rose-500 dark:text-rose-400"
            disabled={isSigningOut}
          >
            <button className="w-full" onClick={() => signOutFn()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogOpen && managedStore && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <StoreProfileDialog />
        </Dialog>
      )}
    </Dialog>
  );
}

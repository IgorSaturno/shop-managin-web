import { toast } from "sonner";

export function showToast(
  message: string,
  type: "success" | "error" | "warning" = "success",
) {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "warning":
      toast.warning(message);
      break;
    default:
      toast(message);
  }
}

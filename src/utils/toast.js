import { toast } from "sonner";

export const toastSuccess = (msg) => toast.success(msg);
export const toastError = (msg) => toast.error(msg);
export const toastInfo = (msg) => toast(msg);
export const toastLoading = (msg) => toast.loading(msg);
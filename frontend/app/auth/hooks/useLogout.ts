import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "../api/auth.api";
import useAuthStore from "../stores/auth.store";

interface UseLogoutReturn {
  logout: () => void;
  isLoggingOut: boolean;
}

export const useLogout = (): UseLogoutReturn => {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logoutMutation = useMutation({
    mutationFn: logoutApi,
    onSettled: () => {
      clearAuth();
      router.push("/auth/login");
    },
  });

  return {
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
  };
};

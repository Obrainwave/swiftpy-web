import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { loginApi } from "../api/auth.api";
import useAuthStore from "../stores/auth.store";
import type { LoginPayload } from "../types/auth.types";

interface UseLoginReturn {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  isLoggingIn: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setSession(data.user, data.access_token, data.refresh_token);
    },
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    const payload: LoginPayload = { email: email.trim(), password };

    try {
      const { user } = await loginMutation.mutateAsync(payload);
      const returnTo = searchParams.get("returnTo");
      const destination =
        returnTo &&
        returnTo.startsWith("/") &&
        !returnTo.startsWith("//") &&
        !returnTo.startsWith("/auth")
          ? returnTo
          : user.is_admin
            ? "/admin"
            : "/";

      router.push(destination);
    } catch (err) {
      const axiosErr = err as AxiosError<{ message?: string; detail?: string }>;
      const message =
        axiosErr.response?.data?.message ??
        axiosErr.response?.data?.detail ??
        "Invalid email or password.";
      setError(message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoggingIn: loginMutation.isPending,
    handleSubmit,
  };
};

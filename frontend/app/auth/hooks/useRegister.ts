import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { registerApi } from "../api/auth.api";
import useAuthStore from "../stores/auth.store";
import type { RegisterPayload } from "../types/auth.types";

interface UseRegisterReturn {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  error: string | null;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useRegister = (): UseRegisterReturn => {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      if (data.access_token && data.refresh_token && data.user) {
        setSession(data.user, data.access_token, data.refresh_token);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setFieldErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setFieldErrors({ password: "Password must be at least 8 characters long." });
      return;
    }

    const payload: RegisterPayload = {
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await registerMutation.mutateAsync(payload);

      if (response.access_token && response.refresh_token && response.user) {
        router.push(response.user.is_admin ? "/admin" : "/");
      } else {
        router.push("/auth/account-verification");
      }
    } catch (err) {
      const axiosErr = err as AxiosError<{
        message?: string;
        detail?: string;
        errors?: Record<string, string | string[]>;
      }>;

      const data = axiosErr.response?.data;
      if (data?.errors) {
        const formatted: Record<string, string> = {};
        for (const [key, val] of Object.entries(data.errors)) {
          formatted[key] = Array.isArray(val) ? val[0] : val;
        }
        setFieldErrors(formatted);
      }

      const message =
        data?.message ??
        data?.detail ??
        "Registration failed. Please check your information and try again.";
      setError(message);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    fieldErrors,
    isLoading: registerMutation.isPending,
    handleSubmit,
  };
};

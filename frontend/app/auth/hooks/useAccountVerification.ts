import { useMutation } from "@tanstack/react-query";
import {
  resendVerificationApi,
  verifyAccountApi,
} from "../api/auth.api";

export const useVerifyAccount = () =>
  useMutation({
    mutationFn: verifyAccountApi,
  });

export const useResendVerification = () =>
  useMutation({
    mutationFn: resendVerificationApi,
  });

"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useToast } from "@/components/toast-provider";

export function ActionButton({
  children,
  message,
  description,
  toastType = "info",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  message: string;
  description?: string;
  toastType?: "success" | "info" | "error";
}) {
  const { toast } = useToast();
  return <button {...props} onClick={(event) => { props.onClick?.(event); toast(message, { type: toastType, description }); }}>{children}</button>;
}

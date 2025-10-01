"use client"

import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description, variant }) => {
      sonnerToast(title, {
        description,
        className: variant === "destructive" ? "bg-red-500 text-white" : "",
      })
    },
  }
}

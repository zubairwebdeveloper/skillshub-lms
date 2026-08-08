"use client";

import { useForm as useRHF } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useForm(schema, defaultValues = {}) {
  return useRHF({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur",
  });
}

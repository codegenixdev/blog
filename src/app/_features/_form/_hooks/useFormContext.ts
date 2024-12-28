import { FormContext } from "@/app/_features/_form/_types/formContext";

import { useFormContext as useRHFFormContext } from "react-hook-form";

const useFormContext = <T extends Record<string, unknown>>() => {
  const context = useRHFFormContext<T>() as FormContext<T>;

  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider");
  }

  return context;
};

export { useFormContext };

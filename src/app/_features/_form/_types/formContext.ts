import { UseFormReturn } from "react-hook-form";

type FormContext<T extends Record<string, unknown>> = UseFormReturn<T> & {
  readOnly: boolean;
};

export { type FormContext };

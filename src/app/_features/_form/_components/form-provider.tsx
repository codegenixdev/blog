import { ReactNode } from "react";

import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { FormErrorSummary } from "@/app/_features/_form/_components/form-error-summary";
import { FormContext } from "@/app/_features/_form/_types/formContext";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  FormProvider as RHFFormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
  useForm,
} from "react-hook-form";
import { ZodSchema } from "zod";
import { d } from "@/app/foo";

type FormProps<T extends FieldValues> = {
  children: ReactNode;
  schema: ZodSchema<T>;
  title?: string;
  isLoading?: boolean;
  onSubmit: SubmitHandler<T>;
  onError?: SubmitErrorHandler<T>;
  slotProps?: {
    submitButtonProps?: LoadingButtonProps;
    formContainerProps?: Partial<typeof Grid>;
  };
  mode?: UseFormProps<T>["mode"];
  submitButtonText?: string;
  defaultValues?: DefaultValues<T>;
  readOnly?: boolean;
};

const FormProvider = <T extends FieldValues>({
  children,
  schema,
  title,
  isLoading,
  onSubmit,
  onError,
  slotProps,
  mode = "all",
  defaultValues,
  submitButtonText,
  readOnly = false,
}: FormProps<T>) => {
  const form = useForm<T>({
    mode,
    defaultValues,
    resolver: zodResolver(schema),
  });

  const extendedForm: FormContext<T> = {
    ...form,
    readOnly,
  };

  return (
    <RHFFormProvider {...extendedForm}>
      <Grid
        size={{ xs: 12 }}
        spacing={2}
        container
        component="form"
        onSubmit={form.handleSubmit(onSubmit, onError)}
        {...slotProps?.formContainerProps}
      >
        {title && (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
            size={{ xs: 12 }}
          >
            <Typography variant="h6">{title}</Typography>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <FormErrorSummary />
        </Grid>

        {children}

        {!readOnly && (
          <Grid offset="auto">
            <LoadingButton
              type="submit"
              variant="contained"
              {...slotProps?.submitButtonProps}
              loading={isLoading}
            >
              {submitButtonText ??
                slotProps?.submitButtonProps?.children ??
                d.submit}
            </LoadingButton>
          </Grid>
        )}
      </Grid>
    </RHFFormProvider>
  );
};

export { FormProvider };

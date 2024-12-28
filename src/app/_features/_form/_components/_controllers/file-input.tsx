import { ChangeEvent, ReactElement, Ref, forwardRef } from "react";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { SxProps, Theme, styled } from "@mui/material";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { d } from "@/app/_i18n/_utils/dictionary";

import { Controller, FieldValues, Path } from "react-hook-form";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

type FileInputProps<T extends FieldValues> = {
  name: Path<T>;
  accept?: string[];
  onFileChange?: (file: File) => void;
  isLoading?: boolean;
} & {
  slotProps?: {
    loadingButtonProps?: Omit<
      LoadingButtonProps,
      "onClick" | "ref" | "component"
    >;
  };
};

const FileInput = forwardRef(
  <T extends FieldValues>(
    { name, accept, onFileChange, isLoading, slotProps }: FileInputProps<T>,
    ref: Ref<HTMLInputElement>
  ) => {
    const { control } = useFormContext<T>();

    const baseLoadingButtonSx: SxProps<Theme> = {
      placeSelf: "end",
      textWrap: "nowrap",
    };

    const mergedSx: SxProps<Theme> = {
      ...baseLoadingButtonSx,
      ...(slotProps?.loadingButtonProps?.sx || {}),
    };

    const buttonProps = {
      component: "label" as const,
      variant: "contained" as const,
      startIcon: <FileUploadOutlinedIcon />,
      loading: isLoading,
      ...(() => {
        const { ...rest } = slotProps?.loadingButtonProps || {};
        return rest;
      })(),
      sx: mergedSx,
    };

    return (
      <LoadingButton {...buttonProps}>
        {buttonProps.children ?? d.uploadFile}

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange }, fieldState: { error } }) => (
            <VisuallyHiddenInput
              ref={ref}
              type="file"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0] || null;
                onChange(file);

                if (onFileChange && file) {
                  onFileChange(file);
                }
              }}
              accept={accept?.join(",")}
              aria-invalid={!!error}
            />
          )}
        />
      </LoadingButton>
    );
  }
) as <T extends FieldValues>(
  props: FileInputProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { FileInput, type FileInputProps };

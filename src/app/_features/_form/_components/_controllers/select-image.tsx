import { ReactElement, Ref, forwardRef } from "react";

import {
  Autocomplete,
  Box,
  Stack,
  SxProps,
  TextField,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { MediaForm } from "@/app/(admin)/admin/media/_components/Form";
import { ImageWrapper } from "@/app/(public)/_components/image-wrapper";
import { d } from "@/app/_i18n/_utils/dictionary";

import { Controller, FieldValues, Path } from "react-hook-form";

type SelectImageOption = {
  id: string;
  label: string;
};

type SelectImageProps<T extends FieldValues> = {
  name: Path<T>;
  options?: SelectImageOption[] | null;
  label?: string;
  sx?: SxProps<Theme>;
  placeholder?: string;
};

const SelectImage = forwardRef(
  <T extends FieldValues>(
    {
      name,
      options = [],
      label,
      sx,
      placeholder,
      ...autocompleteProps
    }: SelectImageProps<T>,
    ref: Ref<HTMLInputElement>
  ) => {
    const theme = useTheme();
    const { control, readOnly } = useFormContext<T>();

    const defaultSx: SxProps<Theme> = {
      width: 1,
      ...sx,
    };

    return (
      <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
        <Controller
          name={name}
          control={control}
          render={({ field, fieldState: { error } }) => {
            const selectedOption = options?.find(
              (option) => option.id === field.value
            );

            return (
              <Autocomplete
                {...autocompleteProps}
                sx={defaultSx}
                options={options ?? []}
                value={selectedOption ?? null}
                onChange={(_, newValue) => {
                  field.onChange(newValue?.id ?? null);
                }}
                getOptionLabel={(option) => option.label}
                readOnly={readOnly}
                noOptionsText={d.notFound}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={ref}
                    label={label}
                    placeholder={placeholder}
                    error={!!error}
                    helperText={error?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        startAdornment: selectedOption && (
                          <Box
                            sx={{
                              height: 32,
                              width: 32,
                              mr: 1,
                              overflow: "hidden",
                            }}
                          >
                            <ImageWrapper
                              src={selectedOption.id}
                              alt={selectedOption.label}
                              size={80}
                              disableBlur
                              style={{ objectFit: "contain" }}
                              hoverEffects={false}
                            />
                          </Box>
                        ),
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={props.key + option.id}>
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          maxHeight: 72,
                          maxWidth: 72,
                          minHeight: 72,
                          minWidth: 72,
                          height: 72,
                          width: 72,
                          overflow: "hidden",
                        }}
                      >
                        <ImageWrapper
                          src={option.id}
                          alt={option.label}
                          size={180}
                          disableBlur
                          style={{ objectFit: "contain" }}
                          hoverEffects={false}
                        />
                      </Box>
                      <Typography>{option.label}</Typography>
                    </Stack>
                  </li>
                )}
              />
            );
          }}
        />
        <MediaForm
          loadingButtonProps={{
            variant: "text",
            sx: { height: theme.spacing(7) },
            color: "secondary",
          }}
        />
      </Stack>
    );
  }
) as <T extends FieldValues>(
  props: SelectImageProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { SelectImage };

import { ReactElement, Ref, forwardRef } from "react";

import {
  AutocompleteValue,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  TextField as MuiTextField,
} from "@mui/material";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { Controller, FieldValues, Path } from "react-hook-form";
import { d } from "@/app/foo";

type AutocompleteOption = {
  label: string;
  value: string | number;
};

type AutocompleteProps<
  T extends FieldValues,
  Multiple extends boolean = false
> = Omit<
  MuiAutocompleteProps<AutocompleteOption, Multiple, false, false>,
  "renderInput" | "onChange" | "options" | "multiple" | "disableClearable"
> & {
  name: Path<T>;
  textFieldProps?: Omit<
    React.ComponentProps<typeof MuiTextField>,
    "name" | "error" | "helperText"
  >;
  options: AutocompleteOption[] | undefined;
  multiple?: Multiple;
  onOptionSelect?: Multiple extends true
    ? (options: AutocompleteOption[]) => void
    : (option: AutocompleteOption | null) => void;
  disableClearable?: boolean;
};

const Autocomplete = forwardRef(
  <T extends FieldValues, Multiple extends boolean = false>(
    {
      name,
      options,
      textFieldProps,
      onOptionSelect,
      multiple = false as Multiple,
      disableClearable,
      ...autocompleteProps
    }: AutocompleteProps<T, Multiple>,
    ref: Ref<HTMLInputElement>
  ) => {
    const { control, readOnly } = useFormContext<T>();

    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value, ...field },
          fieldState: { error },
        }) => {
          const getValue = (): AutocompleteValue<
            AutocompleteOption,
            Multiple,
            false,
            false
          > => {
            if (multiple) {
              return (options ?? []).filter((option) =>
                Array.isArray(value) ? value.includes(option.value) : false
              ) as AutocompleteValue<
                AutocompleteOption,
                Multiple,
                false,
                false
              >;
            }
            return ((options ?? []).find((option) => option.value === value) ||
              null) as AutocompleteValue<
              AutocompleteOption,
              Multiple,
              false,
              false
            >;
          };

          return (
            <MuiAutocomplete<AutocompleteOption, Multiple, false, false>
              {...autocompleteProps}
              {...field}
              multiple={multiple}
              options={options ?? []}
              value={getValue()}
              readOnly={readOnly}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              disableClearable={disableClearable}
              noOptionsText={d.notFound}
              disableCloseOnSelect={multiple}
              id={name}
              onChange={(_, newValue) => {
                if (multiple) {
                  const values = (newValue as AutocompleteOption[]).map(
                    (option) => option.value
                  );
                  onChange(values);
                  if (onOptionSelect) {
                    (onOptionSelect as (options: AutocompleteOption[]) => void)(
                      newValue as AutocompleteOption[]
                    );
                  }
                } else {
                  const singleValue = newValue as AutocompleteOption | null;
                  onChange(singleValue?.value ?? "");
                  if (onOptionSelect) {
                    (
                      onOptionSelect as (
                        option: AutocompleteOption | null
                      ) => void
                    )(singleValue);
                  }
                }
              }}
              renderInput={(params) => (
                <MuiTextField
                  {...textFieldProps}
                  {...params}
                  inputRef={ref}
                  error={!!error}
                  helperText={error?.message}
                  placeholder={!options ? d.defaultLoading : ""}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      readOnly,
                      endAdornment: readOnly
                        ? null
                        : params.InputProps.endAdornment,
                    },
                  }}
                />
              )}
            />
          );
        }}
      />
    );
  }
) as <T extends FieldValues, Multiple extends boolean = false>(
  props: AutocompleteProps<T, Multiple> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { Autocomplete, type AutocompleteOption };

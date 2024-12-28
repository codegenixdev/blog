import { ReactElement, Ref, forwardRef } from "react";

import {
  Slider as MuiSlider,
  SliderProps as MuiSliderProps,
  SxProps,
  Theme,
} from "@mui/material";
import Typography from "@mui/material/Typography";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { Controller, FieldValues, Path } from "react-hook-form";

type SliderProps<T extends FieldValues> = Omit<
  MuiSliderProps,
  "name" | "value" | "onChange"
> & {
  name: Path<T>;
  label?: string;
  unit?: string;
};

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return value.toString();
};

const Slider = forwardRef(
  <T extends FieldValues>(
    {
      name,
      label,
      min = 0,
      max = 100,
      sx,
      unit,
      ...sliderProps
    }: SliderProps<T>,
    ref: Ref<HTMLInputElement>
  ) => {
    const { control, readOnly } = useFormContext<T>();

    const defaultSx: SxProps<Theme> = {
      width: 1,
      ...sx,
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            {label && <Typography gutterBottom>{label}</Typography>}
            <MuiSlider
              {...sliderProps}
              {...field}
              min={min}
              sx={defaultSx}
              max={max}
              disabled={readOnly}
              value={field.value ?? min}
              ref={ref}
              valueLabelDisplay="on"
              valueLabelFormat={(value) => `${unit}${formatNumber(value)}`}
            />
          </>
        )}
      />
    );
  }
) as <T extends FieldValues>(
  props: SliderProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { Slider };

import { ReactElement, Ref, forwardRef } from "react";

import { SxProps, Theme } from "@mui/material";
import {
	DatePicker as MuiDatePicker,
	DatePickerProps as MuiDatePickerProps,
} from "@mui/x-date-pickers";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { Controller, FieldValues, Path } from "react-hook-form";

type DatePickerProps<T extends FieldValues> = Omit<
	MuiDatePickerProps<Date>,
	"name" | "value" | "onChange"
> & {
	name: Path<T>;
};

function DatePickerComponent<T extends FieldValues>(
	{ name, sx, ...datePickerProps }: DatePickerProps<T>,
	ref: Ref<HTMLDivElement>
) {
	const { control, readOnly } = useFormContext<T>();

	const defaultSx: SxProps<Theme> = {
		width: 1,
		...sx,
	};

	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { onChange, value }, fieldState: { error } }) => {
				const isValidDate = (val: unknown): val is Date => {
					return val instanceof Date && !isNaN(val.getTime());
				};

				const dateValue = isValidDate(value)
					? value
					: value
						? new Date(value as string)
						: null;

				return (
					<MuiDatePicker
						{...datePickerProps}
						value={dateValue}
						onChange={(newValue) => {
							const finalValue = isValidDate(newValue) ? newValue : newValue;
							onChange(finalValue);
						}}
						ref={ref}
						disableOpenPicker={readOnly}
						sx={defaultSx}
						readOnly={readOnly}
						slotProps={{
							...datePickerProps.slotProps,
							textField: {
								...datePickerProps.slotProps?.textField,
								error: !!error,
								helperText: error?.message,
								name,
							},
						}}
					/>
				);
			}}
		/>
	);
}

const DatePicker = forwardRef(DatePickerComponent) as <T extends FieldValues>(
	props: DatePickerProps<T> & { ref?: Ref<HTMLDivElement> }
) => ReactElement;

export { DatePicker };

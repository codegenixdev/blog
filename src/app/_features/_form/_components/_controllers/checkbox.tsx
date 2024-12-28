import { ReactElement, Ref, forwardRef } from "react";

import {
	FormControl,
	FormControlLabel,
	FormControlLabelProps,
	Checkbox as MuiCheckbox,
	CheckboxProps as MuiCheckboxProps,
	useTheme,
} from "@mui/material";

import { ErrorMessage } from "@/app/_features/_form/_components/error-message";
import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { Controller, FieldValues, Path } from "react-hook-form";

type CheckboxProps<T extends FieldValues> = Omit<
	MuiCheckboxProps,
	"name" | "checked" | "defaultChecked"
> & {
	name: Path<T>;
	label?: string;
	labelPlacement?: FormControlLabelProps["labelPlacement"];
	helperText?: string;
};

const Checkbox = forwardRef(
	<T extends FieldValues>(
		{
			name,
			label,
			labelPlacement = "end",
			helperText,
			...checkboxProps
		}: CheckboxProps<T>,
		ref: Ref<HTMLInputElement>
	) => {
		const { control, readOnly } = useFormContext<T>();
		const theme = useTheme();

		return (
			<Controller
				name={name}
				control={control}
				render={({
					field: { value, onChange, ...field },
					fieldState: { error },
				}) => {
					const checkbox = (
						<MuiCheckbox
							{...checkboxProps}
							{...field}
							inputRef={ref}
							checked={!!value}
							onChange={(event) => onChange(event.target.checked)}
							sx={{
								color: error ? "error.main" : undefined,
								"&.Mui-checked": {
									color: error ? "error.main" : undefined,
								},
							}}
						/>
					);

					return (
						<FormControl error={!!error}>
							{label ? (
								<FormControlLabel
									sx={{
										"& .MuiFormControlLabel-label": {
											color: error ? theme.palette.error.main : "inherit",
										},
									}}
									disabled={readOnly}
									control={checkbox}
									label={label}
									labelPlacement={labelPlacement}
								/>
							) : (
								checkbox
							)}

							{(error || helperText) && <ErrorMessage<T> name={name} />}
						</FormControl>
					);
				}}
			/>
		);
	}
) as <T extends FieldValues>(
	props: CheckboxProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { Checkbox };

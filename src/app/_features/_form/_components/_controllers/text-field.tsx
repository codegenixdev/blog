import { ReactElement, Ref, forwardRef } from "react";

import {
	InputBaseComponentProps,
	TextField as MuiTextField,
	TextFieldProps as MuiTextFieldProps,
	SxProps,
	Theme,
} from "@mui/material";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import { Controller, FieldValues, Path } from "react-hook-form";
import { NumericFormat, PatternFormat } from "react-number-format";

type FormatType =
	| "number"
	| "phoneNumber"
	| "currency"
	| "socialSecurity"
	| undefined;

type CustomNumberFormatProps = InputBaseComponentProps & {
	onChange: (event: { target: { name: string; value: string } }) => void;
	name: string;
};

type TextFieldProps<T extends FieldValues> = Omit<
	MuiTextFieldProps,
	"name" | "error" | "helperText"
> & {
	name: Path<T>;
	format?: FormatType;
	forceLtr?: boolean;
};

const createNumberFormat = (
	formatConfig: {
		format?: string;
		mask?: string;
		thousandSeparator?: boolean;
		allowEmptyFormatting?: boolean;
	} = {}
) => {
	return forwardRef<HTMLInputElement, CustomNumberFormatProps>(
		function NumberFormat(props, ref) {
			const { onChange, name, ...other } = props;

			const handleValueChange = (values: { value: string }) => {
				onChange({
					target: {
						name,
						value: values.value ?? "",
					},
				});
			};

			const Component = formatConfig.format ? PatternFormat : NumericFormat;
			return (
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				<Component
					{...other}
					{...formatConfig}
					getInputRef={ref}
					onValueChange={handleValueChange}
				/>
			);
		}
	);
};

const formatComponents = {
	number: createNumberFormat({
		thousandSeparator: true,
	}),
	phoneNumber: createNumberFormat({
		format: "#### ### ####",
		allowEmptyFormatting: true,
		mask: "_",
	}),
	socialSecurity: createNumberFormat({
		format: "### ## ####",
		allowEmptyFormatting: true,
		mask: "_",
	}),
	currency: createNumberFormat({
		thousandSeparator: true,
	}),
};

const TextField = forwardRef(
	<T extends FieldValues>(
		{ name, format, sx, forceLtr, ...textFieldProps }: TextFieldProps<T>,
		ref: Ref<HTMLInputElement>
	) => {
		const { control, readOnly } = useFormContext<T>();

		const getInputComponent = (format?: FormatType) => {
			return format ? formatComponents[format] : undefined;
		};

		const defaultSx: SxProps<Theme> = {
			width: 1,
			...sx,
		};

		return (
			<Controller
				name={name}
				control={control}
				render={({ field: { value, ...restField }, fieldState: { error } }) => (
					<MuiTextField
						{...textFieldProps}
						{...restField}
						value={value ?? ""}
						inputRef={ref}
						error={!!error}
						helperText={error?.message}
						sx={defaultSx}
						slotProps={{
							...textFieldProps?.slotProps,
							input: {
								...textFieldProps?.slotProps?.input,
								inputComponent: getInputComponent(format),
								readOnly,
								...(readOnly && { type: undefined }),
							},
							htmlInput: {
								...textFieldProps.slotProps?.htmlInput,
								...(forceLtr
									? {
											dir: "ltr",
											style: { textAlign: "left" },
										}
									: undefined),
							},
						}}
					/>
				)}
			/>
		);
	}
) as <T extends FieldValues>(
	props: TextFieldProps<T> & { ref?: Ref<HTMLInputElement> }
) => ReactElement;

export { TextField };

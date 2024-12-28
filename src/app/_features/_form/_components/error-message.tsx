import { FormHelperText } from "@mui/material";

import { ErrorMessage as RHFErrorMessage } from "@hookform/error-message";
import { ArrayPath, FieldValues, Path } from "react-hook-form";

type ErrorMessageProps<T extends FieldValues> = {
  name: Path<T> | ArrayPath<T>;
};

const ErrorMessage = <T extends FieldValues>({
  name,
}: ErrorMessageProps<T>) => {
  return (
    <>
      <RHFErrorMessage name={name} as={<FormHelperText error />} />
      <RHFErrorMessage name={`${name}.root`} as={<FormHelperText error />} />
    </>
  );
};

export { ErrorMessage };

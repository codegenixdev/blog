import { humanizeFieldName } from "@/app/_features/_form/_utils/humanizeFieldName";
import { d } from "@/app/foo";

import { FieldErrors } from "react-hook-form";

type ErrorMessage = {
  field: string;
  label: string;
  message: string | undefined;
  category?: string;
  index?: number;
};

const formatErrors = <T extends Record<string, unknown>>(
  errors: FieldErrors<T>
): ErrorMessage[] => {
  const formattedErrors: ErrorMessage[] = [];

  const processErrors = (
    obj: unknown,
    parentField = "",
    parentLabel = ""
  ): void => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      if (!key || value === undefined) {
        return;
      }

      const currentField = parentField ? `${parentField}.${key}` : key;
      const isArrayField = currentField.includes("[");
      const arrayMatch = currentField.match(/\[(\d+)\]/);
      const arrayIndex = arrayMatch ? parseInt(arrayMatch[1]) : undefined;

      const categoryName = currentField.split("[")[0];
      const categoryLabel =
        d[categoryName as keyof typeof d] || humanizeFieldName(categoryName);

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item) {
            processErrors(item, `${currentField}[${index}]`, categoryLabel);
          }
        });
      } else if (value && typeof value === "object") {
        if (value.message) {
          formattedErrors.push({
            field: currentField,
            label: d[key as keyof typeof d] || humanizeFieldName(key),
            message: value.message,
            category: isArrayField ? categoryLabel : undefined,
            index: arrayIndex,
          });
        } else {
          processErrors(value, currentField, parentLabel);
        }
      }
    });
  };

  try {
    processErrors(errors);
  } catch (error) {
    console.error("Error processing form errors:", error);
  }

  return formattedErrors.sort((a, b) => {
    if (a.category && b.category) {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return (a.index || 0) - (b.index || 0);
    }
    if (a.category) return 1;
    if (b.category) return -1;
    return 0;
  });
};

export { formatErrors };

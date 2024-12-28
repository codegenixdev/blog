import { Alert, AlertTitle, List, ListItem } from "@mui/material";

import { formatErrors } from "@/app/_features/_form/_utils/formatErrors";

import { useFormState } from "react-hook-form";
import { d } from "@/app/foo";

const FormErrorSummary = () => {
  const { errors, isSubmitted } = useFormState();

  if (!isSubmitted || !errors || Object.keys(errors).length === 0) return null;

  const formattedErrors = formatErrors(errors);

  const handleErrorClick = (field: string) => {
    const cleanField = field.endsWith(".root") ? field.slice(0, -5) : field;

    const formFieldName = cleanField.replace(/\[(\d+)\]/g, ".$1");

    try {
      const elementById = document.getElementById(formFieldName);
      if (elementById) {
        elementById.scrollIntoView({ behavior: "smooth", block: "center" });
        elementById.focus();
        return;
      }
      const elementByName = document.getElementsByName(formFieldName)[0];
      if (elementByName) {
        elementByName.scrollIntoView({ behavior: "smooth", block: "center" });
        elementByName.focus();
        return;
      }
      console.warn(`No element found for field: ${formFieldName}`);
    } catch (error) {
      console.error("Error focusing field:", formFieldName, error);
    }
  };

  const getDisplayLabel = (label: string, field: string) => {
    if (label.toLowerCase() === "root") {
      const parentKey = field.split(".root")[0].split(".").pop() || field;
      return d[parentKey as keyof typeof d] || humanizeFieldName(parentKey);
    }
    return label;
  };

  const humanizeFieldName = (field: string): string => {
    return field
      .split(/(?=[A-Z])/)
      .join(" ")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const groupedErrors = formattedErrors.reduce(
    (acc, error) => {
      if (error.category) {
        if (!acc[error.category]) {
          acc[error.category] = [];
        }
        acc[error.category].push(error);
      } else {
        if (!acc["general"]) {
          acc["general"] = [];
        }
        acc["general"].push(error);
      }
      return acc;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    {} as Record<string, any[]>
  );

  return (
    <Alert
      severity="error"
      sx={{
        mb: 2,
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      <AlertTitle>{d.errorValidationTitle}</AlertTitle>
      <List dense>
        {groupedErrors["general"]?.map(({ label, message, field }, index) => (
          <ListItem
            key={`general-${index}`}
            sx={{
              px: 0,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            onClick={() => handleErrorClick(field)}
          >
            • {getDisplayLabel(label, field)}: {message}
          </ListItem>
        ))}

        {Object.entries(groupedErrors).map(([category, errors]) => {
          if (category === "general") return null;

          return (
            <div key={category}>
              <ListItem sx={{ px: 0, fontWeight: "bold" }}>
                {category}:
              </ListItem>
              {errors.map(({ label, message, field, index }, i) => (
                <ListItem
                  key={`${category}-${index}-${i}`}
                  sx={{
                    px: 2,
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => handleErrorClick(field)}
                >
                  • {index !== undefined ? `#${index + 1} - ` : ""}
                  {getDisplayLabel(label, field)}: {message}
                </ListItem>
              ))}
            </div>
          );
        })}
      </List>
    </Alert>
  );
};

export { FormErrorSummary };

import { ReactElement, ReactNode, Ref, forwardRef } from "react";

import { Box, IconButton, Menu as MuiMenu } from "@mui/material";
import MenuItem, {
  MenuItemProps as MuiMenuItemProps,
} from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { SxProps, Theme } from "@mui/material/styles";

import { useFormContext } from "@/app/_features/_form/_hooks/useFormContext";

import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { Controller, FieldValues, Path } from "react-hook-form";

type DisplayMode = "icon" | "label" | "both";

type Option = {
  value: string | number;
  label: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  disabled?: boolean;
};

type BaseMenuProps = {
  options: Option[];
  MenuItemProps?: MuiMenuItemProps;
  className?: string;
  renderLabel?: (option: Option) => ReactNode;
  sx?: SxProps<Theme>;
  displayMode?: DisplayMode;
  placeholder?: string;
} & Omit<MuiMenuItemProps, "name" | "error" | "value" | "onChange">;

type FormControlledMenuProps<T extends FieldValues> = {
  name: Path<T>;
  value?: never;
  onChange?: never;
  controlled?: false;
} & BaseMenuProps;

type SelfControlledMenuProps = {
  name?: never;
  value: Option["value"];
  onChange: (value: Option["value"]) => void;
  controlled: true;
} & BaseMenuProps;

type MenuProps<T extends FieldValues> =
  | FormControlledMenuProps<T>
  | SelfControlledMenuProps;

type MenuContentProps = {
  value: Option["value"];
  onChange: (value: Option["value"]) => void;
  options: Option[];
  MenuItemProps?: MuiMenuItemProps;
  sx?: SxProps<Theme>;
  className?: string;
  renderLabel?: (option: Option) => ReactNode;
  displayMode?: DisplayMode;
  placeholder?: string;
  ref?: Ref<HTMLLIElement>;
};

const MenuContent = forwardRef<HTMLLIElement, MenuContentProps>(
  (
    {
      value,
      onChange,
      options,
      MenuItemProps,
      sx,
      className,
      renderLabel,
      displayMode = "both",
      placeholder = "Select an option",
    },
    ref
  ): ReactElement => {
    const popupState = usePopupState({
      variant: "popover",
      popupId: `menu-${Math.random().toString(36).substr(2, 9)}`,
    });

    const handleMenuItemClick = (option: Option) => {
      onChange(option.value);
      popupState.close();
    };

    const selectedOption = options.find((option) => option.value === value);

    const renderTriggerContent = () => {
      if (!selectedOption) {
        return (
          <Typography
            variant="body2"
            sx={{
              maxWidth: "150px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {placeholder}
          </Typography>
        );
      }

      return (
        <>
          {(displayMode === "icon" || displayMode === "both") &&
            selectedOption.leftIcon}
          {(displayMode === "label" || displayMode === "both") && (
            <Typography
              variant="body2"
              sx={{
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                ml: displayMode === "both" && selectedOption.leftIcon ? 1 : 0,
              }}
            >
              {renderLabel ? renderLabel(selectedOption) : selectedOption.label}
            </Typography>
          )}
        </>
      );
    };

    return (
      <>
        <MuiMenu
          {...bindPopover(popupState)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              {...MenuItemProps}
              ref={ref}
              className={className}
              selected={value === option.value}
              disabled={option.disabled}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingX: 1,
                minWidth: "200px",
                ...sx,
              }}
              onClick={() => handleMenuItemClick(option)}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {option.leftIcon}
                {renderLabel ? (
                  renderLabel(option)
                ) : (
                  <Typography
                    sx={{
                      paddingX: 1,
                      textAlign: "left",
                    }}
                  >
                    {option.label}
                  </Typography>
                )}
              </Box>
              {option.rightIcon}
            </MenuItem>
          ))}
        </MuiMenu>
        <IconButton
          {...bindTrigger(popupState)}
          size="small"
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            minWidth: displayMode === "both" ? "100px" : "auto",
          }}
        >
          {renderTriggerContent()}
        </IconButton>
      </>
    );
  }
);

const FormControlledMenu = forwardRef<
  HTMLLIElement,
  FormControlledMenuProps<FieldValues>
>(({ name, displayMode, placeholder, ...rest }, ref) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MenuContent
          ref={ref}
          value={field.value as Option["value"]}
          onChange={field.onChange}
          displayMode={displayMode}
          placeholder={placeholder}
          {...rest}
        />
      )}
    />
  );
});

const SelfControlledMenu = forwardRef<HTMLLIElement, SelfControlledMenuProps>(
  ({ value, onChange, displayMode, placeholder, ...rest }, ref) => {
    return (
      <MenuContent
        ref={ref}
        value={value}
        onChange={onChange}
        displayMode={displayMode}
        placeholder={placeholder}
        {...rest}
      />
    );
  }
);

const Menu = forwardRef(
  <T extends FieldValues>(props: MenuProps<T>, ref: Ref<HTMLLIElement>) => {
    if (props.controlled) {
      return (
        <SelfControlledMenu ref={ref} {...(props as SelfControlledMenuProps)} />
      );
    }
    return (
      <FormControlledMenu
        ref={ref}
        {...(props as FormControlledMenuProps<T>)}
      />
    );
  }
) as <T extends FieldValues>(
  props: MenuProps<T> & { ref?: Ref<HTMLLIElement> }
) => ReactElement;

export { Menu };

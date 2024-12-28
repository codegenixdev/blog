"use client";
import { theme } from "@/app/_utils/theme";
import { CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

type ThemeProviderProps = {
  children: ReactNode;
  dir: "rtl" | "ltr";
};

const ThemeProvider = ({ children, dir }: ThemeProviderProps) => {
  const providerConfig =
    dir === "rtl"
      ? {
          options: {
            key: "muirtl",
            stylisPlugins: [prefixer, rtlPlugin],
          },
        }
      : {};

  return (
    <AppRouterCacheProvider {...providerConfig}>
      <MuiThemeProvider theme={theme(dir)}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
};

export { ThemeProvider };

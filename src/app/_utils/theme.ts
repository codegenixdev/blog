"use client";
import { LinkBehaviour } from "@/app/_components/link-behaviour";
import { purple, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = (dir: "rtl" | "ltr") =>
  createTheme({
    direction: dir,
    typography: {
      fontFamily: "var(--font-poppins)",
    },
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehaviour,
        },
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehaviour,
        },
      },
      MuiTextField: {
        defaultProps: {
          slotProps: { inputLabel: { shrink: true } },
        },
      },
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: purple[500],
          },
          error: {
            main: red[500],
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: purple[500],
          },
          error: {
            main: red[500],
          },
        },
      },
    },
  });

export { theme };

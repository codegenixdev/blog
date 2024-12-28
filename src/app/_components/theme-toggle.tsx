import ContrastRoundedIcon from "@mui/icons-material/ContrastRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import { useColorScheme } from "@mui/material/styles";

import { Menu } from "@/app/_features/_form/_components/_controllers/menu";
import { d } from "@/app/foo";

const ThemeToggle = () => {
  const { mode, setMode } = useColorScheme();

  const handleChange = (value: string | number) => {
    setMode(value as "light" | "dark" | "system");
  };

  if (!mode) {
    return null;
  }

  return (
    <Menu
      controlled
      value={mode}
      onChange={handleChange}
      displayMode="icon"
      options={[
        {
          value: "system",
          label: d.auto,
          leftIcon: <ContrastRoundedIcon fontSize="small" />,
        },
        {
          value: "light",
          label: d.light,
          leftIcon: <WbSunnyRoundedIcon fontSize="small" />,
        },
        {
          value: "dark",
          label: d.dark,
          leftIcon: <NightlightRoundedIcon fontSize="small" />,
        },
      ]}
    />
  );
};

export { ThemeToggle };

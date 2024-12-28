"use client";

import { MouseEvent, ReactElement, ReactNode, useMemo } from "react";

import { usePathname, useRouter } from "next/navigation";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DockRoundedIcon from "@mui/icons-material/DockRounded";
import HomeIcon from "@mui/icons-material/Home";
import LocalPoliceRoundedIcon from "@mui/icons-material/LocalPoliceRounded";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import PeopleIcon from "@mui/icons-material/People";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsBackupRestoreRoundedIcon from "@mui/icons-material/SettingsBackupRestoreRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import {
  Box,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Stack,
  SxProps,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { d } from "@/app/foo";

const routeIconMap: Record<string, ReactElement> = {
  home: <HomeIcon />,
  dashboard: <DashboardIcon />,
  users: <PeopleIcon />,
  kiosks: <DockRoundedIcon />,
  settings: <SettingsIcon />,
  media: <PermMediaRoundedIcon />,
  employees: <BadgeRoundedIcon />,
  roles: <LocalPoliceRoundedIcon />,
  backup: <SettingsBackupRestoreRoundedIcon />,
  "support-services": <SupportAgentRoundedIcon />,
};

const routeNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  users: d.users,
  kiosks: d.kiosks,
  settings: d.settings,
  list: d.list,
  admin: d.dashboard,
  create: d.create,
  media: d.mediaManagement,
  update: d.edit,
  employees: d.employees,
  "create-user": d.createUser,
  "edit-user": d.editUser,
  "create-kiosk": d.createKiosk,
  "edit-kiosk": d.editKiosk,
  roles: d.roles,
  backup: d.backup,
  "support-services": d.supportServices,
};

type BreadcrumbsProps = {
  sx?: SxProps<Theme>;
};

const Breadcrumbs = ({ sx }: BreadcrumbsProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const breadcrumbs = useMemo(() => {
    const paths = pathname.split("/").filter((path) => path);
    let currentPath = "";

    const items: {
      path: string;
      label: string;
      icon: ReactNode;
    }[] = [];

    paths.forEach((path) => {
      currentPath += `/${path}`;
      const label =
        routeNameMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
      const icon = routeIconMap[path];

      items.push({
        path: currentPath,
        label,
        icon,
      });
    });

    if ((isXs || isSm) && items.length > 2) {
      return [
        {
          path: "/",
          label: "...",
          icon: null,
        },
        ...items.slice(-2),
      ];
    }

    return items;
  }, [pathname, isSm, isXs]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    router.push(path);
  };

  return (
    <Stack
      spacing={1.5}
      sx={{
        ...sx,
        "& .MuiBreadcrumbs-separator": {
          color: "text.secondary",
          margin: isXs ? "0 4px" : "0 8px",
        },
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "nowrap",
        },
      }}
    >
      <MuiBreadcrumbs
        separator={
          <NavigateBeforeOutlinedIcon
            sx={{
              fontSize: isXs ? "0.9rem" : "1rem",
            }}
          />
        }
        sx={{
          "& .MuiBreadcrumbs-li": {
            minWidth: 0,
          },
        }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          const content = (
            <>
              {breadcrumb.icon && (
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    "& .MuiSvgIcon-root": {
                      fontSize: isXs ? "0.9rem" : "1.1rem",
                      mr: 0.5,
                    },
                  }}
                >
                  {breadcrumb.icon}
                </Box>
              )}
              <Typography
                component="span"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: isSm ? "100px" : "200px",
                  fontSize: isXs ? "0.85rem" : "inherit",
                }}
              >
                {breadcrumb.label}
              </Typography>
            </>
          );

          return isLast ? (
            <Typography
              key={breadcrumb.path}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.primary",
                fontWeight: 500,
                fontSize: isXs ? "0.85rem" : "inherit",
                "& .MuiSvgIcon-root": {
                  mr: 0.5,
                  width: isXs ? 18 : 20,
                  height: isXs ? 18 : 20,
                },
              }}
            >
              {content}
            </Typography>
          ) : (
            <Link
              key={breadcrumb.path}
              href={breadcrumb.path}
              onClick={(e) => handleClick(e, breadcrumb.path)}
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                textDecoration: "none",
                transition: "color 0.2s ease-in-out",
                fontSize: isXs ? "0.85rem" : "inherit",
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "none",
                },
                "& .MuiSvgIcon-root": {
                  mr: 0.5,
                  width: isXs ? 18 : 20,
                  height: isXs ? 18 : 20,
                },
              }}
            >
              {content}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Stack>
  );
};

export { Breadcrumbs };

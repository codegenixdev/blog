"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DockRoundedIcon from "@mui/icons-material/DockRounded";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LocalPoliceRoundedIcon from "@mui/icons-material/LocalPoliceRounded";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import PermMediaRoundedIcon from "@mui/icons-material/PermMediaRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import SettingsBackupRestoreRoundedIcon from "@mui/icons-material/SettingsBackupRestoreRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import { Button, Stack, useMediaQuery } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { useTheme } from "@mui/material/styles";

import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { DRAWER_WIDTH } from "@/app/_utils/constants";
import { d } from "@/app/foo";
import { UserAvatar, UserAvatarProps } from "@/app/_components/user-avatar";
import { ThemeToggle } from "@/app/_components/theme-toggle";

type MenuItem = {
  text: string;
  href: string;
  icon?: ReactNode;
};

type ParentMenuItem = {
  type: "parent";
  id: string;
  text: string;
  icon: ReactNode;
  children: MenuItem[];
};

type SingleMenuItem = {
  type: "item";
  text: string;
  href: string;
  icon?: ReactNode;
};

type DividerItem = {
  type: "divider";
};

type MenuItemType = ParentMenuItem | SingleMenuItem | DividerItem;

type MenuOpenStates = {
  [K in ParentMenuItem["id"]]: boolean;
};

type AdminLayoutProps = {
  children: ReactNode;
  slotProps: { userAvatar: UserAvatarProps };
};

const AdminLayout = ({ children, slotProps }: AdminLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  const disableAppBar = useMemo(() => pathname.includes("sign-in"), [pathname]);

  useEffect(() => {
    if (isMobile) {
      setDrawerOpen(false);
    }
  }, [pathname, isMobile, setDrawerOpen]);

  const [menuOpenStates, setMenuOpenStates] = useState<MenuOpenStates>({
    administration: false,
    reports: false,
    settings: false,
    users: false,
    products: false,
  });

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  const handleMenuClick = (menu: keyof MenuOpenStates) => {
    setMenuOpenStates((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        type: "item",
        icon: <DashboardIcon />,
        text: d.dashboard,
        href: "/admin",
      },
      { type: "divider" },
      {
        type: "item",
        icon: <BadgeRoundedIcon />,
        text: d.employeesManagement,
        href: "/admin/employees",
      },
      {
        type: "item",
        icon: <PermMediaRoundedIcon />,
        text: d.mediaManagement,
        href: "/admin/media",
      },
      {
        type: "parent",
        id: "products",
        icon: <CategoryRoundedIcon />,
        text: d.productsManagement,
        children: [
          {
            text: d.kiosks,
            href: "/admin/kiosks",
            icon: <DockRoundedIcon />,
          },
          {
            text: d.supportServices,
            href: "/admin/support-services",
            icon: <SupportAgentRoundedIcon />,
          },
        ],
      },
      { type: "divider" },
      {
        type: "parent",
        id: "settings",
        icon: <SettingsIcon />,
        text: d.settings,
        children: [
          {
            text: d.users,
            href: "/admin/users",
            icon: <PeopleIcon />,
          },
          {
            text: d.roles,
            href: "/admin/roles",
            icon: <LocalPoliceRoundedIcon />,
          },
          {
            text: d.backup,
            href: "/admin/backup",
            icon: <SettingsBackupRestoreRoundedIcon />,
          },
        ],
      },
    ],
    []
  );

  const renderMenuItem = (item: MenuItemType) => {
    if (item.type === "divider") {
      return <Divider key={`divider-${Math.random()}`} />;
    }

    if (item.type === "parent") {
      return (
        <Box key={item.text}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleMenuClick(item.id)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {menuOpenStates[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={menuOpenStates[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItem key={child.text} disablePadding>
                  <ListItemButton href={child.href} sx={{ pl: 4 }}>
                    <ListItemIcon>
                      {child.icon ?? <SettingsRoundedIcon />}
                    </ListItemIcon>
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      );
    }

    return (
      <ListItem key={item.text} disablePadding>
        <ListItemButton href={item.href}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: "flex" }}>
      {!disableAppBar && (
        <>
          <MuiAppBar
            position="fixed"
            sx={{
              zIndex: theme.zIndex.drawer + 1,
              transition: theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              ...(!isMobile &&
                drawerOpen && {
                  width: `calc(100% - ${DRAWER_WIDTH}px)`,
                  marginLeft: `${DRAWER_WIDTH}px`,
                  transition: theme.transitions.create(["margin", "width"], {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                  }),
                }),
            }}
          >
            <Toolbar>
              <IconButton
                onClick={handleDrawerOpen}
                sx={{
                  mr: 2,
                  ...(drawerOpen && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>

              <Stack
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 1,
                  alignItems: "center",
                }}
              >
                <Breadcrumbs />
                <Stack sx={{ flexDirection: "row", gap: 1 }}>
                  <ThemeToggle />
                  <UserAvatar {...slotProps.userAvatar} />
                </Stack>
              </Stack>
            </Toolbar>
          </MuiAppBar>

          <Drawer
            variant={isMobile ? "temporary" : "persistent"}
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerClose}
            sx={{
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
              },
              display: { xs: "block", sm: "block" },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: theme.spacing(0, 1),
                ...theme.mixins.toolbar,
                justifyContent: "space-between",
              }}
            >
              <Button href="/">
                <Stack
                  sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}
                >
                  LOGO
                </Stack>
              </Button>

              <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Divider />
            <List>{menuItems.map((item) => renderMenuItem(item))}</List>
          </Drawer>
        </>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: { xs: theme.spacing(0), sm: theme.spacing(3) },

          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: !isMobile && drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          width: "100%",
          ...(disableAppBar && {
            padding: 0,
            marginLeft: 0,
          }),
        }}
      >
        {!disableAppBar && <Box sx={{ ...theme.mixins.toolbar }} />}
        {children}
      </Box>
    </Box>
  );
};

export { AdminLayout };

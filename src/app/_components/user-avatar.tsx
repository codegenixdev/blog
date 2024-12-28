import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {
  Avatar,
  Button,
  ButtonBase,
  Popover,
  Stack,
  Typography,
} from "@mui/material";

import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { d } from "@/app/foo";

type UserAvatarProps = {
  // userData: Awaited<ReturnType<typeof getUser>>;
};
const UserAvatar = ({ userData }: UserAvatarProps) => {
  const state = usePopupState({ variant: "popover" });
  // const signOutMutation = useSignOut();

  const handleSignOutClick = () => {
    // signOutMutation.mutate();
  };

  if (!userData) return null;

  return (
    <>
      <Popover {...bindPopover(state)}>
        <Stack sx={{ padding: 2, gap: 1 }}>
          <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{ backgroundColor: "primary.main" }}
              src={userData.imageSource ?? undefined}
            >
              {userData.firstName[0]}
            </Avatar>
            <Stack>
              <Typography>{userData.email}</Typography>
              <Typography variant="body2">
                {`${d.name}: ${userData.firstName} ${userData.lastName}`}
              </Typography>
              {userData.role && (
                <Typography variant="body2">
                  {`${d.role}: ${userData.role.name}`}
                </Typography>
              )}
            </Stack>
          </Stack>
          <Button
            sx={{
              width: "fit-content",
              ":hover": {
                backgroundColor: "initial",
                color: "error.main",
              },
              placeSelf: "end",
            }}
            onClick={handleSignOutClick}
            startIcon={<LogoutRoundedIcon />}
            color="error"
            variant="outlined"
          >
            {d.signOut}
          </Button>
        </Stack>
      </Popover>
      <ButtonBase {...bindTrigger(state)}>
        <Avatar
          sx={{ backgroundColor: "primary.main", width: 30, height: 30 }}
          src={userData.imageSource ?? undefined}
        >
          {userData.firstName[0]}
        </Avatar>
      </ButtonBase>
    </>
  );
};

export { UserAvatar, type UserAvatarProps };

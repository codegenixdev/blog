import { ReactNode, useState } from "react";

import { Dialog as MuiDialog } from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  ConfirmContext,
  ConfirmOptions,
} from "@/app/_features/_confirm/_hooks/useConfirm";
import { d } from "@/app/foo";

type ConfirmProviderProps = {
  children: ReactNode;
};

const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>();

  const confirm = (optionsArg: ConfirmOptions) => {
    return new Promise<void>(() => {
      setOptions(optionsArg);
      setOpen(true);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    options?.onConfirm();
    handleClose();
  };

  return (
    <>
      <ConfirmContext.Provider value={confirm}>
        {children}
      </ConfirmContext.Provider>
      <MuiDialog
        disableRestoreFocus
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth="xs"
      >
        <DialogTitle>{d.confirmOperation}</DialogTitle>
        <DialogContent>{d.doYouConfirmOperation}</DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={handleClose}>
            {d.cancel}
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
            {d.confirm}
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
};

export { ConfirmProvider };

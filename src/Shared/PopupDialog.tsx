/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Dialog } from "@material-ui/core";

export default function PopupDialog({
  open,
  classes,
  onClose,
  children,
  maxWidth,
}: any) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      classes={{ paper: classes.popup }}
    >
      {children}
    </Dialog>
  );
}

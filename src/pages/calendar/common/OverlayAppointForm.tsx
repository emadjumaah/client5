/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box } from "@material-ui/core";
import React from "react";
import { PopupDialog } from "../../../Shared";
import { appointClasses } from "../../../themes";

const OverlayAppointForm = ({ visible, onHide, children }: any) => {
  const classes = appointClasses();

  return (
    <PopupDialog
      open={visible || false}
      onClose={onHide}
      maxWidth={"md"}
      classes={classes}
    >
      <Box m={3}>{children}</Box>
    </PopupDialog>
  );
};

export default OverlayAppointForm;

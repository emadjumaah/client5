/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, TextField } from "@material-ui/core";
import React, { useState } from "react";

import { PopupTitle, PopupDialog, PopupDialogContent } from "../Shared";
import BackupRestoreDB from "../Shared/BackupRestoreDB";
import { appointClasses } from "../themes";

const PopupRestoreDB = ({ open, onClose, isRTL }: any) => {
  const [on, setOn] = useState(false);
  const [value, setValue] = useState("");
  const classes = appointClasses();
  const keyPress = (e: any) => {
    if (e.keyCode === 13) {
      if (value === "admin") {
        setOn(true);
        setValue("");
      } else {
        setValue("");
      }
    }
  };
  return (
    <PopupDialog
      open={open}
      onClose={onClose}
      maxWidth={"md"}
      classes={classes}
    >
      <PopupTitle title="Restore Database" />
      <PopupDialogContent>
        {!on && (
          <Box
            display="flex"
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: 350,
            }}
          >
            <TextField
              id="filled-password-input"
              autoFocus
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              value={value}
              onKeyDown={keyPress}
              onChange={(e: any) => setValue(e.target.value)}
            />
          </Box>
        )}
        {on && <BackupRestoreDB isRTL={isRTL} dialog={true}></BackupRestoreDB>}
      </PopupDialogContent>
    </PopupDialog>
  );
};

export default PopupRestoreDB;

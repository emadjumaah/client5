/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";

export default function PopupTitle({ title }: any) {
  return <DialogTitle id="form-dialog-title">{title}</DialogTitle>;
}

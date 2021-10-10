/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import Alert from "@material-ui/lab/Alert";

export default function AlertLocal({ type, msg, isRTL, top }: any) {
  return (
    <Alert
      style={{
        direction: isRTL ? "rtl" : "ltr",
        position: "absolute",
        bottom: top ? undefined : 60,
        top: top ? 55 : undefined,
        width: top ? window.innerWidth - 275 : "100%",
        height: top ? 60 : undefined,
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
      }}
      severity={type}
    >
      {msg}
    </Alert>
  );
}

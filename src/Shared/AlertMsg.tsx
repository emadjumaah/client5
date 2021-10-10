/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import Alert from "@material-ui/lab/Alert";

export default function AlertMsg({ type, msg, top, right }: any) {
  return (
    <Alert
      style={{
        position: "absolute",
        bottom: top ? undefined : 0,
        top: top ? 40 : undefined,
        left: right ? undefined : 0,
        right: right ? 0 : undefined,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      severity={type}
    >
      {msg}
    </Alert>
  );
}

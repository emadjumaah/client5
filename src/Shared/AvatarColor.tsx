/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import { Box, Tooltip } from "@material-ui/core";
import React from "react";
import { nameToColor } from "../common";

export default function AvatarColor({
  name,
  username,
  size = 40,
  bc = "#ddd",
  bg,
}: any) {
  const uname = name ? name : username;
  const color = bg ? bg : uname ? nameToColor(uname) : "";

  return (
    <Tooltip title={uname ? uname : ""}>
      <Box
        border={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderColor: bc,
        }}
      ></Box>
    </Tooltip>
  );
}

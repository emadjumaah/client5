/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Typography } from "@material-ui/core";
import React from "react";

export default function OptionItem({ item, isRTL, col }: any) {
  const { color } = item;
  return (
    <Box
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      {item.color && !col && (
        <Box
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: color ? color : "#fff",
          }}
        ></Box>
      )}
      <Typography
        style={{
          marginLeft: color ? 10 : undefined,
          marginRight: color ? 10 : undefined,
          textAlign: isRTL ? "right" : "left",
        }}
        variant={isRTL ? "subtitle1" : "subtitle2"}
      >
        {isRTL ? item.nameAr : item.name}
      </Typography>
    </Box>
  );
}

/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Box, Divider, Typography } from "@material-ui/core";

export const ChartHeader = (props: any) => {
  const { color, title } = props;
  return (
    <Box>
      <Typography
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: color,
          padding: 10,
        }}
      >
        {title}
      </Typography>
      <Divider></Divider>
    </Box>
  );
};
export default ChartHeader;

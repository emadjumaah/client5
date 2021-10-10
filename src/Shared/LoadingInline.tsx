/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, CircularProgress } from "@material-ui/core";
import React from "react";

const LoadingInline = () => {
  return (
    <Box
      style={{
        position: "relative",
      }}
      display="flex"
      flex="1"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingInline;

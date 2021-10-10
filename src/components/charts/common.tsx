/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box, Typography } from "@material-ui/core";
import React from "react";
import MyIcon from "../../Shared/MyIcon";

export const InfoAmount = ({ value, color }: any) => {
  return (
    <Typography style={{ fontSize: 26, fontWeight: "bold", color }}>
      {value}
    </Typography>
  );
};

export const InfoDesc = ({ desc }: any) => {
  return (
    <Typography style={{ fontSize: 14, color: "#888" }}>{desc}</Typography>
  );
};

export const InfoIcon = ({ icon, color }) => {
  return (
    <Box
      display="flex"
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MyIcon color={color} icon={icon}></MyIcon>
    </Box>
  );
};
export const InfoPercent = ({ percent }: any) => {
  return (
    <Box
      style={{
        backgroundColor: "#bff8bf",
        borderRadius: 5,
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <Typography style={{ fontSize: 14, color: "#888" }}>{percent}</Typography>
    </Box>
  );
};

export const InfoTitle = ({ title, color }: any) => {
  return (
    <Typography style={{ fontSize: 16, fontWeight: "bold", color }}>
      {title}
    </Typography>
  );
};

export const ChartTitle = ({ title }: any) => {
  return <Typography variant="h5">{title}</Typography>;
};

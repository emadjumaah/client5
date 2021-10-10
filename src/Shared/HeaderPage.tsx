/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { fade, IconButton, Paper, Typography } from "@material-ui/core";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";

export default function HeaderPage({ isRTL, menuitem, refresh, theme }: any) {
  return (
    <Paper
      elevation={0}
      style={{
        backgroundColor: fade(theme.palette.primary.light, 0.3),
        paddingLeft: 20,
        paddingRight: 20,
        height: 50,
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 0,
      }}
    >
      <Typography
        style={{
          color: theme.palette.primary.main,
          fontSize: 22,
        }}
      >
        {isRTL ? menuitem.titleAr : menuitem.titleEn}
      </Typography>
      {refresh && (
        <IconButton
          style={{
            backgroundColor: fade(theme.palette.secondary.main, 0.5),
            padding: 7,
          }}
          onClick={refresh}
        >
          <RefreshOutlinedIcon
            style={{ fontSize: 24 }}
            color="primary"
          ></RefreshOutlinedIcon>
        </IconButton>
      )}
    </Paper>
  );
}

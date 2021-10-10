/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable react/jsx-no-undef */
import React from "react";
import {
  AppBar,
  Box,
  createStyles,
  fade,
  makeStyles,
  Theme,
  Toolbar,
  Typography,
  useTheme,
} from "@material-ui/core";
import { UserBox } from "../../Shared";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      "-webkit-app-region": "drag",
      backgroundColor: fade(theme.palette.primary.light, 0),
    },
    titleSt: {
      color: theme.palette.grey[700],
      fontSize: 14,
    },
    appBarButton: {
      color: theme.palette.grey[700],
      "-webkit-app-region": "no-drag",
      top: -3,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
    appBarButtonLang: {
      color: theme.palette.grey[700],
      fontSize: 12,
      "-webkit-app-region": "no-drag",
      top: -3,
      "&:hover": {
        backgroundColor: "transparent",
      },
    },
  })
);

export default function ApplicationBar(props: any) {
  const { isRTL, user, company, network } = props;

  const { appBar, appBarButtonLang, titleSt } = useStyles();
  const theme = useTheme();

  const companyName = company
    ? isRTL
      ? company?.nameAr
      : company?.name
    : null;
  const title = companyName ? `${companyName}` : "JADWAL ERP";

  return (
    <AppBar
      elevation={0}
      style={{ height: 40 }}
      position="fixed"
      className={appBar}
    >
      <Toolbar
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: isRTL ? "row-reverse" : "row",
          padding: 0,
        }}
      >
        <UserBox
          appBarButtonLang={appBarButtonLang}
          isRTL={isRTL}
          theme={theme}
          user={user}
          logout={props.logout}
          network={network}
        ></UserBox>
        <Box style={{ marginTop: -5 }}>
          <Typography className={titleSt} noWrap variant="button">
            {title}
          </Typography>
        </Box>

        <Box
          style={{
            display: "flex",
            width: 280,
            justifyContent: isRTL ? "flex-start" : "flex-end",
          }}
        ></Box>
      </Toolbar>
    </AppBar>
  );
}

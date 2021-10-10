/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Box,
  fade,
  Hidden,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import RefreshOutlinedIcon from "@material-ui/icons/RefreshOutlined";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function PageLayout(props: any) {
  const {
    children,
    menuitem,
    isRTL,
    refresh,
    theme,
    bgcolor = theme.palette.primary.light,
  } = props;
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box p={isMobile ? 0 : 2} pt={isMobile ? 6 : undefined}>
      <Hidden xsDown implementation="css">
        <Paper
          elevation={0}
          style={{
            backgroundColor: fade(bgcolor, 0.2),
            paddingLeft: 20,
            paddingRight: 20,
            height: 50,
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
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
                backgroundColor: fade(bgcolor, 0.5),
                padding: 7,
              }}
              onClick={refresh}
            >
              <RefreshOutlinedIcon
                style={{ fontSize: 24, color: "#eee" }}
                color="primary"
              ></RefreshOutlinedIcon>
            </IconButton>
          )}
        </Paper>
      </Hidden>
      <Paper
        style={{
          // height: window.innerHeight - 85,
          // overflow: "auto",
          backgroundColor: fade(theme.palette.primary.light, 0.05),
          // borderTopRightRadius: 0,
          // borderTopLeftRadius: 0,
          borderBottomLeftRadius: isMobile ? undefined : 10,
          borderBottomRightRadius: isMobile ? undefined : 10,
        }}
        elevation={0}
      >
        {React.cloneElement(children, { ...props })}
      </Paper>
    </Box>
  );
}

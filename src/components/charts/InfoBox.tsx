/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React from "react";
import Paper from "@material-ui/core/Paper";
import { Box, Divider, Grid, Typography } from "@material-ui/core";
import { InfoAmount, InfoIcon, InfoTitle } from "./common";

export default function InfoBox({ title, value, icon, color, desc }: any) {
  return (
    <Paper style={{ height: 116 }}>
      <Box p={1}>
        <Grid container spacing={2}>
          <Grid item xs={11}>
            <Box
              display="flex"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <InfoIcon color={color} icon={icon}></InfoIcon>
              <InfoTitle color={color} title={title}></InfoTitle>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              <InfoAmount color={color} value={value}></InfoAmount>
            </Box>
            {desc && (
              <React.Fragment>
                <Divider></Divider>
                <Box display="flex" style={{ marginLeft: 10, marginRight: 10 }}>
                  <Typography
                    style={{ alignSelf: "center", color: "#aaa" }}
                    variant="caption"
                  >
                    {desc}
                  </Typography>
                </Box>
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

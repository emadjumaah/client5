/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Box, Paper, TextField, Typography } from "@material-ui/core";
import { useState } from "react";
const Connection = ({
  setNetwork,
  network,
  setWeburi,
  weburi,
  setLocaluri,
  localuri,
  isRTL,
}) => {
  const [web, setWeb] = useState(null);
  const [local, setLocal] = useState(null);
  const onchange = (e: any) => {
    setNetwork(e.target.value);
  };

  return (
    <Paper elevation={3}>
      <Box padding={3}>
        <Typography variant="h6">
          {isRTL ? "كيفية الاتصال مع المخدم" : "Server Connection type"}
        </Typography>

        <RadioGroup
          aria-label="network"
          style={{ marginTop: 12 }}
          name="network"
          value={network}
          onChange={onchange}
        >
          <Box
            display="flex"
            style={{ flexDirection: "row", marginBottom: 20 }}
          >
            <FormControlLabel
              value="local"
              control={<Radio color="primary" />}
              label={
                isRTL ? "الاتصال من شبكة محلية" : "Local Network Connection"
              }
              style={{ width: 300 }}
            />
            <TextField
              name="localuri"
              defaultValue={localuri}
              value={local}
              onChange={(e: any) => setLocal(e.target.value)}
              label="URI"
              style={{ width: 500 }}
              variant="outlined"
              margin="dense"
            />
          </Box>
          <Box
            display="flex"
            style={{ flexDirection: "row", marginBottom: 20 }}
          >
            <FormControlLabel
              value="web"
              control={<Radio color="primary" />}
              label={isRTL ? "الاتصال من الانترنت" : "Web/Remote Connection"}
              style={{ width: 300 }}
            />
            <TextField
              name="weburi"
              defaultValue={weburi}
              value={web}
              onChange={(e: any) => setWeb(e.target.value)}
              label="URI"
              style={{ width: 500 }}
              variant="outlined"
              margin="dense"
            />
          </Box>
        </RadioGroup>
      </Box>
    </Paper>
  );
};

export default Connection;

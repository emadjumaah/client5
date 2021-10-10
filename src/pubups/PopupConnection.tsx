/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useContext, useEffect, useState } from "react";

import { GContextTypes } from "../types";
import { GlobalContext } from "../contexts";
import PopupLayout from "../pages/main/PopupLayout";
import {
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { errorAlert } from "../Shared";
// import { remote } from "electron";

const PopupConnection = ({ open, onClose, theme }: any) => {
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });
  const [net, setNet] = useState("");
  const [web, setWeb] = useState("");
  const [local, setLocal] = useState("");
  // const appWindow: any = remote.BrowserWindow.getFocusedWindow();

  const {
    translate: { isRTL },
    store,
    dispatch,
  }: GContextTypes = useContext(GlobalContext);

  useEffect(() => {
    setNet(network);
    setWeb(weburi);
    setLocal(localuri);
  }, [open]);

  const { network, weburi, localuri } = store;

  const setNetwork = (network: any) => {
    dispatch({ type: "setNetwork", payload: network });
  };
  const setWeburi = (weburi: any) => {
    dispatch({ type: "setWeburi", payload: weburi });
  };
  const setLocaluri = (localuri: any) => {
    dispatch({ type: "setLocaluri", payload: localuri });
  };

  const onSubmit = async () => {
    if (
      (net === "local" && (!local || local.length === 0)) ||
      (net === "web" && (!web || web.length === 0))
    ) {
      await errorAlert(setAlrt, isRTL);
      return;
    }
    setNetwork(net);
    setWeburi(web);
    setLocaluri(local);
    // appWindow.reload();
    window.location.reload();
    onClose();
  };

  const title = isRTL ? "كيفية الاتصال مع المخدم" : "Server Connection type";

  return (
    <PopupLayout
      isRTL={isRTL}
      open={open}
      onClose={onClose}
      title={title}
      onSubmit={onSubmit}
      theme={theme}
      alrt={alrt}
      width={500}
    >
      <Grid container spacing={2}>
        <Grid item xs={1}></Grid>
        <Grid item xs={9}>
          <RadioGroup
            aria-label="network"
            style={{ marginTop: 12 }}
            name="network"
            defaultValue={network}
            value={net}
            onChange={(e: any) => setNet(e.target.value)}
          >
            <FormControlLabel
              value="local"
              control={<Radio color="primary" />}
              label={isRTL ? "اتصال محلي" : "Local Connection"}
            />
            <TextField
              name="localuri"
              defaultValue={localuri}
              value={local}
              onChange={(e: any) => setLocal(e.target.value)}
              label="URI"
              // style={{ display: "none" }}
              variant="outlined"
              margin="dense"
              fullWidth
            />

            <FormControlLabel
              value="web"
              control={<Radio color="primary" />}
              label={isRTL ? "اتصال خارجي" : "Remote Connection"}
            />
            <TextField
              name="weburi"
              defaultValue={weburi}
              value={web}
              disabled={net !== "web"}
              onChange={(e: any) => setWeb(e.target.value)}
              label="URI"
              variant="outlined"
              margin="dense"
              fullWidth
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </PopupLayout>
  );
};

export default PopupConnection;

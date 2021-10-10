// const remote = require("electron").remote;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
// import { remote } from "electron";
import { useBackup } from "../hooks";
import Loading from "./Loading";
import { messageAlert, messageShow } from "./helpers";
import AlertMsg from "./AlertMsg";
// const eFS = remote.require("fs");
// const ePath = remote.require("path");

export default function BackupRestoreDB({ dialog, isRTL }: any) {
  const [loading, setLoading] = useState(false);
  const [alrt, setAlrt] = useState({ show: false, msg: "", type: undefined });

  const [btype, setBtype] = useState("auto");
  const [pathlist, setPathlist]: any = useState(null);

  const { backup, restore } = useBackup();

  // useEffect(() => {
  //   // const root = process.cwd().split(ePath.sep)[0];
  //   // const backupDir = root + "/jadwaldata/backups/";
  //   eFS.readdir(backupDir, function (err, items) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       const list = items.map((item: any, index: any) => {
  //         return {
  //           id: index,
  //           name: item,
  //           path: `${backupDir}${item}`,
  //         };
  //       });
  //       const updatedList = list.filter((litem: any) =>
  //         litem.name.startsWith(btype),
  //       );
  //       updatedList.sort((b: any, a: any) =>
  //         a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
  //       );
  //       setPathlist(updatedList);
  //     }
  //   });
  // }, [btype]);

  const hendleBackup = async () => {
    setLoading(true);
    const res = await backup({});
    if (res?.data?.backupDB?.ok) {
      await messageShow(setAlrt, `backup Succeed`);
    } else {
      await messageAlert(setAlrt, `backup Fail`);
    }
    setLoading(false);
  };
  const hendleRestore = async (filepath: any) => {
    setLoading(true);
    const res = await restore({ variables: { path: filepath } });
    if (res?.data?.restoreDB?.ok) {
      await messageShow(setAlrt, `Restore Succeed`);
    } else {
      await messageAlert(setAlrt, `Restore Fail`);
    }
    setLoading(false);
  };
  return (
    <Paper style={{ height: 500 }}>
      <Box padding={3}>
        {alrt.show && (
          <AlertMsg top right type={alrt.type} msg={alrt.msg}></AlertMsg>
        )}
        <Box
          display="flex"
          style={{
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {isRTL
              ? "نسخ احتياطي لقاعدة البيانات"
              : "Backup and Restore Database"}
          </Typography>
          {!dialog && (
            <Button
              onClick={hendleBackup}
              color="primary"
              variant="contained"
              style={{ height: 36 }}
            >
              {isRTL ? "انشاء نسخ احتياطي" : "Backup Now"}
            </Button>
          )}
        </Box>

        <Box style={{ marginInlineStart: 30 }}>
          <RadioGroup
            aria-label="Views"
            name="views"
            row
            value={btype}
            onChange={(e: any) => setBtype(e.target.value)}
          >
            <Box display="flex" style={{ flexDirection: "row" }}>
              <FormControlLabel
                value="auto"
                control={<Radio color="primary" />}
                label={isRTL ? "النسخ الاحتياطي الألي" : "Auto Backups"}
              />
            </Box>
            <Box display="flex" style={{ flexDirection: "row" }}>
              <FormControlLabel
                value="manual"
                control={<Radio color="primary" />}
                label={isRTL ? "النسخ الاحتياطي اليدوي" : "Manual Backups"}
              />
            </Box>
          </RadioGroup>
        </Box>
        <Paper elevation={3} style={{ height: 360, overflow: "auto" }}>
          <Box padding={3}>
            <TableContainer>
              {pathlist && (
                <Table aria-label="simple table">
                  <TableBody>
                    {pathlist.map((row: any) => (
                      <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right">
                          <Button
                            onClick={() => hendleRestore(row.path)}
                            variant="outlined"
                            color="primary"
                          >
                            {isRTL ? "استرجاع البيانات" : "Restore"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Box>
        </Paper>
      </Box>
      {loading && <Loading isRTL={isRTL} />}
    </Paper>
  );
}

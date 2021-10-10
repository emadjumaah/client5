/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { Box, Grid, Typography } from "@material-ui/core";
import PieChart from "./PieChart";
import { formatKeyToMonth } from "../../common/reports";
import _ from "lodash";

export default function PieChartBox({
  title,
  desc,
  data,
  valueField,
  argumentField,
  size,
  isRTL,
}: any) {
  const [keys, setKeys]: any = useState(null);

  useEffect(() => {
    if (data) {
      const ks = Object.keys(data);
      ks.sort((a: any, b: any) => (a > b ? 1 : b > a ? -1 : 0));
      setKeys(ks);
    }
  }, [data]);

  return (
    <Paper>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                {title}
              </Typography>

              <Box display="flex" style={{ marginTop: 60 }}>
                {keys &&
                  keys.map((k: any) => {
                    return (
                      <Box key={k}>
                        {formatKeyToMonth(k, isRTL)}
                        <PieChart
                          size={size}
                          data={data[k]}
                          valueField={valueField}
                          argumentField={argumentField}
                        ></PieChart>
                      </Box>
                    );
                  })}
              </Box>
            </Grid>
            {/* <Grid item xs={12}>
              <Box display="flex" m={1}>
                {keys &&
                  keys.map((k: any) => {
                    const sorted = _.orderBy(data[k], ["amount"], ["desc"]);
                    return (
                      <Box
                        p={1}
                        m={1}
                        key={k}
                        style={{ backgroundColor: "#eee", borderRadius: 5 }}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          {formatKeyToMonth(k, isRTL)}
                        </Typography>
                        {sorted &&
                          sorted.map((item: any, index: any) => {
                            return (
                              <Box key={index} display="flex">
                                <Typography
                                  style={{
                                    minWidth: 150,
                                    fontSize: 12,
                                  }}
                                >
                                  {item[argumentField]}
                                </Typography>
                                <Typography style={{ fontSize: 12 }}>
                                  {moneyFormat(item.amount)}
                                </Typography>
                              </Box>
                            );
                          })}
                      </Box>
                    );
                  })}
              </Box>
            </Grid> */}
          </Grid>
          <Grid item xs={5}></Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

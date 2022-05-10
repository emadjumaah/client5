import React from 'react';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import _ from 'lodash';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { carstatuss } from '../../constants';
import ChartHeader from './ChartHeader';

const Cars = ({ title, data, height, isRTL, prim }) => {
  let data01: any;
  if (data && data.length > 0) {
    const status = _(data)
      .groupBy('carstatus')
      .map((array, key) => ({
        name: key,
        status: array[0].carstatus,
        value: array.length,
      }))
      .value();
    if (status && status.length > 0) {
      const fdata = status.map((da: any) => {
        const cstat = carstatuss.filter((cs: any) => cs.id === da.status)?.[0];
        if (cstat) {
          return {
            name: isRTL ? cstat?.nameAr : cstat?.name,
            value: da.value,
            color: cstat.color,
          };
        } else {
          return {
            name: isRTL ? carstatuss?.[0]?.nameAr : carstatuss?.[0]?.name,
            value: da.value,
            color: carstatuss?.[0].color,
          };
        }
      });
      data01 = fdata;
    }
  }

  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <Box
        display={'flex'}
        style={{
          flex: 1,
          height: height - 50,
          width: '100%',
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                height={height - 50}
                margin={{
                  top: 10,
                  right: 10,
                  left: 10,
                  bottom: 10,
                }}
              >
                <Pie
                  dataKey="value"
                  data={data01 || []}
                  innerRadius={80}
                  outerRadius={110}
                  fill="#82ca9d"
                  startAngle={0}
                  endAngle={360}
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {data01?.length > 0 &&
                    data01.map((entry: any) => (
                      <Cell key={`cell-${entry?.name}`} fill={entry?.color} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={0} style={{ marginTop: 40 }}>
              {(data01 || []).map((da: any) => {
                return (
                  <>
                    <Grid item xs={8}>
                      <Typography
                        style={{
                          marginTop: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                        }}
                      >
                        {da?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography
                        style={{
                          marginTop: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: da?.color,
                        }}
                      >
                        {da?.value}
                      </Typography>
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default Cars;

/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Box } from '@material-ui/core';
import { Paper } from '@material-ui/core';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const renderLegend = (props) => {
  const { payload } = props;

  return (
    <Box display="flex" style={{ marginBottom: 20 }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{ color: entry.color, marginLeft: 30 }}
        >
          {entry.value}
        </li>
      ))}
    </Box>
  );
};

const scheme = [
  '#717EC3',
  '#2AB7CA',
  '#FFA8A9',
  '#A14A76',
  '#E8DB7D',
  '#558C8C',
  '#8DE969',
  '#231123',
  '#EE8434',
  '#FE4A49',
  '#151060',
  '#EFF7FF',
];

export const SalesMonthsChart = (props: any) => {
  const { data, height } = props;

  const rdata = data.map((d: any) => {
    const obj = d;
    if (d.status && d.status.length > 0) {
      d.status.map((ds: any) => {
        obj[ds.name] = ds.count;
      });
    }
    return obj;
  });

  return (
    <Paper style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={height}
          data={rdata}
          margin={{
            top: 20,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend align="center" verticalAlign="top" content={renderLegend} />

          {data?.departments?.map((dp: any, index) => {
            return (
              <Bar
                key={dp.id}
                dataKey="name"
                stackId="a"
                fill={scheme[index]}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesMonthsChart;

/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from "@material-ui/core";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const DaysSales = (props: any) => {
  const { data, dataKey, color, height } = props;
  return (
    <Paper style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={height}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          syncId="anyId"
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="name" axisLine={false} />
          <YAxis axisLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default DaysSales;

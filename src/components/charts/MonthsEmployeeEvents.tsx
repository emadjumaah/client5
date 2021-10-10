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

export const MonthsEmployeeEvents = (props: any) => {
  const { data, dataKey, color } = props;

  return (
    <Paper style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          syncId="6month"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar stackId="id" dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthsEmployeeEvents;

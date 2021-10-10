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

export const MonthsDepartmentChart = (props: any) => {
  const { data, departments, isRTL } = props;

  const readyData = data.map((d: any) => {
    const obj = {};
    const name = d.name;
    d.departments.map((emp: any) => {
      obj[emp.name] = emp.amount;
    });
    return {
      name,
      ...obj,
    };
  });

  return (
    <Paper style={{ height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          height={400}
          data={readyData}
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
          {departments.map((emp: any) => {
            const dataKey = isRTL ? emp.nameAr : emp.name;
            return <Bar stackId="id" dataKey={dataKey} fill={emp.color} />;
          })}
          <Bar stackId="id" dataKey="null" fill={"#aaa"} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthsDepartmentChart;

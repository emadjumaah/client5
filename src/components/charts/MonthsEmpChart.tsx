/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { fade, Paper } from "@material-ui/core";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ChartHeader from "./ChartHeader";

export const MonthsEmpChart = (props: any) => {
  const {
    data,
    isRTL,
    color,
    height,
    employees,
    departments,
    title,
    prim,
  } = props;
  const rdata: any = [];
  if (employees) {
    if (data?.employees) {
      employees.map((emp: any) => {
        const name = isRTL ? emp.nameAr : emp.name;
        const value = data.employees.filter((en: any) => en.name === name)?.[0]
          ?.amount;
        // const color = emp.color;
        rdata.push({
          name,
          value,
          // color,
        });
      });
    }
  }
  if (departments) {
    if (data?.departments) {
      departments.map((dep: any) => {
        const name = isRTL ? dep.nameAr : dep.name;
        const value = data.departments.filter(
          (en: any) => en.name === name,
        )?.[0]?.amount;
        // const color = dep.color;
        rdata.push({
          name,
          value,
          // color,
        });
      });
    }
  }
  const ucolor = fade(color, 0.7);

  return (
    <Paper style={{ height }}>
      <ChartHeader title={title} color={prim}></ChartHeader>
      <ResponsiveContainer width="100%" height={height - 60}>
        <BarChart
          height={height}
          data={rdata}
          margin={{
            top: 20,
            right: 30,
            left: isRTL ? 50 : 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis
            axisLine={false}
            tickLine={false}
            mirror={isRTL ? true : false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(value) => [value.toLocaleString()]}
          />
          <Bar dataKey="value" fill={ucolor} />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthsEmpChart;

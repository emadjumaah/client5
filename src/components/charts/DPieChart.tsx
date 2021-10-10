/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from "@material-ui/core";
import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const DPieChart = (props: any) => {
  const { data, employees, isRTL } = props;
  const readyData = data?.[0]?.employees.map((d: any) => {
    const fname = isRTL ? "nameAr" : "name";
    const color = employees.filter((emp: any) => emp[fname] === d.name)?.[0]
      ?.color;

    return {
      ...d,
      value: d.amount,
      color,
    };
  });

  return (
    <Paper>
      <PieChart width={400} height={300}>
        <Pie
          data={readyData}
          cx="50%"
          cy="50%"
          labelLine={false}
          // label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {readyData.map((entry, index) => {
            return <Cell key={entry.name} fill={entry?.color} />;
          })}
        </Pie>
        <Tooltip />
      </PieChart>
    </Paper>
  );
};

export default DPieChart;

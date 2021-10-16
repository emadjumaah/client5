/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Paper } from '@material-ui/core';
import React from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DPieOutCart = () => {
  const onPieEnter = () => {
    //
  };
  return (
    <Paper>
      <PieChart width={400} height={300} onMouseEnter={onPieEnter}>
        <Pie
          data={data}
          // cx={120}
          // cy={200}
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </Paper>
  );
};

export default DPieOutCart;

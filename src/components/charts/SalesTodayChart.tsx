/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from 'react';
import { Paper } from '@material-ui/core';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const SalesTodayChart = ({ height, data }) => {
  return (
    <Paper style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart height={height - 20}>
          <Pie
            dataKey="value"
            data={data ? data : []}
            outerRadius={120}
            innerRadius={70}
            cy={175}
            startAngle={180}
            endAngle={0}
          >
            {data && data.map((entry: any) => <Cell fill={entry.color} />)}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default SalesTodayChart;

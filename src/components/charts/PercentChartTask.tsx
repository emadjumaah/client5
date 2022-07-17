import { fade } from '@material-ui/core';
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Label } from 'recharts';

const PercentChartTask = ({ height, progress, pricolor, seccolor }) => {
  const rdata = [{ value: progress }];
  const startPosition = 90,
    endPosition = startPosition - 360 * progress;
  const value = progress
    ? Math.round(progress * 100).toLocaleString() + '%'
    : '0%';
  const fontSize = height > 100 ? 18 : 13;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart height={height}>
        <Pie
          data={[{ value: 1 }]}
          innerRadius="75%"
          outerRadius="90%"
          startAngle={startPosition}
          endAngle={startPosition - 360}
          isAnimationActive={false}
          paddingAngle={0}
          fill={fade(seccolor, 0.3)}
          dataKey="value"
        />
        <Pie
          data={rdata}
          innerRadius="75%"
          outerRadius="90%"
          startAngle={startPosition}
          endAngle={endPosition}
          cornerRadius={20}
          fill={pricolor}
          dataKey="value"
          labelLine={false}
          isAnimationActive={false}
        >
          <Label
            position="center"
            value={value}
            style={{ fontSize, fontWeight: 'bold' }}
            fill={pricolor}
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PercentChartTask;

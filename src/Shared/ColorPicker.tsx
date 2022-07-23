/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-anonymous-default-export */
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { colors } from '../constants';

const ColorPicker = ({ setColor, color }: any) => {
  const [bg, setbg] = useState(color);

  const handleChangeComplete = (col: any) => {
    setbg(col.hex);
    if (setColor) {
      setColor(col.hex);
    }
  };

  return (
    <Box
      style={{
        paddingLeft: 20,
        paddingTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <ChromePicker
        colors={colors}
        color={bg || 'black'}
        width={200}
        disableAlpha
        onChange={handleChangeComplete}
      />
    </Box>
  );
};
export default ColorPicker;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, Paper, Typography } from '@material-ui/core';
import { palettes } from '../../themes/palettes';
const GenTheme = ({ themeId, setThemeId, isRTL }) => {
  const onchange = (e: any) => {
    setThemeId(Number(e.target.value));
  };

  const renderColors = (pallet: any) => {
    return (
      <Box display="flex" style={{ flexDirection: 'row' }}>
        <Box
          style={{
            width: 40,
            height: 40,
            backgroundColor: pallet.primary.main,
          }}
        ></Box>
        <Box
          style={{
            width: 40,
            height: 40,
            backgroundColor: pallet.secondary.main,
          }}
        ></Box>
      </Box>
    );
  };

  return (
    <Paper style={{ height: 350, marginTop: 10 }}>
      <Box padding={3}>
        <Typography variant="h6">{isRTL ? 'الثيمة' : 'Themes'}</Typography>

        <RadioGroup
          aria-label="Views"
          style={{ marginTop: 12 }}
          name="views"
          row
          value={themeId}
          onChange={onchange}
        >
          {palettes.map((pal: any, index: number) => {
            return (
              <Box
                key={index}
                display="flex"
                style={{ flexDirection: 'row', marginTop: 10, marginRight: 50 }}
              >
                <FormControlLabel
                  value={index}
                  control={<Radio color="primary" />}
                  label=""
                />
                {renderColors(pal.palette)}
              </Box>
            );
          })}
        </RadioGroup>
      </Box>
    </Paper>
  );
};

export default GenTheme;

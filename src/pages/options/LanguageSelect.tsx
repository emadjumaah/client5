/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Box, Paper, Typography } from '@material-ui/core';

const GenLanguage = ({ lang, setLang, isRTL }) => {
  const onchange = (e: any) => {
    setLang(e.target.value);
  };
  return (
    <Paper style={{ height: 350, marginTop: 10 }}>
      <Box padding={3}>
        <Typography variant="h6">
          {isRTL ? 'تغيير اللغة' : 'Change Language'}
        </Typography>

        <RadioGroup
          aria-label="Views"
          style={{ marginTop: 12 }}
          name="views"
          value={lang}
          onChange={onchange}
        >
          <Box
            display="flex"
            style={{ flexDirection: 'row', marginBottom: 20 }}
          >
            <FormControlLabel
              value="en"
              control={<Radio color="primary" />}
              label="English"
            />
          </Box>
          <Box
            display="flex"
            style={{ flexDirection: 'row', marginBottom: 20 }}
          >
            <FormControlLabel
              value="ar"
              control={<Radio color="primary" />}
              label="عربي"
            />
          </Box>
        </RadioGroup>
      </Box>
    </Paper>
  );
};

export default GenLanguage;
